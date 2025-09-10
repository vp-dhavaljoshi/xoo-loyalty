<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\LoyaltyTransaction\LoyaltyTransactionController;

// Transaction History API Routes
Route::prefix('api/transactions')->name('api.transactions.')->group(function () {
    Route::get('/', [LoyaltyTransactionController::class, 'index'])->name('index');
    Route::get('/stats', [LoyaltyTransactionController::class, 'stats'])->name('stats');
    Route::get('/{id}', [LoyaltyTransactionController::class, 'show'])->name('show');
    Route::post('/', [LoyaltyTransactionController::class, 'store'])->name('store');
    Route::get('/user/{userId}/history', [LoyaltyTransactionController::class, 'getUserHistory'])->name('user.history');
});
