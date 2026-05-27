<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Book;
use App\Models\BookCopy;
use App\Models\Borrowing;
use App\Models\Category;
use App\Models\Fine;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LibrarySeeder extends Seeder
{
    public function run(): void
    {
        $categories = collect([
            'Fiction',
            'Non-fiction',
            'Science',
            'Technology',
            'History',
            'Philosophy',
            'Business',
            'Self-Help',
            'Arts',
            'Children',
        ])->map(function (string $name) {
            return Category::firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name]
            );
        });

        $authors = collect([
            'Jane Austen',
            'George Orwell',
            'Haruki Murakami',
            'Yuval Noah Harari',
            'Malcolm Gladwell',
            'Toni Morrison',
            'Stephen King',
            'Neil Gaiman',
            'Mary Shelley',
            'Isaac Asimov',
        ])->map(fn (string $name) => Author::firstOrCreate(['name' => $name]));

        $now = CarbonImmutable::now();

        $books = collect(range(1, 35))->map(function () use ($categories, $authors) {
            $title = fake()->sentence(rand(2, 5));
            $category = $categories->random();

            $book = Book::create([
                'category_id' => $category->id,
                'title' => rtrim($title, '.'),
                'subtitle' => rand(0, 3) === 0 ? fake()->sentence(rand(3, 7)) : null,
                'isbn' => rand(0, 3) === 0 ? null : fake()->unique()->isbn13(),
                'description' => fake()->paragraphs(rand(2, 4), true),
                'published_year' => rand(1990, 2026),
                'language' => 'en',
                'cover_path' => null,
            ]);

            $book->authors()->sync(
                $authors->random(rand(1, 2))->pluck('id')->all()
            );

            $copies = rand(1, 5);
            foreach (range(1, $copies) as $i) {
                BookCopy::create([
                    'book_id' => $book->id,
                    'barcode' => strtoupper(Str::random(10)).'-'.$book->id.'-'.$i,
                    'status' => 'available',
                    'shelf_location' => 'Aisle '.rand(1, 6).' · Shelf '.rand(1, 12),
                    'acquired_at' => fake()->dateTimeBetween('-3 years', 'now')->format('Y-m-d'),
                ]);
            }

            return $book;
        });

        $members = User::query()->where('role', 'member')->get();
        $librarian = User::query()->where('role', 'librarian')->first();

        if ($members->isEmpty() || ! $librarian) {
            return;
        }

        // Create some borrowings (some returned, some overdue)
        $copies = BookCopy::query()->inRandomOrder()->limit(25)->get();
        foreach ($copies as $copy) {
            $member = $members->random();
            $borrowedAt = $now->subDays(rand(1, 35));
            $dueAt = $borrowedAt->addDays(14);
            $returned = rand(0, 2) === 0;
            $returnedAt = $returned ? $borrowedAt->addDays(rand(1, 20)) : null;

            $status = 'borrowed';
            if ($returnedAt) {
                $status = 'returned';
            } elseif ($dueAt->isPast()) {
                $status = 'overdue';
            }

            $borrowing = Borrowing::create([
                'user_id' => $member->id,
                'processed_by_user_id' => $librarian->id,
                'book_copy_id' => $copy->id,
                'borrowed_at' => $borrowedAt,
                'due_at' => $dueAt,
                'returned_at' => $returnedAt,
                'status' => $status,
                'notes' => rand(0, 4) === 0 ? fake()->sentence() : null,
            ]);

            if ($status === 'overdue') {
                Fine::create([
                    'user_id' => $member->id,
                    'borrowing_id' => $borrowing->id,
                    'amount_cents' => rand(2000, 12000),
                    'currency' => 'PHP',
                    'status' => 'unpaid',
                    'reason' => 'Overdue return',
                    'assessed_at' => $now->subDays(rand(0, 3)),
                ]);
            }
        }
    }
}

