<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Guest routes - accessible to everyone
Route::get('/', function () {
    // If user is authenticated, redirect to dashboard
    if (auth()->check()) {
        return redirect()->route('admin.dashboard');
    }
    
    // If not authenticated, show home page
    return Inertia::render('Home', [
        'error' => session('error'),
        getLoginUserArray()
    ]);
})->name('home');

// Logout route
Route::post('/logout', function () {
    auth()->logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect()->route('home');
})->name('logout');

// Include admin routes
require __DIR__.'/admin.php';

// Include profile routes
require __DIR__.'/profile.php';

// Include auth routes
require __DIR__.'/auth.php';
