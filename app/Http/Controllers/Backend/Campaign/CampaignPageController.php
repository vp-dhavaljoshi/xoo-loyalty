<?php

namespace App\Http\Controllers\Backend\Campaign;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class CampaignPageController extends Controller
{
    /**
     * Display the campaigns page
     *
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('Campaigns');
    }
}
