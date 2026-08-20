<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\RestaurantTable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Reservation::with('table');

        if ($request->has('date')) {
            $query->forDate($request->date);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $reservations = $query->orderBy('reservation_date', 'desc')
            ->orderBy('reservation_time', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($reservations);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'table_id' => 'required|exists:restaurant_tables,id',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email',
            'party_size' => 'required|integer|min:1',
            'reservation_date' => 'required|date|after_or_equal:today',
            'reservation_time' => 'required|date_format:H:i',
            'special_requests' => 'nullable|string',
        ]);

        $table = RestaurantTable::find($validated['table_id']);

        if ($table->status === 'maintenance') {
            return response()->json(['message' => 'Table is under maintenance'], 422);
        }

        $conflict = Reservation::where('table_id', $validated['table_id'])
            ->where('reservation_date', $validated['reservation_date'])
            ->where('reservation_time', $validated['reservation_time'])
            ->whereNotIn('status', ['cancelled', 'no_show'])
            ->exists();

        if ($conflict) {
            return response()->json(['message' => 'Table is already reserved for this time'], 422);
        }

        if ($validated['party_size'] > $table->seats) {
            return response()->json(['message' => 'Party size exceeds table capacity'], 422);
        }

        $reservation = Reservation::create($validated);
        $reservation->refresh();
        $reservation->load('table');

        if ($table->status !== 'occupied') {
            $table->update(['status' => 'reserved']);
        }

        return response()->json($reservation, 201);
    }

    public function show(Reservation $reservation): JsonResponse
    {
        $reservation->load('table', 'order');

        return response()->json($reservation);
    }

    public function update(Request $request, Reservation $reservation): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'sometimes|string|max:255',
            'customer_phone' => 'sometimes|string|max:20',
            'customer_email' => 'nullable|email',
            'party_size' => 'sometimes|integer|min:1',
            'reservation_date' => 'sometimes|date',
            'reservation_time' => 'sometimes|date_format:H:i',
            'status' => 'sometimes|in:pending,confirmed,seated,completed,cancelled,no_show',
            'special_requests' => 'nullable|string',
        ]);

        $reservation->update($validated);

        if (isset($validated['status'])) {
            match ($validated['status']) {
                'seated' => $reservation->update(['checked_in_at' => now()]),
                'completed' => $reservation->update(['completed_at' => now()]),
                default => null,
            };

            if (in_array($validated['status'], ['completed', 'cancelled', 'no_show'])) {
                $table = $reservation->table;
                if ($table) {
                    $hasActiveReservation = Reservation::where('table_id', $table->id)
                        ->where('id', '!=', $reservation->id)
                        ->whereNotIn('status', ['completed', 'cancelled', 'no_show'])
                        ->exists();

                    if (! $hasActiveReservation) {
                        $table->update(['status' => 'available']);
                    }
                }
            }
        }

        $reservation->load('table');

        return response()->json($reservation);
    }

    public function destroy(Reservation $reservation): JsonResponse
    {
        $reservation->update(['status' => 'cancelled']);

        $table = $reservation->table;
        if ($table) {
            $hasActiveReservation = Reservation::where('table_id', $table->id)
                ->where('id', '!=', $reservation->id)
                ->whereNotIn('status', ['completed', 'cancelled', 'no_show'])
                ->exists();

            if (! $hasActiveReservation) {
                $table->update(['status' => 'available']);
            }
        }

        return response()->json(['message' => 'Reservation cancelled']);
    }

    public function today(): JsonResponse
    {
        $reservations = Reservation::with('table')
            ->forDate(now()->toDateString())
            ->orderBy('reservation_time')
            ->get();

        return response()->json($reservations);
    }

    public function availableSlots(Request $request): JsonResponse
    {
        $request->validate([
            'date' => 'required|date',
            'party_size' => 'required|integer|min:1',
        ]);

        $tables = RestaurantTable::where('status', '!=', 'maintenance')
            ->where('seats', '>=', $request->party_size)
            ->get();

        $bookedTableIds = Reservation::where('reservation_date', $request->date)
            ->whereNotIn('status', ['cancelled', 'no_show'])
            ->pluck('table_id');

        $availableTables = $tables->reject(fn ($table) => $bookedTableIds->contains($table->id));

        return response()->json([
            'date' => $request->date,
            'party_size' => $request->party_size,
            'available_tables' => $availableTables,
        ]);
    }
}
