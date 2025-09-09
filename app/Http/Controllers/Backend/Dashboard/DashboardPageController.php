<?php

namespace App\Http\Controllers\Backend\Dashboard;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardPageController extends Controller
{
    /**
     * Display the dashboard page
     *
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('Dashboard');
    }
}
