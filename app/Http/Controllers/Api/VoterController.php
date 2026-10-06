<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VoterController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validasi Input (gunakan string biasa agar fleksibel)
        $request->validate([
            'nik' => 'required|string',
            'birth_date' => 'required|date',
        ]);

        // 2. Cek Data Pemilih di Supabase
        $voter = DB::table('voters')
            ->where('nik', $request->nik)
            ->where('birth_date', $request->birth_date)
            ->first();

        // 3. Jika Data Tidak Ditemukan dalam DPT
        if (!$voter) {
            return back()->with('error', 'NIK atau Tanggal Lahir tidak terdaftar dalam DPT!');
        }

        // 4. Berhasil Login - Simpan ke Session
        session(['voter' => $voter]);

        // Redirect langsung ke route dashboard
        return redirect()->route('dashboard')->with('success', 'Login berhasil!');
    }
}