<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class AdminController extends Controller
{
    // Tampilan Form Login Admin
    public function showLoginForm()
    {
        if (session('admin')) {
            return redirect()->route('admin.dashboard');
        }
        return Inertia::render('admin/login');
    }

    // Tambah Paslon (Dengan Upload Foto)
    public function storeCandidate(Request $request)
    {
        $request->validate([
            'candidate_number' => 'required|string|unique:candidates,candidate_number',
            'name' => 'required|string|max:255',
            'vice_name' => 'required|string|max:255',
            'vision_mission' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // Maksimal 2MB
        ]);

        $photoUrl = '/images/default-avatar.png';

        // Simpan file ke public/images jika ada file diunggah
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $fileName = 'paslon_' . time() . '_' . $request->candidate_number . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images'), $fileName);
            $photoUrl = '/images/' . $fileName;
        }

        DB::table('candidates')->insert([
            'candidate_number' => $request->candidate_number,
            'name' => $request->name,
            'vice_name' => $request->vice_name,
            'vision_mission' => $request->vision_mission,
            'photo_url' => $photoUrl,
            'created_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Paslon berhasil ditambahkan.');
    }

    // Update Paslon (Dengan Upload Foto & Hapus Foto Lama)
    public function updateCandidate(Request $request, $id)
    {
        $request->validate([
            'candidate_number' => 'required|string',
            'name' => 'required|string|max:255',
            'vice_name' => 'required|string|max:255',
            'vision_mission' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $candidate = DB::table('candidates')->where('id', $id)->first();
        $photoUrl = $candidate ? $candidate->photo_url : '/images/default-avatar.png';

        // Jika ada foto baru diunggah
        if ($request->hasFile('photo')) {
            // Hapus file foto lama dari public/images jika bukan foto default
            if ($candidate && $candidate->photo_url && $candidate->photo_url !== '/images/default-avatar.png') {
                $oldPath = public_path($candidate->photo_url);
                if (File::exists($oldPath)) {
                    File::delete($oldPath);
                }
            }

            $file = $request->file('photo');
            $fileName = 'paslon_' . time() . '_' . $request->candidate_number . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images'), $fileName);
            $photoUrl = '/images/' . $fileName;
        }

        DB::table('candidates')->where('id', $id)->update([
            'candidate_number' => $request->candidate_number,
            'name' => $request->name,
            'vice_name' => $request->vice_name,
            'vision_mission' => $request->vision_mission,
            'photo_url' => $photoUrl,
        ]);

        return redirect()->back()->with('success', 'Data paslon berhasil diperbarui.');
    }

    // Hapus Paslon (Sekaligus Hapus File Foto dari Server)
    public function deleteCandidate($id)
    {
        $candidate = DB::table('candidates')->where('id', $id)->first();

        if ($candidate && $candidate->photo_url && $candidate->photo_url !== '/images/default-avatar.png') {
            $photoPath = public_path($candidate->photo_url);
            if (File::exists($photoPath)) {
                File::delete($photoPath);
            }
        }

        DB::table('candidates')->where('id', $id)->delete();
        return redirect()->back()->with('success', 'Paslon berhasil dihapus.');
    }

    // Proses Auth Admin
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $admin = DB::table('admins')
            ->where('username', $request->username)
            ->where('password', $request->password)
            ->first();

        if (!$admin) {
            return back()->withErrors(['username' => 'Username atau Password salah!']);
        }

        session(['admin' => $admin]);

        return redirect()->route('admin.dashboard');
    }

    // Process Logout Admin
    public function logout()
    {
        session()->forget('admin');
        return redirect()->route('admin.login');
    }

    // Dashboard dengan Pengecekan Sesi Admin
    public function dashboard()
    {
        if (!session('admin')) {
            return redirect()->route('admin.login')->withErrors(['username' => 'Silakan login terlebih dahulu.']);
        }

        // Statistik DPT & Suara
        $totalDpt = DB::table('voters')->count();
        $totalVoted = DB::table('voters')->where('has_voted', true)->count();
        $totalUnvoted = max(0, $totalDpt - $totalVoted);
        $totalCandidates = DB::table('candidates')->count();

        $voters = DB::table('voters')
            ->select('id', 'nik', 'name', 'rt_rw', 'has_voted')
            ->orderBy('id', 'desc')
            ->get();

        $candidates = DB::table('candidates')
            ->select(
                'candidates.id',
                'candidates.candidate_number',
                'candidates.name',
                'candidates.vice_name',
                'candidates.photo_url',
                DB::raw('COUNT(votes.id) as votes')
            )
            ->leftJoin('votes', 'candidates.id', '=', 'votes.candidate_id')
            ->groupBy('candidates.id', 'candidates.candidate_number', 'candidates.name', 'candidates.vice_name', 'candidates.photo_url')
            ->orderBy('candidates.candidate_number', 'asc')
            ->get();

        return Inertia::render('admin/dashboard', [
            'admin' => session('admin'),
            'stats' => [
                'total_dpt' => $totalDpt,
                'total_voted' => $totalVoted,
                'total_unvoted' => $totalUnvoted,
                'total_candidates' => $totalCandidates,
            ],
            'voters' => $voters,
            'candidates' => $candidates,
        ]);
    }

    // Tambah Pemilih Baru (DPT)
    public function storeVoter(Request $request)
    {
        if (!session('admin')) return redirect()->route('admin.login');

        $request->validate([
            'nik' => 'required|numeric|unique:voters,nik',
            'name' => 'required|string|max:255',
            'rt_rw' => 'nullable|string|max:50',
        ]);

        DB::table('voters')->insert([
            'nik' => $request->nik,
            'name' => $request->name,
            'rt_rw' => $request->rt_rw,
            'has_voted' => false,
            'created_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Pemilih berhasil ditambahkan.');
    }

    // Reset Status Voting Pemilih
    public function resetVoterStatus($id)
    {
        if (!session('admin')) return redirect()->route('admin.login');

        DB::table('voters')->where('id', $id)->update(['has_voted' => false]);
        return redirect()->back()->with('success', 'Status voting pemilih berhasil direset.');
    }

    // Hapus Data Pemilih
    public function deleteVoter($id)
    {
        if (!session('admin')) return redirect()->route('admin.login');

        DB::table('voters')->where('id', $id)->delete();
        return redirect()->back()->with('success', 'Data pemilih berhasil dihapus.');
    }

    // Reset Total Data Suara Percobaan
    public function resetElection()
    {
        if (!session('admin')) return redirect()->route('admin.login');

        DB::table('votes')->truncate();
        DB::table('voters')->update(['has_voted' => false]);

        return redirect()->back()->with('success', 'Data hasil pemilihan berhasil direset total.');
    }
}