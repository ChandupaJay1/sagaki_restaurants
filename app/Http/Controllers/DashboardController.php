<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;

class DashboardController extends Controller
{
    /**
     * Display the restaurant dashboard.
     */
    public function index(): View
    {
        $today = now()->dayOfWeek === 0 ? 6 : now()->dayOfWeek - 1;

        $weeklySales = [
            ['day' => 'Mon', 'sales' => 98000,  'orders' => 124],
            ['day' => 'Tue', 'sales' => 112000, 'orders' => 138],
            ['day' => 'Wed', 'sales' => 89000,  'orders' => 109],
            ['day' => 'Thu', 'sales' => 134000, 'orders' => 167],
            ['day' => 'Fri', 'sales' => 178000, 'orders' => 219],
            ['day' => 'Sat', 'sales' => 215000, 'orders' => 268],
            ['day' => 'Sun', 'sales' => 198000, 'orders' => 245],
        ];

        $peakHours = [
            ['hour' => '10AM', 'traffic' => 20], ['hour' => '11AM', 'traffic' => 45],
            ['hour' => '12PM', 'traffic' => 85], ['hour' => '1PM',  'traffic' => 100],
            ['hour' => '2PM',  'traffic' => 72], ['hour' => '3PM',  'traffic' => 38],
            ['hour' => '4PM',  'traffic' => 25], ['hour' => '5PM',  'traffic' => 40],
            ['hour' => '6PM',  'traffic' => 78], ['hour' => '7PM',  'traffic' => 95],
            ['hour' => '8PM',  'traffic' => 88], ['hour' => '9PM',  'traffic' => 55],
            ['hour' => '10PM', 'traffic' => 30],
        ];

        $topProducts = [
            ['rank' => 1, 'name' => 'Chicken Kottu',    'emoji' => '🍛', 'qty' => 48, 'revenue' => 40800, 'pct' => 92, 'trend' => '+5.2%'],
            ['rank' => 2, 'name' => 'Lamprais',          'emoji' => '📦', 'qty' => 36, 'revenue' => 34200, 'pct' => 82, 'trend' => '+2.1%'],
            ['rank' => 3, 'name' => 'Fish Ambul Thiyal', 'emoji' => '🐠', 'qty' => 29, 'revenue' => 31900, 'pct' => 71, 'trend' => '+8.4%'],
            ['rank' => 4, 'name' => 'Hoppers (3 pcs)',   'emoji' => '🥞', 'qty' => 24, 'revenue' => 10800, 'pct' => 58, 'trend' => '-1.3%'],
            ['rank' => 5, 'name' => 'Mutton Kottu',      'emoji' => '🍖', 'qty' => 18, 'revenue' => 21600, 'pct' => 44, 'trend' => '+3.7%'],
            ['rank' => 6, 'name' => 'Coconut Rice',      'emoji' => '🥥', 'qty' => 15, 'revenue' => 9000,  'pct' => 36, 'trend' => '+1.1%'],
            ['rank' => 7, 'name' => 'Cutlet (3 pcs)',    'emoji' => '🥟', 'qty' => 12, 'revenue' => 5400,  'pct' => 29, 'trend' => '-0.5%'],
        ];

        $recentOrders = [
            ['id' => 'ORD-142', 'table' => 'T5',  'items' => 6, 'total' => 4200, 'status' => 'paid',     'method' => 'Card', 'time' => '2 min ago'],
            ['id' => 'ORD-141', 'table' => 'T3',  'items' => 4, 'total' => 2850, 'status' => 'preparing', 'method' => 'Cash', 'time' => '5 min ago'],
            ['id' => 'ORD-140', 'table' => 'T12', 'items' => 8, 'total' => 5600, 'status' => 'paid',     'method' => 'Card', 'time' => '12 min ago'],
            ['id' => 'ORD-139', 'table' => 'T7',  'items' => 3, 'total' => 3100, 'status' => 'served',   'method' => 'Cash', 'time' => '18 min ago'],
            ['id' => 'ORD-138', 'table' => 'T1',  'items' => 2, 'total' => 1700, 'status' => 'paid',     'method' => 'Card', 'time' => '25 min ago'],
            ['id' => 'ORD-137', 'table' => 'T9',  'items' => 5, 'total' => 3800, 'status' => 'paid',     'method' => 'QR',   'time' => '32 min ago'],
            ['id' => 'ORD-136', 'table' => 'T4',  'items' => 1, 'total' => 850,  'status' => 'served',   'method' => 'Cash', 'time' => '41 min ago'],
        ];

        $stockAlerts = [
            ['item' => 'Rice (5kg)',   'stock' => 4, 'unit' => 'bags', 'min' => 10, 'urgency' => 'medium'],
            ['item' => 'Coconut Milk', 'stock' => 6, 'unit' => 'tins', 'min' => 12, 'urgency' => 'medium'],
            ['item' => 'Chilli Powder', 'stock' => 1, 'unit' => 'kg',   'min' => 5,  'urgency' => 'high'],
            ['item' => 'Lemon',        'stock' => 8, 'unit' => 'pcs',  'min' => 15, 'urgency' => 'medium'],
        ];

        $staffOnDuty = [
            ['name' => 'Amali Perera',      'role' => 'Cashier',        'avatar' => 'AP'],
            ['name' => 'Kamali Silva',      'role' => 'Cashier',        'avatar' => 'KS'],
            ['name' => 'Ravi Fernando',     'role' => 'Floor Attendant', 'avatar' => 'RF'],
            ['name' => 'Nimal Jayawardena', 'role' => 'Chef',           'avatar' => 'NJ'],
        ];

        $periodStats = [
            'today' => ['sales' => 142580, 'orders' => 184, 'avgOrder' => 775,  'guests' => 523,  'change' => '+12.5%'],
            'week'  => ['sales' => 892340, 'orders' => 1102, 'avgOrder' => 810, 'guests' => 3890, 'change' => '+9.4%'],
            'month' => ['sales' => 3745200, 'orders' => 4680, 'avgOrder' => 800, 'guests' => 16480, 'change' => '+15.2%'],
        ];

        $donuts = [
            ['label' => 'Food',     'value' => 85, 'color' => '#6366f1', 'sub' => 'LKR 121k'],
            ['label' => 'Drinks',   'value' => 62, 'color' => '#10b981', 'sub' => 'LKR 21k'],
            ['label' => 'Takeaway', 'value' => 45, 'color' => '#f59e0b', 'sub' => 'LKR 6k'],
            ['label' => 'Events',   'value' => 28, 'color' => '#ef4444', 'sub' => 'LKR 4k'],
        ];

        $kitchenLoad = [
            ['label' => 'New Orders', 'value' => 3,  'max' => 10, 'color' => 'bg-blue-500'],
            ['label' => 'Preparing',  'value' => 4,  'max' => 10, 'color' => 'bg-amber-500'],
            ['label' => 'Ready',      'value' => 2,  'max' => 10, 'color' => 'bg-emerald-500'],
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
        ));
    }
}