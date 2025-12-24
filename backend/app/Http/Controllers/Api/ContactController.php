<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'berhasil',
            'data' => $contacts
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string'
        ], [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama maksimal 255 karakter.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid (contoh: user@site.com).',
            'email.max' => 'Alamat email terlalu panjang.',
            'message.required' => 'Pesan atau pertanyaan wajib ditulis.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'gagal',
                'pesan' => 'Formulir kontak tidak valid.',
                'errors' => $validator->errors()
            ], 422);
        }

        Contact::create($request->all());

        return response()->json([
            'status' => 'berhasil',
            'pesan' => 'Pesan Anda telah berhasil dikirim. Terima kasih telah menghubungi kami!'
        ]);
    }
}
