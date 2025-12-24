<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Menu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Default Admin (WAJIB)
        User::create([
            'name' => 'WIJI FIKO TEREN',
            'email' => 'tobellord@gmail.com',
            'password' => Hash::make('officer123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create Sample Customer
        User::create([
            'name' => 'Customer Test',
            'email' => 'customer@test.com',
            'password' => Hash::make('customer123'),
            'role' => 'customer',
            'email_verified_at' => now(),
        ]);

        // Create Categories
        $categories = [
            ['name' => 'Nasi & Mie'],
            ['name' => 'Ayam'],
            ['name' => 'Seafood'],
            ['name' => 'Sayuran'],
            ['name' => 'Minuman'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // Create Sample Menus
        $menus = [
            [
                'category_id' => 1,
                'name' => 'Nasi Goreng Spesial',
                'description' => 'Nasi goreng dengan bumbu rahasia chef, dilengkapi telur, ayam, dan sayuran segar',
                'price' => 35000,
                'stock' => 50,
                'is_active' => true,
            ],
            [
                'category_id' => 1,
                'name' => 'Mie Goreng Seafood',
                'description' => 'Mie goreng dengan seafood segar dan bumbu khas Golden Dragon',
                'price' => 45000,
                'stock' => 30,
                'is_active' => true,
            ],
            [
                'category_id' => 2,
                'name' => 'Ayam Kung Pao',
                'description' => 'Ayam dengan saus pedas manis khas Szechuan',
                'price' => 55000,
                'stock' => 25,
                'is_active' => true,
            ],
            [
                'category_id' => 3,
                'name' => 'Udang Saus Tiram',
                'description' => 'Udang segar dengan saus tiram premium',
                'price' => 75000,
                'stock' => 20,
                'is_active' => true,
            ],
            [
                'category_id' => 4,
                'name' => 'Capcay Goreng',
                'description' => 'Aneka sayuran segar tumis dengan saus spesial',
                'price' => 30000,
                'stock' => 40,
                'is_active' => true,
            ],
            [
                'category_id' => 5,
                'name' => 'Es Teh Manis',
                'description' => 'Teh manis segar',
                'price' => 8000,
                'stock' => 100,
                'is_active' => true,
            ],
            [
                'category_id' => 2,
                'name' => 'Ayam Goreng Mentega',
                'description' => 'Ayam goreng dengan saus mentega gurih',
                'price' => 48000,
                'stock' => 35,
                'is_active' => true,
            ],
            [
                'category_id' => 3,
                'name' => 'Cumi Saus Padang',
                'description' => 'Cumi segar dengan saus padang pedas',
                'price' => 65000,
                'stock' => 15,
                'is_active' => true,
            ],
        ];

        foreach ($menus as $menu) {
            Menu::create($menu);
        }
    }
}
