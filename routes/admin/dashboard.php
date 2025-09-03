<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Dashboard - only for authenticated users
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', getLoginUserArray());
})->middleware('auth.custom')->name('dashboard');
