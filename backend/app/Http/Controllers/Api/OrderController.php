<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Menu;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with(['user', 'orderItems.menu'])->orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'berhasil',
            'data' => $orders
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.menu_slug' => 'required|string|exists:menus,slug',
            'items.*.qty' => 'required|integer|min:1',
        ], [
            'items.required' => 'Keranjang belanja tidak boleh kosong.',
            'items.array' => 'Format data item tidak valid.',
            'items.min' => 'Pilih minimal satu menu untuk dipesan.',
            'items.*.menu_slug.required' => 'Slug menu wajib disertakan.',
            'items.*.menu_slug.exists' => 'Salah satu menu yang dipilih tidak ditemukan.',
            'items.*.qty.required' => 'Jumlah pesanan wajib diisi.',
            'items.*.qty.min' => 'Jumlah pesanan minimal adalah 1.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Data pesanan tidak valid.',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            return DB::transaction(function () use ($request) {
                $subtotal = 0;
                $orderItemsData = [];

                // 1. Validasi Stok & Hitung Total
                foreach ($request->items as $item) {
                    $menu = Menu::where('slug', $item['menu_slug'])->first();

                    if (!$menu) {
                        throw new \Exception("Menu dengan slug {$item['menu_slug']} tidak ditemukan.");
                    }

                    if ($menu->stock < $item['qty']) {
                        throw new \Exception("Stok untuk {$menu->name} tidak mencukupi. Tersedia: {$menu->stock}");
                    }

                    $lineTotal = $menu->price * $item['qty'];
                    $subtotal += $lineTotal;

                    $orderItemsData[] = [
                        'menu_id' => $menu->id,
                        'qty' => $item['qty'],
                        'price' => $menu->price,
                        'line_total' => $lineTotal,
                        'menu_instance' => $menu
                    ];
                }

                // 2. Buat Pesanan
                $grandTotal = $subtotal;

                $order = Order::create([
                    'user_id' => Auth::id(),
                    'subtotal' => $subtotal,
                    'discount_total' => 0,
                    'grand_total' => $grandTotal,
                    'status' => 'diproses'
                ]);

                // 3. Buat Item Pesanan & Kurangi Stok
                foreach ($orderItemsData as $data) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'menu_id' => $data['menu_id'],
                        'qty' => $data['qty'],
                        'price' => $data['price'],
                        'line_total' => $data['line_total'],
                    ]);

                    // Kurangi stok
                    $menu = $data['menu_instance'];
                    $menu->decrement('stock', $data['qty']);
                }

                return response()->json([
                    'status' => 'berhasil',
                    'pesan' => 'Pesanan Anda berhasil dibuat dan sedang diproses.',
                    'data' => $order->load('orderItems.menu')
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $uuid)
    {
        $order = Order::where('uuid', $uuid)->with(['user', 'orderItems.menu'])->first();

        if (!$order) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Data pesanan tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => 'berhasil',
            'data' => $order
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $uuid)
    {
        $order = Order::where('uuid', $uuid)->first();

        if (!$order) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Data pesanan tidak ditemukan.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:diproses,dibayar,selesai,dibatalkan'
        ], [
            'status.required' => 'Status pesanan wajib diisi.',
            'status.in' => 'Status pesanan tidak valid. Pilihan: diproses, dibayar, selesai, dibatalkan.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Status pesanan tidak valid.',
                'errors' => $validator->errors()
            ], 422);
        }

        $order->update(['status' => $request->status]);

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'Status pesanan berhasil diperbarui.',
            'data' => $order
        ]);
    }

    /**
     * Display a listing of orders for the authenticated user.
     */
    public function myOrders()
    {
        $userId = Auth::id();
        $orders = Order::where('user_id', $userId)
            ->with(['orderItems.menu'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'berhasil',
            'data' => $orders
        ]);
    }

    /**
     * Display the specified order for the authenticated user.
     */
    public function myOrderDetail(string $uuid)
    {
        $userId = Auth::id();
        $order = Order::where('uuid', $uuid)
            ->where('user_id', $userId)
            ->with(['orderItems.menu'])
            ->first();

        if (!$order) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Pesanan tidak ditemukan atau Anda tidak memiliki akses ke data ini.'
            ], 404);
        }

        return response()->json([
            'status' => 'berhasil',
            'data' => $order
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return response()->json([
            'status' => 'gagal',
            'pesan' => 'Penghapusan pesanan tidak diizinkan untuk menjaga integritas data.'
        ], 405);
    }
}
