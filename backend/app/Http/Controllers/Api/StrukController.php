<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;

class StrukController extends Controller
{
    /**
     * Download struk pesanan sebagai PDF
     */
    public function downloadStruk(string $uuid)
    {
        // Check admin role
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            return response()->json([
                'status' => 'ditolak',
                'pesan' => 'Akses hanya untuk admin.'
            ], 403);
        }

        $order = Order::with(['user', 'orderItems.menu'])
            ->where('uuid', $uuid)
            ->first();

        if (!$order) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Pesanan tidak ditemukan.'
            ], 404);
        }

        $data = [
            'order' => $order,
            'kasir' => auth()->user()->name,
        ];

        $pdf = Pdf::loadView('struk', $data);

        return $pdf->download('struk-' . $order->uuid . '.pdf');
    }

    /**
     * Download struk untuk customer (my orders)
     */
    public function downloadMyStruk(string $uuid)
    {
        $order = Order::with(['user', 'orderItems.menu'])
            ->where('uuid', $uuid)
            ->where('user_id', auth()->id())
            ->first();

        if (!$order) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Pesanan tidak ditemukan atau Anda tidak memiliki akses.'
            ], 404);
        }

        $data = [
            'order' => $order,
            'kasir' => 'Sistem',
        ];

        $pdf = Pdf::loadView('struk', $data);

        return $pdf->download('struk-' . $order->uuid . '.pdf');
    }
}
