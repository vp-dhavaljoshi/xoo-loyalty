<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Dashboard');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

// Admin routes
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/customers', function () {
        return Inertia::render('Customers');
    })->name('customers');

    Route::get('/rules', function () {
        return Inertia::render('Rules');
    })->name('rules');

    Route::get('/campaigns', function () {
        return Inertia::render('Campaigns');
    })->name('campaigns');

    Route::get('/rewards', function () {
        return Inertia::render('Rewards');
    })->name('rewards');

    Route::get('/settings', function () {
        return Inertia::render('Settings');
    })->name('settings');

    // Reports routes
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/participation', function () {
            return Inertia::render('Reports/Participation');
        })->name('participation');

        Route::get('/points', function () {
            return Inertia::render('Reports/Points');
        })->name('points');

        Route::get('/redemption', function () {
            return Inertia::render('Reports/Redemption');
        })->name('redemption');

        Route::get('/membership', function () {
            return Inertia::render('Reports/Membership');
        })->name('membership');

        Route::get('/segmentation', function () {
            return Inertia::render('Reports/Segmentation');
        })->name('segmentation');

        Route::get('/roi', function () {
            return Inertia::render('Reports/ROI');
        })->name('roi');

        Route::get('/growth', function () {
            return Inertia::render('Reports/Growth');
        })->name('growth');
    });
});

// Keep profile routes for future use but remove auth requirement
Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

// Remove auth.php require for now
// require __DIR__.'/auth.php';
