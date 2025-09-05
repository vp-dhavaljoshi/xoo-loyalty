<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rewards Catalog Routes
Route::get('/rewards', function () {
    return Inertia::render('Rewards');
})->middleware(['auth.custom', 'permission:rewards.view'])->name('rewards');
