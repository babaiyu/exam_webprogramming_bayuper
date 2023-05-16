<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Insert default roles
        DB::table('roles')->insert([
            [
                'role_name' => 'Super Admin',
                'role_value' => 'SUPER_ADMIN',
            ], [
                'role_name' => 'Admin',
                'role_value' => 'ADMIN',
            ],
        ]);

        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@admin.com',
            'password' => bcrypt('superadmin1234'),
            'roles_id' => 1,
        ]);

        User::create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('admin1234'),
            'roles_id' => 2,
        ]);
    }
}
