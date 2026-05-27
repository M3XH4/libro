<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookCopy;
use App\Models\Borrowing;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class BorrowingsController extends Controller
{
    public function index(Request $request)
    {
        $me = $request->user();

        $q = $request->string('q')->toString();
        $status = $request->string('status')->toString();

        $borrowings = Borrowing::query()
            ->with(['user', 'processedBy', 'copy.book.authors', 'copy.book.category'])
            ->when($me->role === 'member', fn (Builder $b) => $b->where('user_id', $me->id))
            ->when($status !== '', fn (Builder $b) => $b->where('status', $status))
            ->when($q !== '', function (Builder $b) use ($q) {
                $b->whereHas('copy.book', fn (Builder $bb) => $bb->where('title', 'like', "%{$q}%"));
            })
            ->orderByDesc('borrowed_at')
            ->paginate(perPage: min(max((int) $request->query('per_page', 10), 5), 50));

        return response()->json($borrowings);
    }

    public function borrow(Request $request)
    {
        $me = $request->user();

        if (! in_array($me->role, ['librarian', 'admin'], true)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'book_copy_id' => ['required', 'integer', 'exists:book_copies,id'],
            'days' => ['nullable', 'integer', 'min:1', 'max:60'],
        ]);

        $copy = BookCopy::query()->findOrFail($data['book_copy_id']);
        if ($copy->status !== 'available') {
            return response()->json(['message' => 'Book copy is not available.'], 422);
        }

        $now = CarbonImmutable::now();
        $due = $now->addDays((int) ($data['days'] ?? 14));

        $borrowing = Borrowing::create([
            'user_id' => $data['user_id'],
            'processed_by_user_id' => $me->id,
            'book_copy_id' => $copy->id,
            'borrowed_at' => $now,
            'due_at' => $due,
            'returned_at' => null,
            'status' => 'borrowed',
        ]);

        $copy->update(['status' => 'borrowed']);

        return response()->json(['borrowing' => $borrowing->load(['user', 'copy.book'])], 201);
    }

    public function return(Borrowing $borrowing, Request $request)
    {
        $me = $request->user();

        if ($me->role === 'member' && $borrowing->user_id !== $me->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        if ($borrowing->returned_at) {
            return response()->json(['message' => 'Already returned.'], 422);
        }

        $borrowing->update([
            'returned_at' => CarbonImmutable::now(),
            'status' => 'returned',
        ]);

        $borrowing->copy()->update(['status' => 'available']);

        return response()->json(['borrowing' => $borrowing->fresh()->load(['user', 'copy.book'])]);
    }
}
