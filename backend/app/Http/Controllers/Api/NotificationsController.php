<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Http\Request;

class NotificationsController extends Controller
{
    public function index(Request $request)
    {
        $me = $request->user();

        return response()->json([
            'notifications' => $me->notifications()->limit(50)->get(),
            'unread_count' => $me->unreadNotifications()->count(),
        ]);
    }

    public function markRead(DatabaseNotification $notification, Request $request)
    {
        $me = $request->user();

        if ((string) $notification->notifiable_id !== (string) $me->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $notification->markAsRead();

        return response()->json(['ok' => true]);
    }
}
