<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Menu;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Traits\AdminCheck;

class MenuController extends Controller
{
    use AdminCheck;
    private $rules = [
        'category_id' => 'required|exists:categories,id',
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'price' => 'required|numeric|min:0',
        'stock' => 'required|integer|min:0',
        'is_active' => 'boolean',
        'is_spicy' => 'boolean',
        'is_recommended' => 'boolean',
        'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120'
    ];

    private $messages = [
        'category_id.required' => 'Kategori wajib dipilih.',
        'category_id.exists' => 'Kategori yang dipilih tidak valid.',
        'name.required' => 'Nama menu wajib diisi.',
        'name.string' => 'Nama menu harus berupa teks.',
        'price.required' => 'Harga wajib diisi.',
        'price.numeric' => 'Harga harus berupa angka.',
        'price.min' => 'Harga tidak boleh kurang dari 0.',
        'stock.required' => 'Stok wajib diisi.',
        'stock.integer' => 'Stok harus berupa angka bulat.',
        'stock.min' => 'Stok tidak boleh kurang dari 0.',
        'image.image' => 'File harus berupa gambar.',
        'image.mimes' => 'Format gambar yang didukung: JPG, JPEG, PNG, WEBP.',
        'image.max' => 'Ukuran gambar maksimal adalah 5MB.'
    ];

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $menus = Menu::with('category')->latest()->get();
        return response()->json([
            'status' => 'berhasil',
            'data' => $menus
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($check = $this->checkAdmin())
            return $check;
        $validator = Validator::make($request->all(), $this->rules, $this->messages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Data menu tidak valid.',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('menus', $filename, 'public');
            $data['image_path'] = $path;
        }

        unset($data['image']);

        $menu = Menu::create($data);

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'Menu baru berhasil ditambahkan ke katalog.',
            'data' => $menu
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $menu = Menu::where('slug', $slug)->with('category')->first();

        if (!$menu) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Menu tidak ditemukan.'
            ], 404);
        }

        return response()->json([
            'status' => 'berhasil',
            'data' => $menu
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $slug)
    {
        if ($check = $this->checkAdmin())
            return $check;
        $menu = Menu::where('slug', $slug)->first();

        if (!$menu) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Menu tidak ditemukan.'
            ], 404);
        }

        // Adjust rules for update
        $updateRules = $this->rules;
        foreach ($updateRules as $key => $rule) {
            if (strpos($rule, 'required') !== false) {
                $updateRules[$key] = 'sometimes|' . $rule;
            }
        }

        $validator = Validator::make($request->all(), $updateRules, $this->messages);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Perubahan menu tidak valid.',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            if ($menu->image_path && Storage::disk('public')->exists($menu->image_path)) {
                Storage::disk('public')->delete($menu->image_path);
            }

            $file = $request->file('image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('menus', $filename, 'public');
            $data['image_path'] = $path;
        }

        unset($data['image']);

        $menu->update($data);

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'Menu berhasil diperbarui.',
            'data' => $menu
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        if ($check = $this->checkAdmin())
            return $check;

        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Menu tidak ditemukan.'
            ], 404);
        }

        if ($menu->image_path && Storage::disk('public')->exists($menu->image_path)) {
            Storage::disk('public')->delete($menu->image_path);
        }

        $menu->delete();

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'Menu berhasil dihapus dari sistem.'
        ]);
    }

    /**
     * Update menu image
     */
    public function updateImage(Request $request, string $slug)
    {
        if ($check = $this->checkAdmin())
            return $check;

        $menu = Menu::where('slug', $slug)->first();

        if (!$menu) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Menu tidak ditemukan.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120'
        ], [
            'image.required' => 'Gambar wajib diunggah.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Format gambar harus: jpeg, jpg, png, atau webp.',
            'image.max' => 'Ukuran gambar maksimal 5MB.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'File gambar tidak valid.',
                'errors' => $validator->errors()
            ], 422);
        }

        // Delete old image if exists
        if ($menu->image_path && Storage::disk('public')->exists($menu->image_path)) {
            Storage::disk('public')->delete($menu->image_path);
        }

        // Upload new image
        $file = $request->file('image');
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('menus', $filename, 'public');

        $menu->update(['image_path' => $path]);

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'Gambar menu berhasil diperbarui.',
            'data' => $menu
        ]);
    }
}
