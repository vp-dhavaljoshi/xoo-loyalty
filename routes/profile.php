<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// Profile routes - protected by auth middleware
Route::middleware('auth.custom')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
