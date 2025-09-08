<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\LoyaltySetting\LoyaltySettingController;

// Loyalty Settings Routes
Route::middleware(['auth.custom'])->group(function () {
    // Display settings page
    Route::get('/settings', [LoyaltySettingController::class, 'index'])->name('settings');
    
    // API routes for settings
    Route::prefix('api/settings')->group(function () {
        Route::get('/', [LoyaltySettingController::class, 'getAll']);
        Route::get('/public', [LoyaltySettingController::class, 'getPublic']);
        Route::put('/', [LoyaltySettingController::class, 'updateMultiple']);
    });
});
