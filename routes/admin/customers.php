<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Customer Management Routes
Route::get('/customers', function () {
    return Inertia::render('Customers', getLoginUserArray());
})->name('customers');
