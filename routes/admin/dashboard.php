<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\Dashboard\DashboardPageController;

// Dashboard - only for authenticated users (permission check moved to frontend)
Route::get('/dashboard', [DashboardPageController::class, 'index'])
    ->middleware(['auth.custom'])
    ->name('dashboard');
