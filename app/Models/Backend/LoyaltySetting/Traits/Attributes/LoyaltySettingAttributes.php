<?php

namespace App\Models\Backend\LoyaltySetting\Traits\Attributes;

trait LoyaltySettingAttributes
{
    /**
     * Get the setting value as boolean
     */
    public function getBooleanValueAttribute(): bool
    {
        return filter_var($this->value, FILTER_VALIDATE_BOOLEAN);
    }

    /**
     * Get the setting value as integer
     */
    public function getIntegerValueAttribute(): int
    {
        return (int) $this->value;
    }

    /**
     * Get the setting value as float
     */
    public function getFloatValueAttribute(): float
    {
        return (float) $this->value;
    }

    /**
     * Get the setting value as array (for JSON values)
     */
    public function getArrayValueAttribute(): array
    {
        $decoded = json_decode($this->value, true);
        return is_array($decoded) ? $decoded : [];
    }

    /**
     * Check if setting is a boolean type
     */
    public function getIsBooleanAttribute(): bool
    {
        $booleanKeys = [
            'fraud_detection_enabled',
            'require_order_completion',
            'time_based_freeze',
            'new_customer_freeze',
        ];
        
        return in_array($this->key, $booleanKeys);
    }

    /**
     * Check if setting is an integer type
     */
    public function getIsIntegerAttribute(): bool
    {
        $integerKeys = [
            'freeze_duration_hours',
            'customer_age_threshold_days',
            'signup_bonus_points',
        ];
        
        return in_array($this->key, $integerKeys);
    }

    /**
     * Check if setting is a float type
     */
    public function getIsFloatAttribute(): bool
    {
        $floatKeys = [
            'point_to_currency_rate',
        ];
        
        return in_array($this->key, $floatKeys);
    }

    /**
     * Get the setting's display name
     */
    public function getDisplayNameAttribute(): string
    {
        $displayNames = [
            'fraud_detection_enabled' => 'Fraud Detection Enabled',
            'require_order_completion' => 'Require Order Completion',
            'time_based_freeze' => 'Time Based Freeze',
            'freeze_duration_hours' => 'Freeze Duration (Hours)',
            'new_customer_freeze' => 'New Customer Freeze',
            'customer_age_threshold_days' => 'Customer Age Threshold (Days)',
            'point_to_currency_rate' => 'Point to Currency Rate',
            'currency' => 'Currency',
            'signup_bonus_points' => 'Signup Bonus Points',
        ];
        
        return $displayNames[$this->key] ?? ucwords(str_replace('_', ' ', $this->key));
    }

    /**
     * Get the setting's description
     */
    public function getDescriptionAttribute(): string
    {
        $descriptions = [
            'fraud_detection_enabled' => 'Enable fraud detection for loyalty transactions',
            'require_order_completion' => 'Require order completion before awarding points',
            'time_based_freeze' => 'Enable time-based freeze for new customers',
            'freeze_duration_hours' => 'Duration in hours for customer freeze period',
            'new_customer_freeze' => 'Freeze new customers for a specified period',
            'customer_age_threshold_days' => 'Number of days to consider a customer as new',
            'point_to_currency_rate' => 'Conversion rate from points to currency',
            'currency' => 'Default currency for the loyalty system',
            'signup_bonus_points' => 'Bonus points awarded to new customers on signup',
        ];
        
        return $descriptions[$this->key] ?? 'Loyalty setting configuration';
    }

    /**
     * Get the setting's category
     */
    public function getCategoryAttribute(): string
    {
        $categories = [
            'fraud_detection_enabled' => 'security',
            'require_order_completion' => 'security',
            'time_based_freeze' => 'security',
            'freeze_duration_hours' => 'security',
            'new_customer_freeze' => 'security',
            'customer_age_threshold_days' => 'security',
            'point_to_currency_rate' => 'rewards',
            'currency' => 'general',
            'signup_bonus_points' => 'rewards',
        ];
        
        return $categories[$this->key] ?? 'general';
    }

    /**
     * Get the setting's input type for forms
     */
    public function getInputTypeAttribute(): string
    {
        if ($this->is_boolean) {
            return 'checkbox';
        } elseif ($this->is_integer || $this->is_float) {
            return 'number';
        } elseif ($this->key === 'currency') {
            return 'select';
        }
        
        return 'text';
    }

    /**
     * Get the setting's validation rules
     */
    public function getValidationRulesAttribute(): array
    {
        $rules = [];
        
        if ($this->is_boolean) {
            $rules[] = 'boolean';
        } elseif ($this->is_integer) {
            $rules[] = 'integer';
            $rules[] = 'min:0';
        } elseif ($this->is_float) {
            $rules[] = 'numeric';
            $rules[] = 'min:0';
        } elseif ($this->key === 'currency') {
            $rules[] = 'string';
            $rules[] = 'in:USD,EUR,GBP,CAD,AUD';
        } else {
            $rules[] = 'string';
        }
        
        return $rules;
    }
}
