<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Reports Routes
Route::prefix('reports')->name('reports.')->group(function () {
    Route::get('/participation', function () {
        return Inertia::render('Reports/Participation', getLoginUserArray());
    })->name('participation');

    Route::get('/points', function () {
        return Inertia::render('Reports/Points', getLoginUserArray());
    })->name('points');

    Route::get('/redemption', function () {
        return Inertia::render('Reports/Redemption', getLoginUserArray());
    })->name('redemption');

    Route::get('/membership', function () {
        return Inertia::render('Reports/Membership', getLoginUserArray());
    })->name('membership');

    Route::get('/segmentation', function () {
        return Inertia::render('Reports/Segmentation', getLoginUserArray());
    })->name('segmentation');

    Route::get('/roi', function () {
        return Inertia::render('Reports/ROI', getLoginUserArray());
    })->name('roi');

    Route::get('/growth', function () {
        return Inertia::render('Reports/Growth', getLoginUserArray());
    })->name('growth');
});
