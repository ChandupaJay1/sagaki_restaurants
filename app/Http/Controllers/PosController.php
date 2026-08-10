<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;

class PosController extends Controller
{
    /**
     * Display the point of sale billing screen.
     */
    public function index(): View
    {
        $posCategories = [
            ['id' => 'all',       'label' => 'All Items',    'icon' => 'utensils'],
            ['id' => 'kottu',     'label' => 'Kottu',        'icon' => 'flame'],
            ['id' => 'rice',      'label' => 'Rice & Curry', 'icon' => 'chef-hat'],
            ['id' => 'shortEats', 'label' => 'Short Eats',   'icon' => 'tag'],
            ['id' => 'beverages', 'label' => 'Beverages',    'icon' => 'coffee'],
            ['id' => 'drinks',    'label' => 'Drinks',       'icon' => 'wine'],
            ['id' => 'desserts',  'label' => 'Desserts',     'icon' => 'ice-cream'],
        ];

        $posMenuItems = [
            ['id' => 1,  'name' => 'Chicken Kottu',         'category' => 'kottu',     'price' => 850,  'emoji' => '🍛', 'tags' => ['spicy']],
            ['id' => 2,  'name' => 'Egg Kottu',              'category' => 'kottu',     'price' => 700,  'emoji' => '🍳', 'tags' => []],
            ['id' => 3,  'name' => 'Fish Kottu',             'category' => 'kottu',     'price' => 950,  'emoji' => '🐟', 'tags' => ['spicy']],
            ['id' => 4,  'name' => 'Veg Kottu',              'category' => 'kottu',     'price' => 600,  'emoji' => '🥬', 'tags' => ['vegan']],
            ['id' => 5,  'name' => 'Mutton Kottu',           'category' => 'kottu',     'price' => 1200, 'emoji' => '🍖', 'tags' => ['spicy']],
            ['id' => 6,  'name' => 'Cheese Kottu',           'category' => 'kottu',     'price' => 900,  'emoji' => '🧀', 'tags' => []],
            ['id' => 7,  'name' => 'Chicken Curry Rice',     'category' => 'rice',      'price' => 850,  'emoji' => '🍛', 'tags' => ['spicy']],
            ['id' => 8,  'name' => 'Lamprais',               'category' => 'rice',      'price' => 950,  'emoji' => '📦', 'tags' => []],
            ['id' => 9,  'name' => 'Fish Ambul Thiyal',      'category' => 'rice',      'price' => 1100, 'emoji' => '🐟', 'tags' => ['spicy']],
            ['id' => 10, 'name' => 'Red Rice & Curry',       'category' => 'rice',      'price' => 750,  'emoji' => '🍚', 'tags' => ['spicy']],
            ['id' => 11, 'name' => 'Jaffna Crab Curry',      'category' => 'rice',      'price' => 1500, 'emoji' => '🦀', 'tags' => ['spicy']],
            ['id' => 12, 'name' => 'Coconut Rice',           'category' => 'rice',      'price' => 600,  'emoji' => '🥥', 'tags' => []],
            ['id' => 13, 'name' => 'Prawn Curry Rice',       'category' => 'rice',      'price' => 1300, 'emoji' => '🦐', 'tags' => ['spicy']],
            ['id' => 14, 'name' => 'Hoppers (3 pcs)',        'category' => 'rice',      'price' => 450,  'emoji' => '🥞', 'tags' => []],
            ['id' => 15, 'name' => 'String Hoppers (4 pcs)', 'category' => 'rice',      'price' => 500,  'emoji' => '🍜', 'tags' => []],
            ['id' => 16, 'name' => 'Roti with Curry',        'category' => 'shortEats', 'price' => 350,  'emoji' => '🫓', 'tags' => []],
            ['id' => 17, 'name' => 'Cutlet (3 pcs)',         'category' => 'shortEats', 'price' => 450,  'emoji' => '🥟', 'tags' => ['spicy']],
            ['id' => 18, 'name' => 'Prawn Rolls (4 pcs)',    'category' => 'shortEats', 'price' => 650,  'emoji' => '🦐', 'tags' => []],
            ['id' => 19, 'name' => 'Fish Bankura',           'category' => 'shortEats', 'price' => 550,  'emoji' => '🐟', 'tags' => ['spicy']],
            ['id' => 20, 'name' => 'Chicken 65',             'category' => 'shortEats', 'price' => 600,  'emoji' => '🍗', 'tags' => ['spicy']],
            ['id' => 21, 'name' => 'Momo (6 pcs)',           'category' => 'shortEats', 'price' => 750,  'emoji' => '🥟', 'tags' => []],
            ['id' => 22, 'name' => 'Veg Spring Roll (3 pcs)', 'category' => 'shortEats', 'price' => 400, 'emoji' => '🌯', 'tags' => ['vegan']],
            ['id' => 23, 'name' => 'Samosa (2 pcs)',         'category' => 'shortEats', 'price' => 300,  'emoji' => '🥟', 'tags' => ['vegan']],
            ['id' => 24, 'name' => 'Ceylon Tea',             'category' => 'beverages', 'price' => 150,  'emoji' => '🍵', 'tags' => []],
            ['id' => 25, 'name' => 'Iced Tea',               'category' => 'beverages', 'price' => 250,  'emoji' => '🧊', 'tags' => []],
            ['id' => 26, 'name' => 'Fresh Lime Soda',        'category' => 'beverages', 'price' => 300,  'emoji' => '🍋', 'tags' => []],
            ['id' => 27, 'name' => 'Coconut Water',          'category' => 'beverages', 'price' => 200,  'emoji' => '🥥', 'tags' => ['vegan']],
            ['id' => 28, 'name' => 'Milk Shake',             'category' => 'beverages', 'price' => 450,  'emoji' => '🥤', 'tags' => []],
            ['id' => 29, 'name' => 'Fresh Juice',            'category' => 'beverages', 'price' => 350,  'emoji' => '🧃', 'tags' => ['vegan']],
            ['id' => 30, 'name' => 'Espresso',               'category' => 'beverages', 'price' => 280,  'emoji' => '☕', 'tags' => []],
            ['id' => 31, 'name' => 'Coca-Cola',              'category' => 'drinks',    'price' => 200,  'emoji' => '🥤', 'tags' => []],
            ['id' => 32, 'name' => 'Fanta',                  'category' => 'drinks',    'price' => 200,  'emoji' => '🍊', 'tags' => []],
            ['id' => 33, 'name' => 'Sprite',                 'category' => 'drinks',    'price' => 200,  'emoji' => '🧃', 'tags' => []],
            ['id' => 34, 'name' => 'Red Bull',               'category' => 'drinks',    'price' => 450,  'emoji' => '⚡', 'tags' => []],
            ['id' => 35, 'name' => 'Heineken',               'category' => 'drinks',    'price' => 700,  'emoji' => '🍺', 'tags' => []],
            ['id' => 36, 'name' => 'King Lager',             'category' => 'drinks',    'price' => 550,  'emoji' => '🍺', 'tags' => []],
            ['id' => 37, 'name' => 'Watalappan',             'category' => 'desserts',  'price' => 350,  'emoji' => '🍮', 'tags' => []],
            ['id' => 38, 'name' => 'Halawa',                 'category' => 'desserts',  'price' => 250,  'emoji' => '🍮', 'tags' => []],
            ['id' => 39, 'name' => 'Ice Cream (2 scoops)',   'category' => 'desserts',  'price' => 400,  'emoji' => '🍨', 'tags' => []],
            ['id' => 40, 'name' => 'Chocolate Lava Cake',    'category' => 'desserts',  'price' => 550,  'emoji' => '🍫', 'tags' => []],
            ['id' => 41, 'name' => 'Pineapple Torte',        'category' => 'desserts',  'price' => 450,  'emoji' => '🍍', 'tags' => []],
            ['id' => 42, 'name' => 'Sticky Toffee Pudding',  'category' => 'desserts',  'price' => 500,  'emoji' => '🍰', 'tags' => []],
        ];

        $serviceChargeRate = 0.10;

        return view('pos.index', compact('posCategories', 'posMenuItems', 'serviceChargeRate'));
    }

