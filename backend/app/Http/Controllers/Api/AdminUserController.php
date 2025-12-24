<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Carbon;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', User::class);

        $users = User::with('inviter')->latest()->get();

        return response()->json([
            'status' => 'berhasil',
            'users' => $users
        ]);
    }

    /**
     * Promote a customer to admin.
     */
    public function promote(Request $request, $uuid)
    {
        $target = User::where('uuid', $uuid)->first();

        if (!$target) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Pengguna tidak ditemukan.'
            ], 404);
        }

        Gate::authorize('promote', $target);

        $target->update([
            'role' => 'admin',
            'created_by_admin_id' => auth()->id()
        ]);

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'Pengguna berhasil dipromosikan menjadi Admin.',
            'user' => $target
        ]);
    }

    /**
     * Ban a user.
     */
    public function ban(Request $request, $uuid)
    {
        $target = User::where('uuid', $uuid)->first();

        if (!$target) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Pengguna tidak ditemukan.'
            ], 404);
        }

        Gate::authorize('ban', $target);

        // Security Rule Check
        $currentUser = auth()->user();
        if ($target->id === $currentUser->id) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Keamanan: Anda tidak dapat menangguhkan akun Anda sendiri.'
            ], 403);
        }

        if ($target->id === $currentUser->created_by_admin_id) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Keamanan: Anda tidak memiliki izin untuk menangguhkan akun Administrator yang mengundang Anda.'
            ], 403);
        }

        $target->update([
            'is_banned' => true,
            'banned_at' => Carbon::now()
        ]);

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'Akses pengguna telah berhasil ditangguhkan.',
            'user' => $target
        ]);
    }

    /**
     * Unban a user.
     */
    public function unban(Request $request, $uuid)
    {
        $target = User::where('uuid', $uuid)->first();

        if (!$target) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Pengguna tidak ditemukan.'
            ], 404);
        }

        Gate::authorize('unban', $target);

        $target->update([
            'is_banned' => false,
            'banned_at' => null
        ]);

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'Akses pengguna telah dipulihkan kembali.',
            'user' => $target
        ]);
    }
}
