<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function update(Request $request)
    {
        $me = $request->user();
        $data = $request->validate([
            'dark_mode' => ['nullable', 'boolean'],
            'notifications_email' => ['nullable', 'boolean'],
        ]);

        $settings = $me->settings ?? [];
        foreach ($data as $k => $v) {
            $settings[$k] = $v;
        }

        $me->update(['settings' => $settings]);

        return response()->json(['settings' => $me->settings]);
    }
}
