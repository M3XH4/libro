<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookCopy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class BooksController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->string('q')->toString();
        $categoryId = $request->integer('category_id') ?: null;

        $books = Book::query()
            ->with(['category', 'authors'])
            ->withCount([
                'copies as total_copies',
                'copies as available_copies' => fn (Builder $b) => $b->where('status', 'available'),
            ])
            ->when($q !== '', function (Builder $b) use ($q) {
                $b->where(function (Builder $bb) use ($q) {
                    $bb->where('title', 'like', "%{$q}%")
                        ->orWhere('isbn', 'like', "%{$q}%")
                        ->orWhereHas('authors', fn (Builder $a) => $a->where('name', 'like', "%{$q}%"));
                });
            })
            ->when($categoryId, fn (Builder $b) => $b->where('category_id', $categoryId))
            ->orderBy('title')
            ->paginate(perPage: min(max((int) $request->query('per_page', 10), 5), 50));

        return response()->json($books);
    }

    public function show(Book $book)
    {
        $book->load(['category', 'authors', 'copies']);

        return response()->json([
            'book' => $book,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'isbn' => ['nullable', 'string', 'max:32', 'unique:books,isbn'],
            'description' => ['nullable', 'string'],
            'published_year' => ['nullable', 'integer', 'min:1450', 'max:2100'],
            'language' => ['nullable', 'string', 'max:16'],
            'author_ids' => ['array'],
            'author_ids.*' => ['integer', 'exists:authors,id'],
            'copies' => ['array'],
            'copies.*.barcode' => ['required', 'string', 'max:64', 'distinct'],
            'copies.*.status' => ['nullable', 'string', 'max:24'],
            'copies.*.shelf_location' => ['nullable', 'string', 'max:255'],
            'copies.*.acquired_at' => ['nullable', 'date'],
        ]);

        $book = Book::create([
            'category_id' => $data['category_id'] ?? null,
            'title' => $data['title'],
            'subtitle' => $data['subtitle'] ?? null,
            'isbn' => $data['isbn'] ?? null,
            'description' => $data['description'] ?? null,
            'published_year' => $data['published_year'] ?? null,
            'language' => $data['language'] ?? 'en',
            'cover_path' => null,
        ]);

        if (! empty($data['author_ids'])) {
            $book->authors()->sync($data['author_ids']);
        }

        foreach (($data['copies'] ?? []) as $copy) {
            BookCopy::create([
                'book_id' => $book->id,
                'barcode' => $copy['barcode'],
                'status' => $copy['status'] ?? 'available',
                'shelf_location' => $copy['shelf_location'] ?? null,
                'acquired_at' => $copy['acquired_at'] ?? null,
            ]);
        }

        return response()->json(['book' => $book->load(['category', 'authors', 'copies'])], 201);
    }

    public function update(Request $request, Book $book)
    {
        $data = $request->validate([
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'isbn' => ['nullable', 'string', 'max:32', Rule::unique('books', 'isbn')->ignore($book->id)],
            'description' => ['nullable', 'string'],
            'published_year' => ['nullable', 'integer', 'min:1450', 'max:2100'],
            'language' => ['nullable', 'string', 'max:16'],
            'author_ids' => ['array'],
            'author_ids.*' => ['integer', 'exists:authors,id'],
        ]);

        $book->update([
            'category_id' => $data['category_id'] ?? null,
            'title' => $data['title'],
            'subtitle' => $data['subtitle'] ?? null,
            'isbn' => $data['isbn'] ?? null,
            'description' => $data['description'] ?? null,
            'published_year' => $data['published_year'] ?? null,
            'language' => $data['language'] ?? 'en',
        ]);

        $book->authors()->sync($data['author_ids'] ?? []);

        return response()->json(['book' => $book->load(['category', 'authors', 'copies'])]);
    }

    public function destroy(Book $book)
    {
        $book->delete();

        return response()->json(['ok' => true]);
    }

    public function uploadCover(Request $request, Book $book)
    {
        $data = $request->validate([
            'cover' => ['required', 'file', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        if ($book->cover_path) {
            Storage::disk('public')->delete($book->cover_path);
        }

        $path = $data['cover']->store('covers', 'public');
        $book->update(['cover_path' => $path]);

        return response()->json(['book' => $book->fresh()]);
    }
}
