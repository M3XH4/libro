<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password as PasswordRule;

class MembersController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->string('q')->toString();

        $members = User::query()
            ->where('role', 'member')
            ->when($q !== '', fn ($b) => $b->where(function ($bb) use ($q) {
                $bb->where('name', 'like', "%{$q}%")->orWhere('email', 'like', "%{$q}%");
            }))
            ->orderBy('name')
            ->paginate(perPage: min(max((int) $request->query('per_page', 10), 5), 50));

        return response()->json($members);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', PasswordRule::defaults()],
            'status' => ['nullable', 'string', 'max:32'],
        ]);

        $member = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'member',
            'settings' => [
                'member_status' => $data['status'] ?? 'active',
            ],
        ]);

        return response()->json(['member' => $member], 201);
    }

    public function update(Request $request, User $member)
    {
        if ($member->role !== 'member') {
            return response()->json(['message' => 'Not a member.'], 422);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'max:32'],
        ]);

        $settings = $member->settings ?? [];
        $settings['member_status'] = $data['status'] ?? ($settings['member_status'] ?? 'active');

        $member->update([
            'name' => $data['name'],
            'settings' => $settings,
        ]);

        return response()->json(['member' => $member]);
    }

    public function destroy(User $member)
    {
        if ($member->role !== 'member') {
            return response()->json(['message' => 'Not a member.'], 422);
        }

        $member->delete();

        return response()->json(['ok' => true]);
    }
}
