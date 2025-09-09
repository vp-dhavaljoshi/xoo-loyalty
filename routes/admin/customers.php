<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\User\UserController;

// Customer Management Frontend Route
Route::get('/customers', [UserController::class, 'customers'])
    ->middleware(['auth.custom'])
    ->name('customers');

// Customer API Routes - separate prefix to avoid conflicts
Route::prefix('api/customers')->name('api.customers.')->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('index');
    Route::get('/{id}', [UserController::class, 'show'])->name('show');
    Route::get('/export/csv', [UserController::class, 'exportCsv'])->name('export-csv');
});
