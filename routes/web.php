<?php

use App\Http\Controllers\Api\VoterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Halaman Login
Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::get('/login', function () {
    return Inertia::render('auth/login');
})->name('login');

// Process Login NIK + Tanggal Lahir (TAMBAHKAN ROUTE INI)
Route::post('/api/v1/auth/login-nik', [VoterController::class, 'login']);

// Halaman Dashboard Pemilih (setelah login)
Route::get('/dashboard', function (Request $request) {
    $voter = session('voter');

    // Jika belum login, tendang balik ke halaman login
    if (!$voter) {
        return redirect()->route('login')->with('error', 'Silakan login terlebih dahulu!');
    }

    return Inertia::render('dashboard', [
        'voter' => $voter,
    ]);
})->name('dashboard');

// Route Logout
Route::post('/logout', function (Request $request) {
    $request->session()->forget('voter');

    return redirect()->route('login')->with('success', 'Berhasil keluar!');
})->name('logout');