    /**
     * Display the table management / floor plan.
     */
    public function tables(): View
    {
        $tables = [
            ['id' => 1,  'name' => 'T1',  'type' => '2-top',  'seats' => 2, 'status' => 'occupied',  'customer' => 'Perera',     'bill' => 2450, 'startedAt' => '18:30'],
            ['id' => 2,  'name' => 'T2',  'type' => '2-top',  'seats' => 2, 'status' => 'occupied',  'customer' => 'Silva',      'bill' => 1800, 'startedAt' => '18:45'],
            ['id' => 3,  'name' => 'T3',  'type' => '4-top',  'seats' => 4, 'status' => 'reserved',  'customer' => 'Fernando',   'bill' => 0,    'startedAt' => '19:30'],
            ['id' => 4,  'name' => 'T4',  'type' => '4-top',  'seats' => 4, 'status' => 'available', 'customer' => null,         'bill' => 0,    'startedAt' => null],
            ['id' => 5,  'name' => 'T5',  'type' => '6-top',  'seats' => 6, 'status' => 'occupied',  'customer' => 'Jayawardena','bill' => 4200, 'startedAt' => '18:00'],
            ['id' => 6,  'name' => 'T6',  'type' => '8-top',  'seats' => 8, 'status' => 'available', 'customer' => null,         'bill' => 0,    'startedAt' => null],
            ['id' => 7,  'name' => 'T7',  'type' => '4-top',  'seats' => 4, 'status' => 'occupied',  'customer' => 'Kumar',      'bill' => 3100, 'startedAt' => '19:00'],
            ['id' => 8,  'name' => 'T8',  'type' => '2-top',  'seats' => 2, 'status' => 'reserved',  'customer' => 'De Zoysa',   'bill' => 0,    'startedAt' => '20:00'],
            ['id' => 9,  'name' => 'T9',  'type' => '6-top',  'seats' => 6, 'status' => 'occupied',  'customer' => 'Ranasinghe', 'bill' => 2900, 'startedAt' => '18:15'],
            ['id' => 10, 'name' => 'T10', 'type' => 'bar',    'seats' => 4, 'status' => 'available', 'customer' => null,         'bill' => 0,    'startedAt' => null],
            ['id' => 11, 'name' => 'T11', 'type' => 'patio-4','seats' => 4, 'status' => 'available', 'customer' => null,         'bill' => 0,    'startedAt' => null],
            ['id' => 12, 'name' => 'T12', 'type' => 'patio-6','seats' => 6, 'status' => 'occupied',  'customer' => 'Wijeyeratne','bill' => 5600, 'startedAt' => '17:45'],
            ['id' => 13, 'name' => 'T13', 'type' => 'private', 'seats' => 8, 'status' => 'reserved',  'customer' => 'Bandara',    'bill' => 0,    'startedAt' => '20:30'],
            ['id' => 14, 'name' => 'T14', 'type' => '2-top',  'seats' => 2, 'status' => 'available', 'customer' => null,         'bill' => 0,    'startedAt' => null],
            ['id' => 15, 'name' => 'T15', 'type' => 'bar',    'seats' => 4, 'status' => 'occupied',  'customer' => 'Gunaratne',  'bill' => 1200, 'startedAt' => '19:30'],
            ['id' => 16, 'name' => 'T16', 'type' => '4-top',  'seats' => 4, 'status' => 'available', 'customer' => null,         'bill' => 0,    'startedAt' => null],
        ];

        return view('pos.tables', [
            'tables' => $tables,
            'tablesById' => collect($tables)->keyBy('id'),
        ]);
    }

