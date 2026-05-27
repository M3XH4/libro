<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@libro.test',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Librarian',
            'email' => 'librarian@libro.test',
            'role' => 'librarian',
        ]);

        User::factory()->create([
            'name' => 'Member',
            'email' => 'member@libro.test',
            'role' => 'member',
        ]);

        User::factory(15)->create();

        $this->call([
            LibrarySeeder::class,
        ]);
    }
}
