<?php

use Illuminate\Support\Facades\Route;

// Admin routes - protected by auth middleware
Route::prefix('admin')->name('admin.')->middleware('auth.custom')->group(function () {
    
    // Include dashboard routes
    require __DIR__.'/admin/dashboard.php';
    
    // Include customer management routes
    require __DIR__.'/admin/customers.php';
    
    // Include rules engine routes
    require __DIR__.'/admin/rules.php';
    
    // Include campaign management routes
    require __DIR__.'/admin/campaigns.php';
    
    // Include rewards catalog routes
    require __DIR__.'/admin/rewards.php';
    
    // Include system settings routes
    require __DIR__.'/admin/settings.php';
    
    // Include reports routes
    require __DIR__.'/admin/reports.php';
});
