<?php

namespace App\Models\Backend\LoyaltySetting\Traits\Scopes;

trait LoyaltySettingScopes
{
    /**
     * Scope to filter settings by category
     */
    public function scopeByCategory($query, string $category)
    {
        $categoryKeys = [
            'general' => ['currency'],
            'security' => [
                'fraud_prevention_enabled',
                'require_order_completion',
                'time_based_freeze',
                'freeze_duration_hours',
                'new_customer_freeze',
                'customer_age_threshold_days',
            ],
            'rewards' => ['currency_to_point_rate', 'signup_bonus_points'],
        ];
        
        $keys = $categoryKeys[$category] ?? [];
        
        if (empty($keys)) {
            return $query->whereRaw('1 = 0'); // Return no results for invalid category
        }
        
        return $query->whereIn('key', $keys);
    }

    /**
     * Scope to filter general settings
     */
    public function scopeGeneral($query)
    {
        return $query->byCategory('general');
    }

    /**
     * Scope to filter security settings
     */
    public function scopeSecurity($query)
    {
        return $query->byCategory('security');
    }

    /**
     * Scope to filter reward settings
     */
    public function scopeRewards($query)
    {
        return $query->byCategory('rewards');
    }

    /**
     * Scope to filter boolean settings
     */
    public function scopeBoolean($query)
    {
        $booleanKeys = [
            'fraud_prevention_enabled',
            'require_order_completion',
            'time_based_freeze',
            'new_customer_freeze',
        ];
        
        return $query->whereIn('key', $booleanKeys);
    }

    /**
     * Scope to filter integer settings
     */
    public function scopeInteger($query)
    {
        $integerKeys = [
            'freeze_duration_hours',
            'customer_age_threshold_days',
            'signup_bonus_points',
            'currency_to_point_rate',
        ];
        
        return $query->whereIn('key', $integerKeys);
    }

    /**
     * Scope to filter float settings
     */
    public function scopeFloat($query)
    {
        $floatKeys = [
            // No float settings currently
        ];
        
        return $query->whereIn('key', $floatKeys);
    }

    /**
     * Scope to filter string settings
     */
    public function scopeString($query)
    {
        $stringKeys = [
            'currency',
        ];
        
        return $query->whereIn('key', $stringKeys);
    }

    /**
     * Scope to filter enabled settings (boolean true)
     */
    public function scopeEnabled($query)
    {
        return $query->where('value', 'true');
    }

    /**
     * Scope to filter disabled settings (boolean false)
     */
    public function scopeDisabled($query)
    {
        return $query->where('value', 'false');
    }

    /**
     * Scope to filter settings by key pattern
     */
    public function scopeByKeyPattern($query, string $pattern)
    {
        return $query->where('key', 'like', "%{$pattern}%");
    }

    /**
     * Scope to filter settings with non-empty values
     */
    public function scopeWithValue($query)
    {
        return $query->whereNotNull('value')->where('value', '!=', '');
    }

    /**
     * Scope to filter settings with empty values
     */
    public function scopeWithoutValue($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('value')->orWhere('value', '');
        });
    }

    /**
     * Scope to order settings by category
     */
    public function scopeOrderByCategory($query)
    {
        return $query->orderByRaw("
            CASE 
                WHEN key IN ('currency') THEN 1
                WHEN key IN ('fraud_prevention_enabled', 'require_order_completion', 'time_based_freeze', 'freeze_duration_hours', 'new_customer_freeze', 'customer_age_threshold_days') THEN 2
                WHEN key IN ('currency_to_point_rate', 'signup_bonus_points') THEN 3
                ELSE 4
            END
        ");
    }

    /**
     * Scope to order settings by key
     */
    public function scopeOrderByKey($query, string $direction = 'asc')
    {
        return $query->orderBy('key', $direction);
    }

    /**
     * Scope to get settings that are required for system operation
     */
    public function scopeRequired($query)
    {
        $requiredKeys = [
            'currency',
            'currency_to_point_rate',
        ];
        
        return $query->whereIn('key', $requiredKeys);
    }

    /**
     * Scope to get settings that are optional
     */
    public function scopeOptional($query)
    {
        $requiredKeys = [
            'currency',
            'currency_to_point_rate',
        ];
        
        return $query->whereNotIn('key', $requiredKeys);
    }
}
