<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return auth()->check()
        ? redirect(route('dashboard'))
        : redirect()->route('login');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');

    Route::get('/pos', fn () => Inertia::render('POS/Index'))->name('pos.index');
    Route::get('/pos/kds', fn () => Inertia::render('POS/KDS'))->name('pos.kds');
    Route::get('/pos/tables', fn () => Inertia::render('POS/Tables'))->name('pos.tables');
    Route::get('/pos/inventory', fn () => Inertia::render('POS/Inventory'))->name('pos.inventory');
    Route::get('/pos/crm', fn () => Inertia::render('POS/CRM'))->name('pos.crm');
    Route::get('/pos/reports', fn () => Inertia::render('POS/Reports'))->name('pos.reports');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';