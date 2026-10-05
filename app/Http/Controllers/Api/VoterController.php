<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VoterController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'nik' => 'required|numeric|digits:16',
            'birth_date' => 'required|date_format:Y-m-d',
        ]);

        // 2. Cek Data Pemilih di Supabase
        $voter = DB::table('voters')
            ->where('nik', $request->nik)
            ->where('birth_date', $request->birth_date)
            ->first();

        // 3. Jika Data Tidak Ditemukan
        if (!$voter) {
            return response()->json([
                'success' => false,
                'message' => 'NIK atau Tanggal Lahir tidak terdaftar dalam DPT!'
            ], 401);
        }

        // 4. Berhasil Login - Mengembalikan Data Pemilih
        return response()->json([
            'success' => true,
            'message' => 'Login berhasil!',
            'data' => [
                'id' => $voter->id,
                'nik' => $voter->nik,
                'name' => $voter->name,
                'rt_rw' => $voter->rt_rw,
                'has_voted' => (bool) $voter->has_voted,
            ]
        ], 200);
    }
}