<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fine;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class FinesController extends Controller
{
    public function index(Request $request)
    {
        $me = $request->user();

        $status = $request->string('status')->toString();

        $fines = Fine::query()
            ->with(['user', 'borrowing.copy.book'])
            ->when($me->role === 'member', fn (Builder $b) => $b->where('user_id', $me->id))
            ->when($status !== '', fn (Builder $b) => $b->where('status', $status))
            ->orderByDesc('assessed_at')
            ->paginate(perPage: min(max((int) $request->query('per_page', 10), 5), 50));

        return response()->json($fines);
    }

    public function pay(Fine $fine, Request $request)
    {
        $me = $request->user();
        if (! in_array($me->role, ['librarian', 'admin'], true)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        if ($fine->status !== 'unpaid') {
            return response()->json(['message' => 'Fine is not unpaid.'], 422);
        }

        $fine->update([
            'status' => 'paid',
            'paid_at' => CarbonImmutable::now(),
        ]);

        return response()->json(['fine' => $fine]);
    }
}
