<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Dashboard - only for authenticated users (permission check moved to frontend)
Route::get('/dashboard', function () {    
    return Inertia::render('Dashboard');
})->middleware(['auth.custom'])->name('dashboard');
