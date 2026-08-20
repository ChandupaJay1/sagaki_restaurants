<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['table', 'items.menuItem']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('table_id')) {
            $query->where('table_id', $request->table_id);
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json($orders);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'table_id' => 'required|exists:restaurant_tables,id',
            'reservation_id' => 'nullable|exists:reservations,id',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.options' => 'nullable|array',
            'items.*.notes' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $order = Order::create([
            'order_number' => Order::generateOrderNumber(),
            'table_id' => $validated['table_id'],
            'reservation_id' => $validated['reservation_id'] ?? null,
            'user_id' => $request->user()?->id,
            'status' => 'new',
            'priority' => 'normal',
            'notes' => $validated['notes'] ?? null,
        ]);

        $subtotal = 0;

        foreach ($validated['items'] as $item) {
            $menuItem = \App\Models\MenuItem::find($item['menu_item_id']);
            $unitPrice = $menuItem->price;
            $totalPrice = $unitPrice * $item['quantity'];

            OrderItem::create([
                'order_id' => $order->id,
                'menu_item_id' => $item['menu_item_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $unitPrice,
                'total_price' => $totalPrice,
                'options' => $item['options'] ?? null,
                'notes' => $item['notes'] ?? null,
            ]);

            $subtotal += $totalPrice;
        }

        $serviceCharge = round($subtotal * 0.10, 2);
        $total = $subtotal + $serviceCharge;

        $order->update([
            'subtotal' => $subtotal,
            'service_charge' => $serviceCharge,
            'total' => $total,
        ]);

        $order->load(['table', 'items.menuItem']);

        return response()->json($order, 201);
    }

    public function show(Order $order): JsonResponse
    {
        $order->load(['table', 'items.menuItem', 'reservation']);

        return response()->json($order);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:new,preparing,ready,served,completed,cancelled',
        ]);

        $order->update(['status' => $request->status]);

        $order->load(['table', 'items.menuItem']);

        return response()->json($order);
    }

    public function kds(): JsonResponse
    {
        $orders = Order::with(['table', 'items.menuItem'])
            ->whereIn('status', ['new', 'preparing', 'ready'])
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($orders);
    }
}
