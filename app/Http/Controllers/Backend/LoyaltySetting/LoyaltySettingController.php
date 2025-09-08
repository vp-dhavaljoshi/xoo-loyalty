<?php

namespace App\Http\Controllers\Backend\LoyaltySetting;

use App\Http\Controllers\Controller;
use App\Repositories\Backend\LoyaltySetting\LoyaltySettingRepository;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class LoyaltySettingController extends Controller
{
    protected LoyaltySettingRepository $loyaltySettingRepository;

    /**
     * LoyaltySettingController constructor.
     *
     * @param LoyaltySettingRepository $loyaltySettingRepository
     */
    public function __construct(LoyaltySettingRepository $loyaltySettingRepository)
    {
        $this->loyaltySettingRepository = $loyaltySettingRepository;
    }

    /**
     * Display the settings page
     *
     * @return Response
     */
    public function index(): Response
    {
        $settingsResponse = $this->loyaltySettingRepository->getAllSettings();
        
        return Inertia::render('Settings', [
            'settings' => $settingsResponse['data'] ?? [],
            'settingsLoaded' => $settingsResponse['status'] ?? false,
        ]);
    }

    /**
     * Get all settings
     *
     * @return JsonResponse
     */
    public function getAll(): JsonResponse
    {
        $response = $this->loyaltySettingRepository->getAllSettings();
        
        return response()->json($response);
    }

    /**
     * Update multiple settings
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updateMultiple(Request $request): JsonResponse
    {
        $request->validate([
            'settings' => 'required|array',
        ]);

        $response = $this->loyaltySettingRepository->updateMultipleSettings($request->input('settings'));
        
        return response()->json($response);
    }

    /**
     * Get public settings for frontend
     *
     * @return JsonResponse
     */
    public function getPublic(): JsonResponse
    {
        $response = $this->loyaltySettingRepository->getPublicSettings();
        
        return response()->json($response);
    }
}
