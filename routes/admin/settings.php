<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// System Settings Routes
Route::get('/settings', function () {
    return Inertia::render('Settings');
})->middleware(['auth.custom', 'permission:loyalty-settings.view'])->name('settings');
