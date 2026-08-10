<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check()
        ? redirect(route('dashboard'))
        : redirect()->route('login');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/pos', [PosController::class, 'index'])->name('pos.index');
    Route::get('/pos/kds', [PosController::class, 'kds'])->name('pos.kds');
    Route::get('/pos/tables', [PosController::class, 'tables'])->name('pos.tables');
    Route::get('/pos/inventory', [PosController::class, 'inventory'])->name('pos.inventory');
    Route::get('/pos/crm', [PosController::class, 'crm'])->name('pos.crm');
    Route::get('/pos/reports', [PosController::class, 'reports'])->name('pos.reports');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
});

require __DIR__.'/auth.php';