<?php

namespace App\Http\Controllers\Backend\Report;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ReportPageController extends Controller
{
    /**
     * Display the participation reports page
     *
     * @return Response
     */
    public function participation(): Response
    {
        return Inertia::render('Reports/Participation');
    }

    /**
     * Display the points reports page
     *
     * @return Response
     */
    public function points(): Response
    {
        return Inertia::render('Reports/Points');
    }

    /**
     * Display the redemption reports page
     *
     * @return Response
     */
    public function redemption(): Response
    {
        return Inertia::render('Reports/Redemption');
    }

    /**
     * Display the membership reports page
     *
     * @return Response
     */
    public function membership(): Response
    {
        return Inertia::render('Reports/Membership');
    }

    /**
     * Display the segmentation reports page
     *
     * @return Response
     */
    public function segmentation(): Response
    {
        return Inertia::render('Reports/Segmentation');
    }

    /**
     * Display the ROI reports page
     *
     * @return Response
     */
    public function roi(): Response
    {
        return Inertia::render('Reports/ROI');
    }

    /**
     * Display the growth reports page
     *
     * @return Response
     */
    public function growth(): Response
    {
        return Inertia::render('Reports/Growth');
    }
}
