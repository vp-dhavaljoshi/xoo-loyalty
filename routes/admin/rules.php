<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\Rule\RulePageController;

// Rules Engine Routes
Route::get('/rules', [RulePageController::class, 'index'])
    ->middleware(['auth.custom'])
    ->name('rules');
