<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Traits\AdminCheck;

class UserManagementController extends Controller
{
    use AdminCheck;

    /**
     * Get all users (admin only)
     */
    public function index()
    {
        if ($check = $this->checkAdmin())
            return $check;

        $users = User::orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'berhasil',
            'data' => $users
        ]);
    }

    /**
     * Create new user (admin only)
     */
    public function store(Request $request)
    {
        if ($check = $this->checkAdmin())
            return $check;

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|in:customer,admin',
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar dalam sistem.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.min' => 'Kata sandi minimal 6 karakter.',
            'role.required' => 'Role wajib dipilih.',
            'role.in' => 'Role harus customer atau admin.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Data tidak valid.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'User berhasil ditambahkan.',
            'data' => $user
        ], 201);
    }

    /**
     * Update user (admin only)
     */
    public function update(Request $request, string $uuid)
    {
        if ($check = $this->checkAdmin())
            return $check;

        $user = User::where('uuid', $uuid)->first();

        if (!$user) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'User tidak ditemukan.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:customer,admin',
            'password' => 'nullable|string|min:6',
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah digunakan user lain.',
            'role.required' => 'Role wajib dipilih.',
            'role.in' => 'Role harus customer atau admin.',
            'password.min' => 'Kata sandi minimal 6 karakter.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Data tidak valid.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'User berhasil diperbarui.',
            'data' => $user
        ]);
    }

    /**
     * Delete user (admin only)
     */
    public function destroy(string $uuid)
    {
        if ($check = $this->checkAdmin())
            return $check;

        $user = User::where('uuid', $uuid)->first();

        if (!$user) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'User tidak ditemukan.'
            ], 404);
        }

        // Prevent deleting seed admin
        if ($user->email === 'tobellord@gmail.com') {
            return response()->json([
                'status' => 'ditolak',
                'pesan' => 'Admin utama tidak dapat dihapus dari sistem.'
            ], 403);
        }

        // Prevent self-delete
        if ($user->id === auth()->id()) {
            return response()->json([
                'status' => 'ditolak',
                'pesan' => 'Anda tidak dapat menghapus akun Anda sendiri.'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'User berhasil dihapus dari sistem.'
        ]);
    }

    /**
     * Ban user (admin only)
     */
    public function ban(string $uuid)
    {
        if ($check = $this->checkAdmin())
            return $check;

        $user = User::where('uuid', $uuid)->first();

        if (!$user) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'User tidak ditemukan.'
            ], 404);
        }

        // Prevent self-ban
        if ($user->id === auth()->id()) {
            return response()->json([
                'status' => 'ditolak',
                'pesan' => 'Anda tidak dapat menangguhkan akun Anda sendiri.'
            ], 403);
        }

        // Prevent banning seed admin
        if ($user->email === 'tobellord@gmail.com') {
            return response()->json([
                'status' => 'ditolak',
                'pesan' => 'Admin utama tidak dapat ditangguhkan.'
            ], 403);
        }

        $user->is_banned = true;
        $user->save();

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'User berhasil ditangguhkan.'
        ]);
    }

    /**
     * Unban user (admin only)
     */
    public function unban(string $uuid)
    {
        if ($check = $this->checkAdmin())
            return $check;

        $user = User::where('uuid', $uuid)->first();

        if (!$user) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'User tidak ditemukan.'
            ], 404);
        }

        $user->is_banned = false;
        $user->save();

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'User berhasil diaktifkan kembali.'
        ]);
    }
}
