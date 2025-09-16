<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\Rule\RulePageController;
use App\Http\Controllers\Backend\Rule\RuleController;

// Rules Engine Routes
Route::get('/rules', [RulePageController::class, 'index'])
    ->middleware(['auth.custom'])
    ->name('rules');

// Rules API Routes
Route::prefix('api/rules')->middleware(['auth.custom'])->group(function () {
    Route::get('/', [RuleController::class, 'index']);
    Route::post('/', [RuleController::class, 'store']);
    Route::get('/export/csv', [RuleController::class, 'exportCsv']);
    Route::get('/{id}', [RuleController::class, 'show']);
    Route::put('/{id}', [RuleController::class, 'update']);
    Route::delete('/{id}', [RuleController::class, 'destroy']);
    Route::patch('/{id}/toggle-status', [RuleController::class, 'toggleStatus']);
});
