<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Reports Routes
Route::prefix('reports')->name('reports.')->middleware(['auth.custom'])->group(function () {
    Route::get('/participation', function () {
        return Inertia::render('Reports/Participation');
    })->middleware('permission:loyalty-reports.view')->name('participation');

    Route::get('/points', function () {
        return Inertia::render('Reports/Points');
    })->middleware('permission:loyalty-reports.view')->name('points');

    Route::get('/redemption', function () {
        return Inertia::render('Reports/Redemption');
    })->middleware('permission:loyalty-reports.view')->name('redemption');

    Route::get('/membership', function () {
        return Inertia::render('Reports/Membership');
    })->middleware('permission:loyalty-reports.view')->name('membership');

    Route::get('/segmentation', function () {
        return Inertia::render('Reports/Segmentation');
    })->middleware('permission:loyalty-reports.view')->name('segmentation');

    Route::get('/roi', function () {
        return Inertia::render('Reports/ROI');
    })->middleware('permission:loyalty-reports.view')->name('roi');

    Route::get('/growth', function () {
        return Inertia::render('Reports/Growth');
    })->middleware('permission:loyalty-reports.view')->name('growth');
});
