<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\PromoController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DashboardController;

// ============================================
// AUTH ROUTES (No middleware)
// ============================================
Route::controller(AuthController::class)->group(function () {
    Route::post('auth/login', 'login');
    Route::post('auth/register', 'register');

    // Protected auth routes (JWT only)
    Route::middleware('auth:api')->group(function () {
        Route::post('auth/logout', 'logout');
        Route::post('auth/refresh', 'refresh');
        Route::get('auth/me', 'me');
    });
});

// ============================================
// PUBLIC ROUTES (No auth, no security)
// ============================================
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);
Route::get('/menus', [MenuController::class, 'index']);
Route::get('/menus/{slug}', [MenuController::class, 'show']);
Route::get('/promos', [PromoController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);

// ============================================
// USER ROUTES (JWT only - customer/admin)
// ============================================
Route::middleware('auth:api')->group(function () {
    // Customer Orders
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/my', [OrderController::class, 'myOrders']);
    Route::get('/orders/my/{uuid}', [OrderController::class, 'myOrderDetail']);

    // Dashboard Overview (admin only - checked in controller)
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Admin Management (admin only - checked in controller)
    Route::get('/admin/users', [AdminUserController::class, 'index']);
    Route::post('/admin/users/{uuid}/promote', [AdminUserController::class, 'promote']);
    Route::post('/admin/users/{uuid}/ban', [AdminUserController::class, 'ban']);
    Route::post('/admin/users/{uuid}/unban', [AdminUserController::class, 'unban']);

    // Category Management (admin only - checked in controller)
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{slug}', [CategoryController::class, 'update']);
    Route::patch('/categories/{slug}', [CategoryController::class, 'update']);
    Route::delete('/categories/{slug}', [CategoryController::class, 'destroy']);

    // Menu Management (admin only - checked in controller)
    Route::post('/menus', [MenuController::class, 'store']);
    Route::put('/menus/{slug}', [MenuController::class, 'update']);
    Route::patch('/menus/{slug}', [MenuController::class, 'update']);
    Route::post('/menus/{slug}/image', [MenuController::class, 'updateImage']);
    Route::delete('/menus/{slug}', [MenuController::class, 'destroy']);

    // Order Management (admin only - checked in controller)
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{uuid}', [OrderController::class, 'show']);
    Route::put('/orders/{uuid}/status', [OrderController::class, 'update']);

    // Promo Management (admin only - checked in controller)
    Route::get('/promos/{uuid}', [PromoController::class, 'show']);
    Route::post('/promos', [PromoController::class, 'store']);
    Route::put('/promos/{uuid}', [PromoController::class, 'update']);
    Route::delete('/promos/{uuid}', [PromoController::class, 'destroy']);
    Route::put('/promos/{uuid}/assign-menus', [PromoController::class, 'assignToMenus']);

    // Contact Management (admin only - checked in controller)
    Route::get('/contacts', [ContactController::class, 'index']);

    // User Management (admin only - checked in controller)
    Route::get('/users', [\App\Http\Controllers\Api\UserManagementController::class, 'index']);
    Route::post('/users', [\App\Http\Controllers\Api\UserManagementController::class, 'store']);
    Route::put('/users/{uuid}', [\App\Http\Controllers\Api\UserManagementController::class, 'update']);
    Route::delete('/users/{uuid}', [\App\Http\Controllers\Api\UserManagementController::class, 'destroy']);
    Route::put('/users/{uuid}/ban', [\App\Http\Controllers\Api\UserManagementController::class, 'ban']);
    Route::put('/users/{uuid}/unban', [\App\Http\Controllers\Api\UserManagementController::class, 'unban']);

    // Struk PDF Download
    Route::get('/orders/{uuid}/struk', [\App\Http\Controllers\Api\StrukController::class, 'downloadStruk']);
    Route::get('/orders/my/{uuid}/struk', [\App\Http\Controllers\Api\StrukController::class, 'downloadMyStruk']);
});