    /**
     * Display the kitchen display system.
     */
    public function kds(): View
    {
        $orders = [
            ['id' => 'KDS-001', 'table' => 'T3', 'status' => 'new',       'time' => 3,  'priority' => 'normal', 'items' => [
                ['name' => 'Chicken Kottu',          'qty' => 2, 'options' => ['Extra spicy']],
                ['name' => 'Coca-Cola',              'qty' => 2, 'options' => []],
            ]],
            ['id' => 'KDS-002', 'table' => 'T7', 'status' => 'new',       'time' => 1,  'priority' => 'high',   'items' => [
                ['name' => 'Fish Ambul Thiyal',      'qty' => 1, 'options' => []],
                ['name' => 'Red Rice & Curry',       'qty' => 2, 'options' => ['Less spicy']],
                ['name' => 'Coconut Rice',           'qty' => 1, 'options' => []],
            ]],
            ['id' => 'KDS-003', 'table' => 'T1', 'status' => 'preparing', 'time' => 8,  'priority' => 'normal', 'items' => [
                ['name' => 'Lamprais',               'qty' => 2, 'options' => []],
                ['name' => 'Cutlet (3 pcs)',         'qty' => 1, 'options' => []],
            ]],
            ['id' => 'KDS-004', 'table' => 'T5', 'status' => 'preparing', 'time' => 5,  'priority' => 'normal', 'items' => [
                ['name' => 'Chicken Curry Rice',     'qty' => 1, 'options' => []],
                ['name' => 'Hoppers (3 pcs)',        'qty' => 2, 'options' => ['Extra egg']],
            ]],
            ['id' => 'KDS-005', 'table' => 'T2', 'status' => 'ready',     'time' => 12, 'priority' => 'normal', 'items' => [
                ['name' => 'Mutton Kottu',           'qty' => 1, 'options' => []],
                ['name' => 'Fresh Lime Soda',        'qty' => 1, 'options' => []],
            ]],
            ['id' => 'KDS-006', 'table' => 'T9', 'status' => 'new',       'time' => 0,  'priority' => 'high',   'items' => [
                ['name' => 'Prawn Curry Rice',       'qty' => 1, 'options' => ['Extra prawn']],
                ['name' => 'Momo (6 pcs)',           'qty' => 1, 'options' => []],
                ['name' => 'Ceylon Tea',             'qty' => 2, 'options' => []],
            ]],
            ['id' => 'KDS-007', 'table' => 'T4', 'status' => 'served',    'time' => 18, 'priority' => 'normal', 'items' => [
                ['name' => 'Veg Kottu',              'qty' => 1, 'options' => []],
                ['name' => 'Coconut Water',          'qty' => 1, 'options' => []],
            ]],
            ['id' => 'KDS-008', 'table' => 'T6', 'status' => 'preparing', 'time' => 6,  'priority' => 'normal', 'items' => [
                ['name' => 'Jaffna Crab Curry',      'qty' => 1, 'options' => []],
                ['name' => 'Red Rice & Curry',       'qty' => 1, 'options' => []],
                ['name' => 'Watalapan',              'qty' => 2, 'options' => []],
            ]],
        ];

        return view('pos.kds', compact('orders'));
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

        $inventoryItems = [
            ['id' => 1,  'name' => 'Rice (5kg)',           'category' => 'proteins',  'qty' => 4,  'unit' => 'bags',    'minQty' => 10, 'price' => 1850, 'supplier' => 'Sathosa',      'lastOrder' => '2024-01-10', 'status' => 'low'],
            ['id' => 2,  'name' => 'Coconut Milk',         'category' => 'dairy',     'qty' => 6,  'unit' => 'tins',    'minQty' => 12, 'price' => 280,  'supplier' => 'Nona Foods',   'lastOrder' => '2024-01-08', 'status' => 'low'],
            ['id' => 3,  'name' => 'Chicken (whole)',      'category' => 'proteins',  'qty' => 28, 'unit' => 'kg',      'minQty' => 20, 'price' => 950,  'supplier' => 'Local Farm',   'lastOrder' => '2024-01-12', 'status' => 'ok'],
            ['id' => 4,  'name' => 'Chilli Powder',        'category' => 'spices',    'qty' => 1,  'unit' => 'kg',      'minQty' => 5,  'price' => 650,  'supplier' => 'Spice Garden', 'lastOrder' => '2023-12-20', 'status' => 'critical'],
            ['id' => 5,  'name' => 'Lemon',                'category' => 'produce',   'qty' => 8,  'unit' => 'pcs',     'minQty' => 15, 'price' => 45,   'supplier' => 'Local Market', 'lastOrder' => '2024-01-11', 'status' => 'low'],
            ['id' => 6,  'name' => 'Prawn (king)',         'category' => 'seafood',   'qty' => 12, 'unit' => 'kg',      'minQty' => 10, 'price' => 2200, 'supplier' => 'SeaPort',      'lastOrder' => '2024-01-09', 'status' => 'ok'],
            ['id' => 7,  'name' => 'Mutton',               'category' => 'proteins',  'qty' => 15, 'unit' => 'kg',      'minQty' => 10, 'price' => 1800, 'supplier' => 'Local Farm',   'lastOrder' => '2024-01-12', 'status' => 'ok'],
            ['id' => 8,  'name' => 'All-Purpose Flour',    'category' => 'spices',    'qty' => 8,  'unit' => 'bags',    'minQty' => 10, 'price' => 520,  'supplier' => 'Sathosa',      'lastOrder' => '2024-01-05', 'status' => 'low'],
            ['id' => 9,  'name' => 'Salt (fine)',          'category' => 'spices',    'qty' => 25, 'unit' => 'kg',      'minQty' => 10, 'price' => 120,  'supplier' => 'Sathosa',      'lastOrder' => '2024-01-01', 'status' => 'ok'],
            ['id' => 10, 'name' => 'Curry Leaves',         'category' => 'produce',   'qty' => 3,  'unit' => 'bundles', 'minQty' => 5,  'price' => 80,   'supplier' => 'Local Market', 'lastOrder' => '2024-01-10', 'status' => 'low'],
            ['id' => 11, 'name' => 'Fish (mackerel)',      'category' => 'seafood',   'qty' => 18, 'unit' => 'kg',      'minQty' => 10, 'price' => 850,  'supplier' => 'SeaPort',      'lastOrder' => '2024-01-12', 'status' => 'ok'],
            ['id' => 12, 'name' => 'Eggs',                 'category' => 'dairy',     'qty' => 60, 'unit' => 'pcs',     'minQty' => 30, 'price' => 22,   'supplier' => 'Farm Fresh',   'lastOrder' => '2024-01-11', 'status' => 'ok'],
            ['id' => 13, 'name' => 'Onion (red)',          'category' => 'produce',   'qty' => 20, 'unit' => 'kg',      'minQty' => 10, 'price' => 180,  'supplier' => 'Local Market', 'lastOrder' => '2024-01-09', 'status' => 'ok'],
            ['id' => 14, 'name' => 'Garlic',               'category' => 'produce',   'qty' => 4,  'unit' => 'kg',      'minQty' => 5,  'price' => 450,  'supplier' => 'Local Market', 'lastOrder' => '2024-01-07', 'status' => 'low'],
            ['id' => 15, 'name' => 'Coca-Cola Syrup',      'category' => 'beverages', 'qty' => 3,  'unit' => 'liters',  'minQty' => 5,  'price' => 1200, 'supplier' => 'Coke Lanka',   'lastOrder' => '2023-12-28', 'status' => 'critical'],
            ['id' => 16, 'name' => 'Ceylon Tea Leaves',    'category' => 'beverages', 'qty' => 5,  'unit' => 'kg',      'minQty' => 3,  'price' => 1500, 'supplier' => 'Taproana',     'lastOrder' => '2024-01-06', 'status' => 'ok'],
            ['id' => 17, 'name' => 'Vanilla Ice Cream',    'category' => 'dairy',     'qty' => 8,  'unit' => 'liters',  'minQty' => 5,  'price' => 950,  'supplier' => 'Ice Cream Co', 'lastOrder' => '2024-01-08', 'status' => 'ok'],
            ['id' => 18, 'name' => 'Coconut (whole)',      'category' => 'produce',   'qty' => 2,  'unit' => 'pcs',     'minQty' => 10, 'price' => 85,   'supplier' => 'Local Market', 'lastOrder' => '2024-01-04', 'status' => 'critical'],
        ];

        $units = ['kg', 'pcs', 'bags', 'tins', 'liters', 'bundles'];

        $posInventory = [
            'categories' => collect($categories)->pluck('icon', 'id')->all(),
            'items' => $inventoryItems,
        ];

        return view('pos.inventory', compact('categories', 'inventoryItems', 'units', 'posInventory'));
    }

