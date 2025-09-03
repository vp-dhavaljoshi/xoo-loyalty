<?php

use App\Http\Controllers\Auth\AutoLoginController;
use Illuminate\Support\Facades\Route;

// Auto-login route for cross-domain authentication from xoo
Route::get('auto-login', [AutoLoginController::class, 'handleAutoLogin'])
    ->name('auto-login');