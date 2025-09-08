<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rules Engine Routes
Route::get('/rules', function () {
    return Inertia::render('Rules');
})->middleware(['auth.custom'])->name('rules');