    /**
     * Display the customer relations page.
     */
    public function crm(): View
    {
        $customers = [
            ['id' => 1,  'name' => 'Nuwan Perera',          'phone' => '077-123-4567', 'email' => 'nuwan@email.com',        'visits' => 48, 'total_spend' => 18500, 'tier' => 'gold',   'joined' => '2023-06-15', 'lastVisit' => '2024-01-12', 'notes' => 'Prefers window seat, allergic to peanuts', 'favorite' => 'Chicken Kottu'],
            ['id' => 2,  'name' => 'Samantha de Silva',     'phone' => '071-987-6543', 'email' => 'sam.de@email.com',      'visits' => 32, 'total_spend' => 12400, 'tier' => 'gold',   'joined' => '2023-08-20', 'lastVisit' => '2024-01-11', 'notes' => 'Regular Friday diner', 'favorite' => 'Lamprais'],
            ['id' => 3,  'name' => 'Rajitha Fernando',      'phone' => '076-555-1234', 'email' => 'rajitha@email.com',     'visits' => 24, 'total_spend' => 8200,  'tier' => 'silver', 'joined' => '2023-10-01', 'lastVisit' => '2024-01-10', 'notes' => 'Large group on weekends', 'favorite' => 'Mutton Kottu'],
            ['id' => 4,  'name' => 'Michelle Jayawardena',  'phone' => '072-333-7890', 'email' => 'michelle@email.com',    'visits' => 18, 'total_spend' => 6750,  'tier' => 'silver', 'joined' => '2023-11-05', 'lastVisit' => '2024-01-09', 'notes' => 'Loves desserts', 'favorite' => 'Watalappan'],
            ['id' => 5,  'name' => 'Kasun Bandara',         'phone' => '075-222-4567', 'email' => 'kasun@email.com',       'visits' => 12, 'total_spend' => 3600,  'tier' => 'bronze', 'joined' => '2023-12-10', 'lastVisit' => '2024-01-08', 'notes' => '', 'favorite' => 'Hoppers'],
            ['id' => 6,  'name' => 'Dilan Rathnayake',      'phone' => '077-444-8901', 'email' => 'dilan@email.com',       'visits' => 8,  'total_spend' => 2100,  'tier' => 'bronze', 'joined' => '2024-01-02', 'lastVisit' => '2024-01-07', 'notes' => 'First-time visitor, left 5-star review', 'favorite' => 'Fish Ambul Thiyal'],
            ['id' => 7,  'name' => 'Priyanka Wijeyaratne',  'phone' => '071-666-2345', 'email' => 'priya@email.com',       'visits' => 41, 'total_spend' => 16800, 'tier' => 'gold',   'joined' => '2023-05-20', 'lastVisit' => '2024-01-12', 'notes' => 'VIP - always tips well', 'favorite' => 'Coconut Rice'],
            ['id' => 8,  'name' => 'Tharindu Gunaratne',    'phone' => '076-888-6789', 'email' => 'tharindu@email.com',    'visits' => 6,  'total_spend' => 1500,  'tier' => 'bronze', 'joined' => '2024-01-05', 'lastVisit' => '2024-01-06', 'notes' => '', 'favorite' => 'Cutlet'],
        ];

        return view('pos.crm', compact('customers'));
    }

