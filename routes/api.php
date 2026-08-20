<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\RestaurantTableController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/tables', [RestaurantTableController::class, 'index']);
    Route::get('/tables/floor-plan', [RestaurantTableController::class, 'floorPlan']);
    Route::get('/tables/{table}', [RestaurantTableController::class, 'show']);
    Route::put('/tables/{table}/status', [RestaurantTableController::class, 'updateStatus']);

    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations/today', [ReservationController::class, 'today']);
    Route::get('/reservations/available-slots', [ReservationController::class, 'availableSlots']);
    Route::get('/reservations/{reservation}', [ReservationController::class, 'show']);
    Route::put('/reservations/{reservation}', [ReservationController::class, 'update']);
    Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy']);

    Route::get('/menu', [MenuItemController::class, 'index']);
    Route::get('/menu/categories', [MenuItemController::class, 'categories']);
    Route::get('/menu/{menuItem}', [MenuItemController::class, 'show']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/kds', [OrderController::class, 'kds']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus']);
});
