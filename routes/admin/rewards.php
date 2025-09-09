<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\Reward\RewardPageController;

// Rewards Catalog Routes
Route::get('/rewards', [RewardPageController::class, 'index'])
    ->middleware(['auth.custom'])
    ->name('rewards');
