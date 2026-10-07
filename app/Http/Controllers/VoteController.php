<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;

class VoteController extends Controller
{
    public function index(Request $request)
    {
        $voter = session('voter');

        if (!$voter) {
            return redirect()->route('login')->with('error', 'Silakan login terlebih dahulu!');
        }

        if ($voter->has_voted) {
            return redirect()->route('dashboard')->with('error', 'Anda sudah menggunakan hak pilih!');
        }

        return Inertia::render('vote/index');
    }

    public function submit(Request $request)
    {
        $voterSession = session('voter');

        if (!$voterSession) {
            return redirect()->route('login')->with('error', 'Sesi Anda telah berakhir.');
        }

        // Cek kembali status pemilih di DB
        $voter = DB::table('voters')->where('id', $voterSession->id)->first();

        if (!$voter || $voter->has_voted) {
            return redirect()->route('dashboard')->with('error', 'Anda sudah menggunakan hak pilih!');
        }

        try {
            // 1. Simpan suara secara anonim
            DB::table('votes')->insert([
                'candidate_id' => $request->candidate_id,
                'created_at' => now(),
            ]);

            // 2. Kunci status pemilih
            DB::table('voters')->where('id', $voter->id)->update([
                'has_voted' => true,
            ]);

            // 3. Update status session
            $voterSession->has_voted = true;
            session(['voter' => $voterSession]);

            // 4. Redirect ke halaman sukses
            return redirect()->route('vote.success');

        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengirim suara: ' . $e->getMessage());
        }
    }

    public function success()
    {
        $voterSession = session('voter');

        if (!$voterSession) {
            return redirect()->route('login');
        }

        return Inertia::render('vote/success', [
            'voterName' => $voterSession->name,
            'referenceCode' => session('vote_reference_code'),
        ]);
    }
}