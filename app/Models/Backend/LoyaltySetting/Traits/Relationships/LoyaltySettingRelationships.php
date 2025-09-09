<?php

namespace App\Models\Backend\LoyaltySetting\Traits\Relationships;

trait LoyaltySettingRelationships
{
    /**
     * Get all settings grouped by category
     */
    public static function getGroupedSettings(): array
    {
        $settings = static::all();
        $grouped = [];
        
        foreach ($settings as $setting) {
            $category = $setting->category;
            if (!isset($grouped[$category])) {
                $grouped[$category] = [];
            }
            $grouped[$category][] = $setting;
        }
        
        return $grouped;
    }

    /**
     * Get settings by category
     */
    public static function getByCategory(string $category): array
    {
        return static::whereIn('key', static::getKeysByCategory($category))->get()->toArray();
    }

    /**
     * Get all general settings
     */
    public static function getGeneralSettings(): array
    {
        return static::getByCategory('general');
    }

    /**
     * Get all security settings
     */
    public static function getSecuritySettings(): array
    {
        return static::getByCategory('security');
    }

    /**
     * Get all reward settings
     */
    public static function getRewardSettings(): array
    {
        return static::getByCategory('rewards');
    }

    /**
     * Get keys by category
     */
    private static function getKeysByCategory(string $category): array
    {
        $categoryKeys = [
            'general' => [
                'currency',
            ],
            'security' => [
                'fraud_detection_enabled',
                'require_order_completion',
                'time_based_freeze',
                'freeze_duration_hours',
                'new_customer_freeze',
                'customer_age_threshold_days',
            ],
            'rewards' => [
                'point_to_currency_rate',
                'signup_bonus_points',
            ],
        ];
        
        return $categoryKeys[$category] ?? [];
    }

    /**
     * Get setting dependencies (settings that depend on this setting)
     */
    public function getDependencies(): array
    {
        $dependencies = [
            'time_based_freeze' => [
                'freeze_duration_hours',
            ],
            'new_customer_freeze' => [
                'customer_age_threshold_days',
            ],
        ];
        
        return $dependencies[$this->key] ?? [];
    }

    /**
     * Check if this setting has dependencies
     */
    public function hasDependencies(): bool
    {
        return !empty($this->getDependencies());
    }

    /**
     * Get settings that this setting depends on
     */
    public function getDependsOn(): array
    {
        $dependsOn = [];
        
        foreach (static::all() as $setting) {
            if (in_array($this->key, $setting->getDependencies())) {
                $dependsOn[] = $setting->key;
            }
        }
        
        return $dependsOn;
    }

    /**
     * Check if this setting depends on other settings
     */
    public function dependsOnOthers(): bool
    {
        return !empty($this->getDependsOn());
    }

    /**
     * Get setting validation context
     */
    public function getValidationContext(): array
    {
        return [
            'key' => $this->key,
            'current_value' => $this->value,
            'category' => $this->category,
            'input_type' => $this->input_type,
            'validation_rules' => $this->validation_rules,
            'dependencies' => $this->getDependencies(),
            'depends_on' => $this->getDependsOn(),
        ];
    }

    /**
     * Get a setting value by key
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public static function getValue(string $key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        
        if (!$setting) {
            return $default;
        }

        return static::castValue($setting->value, $key);
    }

    /**
     * Set a setting value by key
     *
     * @param string $key
     * @param mixed $value
     * @return bool
     */
    public static function setValue(string $key, $value): bool
    {
        $setting = static::where('key', $key)->first();
        
        if ($setting) {
            $setting->update(['value' => static::prepareValue($value)]);
        } else {
            static::create([
                'key' => $key,
                'value' => static::prepareValue($value),
            ]);
        }

        return true;
    }

    /**
     * Get all settings as array
     *
     * @return array
     */
    public static function getAllSettings(): array
    {
        $settings = static::all();
        $result = [];
        
        foreach ($settings as $setting) {
            $result[$setting->key] = static::castValue($setting->value, $setting->key);
        }
        
        // Return with frontend-friendly keys
        return [
            'fraudDetectionEnabled' => $result['fraud_detection_enabled'] ?? true,
            'requireOrderCompletion' => $result['require_order_completion'] ?? true,
            'timeBasedFreeze' => $result['time_based_freeze'] ?? true,
            'freezeDurationHours' => $result['freeze_duration_hours'] ?? 24,
            'newCustomerFreeze' => $result['new_customer_freeze'] ?? true,
            'customerAgeThresholdDays' => $result['customer_age_threshold_days'] ?? 7,
            'pointToCurrencyRate' => $result['point_to_currency_rate'] ?? 0.01,
            'currency' => $result['currency'] ?? 'USD',
            'signupBonusPoints' => $result['signup_bonus_points'] ?? 100,
        ];
    }

    /**
     * Update settings from array
     *
     * @param array $settingsData
     * @return bool
     */
    public static function updateFromArray(array $settingsData): bool
    {
        $keyMapping = [
            'fraudDetectionEnabled' => 'fraud_detection_enabled',
            'requireOrderCompletion' => 'require_order_completion',
            'timeBasedFreeze' => 'time_based_freeze',
            'freezeDurationHours' => 'freeze_duration_hours',
            'newCustomerFreeze' => 'new_customer_freeze',
            'customerAgeThresholdDays' => 'customer_age_threshold_days',
            'pointToCurrencyRate' => 'point_to_currency_rate',
            'currency' => 'currency',
            'signupBonusPoints' => 'signup_bonus_points',
        ];
        
        foreach ($settingsData as $frontendKey => $value) {
            if (isset($keyMapping[$frontendKey])) {
                static::setValue($keyMapping[$frontendKey], $value);
            }
        }
        
        return true;
    }

    /**
     * Cast value based on key type
     *
     * @param mixed $value
     * @param string $key
     * @return mixed
     */
    private static function castValue($value, string $key)
    {
        // Boolean settings
        $booleanKeys = [
            'fraud_detection_enabled',
            'require_order_completion',
            'time_based_freeze',
            'new_customer_freeze',
        ];
        
        if (in_array($key, $booleanKeys)) {
            return filter_var($value, FILTER_VALIDATE_BOOLEAN);
        }
        
        // Integer settings
        $integerKeys = [
            'freeze_duration_hours',
            'customer_age_threshold_days',
            'signup_bonus_points',
        ];
        
        if (in_array($key, $integerKeys)) {
            return (int) $value;
        }
        
        // Float settings
        $floatKeys = [
            'point_to_currency_rate',
        ];
        
        if (in_array($key, $floatKeys)) {
            return (float) $value;
        }
        
        // Default to string
        return $value;
    }

    /**
     * Prepare value for storage
     *
     * @param mixed $value
     * @return string
     */
    private static function prepareValue($value): string
    {
        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }
        
        return (string) $value;
    }
}
