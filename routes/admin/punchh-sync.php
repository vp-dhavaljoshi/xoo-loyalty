<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\PunchhSync\PunchhSyncController;

// Punchh Sync API Routes
Route::prefix('api/punchh-sync')->name('api.punchh-sync.')->group(function () {
    // Sync operations
    Route::post('/sync-all', [PunchhSyncController::class, 'syncAllUsers'])->name('sync-all');
    Route::post('/sync-user/{userId}', [PunchhSyncController::class, 'syncUser'])->name('sync-user');
    
    // Status and monitoring
    Route::get('/status', [PunchhSyncController::class, 'getSyncStatus'])->name('status');
    Route::get('/test-connection', [PunchhSyncController::class, 'testConnection'])->name('test-connection');
    Route::get('/stats', [PunchhSyncController::class, 'getSyncStats'])->name('stats');
    
    // User-specific sync history
    Route::get('/user/{userId}/history', [PunchhSyncController::class, 'getUserSyncHistory'])->name('user.history');
});

