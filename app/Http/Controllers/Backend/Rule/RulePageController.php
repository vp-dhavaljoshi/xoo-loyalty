<?php

namespace App\Http\Controllers\Backend\Rule;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class RulePageController extends Controller
{
    /**
     * Display the rules page
     *
     * @return Response
     */
    public function index(): Response
    {
        return Inertia::render('Rules');
    }
}
