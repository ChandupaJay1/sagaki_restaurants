<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Branch;
use App\Models\Table;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\InventoryItem;
use App\Models\Recipe;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Expense;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Delivery;
use App\Models\Attendance;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Truncate existing tables to avoid duplicate key errors
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Attendance::truncate();
        Delivery::truncate();
        PurchaseItem::truncate();
        Purchase::truncate();
        OrderItem::truncate();
        Order::truncate();
        Customer::truncate();
        Recipe::truncate();
        InventoryItem::truncate();
        MenuItem::truncate();
        Category::truncate();
        Table::truncate();
        Branch::truncate();
        User::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Create Users
        $pathum = User::create([
            'name' => 'MG_ Pathum',
            'email' => 'mgpdesaman@gmail.com',
            'password' => Hash::make('88222006'),
        ]);

        $amali = User::create([
            'name' => 'Amali Perera',
            'email' => 'amali@sagaki.com',
            'password' => Hash::make('password'),
        ]);

        $kamali = User::create([
            'name' => 'Kamali Silva',
            'email' => 'kamali@sagaki.com',
            'password' => Hash::make('password'),
        ]);

        $ravi = User::create([
            'name' => 'Ravi Fernando',
            'email' => 'ravi@sagaki.com',
            'password' => Hash::make('password'),
        ]);

        $nimal = User::create([
            'name' => 'Nimal Jayawardena',
            'email' => 'nimal@sagaki.com',
            'password' => Hash::make('password'),
        ]);

        // 1. Branches
        $branch1 = Branch::create([
            'name' => 'Colombo Main Branch',
            'location' => 'Galle Road, Colombo 03',
            'contact' => '011-234-5678',
        ]);
        
        $branch2 = Branch::create([
            'name' => 'Kandy Branch',
            'location' => 'Peradeniya Road, Kandy',
            'contact' => '081-234-5678',
        ]);

        // 2. Attendance
        Attendance::create(['user_id' => $amali->id, 'date' => now()->toDateString(), 'clock_in' => '08:00:00']);
        Attendance::create(['user_id' => $kamali->id, 'date' => now()->toDateString(), 'clock_in' => '08:15:00']);
        Attendance::create(['user_id' => $ravi->id, 'date' => now()->toDateString(), 'clock_in' => '09:00:00']);
        Attendance::create(['user_id' => $nimal->id, 'date' => now()->toDateString(), 'clock_in' => '07:30:00']);

        // 3. Tables
        $tablesData = [
            ['id' => 1,  'name' => 'T1',  'type' => '2-top',  'seats' => 2, 'status' => 'occupied',  'customer' => 'Perera',     'bill' => 2450, 'started_at' => '18:30'],
            ['id' => 2,  'name' => 'T2',  'type' => '2-top',  'seats' => 2, 'status' => 'occupied',  'customer' => 'Silva',      'bill' => 1800, 'started_at' => '18:45'],
            ['id' => 3,  'name' => 'T3',  'type' => '4-top',  'seats' => 4, 'status' => 'reserved',  'customer' => 'Fernando',   'bill' => 0,    'started_at' => '19:30'],
            ['id' => 4,  'name' => 'T4',  'type' => '4-top',  'seats' => 4, 'status' => 'available', 'customer' => null,         'bill' => 0,    'started_at' => null],
            ['id' => 5,  'name' => 'T5',  'type' => '6-top',  'seats' => 6, 'status' => 'occupied',  'customer' => 'Jayawardena','bill' => 4200, 'started_at' => '18:00'],
            ['id' => 6,  'name' => 'T6',  'type' => '8-top',  'seats' => 8, 'status' => 'available', 'customer' => null,         'bill' => 0,    'started_at' => null],
            ['id' => 7,  'name' => 'T7',  'type' => '4-top',  'seats' => 4, 'status' => 'occupied',  'customer' => 'Kumar',      'bill' => 3100, 'started_at' => '19:00'],
            ['id' => 8,  'name' => 'T8',  'type' => '2-top',  'seats' => 2, 'status' => 'reserved',  'customer' => 'De Zoysa',   'bill' => 0,    'started_at' => '20:00'],
            ['id' => 9,  'name' => 'T9',  'type' => '6-top',  'seats' => 6, 'status' => 'occupied',  'customer' => 'Ranasinghe', 'bill' => 2900, 'started_at' => '18:15'],
            ['id' => 10, 'name' => 'T10', 'type' => 'bar',    'seats' => 4, 'status' => 'available', 'customer' => null,         'bill' => 0,    'started_at' => null],
            ['id' => 11, 'name' => 'T11', 'type' => 'patio-4','seats' => 4, 'status' => 'available', 'customer' => null,         'bill' => 0,    'started_at' => null],
            ['id' => 12, 'name' => 'T12', 'type' => 'patio-6','seats' => 6, 'status' => 'occupied',  'customer' => 'Wijeyeratne','bill' => 5600, 'started_at' => '17:45'],
            ['id' => 13, 'name' => 'T13', 'type' => 'private', 'seats' => 8, 'status' => 'reserved',  'customer' => 'Bandara',    'bill' => 0,    'started_at' => '20:30'],
            ['id' => 14, 'name' => 'T14', 'type' => '2-top',  'seats' => 2, 'status' => 'available', 'customer' => null,         'bill' => 0,    'started_at' => null],
            ['id' => 15, 'name' => 'T15', 'type' => 'bar',    'seats' => 4, 'status' => 'occupied',  'customer' => 'Gunaratne',  'bill' => 1200, 'started_at' => '19:30'],
            ['id' => 16, 'name' => 'T16', 'type' => '4-top',  'seats' => 4, 'status' => 'available', 'customer' => null,         'bill' => 0,    'started_at' => null],
        ];

        foreach ($tablesData as $t) {
            Table::create($t + ['branch_id' => $branch1->id]);
        }

        // 4. Menu Categories
        $cats = [
            'kottu' => Category::create(['name' => 'Kottu', 'slug' => 'kottu', 'icon' => 'flame']),
            'rice' => Category::create(['name' => 'Rice & Curry', 'slug' => 'rice', 'icon' => 'chef-hat']),
            'shortEats' => Category::create(['name' => 'Short Eats', 'slug' => 'shortEats', 'icon' => 'tag']),
            'beverages' => Category::create(['name' => 'Beverages', 'slug' => 'beverages', 'icon' => 'coffee']),
            'drinks' => Category::create(['name' => 'Drinks', 'slug' => 'drinks', 'icon' => 'wine']),
            'desserts' => Category::create(['name' => 'Desserts', 'slug' => 'desserts', 'icon' => 'ice-cream']),
        ];

        // 5. Menu Items
        $menuItemsData = [
            ['category' => 'kottu', 'id' => 1,  'name' => 'Chicken Kottu',         'price' => 850,  'emoji' => '🍛', 'tags' => ['spicy'], 'barcode' => '880101'],
            ['category' => 'kottu', 'id' => 2,  'name' => 'Egg Kottu',              'price' => 700,  'emoji' => '🍳', 'tags' => [], 'barcode' => '880102'],
            ['category' => 'kottu', 'id' => 3,  'name' => 'Fish Kottu',             'price' => 950,  'emoji' => '🐟', 'tags' => ['spicy'], 'barcode' => '880103'],
            ['category' => 'kottu', 'id' => 4,  'name' => 'Veg Kottu',              'price' => 600,  'emoji' => '🥬', 'tags' => ['vegan'], 'barcode' => '880104'],
            ['category' => 'kottu', 'id' => 5,  'name' => 'Mutton Kottu',           'price' => 1200, 'emoji' => '🍖', 'tags' => ['spicy'], 'barcode' => '880105'],
            ['category' => 'kottu', 'id' => 6,  'name' => 'Cheese Kottu',           'price' => 900,  'emoji' => '🧀', 'tags' => [], 'barcode' => '880106'],
            
            ['category' => 'rice', 'id' => 7,  'name' => 'Chicken Curry Rice',     'price' => 850,  'emoji' => '🍛', 'tags' => ['spicy'], 'barcode' => '880201'],
            ['category' => 'rice', 'id' => 8,  'name' => 'Lamprais',               'price' => 950,  'emoji' => '📦', 'tags' => [], 'barcode' => '880202'],
            ['category' => 'rice', 'id' => 9,  'name' => 'Fish Ambul Thiyal',      'price' => 1100, 'emoji' => '🐟', 'tags' => ['spicy'], 'barcode' => '880203'],
            ['category' => 'rice', 'id' => 10, 'name' => 'Red Rice & Curry',       'price' => 750,  'emoji' => '🍚', 'tags' => ['spicy'], 'barcode' => '880204'],
            ['category' => 'rice', 'id' => 11, 'name' => 'Jaffna Crab Curry',      'price' => 1500, 'emoji' => '🦀', 'tags' => ['spicy'], 'barcode' => '880205'],
            ['category' => 'rice', 'id' => 12, 'name' => 'Coconut Rice',           'price' => 600,  'emoji' => '🥥', 'tags' => [], 'barcode' => '880206'],
            ['category' => 'rice', 'id' => 13, 'name' => 'Prawn Curry Rice',       'price' => 1300, 'emoji' => '🦐', 'tags' => ['spicy'], 'barcode' => '880207'],
            ['category' => 'rice', 'id' => 14, 'name' => 'Hoppers (3 pcs)',        'price' => 450,  'emoji' => '🥞', 'tags' => [], 'barcode' => '880208'],
            ['category' => 'rice', 'id' => 15, 'name' => 'String Hoppers (4 pcs)', 'price' => 500,  'emoji' => '🍜', 'tags' => [], 'barcode' => '880209'],
            
            ['category' => 'shortEats', 'id' => 16, 'name' => 'Roti with Curry',        'price' => 350,  'emoji' => '🫓', 'tags' => [], 'barcode' => '880301'],
            ['category' => 'shortEats', 'id' => 17, 'name' => 'Cutlet (3 pcs)',         'price' => 450,  'emoji' => '🥟', 'tags' => ['spicy'], 'barcode' => '880302'],
            ['category' => 'shortEats', 'id' => 18, 'name' => 'Prawn Rolls (4 pcs)',    'price' => 650,  'emoji' => '🦐', 'tags' => [], 'barcode' => '880303'],
            ['category' => 'shortEats', 'id' => 19, 'name' => 'Fish Bankura',           'price' => 550,  'emoji' => '🐟', 'tags' => ['spicy'], 'barcode' => '880304'],
            ['category' => 'shortEats', 'id' => 20, 'name' => 'Chicken 65',             'price' => 600,  'emoji' => '🍗', 'tags' => ['spicy'], 'barcode' => '880305'],
            ['category' => 'shortEats', 'id' => 21, 'name' => 'Momo (6 pcs)',           'price' => 750,  'emoji' => '🥟', 'tags' => [], 'barcode' => '880306'],
            ['category' => 'shortEats', 'id' => 22, 'name' => 'Veg Spring Roll (3 pcs)','price' => 400,  'emoji' => '🌯', 'tags' => ['vegan'], 'barcode' => '880307'],
            ['category' => 'shortEats', 'id' => 23, 'name' => 'Samosa (2 pcs)',         'price' => 300,  'emoji' => '🥟', 'tags' => ['vegan'], 'barcode' => '880308'],
            
            ['category' => 'beverages', 'id' => 24, 'name' => 'Ceylon Tea',             'price' => 150,  'emoji' => '🍵', 'tags' => [], 'barcode' => '880401'],
            ['category' => 'beverages', 'id' => 25, 'name' => 'Iced Tea',               'price' => 250,  'emoji' => '🧊', 'tags' => [], 'barcode' => '880402'],
            ['category' => 'beverages', 'id' => 26, 'name' => 'Fresh Lime Soda',        'price' => 300,  'emoji' => '🍋', 'tags' => [], 'barcode' => '880403'],
            ['category' => 'beverages', 'id' => 27, 'name' => 'Coconut Water',          'price' => 200,  'emoji' => '🥥', 'tags' => ['vegan'], 'barcode' => '880404'],
            ['category' => 'beverages', 'id' => 28, 'name' => 'Milk Shake',             'price' => 450,  'emoji' => '🥤', 'tags' => [], 'barcode' => '880405'],
            ['category' => 'beverages', 'id' => 29, 'name' => 'Fresh Juice',            'price' => 350,  'emoji' => '🧃', 'tags' => ['vegan'], 'barcode' => '880406'],
            ['category' => 'beverages', 'id' => 30, 'name' => 'Espresso',               'price' => 280,  'emoji' => '☕', 'tags' => [], 'barcode' => '880407'],
            
            ['category' => 'drinks', 'id' => 31, 'name' => 'Coca-Cola',              'price' => 200,  'emoji' => '🥤', 'tags' => [], 'barcode' => '880501'],
            ['category' => 'drinks', 'id' => 32, 'name' => 'Fanta',                  'price' => 200,  'emoji' => '🍊', 'tags' => [], 'barcode' => '880502'],
            ['category' => 'drinks', 'id' => 33, 'name' => 'Sprite',                 'price' => 200,  'emoji' => '🧃', 'tags' => [], 'barcode' => '880503'],
            ['category' => 'drinks', 'id' => 34, 'name' => 'Red Bull',               'price' => 450,  'emoji' => '⚡', 'tags' => [], 'barcode' => '880504'],
            ['category' => 'drinks', 'id' => 35, 'name' => 'Heineken',               'price' => 700,  'emoji' => '🍺', 'tags' => [], 'barcode' => '880505'],
            ['category' => 'drinks', 'id' => 36, 'name' => 'King Lager',             'price' => 550,  'emoji' => '🍺', 'tags' => [], 'barcode' => '880506'],
            
            ['category' => 'desserts', 'id' => 37, 'name' => 'Watalappan',             'price' => 350,  'emoji' => '🍮', 'tags' => [], 'barcode' => '880601'],
            ['category' => 'desserts', 'id' => 38, 'name' => 'Halawa',                 'price' => 250,  'emoji' => '🍮', 'tags' => [], 'barcode' => '880602'],
            ['category' => 'desserts', 'id' => 39, 'name' => 'Ice Cream (2 scoops)',   'price' => 400,  'emoji' => '🍨', 'tags' => [], 'barcode' => '880603'],
            ['category' => 'desserts', 'id' => 40, 'name' => 'Chocolate Lava Cake',    'price' => 550,  'emoji' => '🍫', 'tags' => [], 'barcode' => '880604'],
            ['category' => 'desserts', 'id' => 41, 'name' => 'Pineapple Torte',        'price' => 450,  'emoji' => '🍍', 'tags' => [], 'barcode' => '880605'],
            ['category' => 'desserts', 'id' => 42, 'name' => 'Sticky Toffee Pudding',  'price' => 500,  'emoji' => '🍰', 'tags' => [], 'barcode' => '880606'],
        ];

        $itemsMap = [];
        foreach ($menuItemsData as $d) {
            $catId = $cats[$d['category']]->id;
            $m = MenuItem::create([
                'id' => $d['id'],
                'category_id' => $catId,
                'name' => $d['name'],
                'price' => $d['price'],
                'emoji' => $d['emoji'],
                'tags' => $d['tags'],
                'barcode' => $d['barcode'],
                'is_available' => true,
            ]);
            $itemsMap[$d['name']] = $m;
        }

        // 6. Inventory Items
        $inventoryItemsData = [
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
            // Add Roti & Veg elements to support the example stock deduction
            ['id' => 19, 'name' => 'Roti (ready-made)',    'category' => 'produce',   'qty' => 100,'unit' => 'pcs',     'minQty' => 20, 'price' => 25,   'supplier' => 'Local Bakery', 'lastOrder' => '2024-01-12', 'status' => 'ok'],
            ['id' => 20, 'name' => 'Mixed Vegetables',     'category' => 'produce',   'qty' => 15, 'unit' => 'kg',      'minQty' => 5,  'price' => 150,  'supplier' => 'Local Market', 'lastOrder' => '2024-01-12', 'status' => 'ok'],
        ];

        $invMap = [];
        foreach ($inventoryItemsData as $i) {
            $data = [
                'id' => $i['id'],
                'name' => $i['name'],
                'category' => $i['category'],
                'qty' => $i['qty'],
                'unit' => $i['unit'],
                'min_qty' => $i['minQty'],
                'price' => $i['price'],
                'supplier' => $i['supplier'],
                'last_order' => $i['lastOrder'],
                'status' => $i['status'],
                'branch_id' => $branch1->id,
            ];
            $inv = InventoryItem::create($data);
            $invMap[$i['name']] = $inv;
        }

        // 7. Recipes (Chicken Kottu Sold = Chicken -200g, Roti -2, Vegetables -100g)
        $ck = $itemsMap['Chicken Kottu'] ?? null;
        if ($ck) {
            Recipe::create(['menu_item_id' => $ck->id, 'inventory_item_id' => $invMap['Chicken (whole)']->id, 'qty_required' => 0.200]);
            Recipe::create(['menu_item_id' => $ck->id, 'inventory_item_id' => $invMap['Roti (ready-made)']->id, 'qty_required' => 2.000]);
            Recipe::create(['menu_item_id' => $ck->id, 'inventory_item_id' => $invMap['Mixed Vegetables']->id, 'qty_required' => 0.100]);
        }

        // 8. Customers
        $customersData = [
            ['name' => 'Nuwan Perera',          'phone' => '077-123-4567', 'email' => 'nuwan@email.com',        'visits' => 48, 'total_spend' => 18500, 'tier' => 'gold',   'notes' => 'Prefers window seat, allergic to peanuts', 'favorite' => 'Chicken Kottu', 'loyalty_points' => 480],
            ['name' => 'Samantha de Silva',     'phone' => '071-987-6543', 'email' => 'sam.de@email.com',      'visits' => 32, 'total_spend' => 12400, 'tier' => 'gold',   'notes' => 'Regular Friday diner', 'favorite' => 'Lamprais', 'loyalty_points' => 320],
            ['name' => 'Rajitha Fernando',      'phone' => '076-555-1234', 'email' => 'rajitha@email.com',     'visits' => 24, 'total_spend' => 8200,  'tier' => 'silver', 'notes' => 'Large group on weekends', 'favorite' => 'Mutton Kottu', 'loyalty_points' => 160],
            ['name' => 'Michelle Jayawardena',  'phone' => '072-333-7890', 'email' => 'michelle@email.com',    'visits' => 18, 'total_spend' => 6750,  'tier' => 'silver', 'notes' => 'Loves desserts', 'favorite' => 'Watalappan', 'loyalty_points' => 120],
            ['name' => 'Kasun Bandara',         'phone' => '075-222-4567', 'email' => 'kasun@email.com',       'visits' => 12, 'total_spend' => 3600,  'tier' => 'bronze', 'notes' => '', 'favorite' => 'Hoppers (3 pcs)', 'loyalty_points' => 60],
            ['name' => 'Dilan Rathnayake',      'phone' => '077-444-8901', 'email' => 'dilan@email.com',       'visits' => 8,  'total_spend' => 2100,  'tier' => 'bronze', 'notes' => 'First-time visitor, left 5-star review', 'favorite' => 'Fish Ambul Thiyal', 'loyalty_points' => 30],
            ['name' => 'Priyanka Wijeyaratne',  'phone' => '071-666-2345', 'email' => 'priya@email.com',       'visits' => 41, 'total_spend' => 16800, 'tier' => 'gold',   'notes' => 'VIP - always tips well', 'favorite' => 'Coconut Rice', 'loyalty_points' => 410],
            ['name' => 'Tharindu Gunaratne',    'phone' => '076-888-6789', 'email' => 'tharindu@email.com',    'visits' => 6,  'total_spend' => 1500,  'tier' => 'bronze', 'notes' => '', 'favorite' => 'Cutlet (3 pcs)', 'loyalty_points' => 15],
        ];

        $custMap = [];
        foreach ($customersData as $c) {
            $cust = Customer::create($c);
            $custMap[$c['name']] = $cust;
        }

        // 9. Orders & Order Items
        $ordersData = [
            ['id' => 'ORD-142', 'table_name' => 'T5',  'items_count' => 6, 'total' => 4200, 'status' => 'paid',     'method' => 'Card', 'customer_name' => 'Jayawardena', 'time' => now()->subMinutes(2)],
            ['id' => 'ORD-141', 'table_name' => 'T3',  'items_count' => 4, 'total' => 2850, 'status' => 'preparing', 'method' => 'Cash', 'customer_name' => 'Fernando', 'time' => now()->subMinutes(5)],
            ['id' => 'ORD-140', 'table_name' => 'T12', 'items_count' => 8, 'total' => 5600, 'status' => 'paid',     'method' => 'Card', 'customer_name' => 'Wijeyeratne', 'time' => now()->subMinutes(12)],
            ['id' => 'ORD-139', 'table_name' => 'T7',  'items_count' => 3, 'total' => 3100, 'status' => 'served',   'method' => 'Cash', 'customer_name' => 'Kumar', 'time' => now()->subMinutes(18)],
            ['id' => 'ORD-138', 'table_name' => 'T1',  'items_count' => 2, 'total' => 1700, 'status' => 'paid',     'method' => 'Card', 'customer_name' => 'Perera', 'time' => now()->subMinutes(25)],
            ['id' => 'ORD-137', 'table_name' => 'T9',  'items_count' => 5, 'total' => 3800, 'status' => 'paid',     'method' => 'QR',   'customer_name' => 'Ranasinghe', 'time' => now()->subMinutes(32)],
            ['id' => 'ORD-136', 'table_name' => 'T4',  'items_count' => 1, 'total' => 850,  'status' => 'served',   'method' => 'Cash', 'customer_name' => null, 'time' => now()->subMinutes(41)],
        ];

        // Also add KDS order formats (KDS-001)
        $kdsOrdersData = [
            ['id' => 'KDS-001', 'table' => 'T3', 'status' => 'new',       'time_offset' => 3,  'priority' => 'normal', 'items' => [
                ['name' => 'Chicken Kottu',          'qty' => 2, 'options' => ['Extra spicy']],
                ['name' => 'Coca-Cola',              'qty' => 2, 'options' => []],
            ]],
            ['id' => 'KDS-002', 'table' => 'T7', 'status' => 'new',       'time_offset' => 1,  'priority' => 'high',   'items' => [
                ['name' => 'Fish Ambul Thiyal',      'qty' => 1, 'options' => []],
                ['name' => 'Red Rice & Curry',       'qty' => 2, 'options' => ['Less spicy']],
                ['name' => 'Coconut Rice',           'qty' => 1, 'options' => []],
            ]],
            ['id' => 'KDS-003', 'table' => 'T1', 'status' => 'preparing', 'time_offset' => 8,  'priority' => 'normal', 'items' => [
                ['name' => 'Lamprais',               'qty' => 2, 'options' => []],
                ['name' => 'Cutlet (3 pcs)',         'qty' => 1, 'options' => []],
            ]],
            ['id' => 'KDS-004', 'table' => 'T5', 'status' => 'preparing', 'time_offset' => 5,  'priority' => 'normal', 'items' => [
                ['name' => 'Chicken Curry Rice',     'qty' => 1, 'options' => []],
                ['name' => 'Hoppers (3 pcs)',        'qty' => 2, 'options' => ['Extra egg']],
            ]],
            ['id' => 'KDS-005', 'table' => 'T2', 'status' => 'ready',     'time_offset' => 12, 'priority' => 'normal', 'items' => [
                ['name' => 'Mutton Kottu',           'qty' => 1, 'options' => []],
                ['name' => 'Fresh Lime Soda',        'qty' => 1, 'options' => []],
            ]],
            ['id' => 'KDS-006', 'table' => 'T9', 'status' => 'new',       'time_offset' => 0,  'priority' => 'high',   'items' => [
                ['name' => 'Prawn Curry Rice',       'qty' => 1, 'options' => ['Extra prawn']],
                ['name' => 'Momo (6 pcs)',           'qty' => 1, 'options' => []],
                ['name' => 'Ceylon Tea',             'qty' => 2, 'options' => []],
            ]],
            ['id' => 'KDS-007', 'table' => 'T4', 'status' => 'served',    'time_offset' => 18, 'priority' => 'normal', 'items' => [
                ['name' => 'Veg Kottu',              'qty' => 1, 'options' => []],
                ['name' => 'Coconut Water',          'qty' => 1, 'options' => []],
            ]],
            ['id' => 'KDS-008', 'table' => 'T6', 'status' => 'preparing', 'time_offset' => 6,  'priority' => 'normal', 'items' => [
                ['name' => 'Jaffna Crab Curry',      'qty' => 1, 'options' => []],
                ['name' => 'Red Rice & Curry',       'qty' => 1, 'options' => []],
                ['name' => 'Watalappan',              'qty' => 2, 'options' => []],
            ]],
        ];

        // Seed recent orders
        foreach ($ordersData as $o) {
            $table = Table::where('name', $o['table_name'])->first();
            $customer = $o['customer_name'] ? (Customer::where('name', 'like', '%'.$o['customer_name'].'%')->first()) : null;
            
            Order::create([
                'id' => $o['id'],
                'branch_id' => $branch1->id,
                'table_id' => $table?->id,
                'customer_id' => $customer?->id,
                'order_type' => 'dine-in',
                'status' => $o['status'] === 'paid' ? 'served' : $o['status'],
                'payment_method' => $o['method'],
                'note' => '',
                'subtotal' => $o['total'] / 1.10,
                'service_charge' => ($o['total'] / 1.10) * 0.10,
                'total' => $o['total'],
                'cashier_id' => $amali->id,
                'created_at' => $o['time'],
            ]);
        }

        // Seed KDS active orders
        foreach ($kdsOrdersData as $k) {
            $table = Table::where('name', $k['table'])->first();
            
            $subtotal = 0;
            $itemsToCreate = [];
            foreach ($k['items'] as $item) {
                $menuItem = MenuItem::where('name', $item['name'])->first();
                if ($menuItem) {
                    $price = $menuItem->price;
                    $subtotal += $price * $item['qty'];
                    $itemsToCreate[] = [
                        'menu_item_id' => $menuItem->id,
                        'qty' => $item['qty'],
                        'price' => $price,
                        'options' => $item['options'],
                    ];
                }
            }
            $serviceCharge = $subtotal * 0.10;
            $total = $subtotal + $serviceCharge;

            Order::create([
                'id' => $k['id'],
                'branch_id' => $branch1->id,
                'table_id' => $table?->id,
                'order_type' => 'dine-in',
                'status' => $k['status'],
                'note' => $k['priority'] === 'high' ? 'High priority' : '',
                'subtotal' => $subtotal,
                'service_charge' => $serviceCharge,
                'total' => $total,
                'created_at' => now()->subMinutes($k['time_offset']),
            ]);

            foreach ($itemsToCreate as $it) {
                OrderItem::create($it + ['order_id' => $k['id']]);
            }
        }

        // 10. Expenses
        Expense::create(['branch_id' => $branch1->id, 'category' => 'utilities', 'amount' => 45000, 'description' => 'Electricity bill Jan', 'date' => '2024-01-10']);
        Expense::create(['branch_id' => $branch1->id, 'category' => 'salaries', 'amount' => 180000, 'description' => 'Kitchen staff salaries', 'date' => '2024-01-05']);
        Expense::create(['branch_id' => $branch1->id, 'category' => 'rent', 'amount' => 120000, 'description' => 'Shop rent Galle Rd', 'date' => '2024-01-01']);
        Expense::create(['branch_id' => $branch1->id, 'category' => 'inventory', 'amount' => 85000, 'description' => 'Purchase of meat & spices', 'date' => '2024-01-11']);
    }
}
