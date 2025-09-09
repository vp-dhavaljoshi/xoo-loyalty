<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\Report\ReportPageController;

// Reports Routes
Route::prefix('reports')->name('reports.')->middleware(['auth.custom'])->group(function () {
    Route::get('/participation', [ReportPageController::class, 'participation'])
        ->middleware('permission:loyalty-reports.view')
        ->name('participation');

    Route::get('/points', [ReportPageController::class, 'points'])
        ->middleware('permission:loyalty-reports.view')
        ->name('points');

    Route::get('/redemption', [ReportPageController::class, 'redemption'])
        ->middleware('permission:loyalty-reports.view')
        ->name('redemption');

    Route::get('/membership', [ReportPageController::class, 'membership'])
        ->middleware('permission:loyalty-reports.view')
        ->name('membership');

    Route::get('/segmentation', [ReportPageController::class, 'segmentation'])
        ->middleware('permission:loyalty-reports.view')
        ->name('segmentation');

    Route::get('/roi', [ReportPageController::class, 'roi'])
        ->middleware('permission:loyalty-reports.view')
        ->name('roi');

    Route::get('/growth', [ReportPageController::class, 'growth'])
        ->middleware('permission:loyalty-reports.view')
        ->name('growth');
});
