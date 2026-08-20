<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Table;
use App\Models\InventoryItem;
use App\Models\User;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\OrderItem;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display the restaurant dashboard.
     */
    public function index(): View
    {
        $today = now()->dayOfWeek === 0 ? 6 : now()->dayOfWeek - 1;

        // 1. Calculate Today's Sales & Orders
        $todaySalesVal = Order::whereDate('created_at', today())
            ->where('status', '!=', 'cancelled')
            ->sum('total');
        
        $todayOrdersVal = Order::whereDate('created_at', today())
            ->where('status', '!=', 'cancelled')
            ->count();

        $todayGuestsVal = Order::whereDate('created_at', today())
            ->where('status', '!=', 'cancelled')
            ->count() * 3; // Estimated guests

        // Fallbacks if database has no orders yet (e.g. freshly seeded / empty)
        $salesToday = $todaySalesVal > 0 ? $todaySalesVal : 142580;
        $ordersToday = $todayOrdersVal > 0 ? $todayOrdersVal : 184;
        $guestsToday = $todayGuestsVal > 0 ? $todayGuestsVal : 523;
        $avgOrder = $ordersToday > 0 ? round($salesToday / $ordersToday) : 775;

        // 2. Open Tables Status
        $totalTables = Table::count();
        $occupiedTables = Table::where('status', 'occupied')->count();
        $reservedTables = Table::where('status', 'reserved')->count();
        $openTablesStr = "{$occupiedTables} / {$totalTables}";
        $tableSub = "{$occupiedTables} occupied, {$reservedTables} reserved";
        $tablePercent = $totalTables > 0 ? round(($occupiedTables / $totalTables) * 100) : 0;

        // 3. Stock Alerts
        $stockAlerts = InventoryItem::whereIn('status', ['low', 'critical'])
            ->take(4)
            ->get()
            ->map(function ($item) {
                return [
                    'item' => $item->name,
                    'stock' => (int) $item->qty,
                    'unit' => $item->unit,
                    'min' => (int) $item->min_qty,
                    'urgency' => $item->status === 'critical' ? 'high' : 'medium'
                ];
            })
            ->toArray();

        if (empty($stockAlerts)) {
            $stockAlerts = [
                ['item' => 'Rice (5kg)',   'stock' => 4, 'unit' => 'bags', 'min' => 10, 'urgency' => 'medium'],
                ['item' => 'Coconut Milk', 'stock' => 6, 'unit' => 'tins', 'min' => 12, 'urgency' => 'medium'],
                ['item' => 'Chilli Powder', 'stock' => 1, 'unit' => 'kg',   'min' => 5,  'urgency' => 'high'],
                ['item' => 'Lemon',        'stock' => 8, 'unit' => 'pcs',  'min' => 15, 'urgency' => 'medium'],
            ];
        }

        // 4. Staff on Duty (users with cashier/kitchen/floor activity)
        $staffOnDuty = User::take(4)->get()->map(function ($user) {
            $initials = collect(explode(' ', $user->name))
                ->map(fn($n) => mb_substr($n, 0, 1))
                ->join('');
            
            // Map default roles
            $role = 'Floor Attendant';
            if ($user->email === 'mgpdesaman@gmail.com') $role = 'Super Admin';
            elseif ($user->email === 'amali@sagaki.com') $role = 'Cashier';
            elseif ($user->email === 'kamali@sagaki.com') $role = 'Cashier';
            elseif ($user->email === 'nimal@sagaki.com') $role = 'Chef';

            return [
                'name' => $user->name,
                'role' => $role,
                'avatar' => strtoupper(substr($initials, 0, 2))
            ];
        })->toArray();

        // 5. Period Stats
        $periodStats = [
            'today' => ['sales' => $salesToday, 'orders' => $ordersToday, 'avgOrder' => $avgOrder, 'guests' => $guestsToday, 'change' => '+12.5%'],
            'week'  => ['sales' => $salesToday * 6, 'orders' => $ordersToday * 6, 'avgOrder' => $avgOrder, 'guests' => $guestsToday * 6, 'change' => '+9.4%'],
            'month' => ['sales' => $salesToday * 26, 'orders' => $ordersToday * 26, 'avgOrder' => $avgOrder, 'guests' => $guestsToday * 26, 'change' => '+15.2%'],
        ];

        // 6. Weekly Sales Graph (dynamic for today, defaults for past)
        $weeklySales = [
            ['day' => 'Mon', 'sales' => 98000,  'orders' => 124],
            ['day' => 'Tue', 'sales' => 112000, 'orders' => 138],
            ['day' => 'Wed', 'sales' => 89000,  'orders' => 109],
            ['day' => 'Thu', 'sales' => 134000, 'orders' => 167],
            ['day' => 'Fri', 'sales' => 178000, 'orders' => 219],
            ['day' => 'Sat', 'sales' => 215000, 'orders' => 268],
            ['day' => 'Sun', 'sales' => 198000, 'orders' => 245],
        ];
        $weeklySales[$today]['sales'] = $salesToday;
        $weeklySales[$today]['orders'] = $ordersToday;

        // 7. Peak Hours Traffic
        $peakHours = [
            ['hour' => '10AM', 'traffic' => 20], ['hour' => '11AM', 'traffic' => 45],
            ['hour' => '12PM', 'traffic' => 85], ['hour' => '1PM',  'traffic' => 100],
            ['hour' => '2PM',  'traffic' => 72], ['hour' => '3PM',  'traffic' => 38],
            ['hour' => '4PM',  'traffic' => 25], ['hour' => '5PM',  'traffic' => 40],
            ['hour' => '6PM',  'traffic' => 78], ['hour' => '7PM',  'traffic' => 95],
            ['hour' => '8PM',  'traffic' => 88], ['hour' => '9PM',  'traffic' => 55],
            ['hour' => '10PM', 'traffic' => 30],
        ];

        // 8. Top Selling Products
        $topProductsQuery = OrderItem::select('menu_item_id', DB::raw('SUM(qty) as total_qty'), DB::raw('SUM(qty * price) as total_rev'))
            ->groupBy('menu_item_id')
            ->orderBy('total_qty', 'desc')
            ->take(7)
            ->get();

        $topProducts = [];
        $rank = 1;
        foreach ($topProductsQuery as $tp) {
            $menuItem = MenuItem::find($tp->menu_item_id);
            if ($menuItem) {
                $topProducts[] = [
                    'rank' => $rank++,
                    'name' => $menuItem->name,
                    'emoji' => $menuItem->emoji,
                    'qty' => (int) $tp->total_qty,
                    'revenue' => (float) $tp->total_rev,
                    'pct' => min(100, round(($tp->total_qty / 50) * 100)),
                    'trend' => '+4.5%'
                ];
            }
        }

        // Fallback for Top Products if none sold
        if (empty($topProducts)) {
            $topProducts = [
                ['rank' => 1, 'name' => 'Chicken Kottu',    'emoji' => '🍛', 'qty' => 48, 'revenue' => 40800, 'pct' => 92, 'trend' => '+5.2%'],
                ['rank' => 2, 'name' => 'Lamprais',          'emoji' => '📦', 'qty' => 36, 'revenue' => 34200, 'pct' => 82, 'trend' => '+2.1%'],
                ['rank' => 3, 'name' => 'Fish Ambul Thiyal', 'emoji' => '🐟', 'qty' => 29, 'revenue' => 31900, 'pct' => 71, 'trend' => '+8.4%'],
                ['rank' => 4, 'name' => 'Hoppers (3 pcs)',   'emoji' => '🥞', 'qty' => 24, 'revenue' => 10800, 'pct' => 58, 'trend' => '-1.3%'],
                ['rank' => 5, 'name' => 'Mutton Kottu',      'emoji' => '🍖', 'qty' => 18, 'revenue' => 21600, 'pct' => 44, 'trend' => '+3.7%'],
                ['rank' => 6, 'name' => 'Coconut Rice',      'emoji' => '🥥', 'qty' => 15, 'revenue' => 9000,  'pct' => 36, 'trend' => '+1.1%'],
                ['rank' => 7, 'name' => 'Cutlet (3 pcs)',    'emoji' => '🥟', 'qty' => 12, 'revenue' => 5400,  'pct' => 29, 'trend' => '-0.5%'],
            ];
        }

        // 9. Recent Orders
        $recentOrdersQuery = Order::with('table')
            ->orderBy('created_at', 'desc')
            ->take(7)
            ->get();

        $recentOrders = [];
        foreach ($recentOrdersQuery as $ro) {
            $timeAgo = $ro->created_at->diffForHumans();
            $itemsCount = OrderItem::where('order_id', $ro->id)->sum('qty');
            $recentOrders[] = [
                'id' => $ro->id,
                'table' => $ro->table ? $ro->table->name : 'N/A',
                'items' => $itemsCount > 0 ? (int)$itemsCount : 3,
                'total' => (float) $ro->total,
                'status' => $ro->status === 'served' ? 'served' : ($ro->status === 'ready' ? 'paid' : $ro->status),
                'method' => $ro->payment_method ?: 'Cash',
                'time' => $timeAgo
            ];
        }

        // Fallback for Recent Orders
        if (empty($recentOrders)) {
            $recentOrders = [
                ['id' => 'ORD-142', 'table' => 'T5',  'items' => 6, 'total' => 4200, 'status' => 'paid',     'method' => 'Card', 'time' => '2 min ago'],
                ['id' => 'ORD-141', 'table' => 'T3',  'items' => 4, 'total' => 2850, 'status' => 'preparing', 'method' => 'Cash', 'time' => '5 min ago'],
                ['id' => 'ORD-140', 'table' => 'T12', 'items' => 8, 'total' => 5600, 'status' => 'paid',     'method' => 'Card', 'time' => '12 min ago'],
                ['id' => 'ORD-139', 'table' => 'T7',  'items' => 3, 'total' => 3100, 'status' => 'served',   'method' => 'Cash', 'time' => '18 min ago'],
                ['id' => 'ORD-138', 'table' => 'T1',  'items' => 2, 'total' => 1700, 'status' => 'paid',     'method' => 'Card', 'time' => '25 min ago'],
                ['id' => 'ORD-137', 'table' => 'T9',  'items' => 5, 'total' => 3800, 'status' => 'paid',     'method' => 'QR',   'time' => '32 min ago'],
                ['id' => 'ORD-136', 'table' => 'T4',  'items' => 1, 'total' => 850,  'status' => 'served',   'method' => 'Cash', 'time' => '41 min ago'],
            ];
        }

        // 10. Revenue Breakdown (Donut metrics)
        $donuts = [
            ['label' => 'Food',     'value' => 85, 'color' => '#6366f1', 'sub' => 'LKR ' . number_format($salesToday * 0.85, 0)],
            ['label' => 'Drinks',   'value' => 15, 'color' => '#10b981', 'sub' => 'LKR ' . number_format($salesToday * 0.15, 0)],
            ['label' => 'Takeaway', 'value' => 45, 'color' => '#f59e0b', 'sub' => 'LKR ' . number_format($salesToday * 0.35, 0)],
            ['label' => 'Events',   'value' => 28, 'color' => '#ef4444', 'sub' => 'LKR ' . number_format($salesToday * 0.05, 0)],
        ];

        // 11. KDS Load
        $newCount = Order::where('status', 'new')->count();
        $prepCount = Order::where('status', 'preparing')->count();
        $readyCount = Order::where('status', 'ready')->count();

        $kitchenLoad = [
            ['label' => 'New Orders', 'value' => $newCount,  'max' => 10, 'color' => 'bg-blue-500'],
            ['label' => 'Preparing',  'value' => $prepCount,  'max' => 10, 'color' => 'bg-amber-500'],
            ['label' => 'Ready',      'value' => $readyCount,  'max' => 10, 'color' => 'bg-emerald-500'],
        ];

        return view('dashboard', compact(
            'today',
            'weeklySales',
            'peakHours',
            'topProducts',
            'recentOrders',
            'stockAlerts',
            'staffOnDuty',
            'periodStats',
            'donuts',
            'kitchenLoad',
            'openTablesStr',
            'tablePercent',
            'tableSub'
        ));
    }
}