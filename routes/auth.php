<?php

use App\Http\Controllers\Auth\AutoLoginController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

// Auto-login route for cross-domain authentication from xoo
Route::get('auto-login', [AutoLoginController::class, 'handleAutoLogin'])
    ->name('auto-login');

// Logout route
Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    
    // Clear any additional session data
    request()->session()->flush();
    
    // Add cache-busting headers to prevent caching issues
    return redirect()->route('home')->withHeaders([
        'Cache-Control' => 'no-cache, no-store, must-revalidate',
        'Pragma' => 'no-cache',
        'Expires' => '0'
    ]);
})->name('logout');