    /**
     * Display the financial & sales reports page.
     */
    public function reports(): View
    {
        $salesData = [
            'today' => [
                ['label' => '10AM', 'orders' => 12, 'revenue' => 8400],
                ['label' => '11AM', 'orders' => 24, 'revenue' => 18200],
                ['label' => '12PM', 'orders' => 38, 'revenue' => 31500],
                ['label' => '1PM',  'orders' => 42, 'revenue' => 35600],
                ['label' => '2PM',  'orders' => 28, 'revenue' => 22400],
                ['label' => '3PM',  'orders' => 15, 'revenue' => 11200],
                ['label' => '4PM',  'orders' => 8,  'revenue' => 5600],
                ['label' => '5PM',  'orders' => 18, 'revenue' => 14400],
                ['label' => '6PM',  'orders' => 35, 'revenue' => 29800],
                ['label' => '7PM',  'orders' => 45, 'revenue' => 38200],
                ['label' => '8PM',  'orders' => 40, 'revenue' => 34000],
                ['label' => '9PM',  'orders' => 22, 'revenue' => 17600],
            ],
            'week' => [
                ['label' => 'Mon', 'orders' => 124, 'revenue' => 98000,  'cost' => 42000],
                ['label' => 'Tue', 'orders' => 138, 'revenue' => 112000, 'cost' => 48000],
                ['label' => 'Wed', 'orders' => 109, 'revenue' => 89000,  'cost' => 38000],
                ['label' => 'Thu', 'orders' => 167, 'revenue' => 134000, 'cost' => 56000],
                ['label' => 'Fri', 'orders' => 219, 'revenue' => 178000, 'cost' => 72000],
                ['label' => 'Sat', 'orders' => 268, 'revenue' => 215000, 'cost' => 89000],
                ['label' => 'Sun', 'orders' => 245, 'revenue' => 198000, 'cost' => 82000],
            ],
            'month' => [
                ['label' => 'W1', 'orders' => 580, 'revenue' => 468000, 'cost' => 195000],
                ['label' => 'W2', 'orders' => 620, 'revenue' => 502000, 'cost' => 208000],
                ['label' => 'W3', 'orders' => 595, 'revenue' => 481000, 'cost' => 199000],
                ['label' => 'W4', 'orders' => 640, 'revenue' => 528000, 'cost' => 218000],
            ],
        ];

        return view('pos.reports', compact('salesData'));
    }
}