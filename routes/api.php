<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\VoterController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route API Login NIK + Tanggal Lahir Pilkades
Route::post('/v1/auth/login-nik', [VoterController::class, 'login']);