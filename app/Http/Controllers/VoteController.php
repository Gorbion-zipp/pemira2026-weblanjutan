<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VoteController extends Controller
{
    public function index(Request $request)
    {
        $voterSession = session('voter');

        if (!$voterSession) {
            return redirect()->route('login')->with('error', 'Silakan login terlebih dahulu!');
        }

        // Cek status terbaru dari database
        $voter = DB::table('voters')->where('id', $voterSession->id)->first();

        if (!$voter || $voter->has_voted) {
            return redirect()->route('dashboard')->with('error', 'Anda sudah menggunakan hak pilih!');
        }

        // Ambil data kandidat aktif secara dinamis dari database
        $candidates = DB::table('candidates')
            ->select('id', 'candidate_number', 'name', 'vice_name', 'vision_mission', 'photo_url')
            ->orderBy('candidate_number', 'asc')
            ->get();

        return Inertia::render('vote/index', [
            'voter' => $voter,
            'candidates' => $candidates,
        ]);
    }

    public function submit(Request $request)
    {
        $voterSession = session('voter');

        if (!$voterSession) {
            return redirect()->route('login')->with('error', 'Sesi Anda telah berakhir.');
        }

        // Validasi bahwa candidate_id harus ada di tabel candidates
        $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
        ]);

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

            // 2. Kunci status pemilih di DB
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