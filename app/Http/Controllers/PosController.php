<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Table;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\InventoryItem;
use App\Models\Customer;
use App\Models\Recipe;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Delivery;
use App\Models\Expense;
use App\Models\Attendance;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PosController extends Controller
{
    /**
     * Display the point of sale billing screen.
     */
    public function index(): View
    {
        $posCategories = Category::all()->map(function($c) {
            return ['id' => $c->slug, 'label' => $c->name, 'icon' => $c->icon];
        })->toArray();
        array_unshift($posCategories, ['id' => 'all', 'label' => 'All Items', 'icon' => 'utensils']);

        $posMenuItems = MenuItem::with('category')->get()->map(function($m) {
            return [
                'id' => $m->id,
                'name' => $m->name,
                'category' => $m->category->slug,
                'price' => (float)$m->price,
                'emoji' => $m->emoji,
                'tags' => $m->tags ?: [],
                'barcode' => $m->barcode
            ];
        })->toArray();

        $serviceChargeRate = 0.10;
        $customers = Customer::all();

        return view('pos.index', compact('posCategories', 'posMenuItems', 'serviceChargeRate', 'customers'));
    }

    /**
     * Create an order on checkout or print KOT.
     */
    public function createOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_type' => 'required|string',
            'table_number' => 'nullable|string',
            'note' => 'nullable|string',
            'items' => 'required|array',
            'items.*.id' => 'required|integer',
            'items.*.qty' => 'required|integer',
            'items.*.options' => 'nullable|array',
            'payment_method' => 'nullable|string',
            'discount' => 'nullable|numeric',
            'customer_id' => 'nullable|integer',
            'action' => 'required|string', // 'kot' or 'checkout'
        ]);

        $table = null;
        if ($validated['order_type'] === 'dine-in' && !empty($validated['table_number'])) {
            $table = Table::where('name', $validated['table_number'])->first();
        }

        $subtotal = 0;
        $orderItems = [];
        foreach ($validated['items'] as $itemData) {
            $menuItem = MenuItem::find($itemData['id']);
            if (!$menuItem) continue;

            $subtotal += $menuItem->price * $itemData['qty'];
            $orderItems[] = [
                'menu_item_id' => $menuItem->id,
                'qty' => $itemData['qty'],
                'price' => $menuItem->price,
                'options' => $itemData['options'] ?? [],
            ];
        }

        $serviceCharge = $validated['order_type'] === 'dine-in' ? ($subtotal * 0.10) : 0;
        $discount = floatval($validated['discount'] ?? 0);
        $total = max(0, $subtotal + $serviceCharge - $discount);

        $prefix = $validated['action'] === 'checkout' ? 'ORD' : 'KDS';
        $orderId = $prefix . '-' . time() . '-' . rand(10, 99);

        $order = Order::create([
            'id' => $orderId,
            'table_id' => $table?->id,
            'customer_id' => $validated['customer_id'] ?? null,
            'order_type' => $validated['order_type'],
            'status' => $validated['action'] === 'checkout' ? 'served' : 'new',
            'payment_method' => $validated['payment_method'] ?? null,
            'note' => $validated['note'] ?? '',
            'subtotal' => $subtotal,
            'service_charge' => $serviceCharge,
            'discount' => $discount,
            'total' => $total,
            'cashier_id' => auth()->id() ?: 1,
        ]);

        foreach ($orderItems as $oi) {
            OrderItem::create($oi + ['order_id' => $orderId]);

            // Deduct stock if checking out
            if ($validated['action'] === 'checkout') {
                $menuItem = MenuItem::find($oi['menu_item_id']);
                if ($menuItem) {
                    foreach ($menuItem->recipes as $recipe) {
                        $invItem = $recipe->inventoryItem;
                        if ($invItem) {
                            $invItem->qty = max(0, $invItem->qty - ($recipe->qty_required * $oi['qty']));
                            if ($invItem->qty == 0) {
                                $invItem->status = 'critical';
                            } elseif ($invItem->qty <= $invItem->min_qty) {
                                $invItem->status = 'low';
                            } else {
                                $invItem->status = 'ok';
                            }
                            $invItem->save();
                        }
                    }
                }
            }
        }

        if ($table) {
            if ($validated['action'] === 'checkout') {
                $table->status = 'available';
                $table->customer = null;
                $table->bill = 0;
                $table->started_at = null;
            } else {
                $table->status = 'occupied';
                $table->customer = $table->customer ?: 'Guest';
                $table->bill = $total;
                $table->started_at = $table->started_at ?: now()->format('H:i');
            }
            $table->save();
        }

        if ($validated['customer_id'] && $validated['action'] === 'checkout') {
            $customer = Customer::find($validated['customer_id']);
            if ($customer) {
                $customer->visits += 1;
                $customer->total_spend += $total;
                $customer->loyalty_points += round($total / 100);
                if ($customer->total_spend >= 15000) {
                    $customer->tier = 'gold';
                } elseif ($customer->total_spend >= 5000) {
                    $customer->tier = 'silver';
                }
                $customer->save();
            }
        }

        return response()->json([
            'success' => true,
            'order_id' => $orderId,
            'message' => $validated['action'] === 'checkout' ? 'Order checkout successful' : 'KOT sent to kitchen',
        ]);
    }

    /**
     * Display the table management / floor plan.
     */
    public function tables(): View
    {
        $tables = Table::all()->map(function($t) {
            return [
                'id' => $t->id,
                'name' => $t->name,
                'type' => $t->type,
                'seats' => $t->seats,
                'status' => $t->status,
                'customer' => $t->customer,
                'bill' => (float)$t->bill,
                'startedAt' => $t->started_at
            ];
        })->toArray();

        return view('pos.tables', [
            'tables' => $tables,
            'tablesById' => collect($tables)->keyBy('id'),
        ]);
    }

    /**
     * Handle actions for tables (Transfer, Merge, Seating).
     */
    public function tableAction(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'action' => 'required|string',
            'table_id' => 'required|integer',
            'target_table_name' => 'nullable|string',
            'customer_name' => 'nullable|string',
        ]);

        $table = Table::find($validated['table_id']);
        if (!$table) {
            return response()->json(['success' => false, 'message' => 'Table not found']);
        }

        if ($validated['action'] === 'seat-guest') {
            $table->status = 'occupied';
            $table->customer = $validated['customer_name'] ?: 'Guest';
            $table->started_at = now()->format('H:i');
            $table->save();
            return response()->json(['success' => true, 'message' => "Guest seated at {$table->name}"]);
        }

        if ($validated['action'] === 'close-table') {
            $table->status = 'available';
            $table->customer = null;
            $table->bill = 0;
            $table->started_at = null;
            $table->save();
            return response()->json(['success' => true, 'message' => "Table {$table->name} closed"]);
        }

        if ($validated['action'] === 'transfer') {
            $target = Table::where('name', $validated['target_table_name'])->first();
            if (!$target) return response()->json(['success' => false, 'message' => 'Target table not found']);

            $target->status = 'occupied';
            $target->customer = $table->customer;
            $target->bill = $table->bill;
            $target->started_at = $table->started_at;
            $target->save();

            $table->status = 'available';
            $table->customer = null;
            $table->bill = 0;
            $table->started_at = null;
            $table->save();

            Order::where('table_id', $table->id)->where('status', '!=', 'served')->update(['table_id' => $target->id]);

            return response()->json(['success' => true, 'message' => "Transferred {$table->name} to {$target->name}"]);
        }

        if ($validated['action'] === 'merge') {
            $target = Table::where('name', $validated['target_table_name'])->first();
            if (!$target) return response()->json(['success' => false, 'message' => 'Target table not found']);

            $target->bill += $table->bill;
            $target->customer = $target->customer . ' + ' . $table->customer;
            $target->save();

            $table->status = 'available';
            $table->customer = null;
            $table->bill = 0;
            $table->started_at = null;
            $table->save();

            Order::where('table_id', $table->id)->where('status', '!=', 'served')->update(['table_id' => $target->id]);

            return response()->json(['success' => true, 'message' => "Merged {$table->name} into {$target->name}"]);
        }

        return response()->json(['success' => false, 'message' => 'Invalid action']);
    }

    /**
     * Display the kitchen display system.
     */
    public function kds(): View
    {
        $ordersQuery = Order::with(['table', 'items.menuItem'])
            ->whereIn('status', ['new', 'preparing', 'ready', 'served'])
            ->whereDate('created_at', today())
            ->get();

        $orders = [];
        foreach ($ordersQuery as $o) {
            $items = [];
            foreach ($o->items as $item) {
                $items[] = [
                    'name' => $item->menuItem ? $item->menuItem->name : 'Item',
                    'qty' => $item->qty,
                    'options' => $item->options ?: [],
                ];
            }

            $orders[] = [
                'id' => $o->id,
                'table' => $o->table ? $o->table->name : 'Takeaway',
                'status' => $o->status,
                'time' => $o->created_at->diffInMinutes(),
                'priority' => str_contains($o->note, 'High') ? 'high' : 'normal',
                'items' => $items,
            ];
        }

        return view('pos.kds', compact('orders'));
    }

    /**
     * Advance KDS order status.
     */
    public function advanceOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => 'required|string',
            'status' => 'required|string',
        ]);

        $order = Order::find($validated['order_id']);
        if (!$order) return response()->json(['success' => false, 'message' => 'Order not found']);

        $order->status = $validated['status'];
        $order->save();

        if ($order->status === 'served' && $order->table) {
            $order->table->status = 'available';
            $order->table->customer = null;
            $order->table->bill = 0;
            $order->table->started_at = null;
            $order->table->save();
        }

        return response()->json(['success' => true, 'message' => "Order {$order->id} marked as " . ucfirst($order->status)]);
    }

    /**
     * Display the inventory management page.
     */
    public function inventory(): View
    {
        $categories = [
            ['id' => 'all',       'label' => 'All Items', 'icon' => 'package'],
            ['id' => 'proteins',  'label' => 'Proteins',  'icon' => 'beef'],
            ['id' => 'produce',   'label' => 'Produce',   'icon' => 'apple'],
            ['id' => 'dairy',     'label' => 'Dairy',     'icon' => 'beaker'],
            ['id' => 'spices',    'label' => 'Spices',    'icon' => 'wheat'],
            ['id' => 'beverages', 'label' => 'Beverages', 'icon' => 'coffee'],
            ['id' => 'seafood',   'label' => 'Seafood',   'icon' => 'fish'],
        ];

        $inventoryItems = InventoryItem::all()->map(function($i) {
            return [
                'id' => $i->id,
                'name' => $i->name,
                'category' => $i->category,
                'qty' => (float)$i->qty,
                'unit' => $i->unit,
                'minQty' => (float)$i->min_qty,
                'price' => (float)$i->price,
                'supplier' => $i->supplier,
                'lastOrder' => $i->last_order ? $i->last_order->toDateString() : '',
                'status' => $i->status
            ];
        })->toArray();

        $units = ['kg', 'pcs', 'bags', 'tins', 'liters', 'bundles'];

        $posInventory = [
            'categories' => collect($categories)->pluck('icon', 'id')->all(),
            'items' => $inventoryItems,
        ];

        return view('pos.inventory', compact('categories', 'inventoryItems', 'units', 'posInventory'));
    }

    /**
     * Adjust inventory stock.
     */
    public function adjustInventory(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => 'required|integer',
            'action' => 'required|string',
        ]);

        $item = InventoryItem::find($validated['id']);
        if (!$item) return response()->json(['success' => false, 'message' => 'Item not found']);

        if ($validated['action'] === 'inc') {
            $item->qty += 1;
        } else {
            $item->qty = max(0, $item->qty - 1);
        }

        if ($item->qty == 0) {
            $item->status = 'critical';
        } elseif ($item->qty <= $item->min_qty) {
            $item->status = 'low';
        } else {
            $item->status = 'ok';
        }
        $item->save();

        return response()->json(['success' => true, 'qty' => (float)$item->qty, 'status' => $item->status]);
    }

    /**
     * Add raw material item.
     */
    public function addInventoryItem(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'unit' => 'required|string',
            'qty' => 'required|numeric',
            'min_qty' => 'required|numeric',
            'price' => 'required|numeric',
            'supplier' => 'nullable|string',
        ]);

        $status = 'ok';
        if ($validated['qty'] == 0) {
            $status = 'critical';
        } elseif ($validated['qty'] <= $validated['min_qty']) {
            $status = 'low';
        }

        $item = InventoryItem::create([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'unit' => $validated['unit'],
            'qty' => $validated['qty'],
            'min_qty' => $validated['min_qty'],
            'price' => $validated['price'],
            'supplier' => $validated['supplier'] ?: '',
            'status' => $status,
            'last_order' => now()->toDateString(),
            'branch_id' => 1,
        ]);

        return response()->json([
            'success' => true, 
            'item' => [
                'id' => $item->id,
                'name' => $item->name,
                'category' => $item->category,
                'qty' => (float)$item->qty,
                'unit' => $item->unit,
                'minQty' => (float)$item->min_qty,
                'price' => (float)$item->price,
                'supplier' => $item->supplier,
                'lastOrder' => $item->last_order->toDateString(),
                'status' => $item->status
            ]
        ]);
    }

    /**
     * Delete inventory item.
     */
    public function deleteInventoryItem($id): JsonResponse
    {
        $item = InventoryItem::find($id);
        if ($item) {
            $item->delete();
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false, 'message' => 'Item not found']);
    }

    /**
     * Display the customer relations page.
     */
    public function crm(): View
    {
        $customers = Customer::all()->map(function($c) {
            return [
                'id' => $c->id,
                'name' => $c->name,
                'phone' => $c->phone,
                'email' => $c->email,
                'visits' => $c->visits,
                'total_spend' => (float)$c->total_spend,
                'tier' => $c->tier,
                'joined' => $c->created_at ? $c->created_at->toDateString() : '',
                'lastVisit' => $c->updated_at ? $c->updated_at->toDateString() : '',
                'notes' => $c->notes,
                'favorite' => $c->favorite
            ];
        })->toArray();

        return view('pos.crm', compact('customers'));
    }

    /**
     * Create customer.
     */
    public function addCustomer(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|string',
            'notes' => 'nullable|string',
            'favorite' => 'nullable|string',
        ]);

        $customer = Customer::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?: '',
            'email' => $validated['email'] ?: '',
            'notes' => $validated['notes'] ?: '',
            'favorite' => $validated['favorite'] ?: '',
            'visits' => 0,
            'total_spend' => 0,
            'loyalty_points' => 0,
            'tier' => 'bronze',
        ]);

        return response()->json([
            'success' => true,
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'email' => $customer->email,
                'visits' => $customer->visits,
                'total_spend' => (float)$customer->total_spend,
                'tier' => $customer->tier,
                'joined' => $customer->created_at->toDateString(),
                'lastVisit' => $customer->updated_at->toDateString(),
                'notes' => $customer->notes,
                'favorite' => $customer->favorite
            ]
        ]);
    }

    /**
     * Update customer notes.
     */
    public function updateCustomerNote(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => 'required|integer',
            'notes' => 'required|string',
        ]);

        $customer = Customer::find($validated['id']);
        if ($customer) {
            $customer->notes = $validated['notes'];
            $customer->save();
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false, 'message' => 'Customer not found']);
    }

    /**
     * Display the financial & sales reports page.
     */
    public function reports(): View
    {
        $todayOrders = Order::whereDate('created_at', today())->get();
        $salesDataToday = [];
        for ($h = 10; $h <= 21; $h++) {
            $label = $h < 12 ? $h.'AM' : ($h == 12 ? '12PM' : ($h-12).'PM');
            $hourOrders = $todayOrders->filter(function($o) use ($h) {
                return $o->created_at->hour === $h;
            });
            $salesDataToday[] = [
                'label' => $label,
                'orders' => $hourOrders->count(),
                'revenue' => (float)$hourOrders->sum('total'),
            ];
        }

        $weeklySales = [];
        for ($d = 6; $d >= 0; $d--) {
            $date = today()->subDays($d);
            $dayLabel = $date->format('D');
            $dayOrders = Order::whereDate('created_at', $date)->get();
            $weeklySales[] = [
                'label' => $dayLabel,
                'orders' => $dayOrders->count(),
                'revenue' => (float)$dayOrders->sum('total'),
                'cost' => (float)$dayOrders->sum('total') * 0.45,
            ];
        }

        $monthlySales = [];
        for ($w = 3; $w >= 0; $w--) {
            $start = today()->subWeeks($w)->startOfWeek();
            $end = today()->subWeeks($w)->endOfWeek();
            $weekOrders = Order::whereBetween('created_at', [$start, $end])->get();
            $monthlySales[] = [
                'label' => 'W'.(4-$w),
                'orders' => $weekOrders->count(),
                'revenue' => (float)$weekOrders->sum('total'),
                'cost' => (float)$weekOrders->sum('total') * 0.45,
            ];
        }

        $salesData = [
            'today' => $salesDataToday,
            'week' => $weeklySales,
            'month' => $monthlySales,
        ];

        return view('pos.reports', compact('salesData'));
    }

    /**
     * Display the Menu Management view.
     */
    public function menu(): View
    {
        $menuItems = MenuItem::with('category')->get();
        $categories = Category::all();
        $inventoryItems = InventoryItem::all();
        return view('pos.menu', compact('menuItems', 'categories', 'inventoryItems'));
    }

    /**
     * Toggle a menu item's availability.
     */
    public function toggleMenuAvailability(Request $request): JsonResponse
    {
        $item = MenuItem::find($request->id);
        if ($item) {
            $item->is_available = !$item->is_available;
            $item->save();
            return response()->json(['success' => true, 'is_available' => $item->is_available]);
        }
        return response()->json(['success' => false, 'message' => 'Item not found']);
    }

    /**
     * Update a menu item's price.
     */
    public function updateMenuPrice(Request $request): JsonResponse
    {
        $item = MenuItem::find($request->id);
        if ($item) {
            $item->price = $request->price;
            $item->save();
            return response()->json(['success' => true, 'price' => $item->price]);
        }
        return response()->json(['success' => false, 'message' => 'Item not found']);
    }

    /**
     * Display the Purchase Management logs and order creation view.
     */
    public function purchases(): View
    {
        $purchases = Purchase::with(['items.inventoryItem', 'branch'])->orderBy('id', 'desc')->get();
        $inventoryItems = InventoryItem::all();
        $branches = Branch::all();
        return view('pos.purchases', compact('purchases', 'inventoryItems', 'branches'));
    }

    /**
     * Create a purchase log and update raw stock inventory.
     */
    public function addPurchase(Request $request): JsonResponse
    {
        $request->validate([
            'supplier' => 'required|string',
            'branch_id' => 'nullable|exists:branches,id',
            'items' => 'required|array',
            'items.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'items.*.qty' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0'
        ]);

        $purchase = Purchase::create([
            'supplier' => $request->supplier,
            'branch_id' => $request->branch_id,
            'total_amount' => 0,
            'status' => 'received',
            'payment_status' => 'paid'
        ]);

        $total = 0;
        foreach ($request->items as $itemData) {
            $amt = $itemData['qty'] * $itemData['unit_price'];
            $total += $amt;

            PurchaseItem::create([
                'purchase_id' => $purchase->id,
                'inventory_item_id' => $itemData['inventory_item_id'],
                'qty' => $itemData['qty'],
                'unit_price' => $itemData['unit_price']
            ]);

            $invItem = InventoryItem::find($itemData['inventory_item_id']);
            if ($invItem) {
                $invItem->qty += $itemData['qty'];
                $invItem->price = $itemData['unit_price'];
                
                if ($invItem->qty <= 0) {
                    $invItem->status = 'critical';
                } elseif ($invItem->qty <= $invItem->min_qty) {
                    $invItem->status = 'low';
                } else {
                    $invItem->status = 'ok';
                }
                
                $invItem->save();
            }
        }

        $purchase->total_amount = $total;
        $purchase->save();

        return response()->json(['success' => true, 'purchase_id' => $purchase->id]);
    }

    /**
     * Display the Delivery Management view.
     */
    public function delivery(): View
    {
        $deliveries = Delivery::with('order.customer')->orderBy('id', 'desc')->get();
        $pendingDeliveryOrders = Order::where('order_type', 'delivery')
            ->whereNotIn('id', Delivery::pluck('order_id'))
            ->get();
        return view('pos.delivery', compact('deliveries', 'pendingDeliveryOrders'));
    }

    /**
     * Assign a rider to a delivery order.
     */
    public function assignRider(Request $request): JsonResponse
    {
        $request->validate([
            'order_id' => 'required',
            'rider_name' => 'required|string',
            'delivery_charge' => 'required|numeric'
        ]);

        $delivery = Delivery::create([
            'order_id' => $request->order_id,
            'rider_name' => $request->rider_name,
            'delivery_charge' => $request->delivery_charge,
            'status' => 'transit'
        ]);

        return response()->json(['success' => true, 'delivery_id' => $delivery->id]);
    }

    /**
     * Display the Staff Management and Attendance view.
     */
    public function staff(): View
    {
        $staff = User::all();
        $attendance = Attendance::with('user')->whereDate('date', today())->get();
        return view('pos.staff', compact('staff', 'attendance'));
    }

    /**
     * Clock in/out a staff member.
     */
    public function clockStaff(Request $request): JsonResponse
    {
        $userId = $request->user_id;
        $action = $request->action;

        $record = Attendance::where('user_id', $userId)
            ->whereDate('date', today())
            ->first();

        if ($action === 'in') {
            if ($record) {
                return response()->json(['success' => false, 'message' => 'Staff already clocked in today']);
            }
            $record = Attendance::create([
                'user_id' => $userId,
                'date' => today(),
                'clock_in' => now()->toTimeString()
            ]);
        } else {
            if (!$record) {
                return response()->json(['success' => false, 'message' => 'Staff has not clocked in today']);
            }
            $record->clock_out = now()->toTimeString();
            $record->save();
        }

        return response()->json(['success' => true, 'record' => $record]);
    }

    /**
     * Display the Financial management dashboard (expenses and income statement).
     */
    public function financial(): View
    {
        $expenses = Expense::with('branch')->orderBy('date', 'desc')->get();
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('total');
        $totalExpenses = Expense::sum('amount');
        $netProfit = $totalRevenue - $totalExpenses;

        $expenseCategories = Expense::select('category', \DB::raw('SUM(amount) as total'))
            ->groupBy('category')
            ->get()
            ->pluck('total', 'category')
            ->toArray();

        $branches = Branch::all();

        return view('pos.financial', compact('expenses', 'totalRevenue', 'totalExpenses', 'netProfit', 'expenseCategories', 'branches'));
    }

    /**
     * Add a cash outflow expense record.
     */
    public function addExpense(Request $request): JsonResponse
    {
        $request->validate([
            'category' => 'required|string',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'date' => 'required|date',
            'branch_id' => 'nullable|exists:branches,id'
        ]);

        $expense = Expense::create([
            'category' => $request->category,
            'amount' => $request->amount,
            'description' => $request->description,
            'date' => $request->date,
            'branch_id' => $request->branch_id
        ]);

        return response()->json(['success' => true, 'expense' => $expense]);
    }

    /**
     * Display the Multi-Branch Management view.
     */
    public function branches(): View
    {
        $branches = Branch::withCount(['tables', 'inventoryItems'])->get()->map(function($b) {
            $orders = Order::whereHas('table', function($q) use ($b) {
                $q->where('branch_id', $b->id);
            })->get();
            
            $b->sales_count = $orders->count();
            $b->revenue = $orders->sum('total');
            return $b;
        });

        return view('pos.branches', compact('branches'));
    }
}