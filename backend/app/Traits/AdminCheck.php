<?php

namespace App\Traits;

trait AdminCheck
{
    /**
     * Check if authenticated user is admin
     * Returns error response if not admin, null if admin
     */
    protected function checkAdmin()
    {
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            return response()->json([
                'status' => 'ditolak',
                'pesan' => 'Akses hanya untuk admin.'
            ], 403);
        }
        return null;
    }
}
