<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');

Route::get('/', function () {
    if (auth()->check()) {
        return to_route('pos.index');
    }
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/pos', fn () => Inertia::render('POS/Index'))->name('pos.index');
Route::get('/pos/kds', fn () => Inertia::render('POS/KDS'))->name('pos.kds');
Route::get('/pos/tables', fn () => Inertia::render('POS/Tables'))->name('pos.tables');

Route::get('/pos/inventory', fn () => Inertia::render('POS/Inventory'))->name('pos.inventory');
Route::get('/pos/crm', fn () => Inertia::render('POS/CRM'))->name('pos.crm');
Route::get('/pos/reports', fn () => Inertia::render('POS/Reports'))->name('pos.reports');

require __DIR__.'/auth.php';
