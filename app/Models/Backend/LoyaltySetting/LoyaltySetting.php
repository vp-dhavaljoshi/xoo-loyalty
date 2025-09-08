<?php

namespace App\Models\Backend\LoyaltySetting;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltySetting extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'loyalty_settings';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'value' => 'string',
    ];

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
            'loyaltyModuleEnabled' => $result['loyalty_module_enabled'] ?? true,
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
            'loyaltyModuleEnabled' => 'loyalty_module_enabled',
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
            'loyalty_module_enabled',
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
