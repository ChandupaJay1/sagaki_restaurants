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
    Route::post('/pos/orders', [PosController::class, 'createOrder'])->name('pos.orders.create');

    Route::get('/pos/kds', [PosController::class, 'kds'])->name('pos.kds');
    Route::post('/pos/kds/advance', [PosController::class, 'advanceOrder'])->name('pos.kds.advance');

    Route::get('/pos/tables', [PosController::class, 'tables'])->name('pos.tables');
    Route::post('/pos/tables/action', [PosController::class, 'tableAction'])->name('pos.tables.action');

    Route::get('/pos/inventory', [PosController::class, 'inventory'])->name('pos.inventory');
    Route::post('/pos/inventory/adjust', [PosController::class, 'adjustInventory'])->name('pos.inventory.adjust');
    Route::post('/pos/inventory/add', [PosController::class, 'addInventoryItem'])->name('pos.inventory.add');
    Route::post('/pos/inventory/delete/{id}', [PosController::class, 'deleteInventoryItem'])->name('pos.inventory.delete');

    Route::get('/pos/crm', [PosController::class, 'crm'])->name('pos.crm');
    Route::post('/pos/crm/add', [PosController::class, 'addCustomer'])->name('pos.crm.add');
    Route::post('/pos/crm/note', [PosController::class, 'updateCustomerNote'])->name('pos.crm.note');

    Route::get('/pos/reports', [PosController::class, 'reports'])->name('pos.reports');

    Route::get('/pos/menu', [PosController::class, 'menu'])->name('pos.menu');
    Route::post('/pos/menu/toggle', [PosController::class, 'toggleMenuAvailability'])->name('pos.menu.toggle');
    Route::post('/pos/menu/price', [PosController::class, 'updateMenuPrice'])->name('pos.menu.price');

    Route::get('/pos/purchases', [PosController::class, 'purchases'])->name('pos.purchases');
    Route::post('/pos/purchases/add', [PosController::class, 'addPurchase'])->name('pos.purchases.add');

    Route::get('/pos/delivery', [PosController::class, 'delivery'])->name('pos.delivery');
    Route::post('/pos/delivery/rider', [PosController::class, 'assignRider'])->name('pos.delivery.rider');

    Route::get('/pos/staff', [PosController::class, 'staff'])->name('pos.staff');
    Route::post('/pos/staff/clock', [PosController::class, 'clockStaff'])->name('pos.staff.clock');

    Route::get('/pos/financial', [PosController::class, 'financial'])->name('pos.financial');
    Route::post('/pos/financial/expense', [PosController::class, 'addExpense'])->name('pos.financial.expense');

    Route::get('/pos/branches', [PosController::class, 'branches'])->name('pos.branches');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
});

require __DIR__.'/auth.php';