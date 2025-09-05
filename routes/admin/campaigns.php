<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Campaign Management Routes
Route::get('/campaigns', function () {
    return Inertia::render('Campaigns');
})->middleware(['auth.custom', 'permission:campaigns.view'])->name('campaigns');
