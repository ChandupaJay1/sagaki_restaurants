<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RestaurantTable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RestaurantTableController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = RestaurantTable::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $tables = $query->orderBy('name')->get();

        return response()->json($tables);
    }

    public function show(RestaurantTable $table): JsonResponse
    {
        $table->load(['reservations' => function ($query) {
            $query->where('reservation_date', '>=', now()->toDateString())
                ->whereNotIn('status', ['cancelled', 'no_show'])
                ->orderBy('reservation_time');
        }]);

        return response()->json($table);
    }

    public function updateStatus(Request $request, RestaurantTable $table): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:available,occupied,reserved,maintenance',
        ]);

        $table->update(['status' => $request->status]);

        return response()->json($table);
    }

    public function floorPlan(): JsonResponse
    {
        $tables = RestaurantTable::all()->map(fn ($table) => [
            'id' => $table->id,
            'name' => $table->name,
            'type' => $table->type,
            'seats' => $table->seats,
            'status' => $table->status,
            'section' => $table->section,
        ]);

        $stats = [
            'total' => $tables->count(),
            'available' => $tables->where('status', 'available')->count(),
            'occupied' => $tables->where('status', 'occupied')->count(),
            'reserved' => $tables->where('status', 'reserved')->count(),
        ];

        return response()->json([
            'tables' => $tables,
            'stats' => $stats,
        ]);
    }
}
