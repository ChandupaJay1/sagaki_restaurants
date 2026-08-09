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
    Route::get('/pos/menu', fn () => Inertia::render('POS/Menu'))->name('pos.menu');
    Route::get('/pos/purchases', fn () => Inertia::render('POS/Purchases'))->name('pos.purchases');
    Route::get('/pos/delivery', fn () => Inertia::render('POS/Delivery'))->name('pos.delivery');
    Route::get('/pos/staff', fn () => Inertia::render('POS/Staff'))->name('pos.staff');
    Route::get('/pos/finance', fn () => Inertia::render('POS/Finance'))->name('pos.finance');
    Route::get('/pos/branches', fn () => Inertia::render('POS/Branches'))->name('pos.branches');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';