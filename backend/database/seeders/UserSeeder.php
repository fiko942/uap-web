<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::updateOrCreate(
            ['email' => 'tobellord@gmail.com'],
            [
                'name' => 'WIJI FIKO TEREN',
                'password' => \Illuminate\Support\Facades\Hash::make('officer123'),
                'role' => 'admin',
                'id' => 1, // Ensure its ID 1 as seed admin
            ]
        );
    }
}
