<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\Campaign\CampaignPageController;

// Campaign Management Routes
Route::get('/campaigns', [CampaignPageController::class, 'index'])
    ->middleware(['auth.custom'])
    ->name('campaigns');
