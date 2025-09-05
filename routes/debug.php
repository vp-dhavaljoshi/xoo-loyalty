<?php

use Illuminate\Support\Facades\Route;
use App\Models\User\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Debug route to test login (REMOVE IN PRODUCTION)
Route::get('/debug/login-user/{id}', function ($id) {
    $user = User::find($id);
    
    if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
    }
    
    Auth::login($user);
    
    return response()->json([
        'message' => 'User logged in successfully',
        'user' => $user,
        'authenticated' => Auth::check(),
        'permissions' => $user->getAllPermissions()->pluck('name')->toArray()
    ]);
})->name('debug.login');

// Debug route to check current auth status
Route::get('/debug/auth-status', function () {
    $user = Auth::user();
    
    return response()->json([
        'authenticated' => Auth::check(),
        'user' => $user,
        'permissions' => $user ? $user->getAllPermissions()->pluck('name')->toArray() : [],
        'session_id' => session()->getId()
    ]);
})->name('debug.auth.status');

// Simple dashboard test without permission middleware
Route::get('/debug/dashboard', function () {
    $user = Auth::user();
    
    if (!$user) {
        return response()->json(['error' => 'Not authenticated'], 401);
    }
    
    return Inertia::render('Dashboard', [
        'auth' => [
            'user' => $user,
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray()
        ]
    ]);
})->middleware('auth.custom')->name('debug.dashboard');

// Simple login page (REMOVE IN PRODUCTION)
Route::get('/login', function () {
    if (Auth::check()) {
        return redirect()->route('admin.dashboard');
    }
    
    return Inertia::render('SimpleLogin', [
        'error' => session('error')
    ]);
})->name('login');
