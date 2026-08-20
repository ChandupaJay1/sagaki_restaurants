<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use App\Models\RestaurantTable;
use Illuminate\Database\Seeder;

class RestaurantSeeder extends Seeder
{
    public function run(): void
    {
        $tables = [
            ['name' => 'T1',  'type' => '2-top',  'seats' => 2, 'status' => 'available', 'section' => 'indoor'],
            ['name' => 'T2',  'type' => '2-top',  'seats' => 2, 'status' => 'available', 'section' => 'indoor'],
            ['name' => 'T3',  'type' => '4-top',  'seats' => 4, 'status' => 'available', 'section' => 'indoor'],
            ['name' => 'T4',  'type' => '4-top',  'seats' => 4, 'status' => 'available', 'section' => 'indoor'],
            ['name' => 'T5',  'type' => '6-top',  'seats' => 6, 'status' => 'available', 'section' => 'indoor'],
            ['name' => 'T6',  'type' => '8-top',  'seats' => 8, 'status' => 'available', 'section' => 'indoor'],
            ['name' => 'T7',  'type' => '4-top',  'seats' => 4, 'status' => 'available', 'section' => 'indoor'],
            ['name' => 'T8',  'type' => '2-top',  'seats' => 2, 'status' => 'available', 'section' => 'indoor'],
            ['name' => 'T9',  'type' => '6-top',  'seats' => 6, 'status' => 'available', 'section' => 'indoor'],
            ['name' => 'T10', 'type' => 'bar',    'seats' => 4, 'status' => 'available', 'section' => 'bar'],
            ['name' => 'T11', 'type' => 'patio-4','seats' => 4, 'status' => 'available', 'section' => 'patio'],
            ['name' => 'T12', 'type' => 'patio-6','seats' => 6, 'status' => 'available', 'section' => 'patio'],
            ['name' => 'T13', 'type' => 'private', 'seats' => 8, 'status' => 'available', 'section' => 'private'],
            ['name' => 'T14', 'type' => '2-top',  'seats' => 2, 'status' => 'available', 'section' => 'indoor'],
            ['name' => 'T15', 'type' => 'bar',    'seats' => 4, 'status' => 'available', 'section' => 'bar'],
            ['name' => 'T16', 'type' => '4-top',  'seats' => 4, 'status' => 'available', 'section' => 'indoor'],
        ];

        foreach ($tables as $table) {
            RestaurantTable::create($table);
        }

        $menuItems = [
            ['name' => 'Chicken Kottu',           'category' => 'kottu',     'price' => 850,  'emoji' => '🍛', 'tags' => ['spicy']],
            ['name' => 'Egg Kottu',                'category' => 'kottu',     'price' => 700,  'emoji' => '🍳', 'tags' => []],
            ['name' => 'Fish Kottu',               'category' => 'kottu',     'price' => 950,  'emoji' => '🐟', 'tags' => ['spicy']],
            ['name' => 'Veg Kottu',                'category' => 'kottu',     'price' => 600,  'emoji' => '🥬', 'tags' => ['vegan']],
            ['name' => 'Mutton Kottu',             'category' => 'kottu',     'price' => 1200, 'emoji' => '🍖', 'tags' => ['spicy']],
            ['name' => 'Cheese Kottu',             'category' => 'kottu',     'price' => 900,  'emoji' => '🧀', 'tags' => []],
            ['name' => 'Chicken Curry Rice',       'category' => 'rice',      'price' => 850,  'emoji' => '🍛', 'tags' => ['spicy']],
            ['name' => 'Lamprais',                 'category' => 'rice',      'price' => 950,  'emoji' => '📦', 'tags' => []],
            ['name' => 'Fish Ambul Thiyal',        'category' => 'rice',      'price' => 1100, 'emoji' => '🐟', 'tags' => ['spicy']],
            ['name' => 'Red Rice & Curry',         'category' => 'rice',      'price' => 750,  'emoji' => '🍚', 'tags' => ['spicy']],
            ['name' => 'Jaffna Crab Curry',        'category' => 'rice',      'price' => 1500, 'emoji' => '🦀', 'tags' => ['spicy']],
            ['name' => 'Coconut Rice',             'category' => 'rice',      'price' => 600,  'emoji' => '🥥', 'tags' => []],
            ['name' => 'Prawn Curry Rice',         'category' => 'rice',      'price' => 1300, 'emoji' => '🦐', 'tags' => ['spicy']],
            ['name' => 'Hoppers (3 pcs)',          'category' => 'rice',      'price' => 450,  'emoji' => '🥞', 'tags' => []],
            ['name' => 'String Hoppers (4 pcs)',   'category' => 'rice',      'price' => 500,  'emoji' => '🍜', 'tags' => []],
            ['name' => 'Roti with Curry',          'category' => 'shortEats', 'price' => 350,  'emoji' => '🫓', 'tags' => []],
            ['name' => 'Cutlet (3 pcs)',           'category' => 'shortEats', 'price' => 450,  'emoji' => '🥟', 'tags' => ['spicy']],
            ['name' => 'Prawn Rolls (4 pcs)',      'category' => 'shortEats', 'price' => 650,  'emoji' => '🦐', 'tags' => []],
            ['name' => 'Fish Bankura',             'category' => 'shortEats', 'price' => 550,  'emoji' => '🐟', 'tags' => ['spicy']],
            ['name' => 'Chicken 65',               'category' => 'shortEats', 'price' => 600,  'emoji' => '🍗', 'tags' => ['spicy']],
            ['name' => 'Momo (6 pcs)',             'category' => 'shortEats', 'price' => 750,  'emoji' => '🥟', 'tags' => []],
            ['name' => 'Veg Spring Roll (3 pcs)',  'category' => 'shortEats', 'price' => 400,  'emoji' => '🌯', 'tags' => ['vegan']],
            ['name' => 'Samosa (2 pcs)',           'category' => 'shortEats', 'price' => 300,  'emoji' => '🥟', 'tags' => ['vegan']],
            ['name' => 'Ceylon Tea',               'category' => 'beverages', 'price' => 150,  'emoji' => '🍵', 'tags' => []],
            ['name' => 'Iced Tea',                 'category' => 'beverages', 'price' => 250,  'emoji' => '🧊', 'tags' => []],
            ['name' => 'Fresh Lime Soda',          'category' => 'beverages', 'price' => 300,  'emoji' => '🍋', 'tags' => []],
            ['name' => 'Coconut Water',            'category' => 'beverages', 'price' => 200,  'emoji' => '🥥', 'tags' => ['vegan']],
            ['name' => 'Milk Shake',               'category' => 'beverages', 'price' => 450,  'emoji' => '🥤', 'tags' => []],
            ['name' => 'Fresh Juice',              'category' => 'beverages', 'price' => 350,  'emoji' => '🧃', 'tags' => ['vegan']],
            ['name' => 'Espresso',                 'category' => 'beverages', 'price' => 280,  'emoji' => '☕', 'tags' => []],
            ['name' => 'Coca-Cola',                'category' => 'drinks',    'price' => 200,  'emoji' => '🥤', 'tags' => []],
            ['name' => 'Fanta',                    'category' => 'drinks',    'price' => 200,  'emoji' => '🍊', 'tags' => []],
            ['name' => 'Sprite',                   'category' => 'drinks',    'price' => 200,  'emoji' => '🧃', 'tags' => []],
            ['name' => 'Red Bull',                 'category' => 'drinks',    'price' => 450,  'emoji' => '⚡', 'tags' => []],
            ['name' => 'Heineken',                 'category' => 'drinks',    'price' => 700,  'emoji' => '🍺', 'tags' => []],
            ['name' => 'King Lager',               'category' => 'drinks',    'price' => 550,  'emoji' => '🍺', 'tags' => []],
            ['name' => 'Watalappan',               'category' => 'desserts',  'price' => 350,  'emoji' => '🍮', 'tags' => []],
            ['name' => 'Halawa',                   'category' => 'desserts',  'price' => 250,  'emoji' => '🍮', 'tags' => []],
            ['name' => 'Ice Cream (2 scoops)',     'category' => 'desserts',  'price' => 400,  'emoji' => '🍨', 'tags' => []],
            ['name' => 'Chocolate Lava Cake',      'category' => 'desserts',  'price' => 550,  'emoji' => '🍫', 'tags' => []],
            ['name' => 'Pineapple Torte',          'category' => 'desserts',  'price' => 450,  'emoji' => '🍍', 'tags' => []],
            ['name' => 'Sticky Toffee Pudding',    'category' => 'desserts',  'price' => 500,  'emoji' => '🍰', 'tags' => []],
        ];

        foreach ($menuItems as $item) {
            MenuItem::create($item);
        }
    }
}
