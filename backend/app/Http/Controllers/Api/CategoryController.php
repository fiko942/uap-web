<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;
use App\Traits\AdminCheck;

class CategoryController extends Controller
{
    use AdminCheck;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            'status' => 'berhasil',
            'data' => Category::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($check = $this->checkAdmin())
            return $check;

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name'
        ], [
            'name.required' => 'Nama kategori wajib diisi.',
            'name.string' => 'Nama kategori harus berupa teks.',
            'name.max' => 'Nama kategori terlalu panjang.',
            'name.unique' => 'Kategori ini sudah ada dalam sistem.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Gagal menambahkan kategori. Periksa input Anda.',
                'errors' => $validator->errors()
            ], 422);
        }

        $category = Category::create([
            'name' => $request->name
        ]);

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'Kategori berhasil ditambahkan ke sistem.',
            'data' => $category
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Kategori tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => 'berhasil',
            'data' => $category
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $slug)
    {
        if ($check = $this->checkAdmin())
            return $check;

        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Kategori tidak ditemukan.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id
        ], [
            'name.required' => 'Nama kategori wajib diisi.',
            'name.string' => 'Nama kategori harus berupa teks.',
            'name.max' => 'Nama kategori terlalu panjang.',
            'name.unique' => 'Nama kategori ini sudah digunakan oleh kategori lain.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Gagal mengubah kategori.',
                'errors' => $validator->errors()
            ], 422);
        }

        $category->update([
            'name' => $request->name
        ]);

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'Kategori berhasil diperbarui.',
            'data' => $category
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $slug)
    {
        if ($check = $this->checkAdmin())
            return $check;

        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Kategori tidak ditemukan.'
            ], 404);
        }

        $category->delete();

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'Kategori berhasil dihapus dari sistem.'
        ]);
    }
}
