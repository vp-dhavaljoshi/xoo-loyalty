<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// System Settings Routes
Route::get('/settings', function () {
    return Inertia::render('Settings', getLoginUserArray());
})->name('settings');
