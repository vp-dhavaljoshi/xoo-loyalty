<?php

namespace App\Repositories\Backend\LoyaltySetting;

use App\Models\Backend\LoyaltySetting\LoyaltySetting;
use Illuminate\Support\Facades\Log;

class LoyaltySettingRepository
{
    /**
     * Get all loyalty settings
     *
     * @return array
     */
    public function getAllSettings(): array
    {
        try {
            $settings = LoyaltySetting::getAllSettings();

            return [
                'status' => true,
                'data' => $settings,
                'message' => 'Settings retrieved successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error fetching loyalty settings', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => false,
                'data' => [],
                'message' => 'Failed to retrieve settings'
            ];
        }
    }

    /**
     * Update multiple settings
     *
     * @param array $settings
     * @return array
     */
    public function updateMultipleSettings(array $settings): array
    {
        try {
            $result = LoyaltySetting::updateFromArray($settings);
            
            if ($result) {
                return [
                    'status' => true,
                    'data' => $settings,
                    'message' => 'Settings updated successfully'
                ];
            }

            return [
                'status' => false,
                'data' => [],
                'message' => 'Failed to update settings'
            ];
        } catch (\Exception $exception) {
            Log::error('Error updating loyalty settings', [
                'settings' => $settings,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => false,
                'data' => [],
                'message' => 'Failed to update settings'
            ];
        }
    }

    /**
     * Get public settings for frontend
     *
     * @return array
     */
    public function getPublicSettings(): array
    {
        try {
            $settings = LoyaltySetting::getAllSettings();
            
            // Only return public settings (module enabled, point value, currency, signup bonus)
            $publicSettings = [
                'loyaltyModuleEnabled' => $settings['loyaltyModuleEnabled'],
                'pointToCurrencyRate' => $settings['pointToCurrencyRate'],
                'currency' => $settings['currency'],
                'signupBonusPoints' => $settings['signupBonusPoints'],
            ];

            return [
                'status' => true,
                'data' => $publicSettings,
                'message' => 'Public settings retrieved successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error fetching public loyalty settings', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => false,
                'data' => [],
                'message' => 'Failed to retrieve public settings'
            ];
        }
    }
}
