<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\Borrowing;
use App\Models\Reservation;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportsController extends Controller
{
    public function overview(Request $request)
    {
        $now = CarbonImmutable::now();
        $start = $now->subDays(13)->startOfDay();

        $borrowTrend = Borrowing::query()
            ->selectRaw('date(borrowed_at) as d, count(*) as c')
            ->where('borrowed_at', '>=', $start)
            ->groupBy('d')
            ->orderBy('d')
            ->get()
            ->keyBy('d');

        $days = collect(range(0, 13))->map(function (int $i) use ($start, $borrowTrend) {
            $d = $start->addDays($i)->toDateString();
            return ['date' => $d, 'borrowings' => (int) ($borrowTrend[$d]->c ?? 0)];
        });

        $topBooks = Borrowing::query()
            ->join('book_copies', 'borrowings.book_copy_id', '=', 'book_copies.id')
            ->join('books', 'book_copies.book_id', '=', 'books.id')
            ->select('books.id', 'books.title', DB::raw('count(*) as borrow_count'))
            ->groupBy('books.id', 'books.title')
            ->orderByDesc('borrow_count')
            ->limit(5)
            ->get();

        return response()->json([
            'kpis' => [
                'books' => Book::query()->count(),
                'members' => User::query()->where('role', 'member')->count(),
                'borrowed_active' => Borrowing::query()->whereNull('returned_at')->count(),
                'overdue' => Borrowing::query()->where('status', 'overdue')->count(),
                'active_reservations' => Reservation::query()->where('status', 'active')->count(),
            ],
            'trend' => $days,
            'top_books' => $topBooks,
        ]);
    }
}
