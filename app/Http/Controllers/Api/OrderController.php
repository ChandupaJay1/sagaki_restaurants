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
            'table_id' => 'required|exists:tables,id',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.options' => 'nullable|array',
            'note' => 'nullable|string',
        ]);

        $orderNumber = $this->generateOrderNumber();
        $subtotal = 0;

        $itemsToCreate = [];
        foreach ($validated['items'] as $item) {
            $menuItem = \App\Models\MenuItem::find($item['menu_item_id']);
            $price = $menuItem->price;
            $subtotal += $price * $item['qty'];
            $itemsToCreate[] = [
                'menu_item_id' => $item['menu_item_id'],
                'qty' => $item['qty'],
                'price' => $price,
                'options' => $item['options'] ?? null,
            ];
        }

        $serviceCharge = round($subtotal * 0.10, 2);
        $total = $subtotal + $serviceCharge;

        $order = Order::create([
            'id' => $orderNumber,
            'table_id' => $validated['table_id'],
            'order_type' => 'dine-in',
            'status' => 'new',
            'note' => $validated['note'] ?? null,
            'subtotal' => $subtotal,
            'service_charge' => $serviceCharge,
            'total' => $total,
            'cashier_id' => $request->user()?->id,
        ]);

        foreach ($itemsToCreate as $item) {
            OrderItem::create($item + ['order_id' => $order->id]);
        }

        $order->load(['table', 'items.menuItem']);

        return response()->json($order, 201);
    }

    public function show(Order $order): JsonResponse
    {
        $order->load(['table', 'items.menuItem']);

        return response()->json($order);
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:new,preparing,ready,served,paid,cancelled',
        ]);

        $order->update(['status' => $request->status]);

        $order->load(['table', 'items.menuItem']);

        return response()->json($order);
    }

    public function kds(): JsonResponse
    {
        $orders = Order::with(['table', 'items.menuItem'])
            ->whereIn('status', ['new', 'preparing', 'ready'])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($orders);
    }

    private function generateOrderNumber(): string
    {
        $date = now()->format('Ymd');
        $lastOrder = Order::where('id', 'like', "ORD-{$date}-%")
            ->orderByDesc('id')
            ->first();

        if ($lastOrder) {
            $sequence = (int) substr($lastOrder->id, -4) + 1;
        } else {
            $sequence = 1;
        }

        return sprintf("ORD-%s-%04d", $date, $sequence);
    }
}
