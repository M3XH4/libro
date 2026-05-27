<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AuthorsController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->string('q')->toString();

        $authors = Author::query()
            ->when($q !== '', fn ($b) => $b->where('name', 'like', "%{$q}%"))
            ->orderBy('name')
            ->limit(50)
            ->get();

        return response()->json(['authors' => $authors]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:authors,name'],
            'bio' => ['nullable', 'string'],
        ]);

        $author = Author::create($data);

        return response()->json(['author' => $author], 201);
    }

    public function update(Request $request, Author $author)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('authors', 'name')->ignore($author->id)],
            'bio' => ['nullable', 'string'],
        ]);

        $author->update($data);

        return response()->json(['author' => $author]);
    }

    public function destroy(Author $author)
    {
        $author->delete();

        return response()->json(['ok' => true]);
    }
}
