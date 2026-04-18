<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@atci.local'],
            [
                'name' => 'Administrateur ATCI',
                'role' => 'admin',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        User::query()->updateOrCreate(
            ['email' => 'secretaire@atci.local'],
            [
                'name' => 'Secrétaire ATCI',
                'role' => 'secretaire',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
    }
}
