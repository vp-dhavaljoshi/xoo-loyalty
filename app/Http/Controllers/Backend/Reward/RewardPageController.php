<?php

namespace App\Http\Controllers\Backend\Reward;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class RewardPageController extends Controller
{
    /**
     * Display the rewards page
     *
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('Rewards');
    }
}
