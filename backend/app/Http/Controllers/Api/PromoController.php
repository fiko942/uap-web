<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promo;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Traits\AdminCheck;

class PromoController extends Controller
{
    use AdminCheck;

    /**
     * Get all promos (public: only active, admin: all)
     */
    public function index(Request $request)
    {
        $query = Promo::query();

        // Only filter if not admin OR admin without 'all' param
        $isAdmin = auth()->check() && auth()->user()->role === 'admin';
        $showAll = $request->has('all') && $request->get('all') === 'true';

        if (!$isAdmin || !$showAll) {
            $query->where('is_active', true)
                ->where('start_date', '<=', now())
                ->where('end_date', '>=', now());
        }

        $promos = $query->withCount('menus')->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'berhasil',
            'data' => $promos
        ]);
    }

    /**
     * Get single promo
     */
    public function show(string $uuid)
    {
        $promo = Promo::where('uuid', $uuid)->with('menus')->first();

        if (!$promo) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Promo tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => 'berhasil',
            'data' => $promo
        ]);
    }

    /**
     * Create new promo (admin only)
     */
    public function store(Request $request)
    {
        if ($check = $this->checkAdmin())
            return $check;

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|in:persen,nominal',
            'value' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ], [
            'name.required' => 'Nama promo wajib diisi.',
            'type.required' => 'Tipe promo wajib dipilih.',
            'type.in' => 'Tipe promo harus persen atau nominal.',
            'value.required' => 'Nilai promo wajib diisi.',
            'value.numeric' => 'Nilai promo harus berupa angka.',
            'start_date.required' => 'Tanggal mulai wajib diisi.',
            'end_date.required' => 'Tanggal selesai wajib diisi.',
            'end_date.after' => 'Tanggal selesai harus setelah tanggal mulai.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Data promo tidak valid.',
                'errors' => $validator->errors()
            ], 422);
        }

        $promo = Promo::create([
            'name' => $request->name,
            'type' => $request->type,
            'value' => $request->value,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'is_active' => $request->is_active ?? true,
        ]);

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'Promo berhasil ditambahkan.',
            'data' => $promo
        ], 201);
    }

    /**
     * Update promo (admin only)
     */
    public function update(Request $request, string $uuid)
    {
        if ($check = $this->checkAdmin())
            return $check;

        $promo = Promo::where('uuid', $uuid)->first();

        if (!$promo) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Promo tidak ditemukan.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => 'required|in:persen,nominal',
            'value' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ], [
            'name.required' => 'Nama promo wajib diisi.',
            'type.required' => 'Tipe promo wajib dipilih.',
            'type.in' => 'Tipe promo harus persen atau nominal.',
            'value.required' => 'Nilai promo wajib diisi.',
            'value.numeric' => 'Nilai promo harus berupa angka.',
            'start_date.required' => 'Tanggal mulai wajib diisi.',
            'end_date.required' => 'Tanggal selesai wajib diisi.',
            'end_date.after' => 'Tanggal selesai harus setelah tanggal mulai.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Data promo tidak valid.',
                'errors' => $validator->errors()
            ], 422);
        }

        $promo->update([
            'name' => $request->name,
            'type' => $request->type,
            'value' => $request->value,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'is_active' => $request->is_active ?? $promo->is_active,
        ]);

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'Promo berhasil diperbarui.',
            'data' => $promo
        ]);
    }

    /**
     * Delete promo (admin only)
     */
    public function destroy(string $uuid)
    {
        if ($check = $this->checkAdmin())
            return $check;

        $promo = Promo::where('uuid', $uuid)->first();

        if (!$promo) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Promo tidak ditemukan.'
            ], 404);
        }

        // Detach from all menus first
        $promo->menus()->detach();
        $promo->delete();

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'Promo berhasil dihapus.'
        ]);
    }

    /**
     * Assign promo to menus (admin only)
     */
    public function assignToMenus(Request $request, string $uuid)
    {
        if ($check = $this->checkAdmin())
            return $check;

        $promo = Promo::where('uuid', $uuid)->first();

        if (!$promo) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Promo tidak ditemukan.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'menu_ids' => 'required|array',
            'menu_ids.*' => 'exists:menus,id',
        ], [
            'menu_ids.required' => 'Pilih minimal satu menu.',
            'menu_ids.array' => 'Format data menu tidak valid.',
            'menu_ids.*.exists' => 'Salah satu menu tidak ditemukan.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Data tidak valid.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Sync menus (replace existing)
        $promo->menus()->sync($request->menu_ids);

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'Promo berhasil diterapkan ke menu yang dipilih.',
            'data' => $promo->load('menus')
        ]);
    }
}
