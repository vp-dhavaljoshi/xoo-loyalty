<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Dashboard - only for authenticated users with loyalty-dashboard.view permission
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth.custom', 'permission:loyalty-dashboard.view'])->name('dashboard');
