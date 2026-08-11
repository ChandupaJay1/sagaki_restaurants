<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'MG_ Pathum',
            'email' => 'mgpdesaman@gmail.com',
            'password' => Hash::make('88222006'),
        ]);

        User::create([
            'name' => 'Amali Perera',
            'email' => 'amali@sagaki.com',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'Kamali Silva',
            'email' => 'kamali@sagaki.com',
            'password' => Hash::make('password'),
        ]);
    }
}
