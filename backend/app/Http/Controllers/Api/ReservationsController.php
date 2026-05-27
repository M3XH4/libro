<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Reservation;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ReservationsController extends Controller
{
    public function index(Request $request)
    {
        $me = $request->user();

        $reservations = Reservation::query()
            ->with(['user', 'book.authors', 'book.category'])
            ->when($me->role === 'member', fn (Builder $b) => $b->where('user_id', $me->id))
            ->orderByDesc('created_at')
            ->paginate(perPage: min(max((int) $request->query('per_page', 10), 5), 50));

        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $me = $request->user();
        $data = $request->validate([
            'book_id' => ['required', 'integer', 'exists:books,id'],
        ]);

        $book = Book::query()->findOrFail($data['book_id']);

        $activeCount = Reservation::query()
            ->where('book_id', $book->id)
            ->where('status', 'active')
            ->count();

        $reservation = Reservation::create([
            'user_id' => $me->id,
            'book_id' => $book->id,
            'status' => 'active',
            'position' => $activeCount + 1,
            'expires_at' => CarbonImmutable::now()->addDays(3),
        ]);

        return response()->json(['reservation' => $reservation->load(['book'])], 201);
    }

    public function cancel(Reservation $reservation, Request $request)
    {
        $me = $request->user();

        if ($me->role === 'member' && $reservation->user_id !== $me->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        if ($reservation->status !== 'active') {
            return response()->json(['message' => 'Reservation is not active.'], 422);
        }

        $reservation->update([
            'status' => 'cancelled',
            'cancelled_at' => CarbonImmutable::now(),
        ]);

        // Re-pack queue positions for active reservations on the same book.
        $active = Reservation::query()
            ->where('book_id', $reservation->book_id)
            ->where('status', 'active')
            ->orderBy('created_at')
            ->get();

        foreach ($active as $idx => $r) {
            $r->update(['position' => $idx + 1]);
        }

        return response()->json(['reservation' => $reservation->fresh()]);
    }
}
