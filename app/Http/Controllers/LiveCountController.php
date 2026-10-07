<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LiveCountController extends Controller
{
    public function index()
    {
        // 1. Ambil statistik pemilih dari tabel voters
        $totalDpt = DB::table('voters')->count();
        $totalVoted = DB::table('voters')->where('has_voted', true)->count();
        $totalUnvoted = max(0, $totalDpt - $totalVoted);
        $percentage = $totalDpt > 0 ? round(($totalVoted / $totalDpt) * 100, 1) : 0;

        // 2. Hitung jumlah suara per kandidat langsung dari tabel votes
        $voteCounts = DB::table('votes')
            ->select('candidate_id', DB::raw('COUNT(*) as total'))
            ->groupBy('candidate_id')
            ->pluck('total', 'candidate_id');

        // 3. Gabungkan data kandidat
        $candidates = [
            [
                'id' => 1,
                'candidate_number' => '01',
                'name' => 'I Wayan Sudiarta',
                'votes' => (int) ($voteCounts[1] ?? 0),
            ],
            [
                'id' => 2,
                'candidate_number' => '02',
                'name' => 'Ni Luh Putu Anggreni',
                'votes' => (int) ($voteCounts[2] ?? 0),
            ],
        ];

        return Inertia::render('live-count/index', [
            'stats' => [
                'total_dpt' => $totalDpt,
                'total_voted' => $totalVoted,
                'total_unvoted' => $totalUnvoted,
                'percentage' => $percentage,
            ],
            'chartData' => $candidates,
        ]);
    }
}