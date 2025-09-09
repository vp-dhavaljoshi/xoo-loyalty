<?php

namespace App\Repositories\Backend\LoyaltySetting;

use App\Constants\AppConstants;
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
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $settings,
                'message' => 'Settings retrieved successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error fetching loyalty settings', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
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
                    'status' => AppConstants::STATUS_SUCCESS,
                    'data' => $settings,
                    'message' => 'Settings updated successfully'
                ];
            }

            return [
                'status' => AppConstants::STATUS_ERROR,
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
                'status' => AppConstants::STATUS_ERROR,
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
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $publicSettings,
                'message' => 'Public settings retrieved successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error fetching public loyalty settings', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => [],
                'message' => 'Failed to retrieve public settings'
            ];
        }
    }

    /**
     * Get settings by category
     *
     * @param string $category
     * @return array
     */
    public function getSettingsByCategory(string $category): array
    {
        try {
            $settings = LoyaltySetting::byCategory($category)->get();
            $result = [];
            
            foreach ($settings as $setting) {
                $result[$setting->key] = [
                    'key' => $setting->key,
                    'value' => $setting->value,
                    'display_name' => $setting->display_name,
                    'description' => $setting->description,
                    'category' => $setting->category,
                    'input_type' => $setting->input_type,
                    'validation_rules' => $setting->validation_rules,
                ];
            }

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $result,
                'message' => ucfirst($category) . ' settings retrieved successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error fetching settings by category', [
                'category' => $category,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => [],
                'message' => 'Failed to retrieve ' . $category . ' settings'
            ];
        }
    }

    /**
     * Get general settings
     *
     * @return array
     */
    public function getGeneralSettings(): array
    {
        return $this->getSettingsByCategory('general');
    }

    /**
     * Get security settings
     *
     * @return array
     */
    public function getSecuritySettings(): array
    {
        return $this->getSettingsByCategory('security');
    }

    /**
     * Get reward settings
     *
     * @return array
     */
    public function getRewardSettings(): array
    {
        return $this->getSettingsByCategory('rewards');
    }

    /**
     * Get a single setting by key
     *
     * @param string $key
     * @param mixed $default
     * @return array
     */
    public function getSetting(string $key, $default = null): array
    {
        try {
            $value = LoyaltySetting::getValue($key, $default);
            $setting = LoyaltySetting::where('key', $key)->first();

            $result = [
                'key' => $key,
                'value' => $value,
                'display_name' => $setting ? $setting->display_name : ucwords(str_replace('_', ' ', $key)),
                'description' => $setting ? $setting->description : 'Setting configuration',
                'category' => $setting ? $setting->category : 'general',
                'input_type' => $setting ? $setting->input_type : 'text',
                'validation_rules' => $setting ? $setting->validation_rules : ['string'],
            ];

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $result,
                'message' => 'Setting retrieved successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error fetching setting', [
                'key' => $key,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => null,
                'message' => 'Failed to retrieve setting'
            ];
        }
    }

    /**
     * Update a single setting
     *
     * @param string $key
     * @param mixed $value
     * @return array
     */
    public function updateSetting(string $key, $value): array
    {
        try {
            $result = LoyaltySetting::setValue($key, $value);
            
            if ($result) {
                return [
                    'status' => AppConstants::STATUS_SUCCESS,
                    'data' => ['key' => $key, 'value' => $value],
                    'message' => 'Setting updated successfully'
                ];
            }

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => null,
                'message' => 'Failed to update setting'
            ];
        } catch (\Exception $exception) {
            Log::error('Error updating setting', [
                'key' => $key,
                'value' => $value,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => null,
                'message' => 'Failed to update setting'
            ];
        }
    }

    /**
     * Get all settings with full details
     *
     * @return array
     */
    public function getAllSettingsWithDetails(): array
    {
        try {
            $settings = LoyaltySetting::orderByCategory()->get();
            $result = [];
            
            foreach ($settings as $setting) {
                $result[$setting->key] = [
                    'key' => $setting->key,
                    'value' => $setting->value,
                    'display_name' => $setting->display_name,
                    'description' => $setting->description,
                    'category' => $setting->category,
                    'input_type' => $setting->input_type,
                    'validation_rules' => $setting->validation_rules,
                    'dependencies' => $setting->getDependencies(),
                    'depends_on' => $setting->getDependsOn(),
                ];
            }

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $result,
                'message' => 'Settings with details retrieved successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error fetching settings with details', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => [],
                'message' => 'Failed to retrieve settings with details'
            ];
        }
    }
}
