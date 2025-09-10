<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

// Guest routes - accessible to everyone
Route::get('/', function () {
    // If user is authenticated, redirect to dashboard
    if (Auth::check()) {
        return redirect()->route('admin.dashboard');
    }
    
    // If not authenticated, show home page with no auth data
    return Inertia::render('Home', [
        'error' => session('error'),
        'auth' => [
            'user' => null,
            'permissions' => []
        ]
    ]);
})->name('home');

// Admin routes - protected by auth middleware
Route::prefix('admin')->name('admin.')->middleware('auth.custom')->group(function () {
    includeRouteFiles(__DIR__.'/admin/');
});

require __DIR__.'/auth.php';