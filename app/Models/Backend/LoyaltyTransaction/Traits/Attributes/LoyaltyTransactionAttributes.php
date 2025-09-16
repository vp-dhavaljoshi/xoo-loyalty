<?php

namespace App\Models\Backend\LoyaltyTransaction\Traits\Attributes;

trait LoyaltyTransactionAttributes
{
    /**
     * Get formatted points with sign
     *
     * @return string
     */
    public function getFormattedPointsAttribute(): string
    {
        return $this->points > 0 ? '+' . $this->points : (string) $this->points;
    }

    /**
     * Get transaction type label
     *
     * @return string
     */
    public function getTransactionTypeLabelAttribute(): string
    {
        return match($this->transaction_type) {
            'signup_bonus' => 'Signup Bonus',
            'product_points' => 'Product Points',
            'cart_points' => 'Cart Points',
            'redemption' => 'Redemption',
            'adjustment' => 'Manual Adjustment',
            'expiration' => 'Points Expired',
            'refund' => 'Refund',
            'transfer' => 'Transfer',
            default => ucfirst(str_replace('_', ' ', $this->transaction_type))
        };
    }

    /**
     * Get transaction type color class
     *
     * @return string
     */
    public function getTransactionTypeColorAttribute(): string
    {
        return match($this->transaction_type) {
            'signup_bonus', 'product_points', 'cart_points', 'refund' => 'bg-green-100 text-green-800',
            'redemption', 'expiration' => 'bg-red-100 text-red-800',
            'adjustment', 'transfer' => 'bg-blue-100 text-blue-800',
            default => 'bg-gray-100 text-gray-800'
        };
    }

    /**
     * Get points color class
     *
     * @return string
     */
    public function getPointsColorAttribute(): string
    {
        return $this->points > 0 ? 'text-green-600' : 'text-red-600';
    }

    /**
     * Check if transaction is expired
     *
     * @return bool
     */
    public function getIsExpiredAttribute(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Get formatted date
     *
     * @return string
     */
    public function getFormattedDateAttribute(): string
    {
        return $this->created_at->format('m-d-Y');
    }

    /**
     * Get formatted time
     *
     * @return string
     */
    public function getFormattedTimeAttribute(): string
    {
        return $this->created_at->format('H:i:s');
    }

    /**
     * Get formatted date and time
     *
     * @return string
     */
    public function getFormattedDateTimeAttribute(): string
    {
        return $this->created_at->format('m-d-Y H:i');
    }

    /**
     * Get formatted date and time with seconds
     *
     * @return string
     */
    public function getFormattedDateTimeWithSecondsAttribute(): string
    {
        return $this->created_at->format('m-d-Y H:i:s');
    }

    /**
     * Get short description (truncated)
     *
     * @param int $length
     * @return string
     */
    public function getShortDescriptionAttribute(int $length = 50): string
    {
        return strlen($this->description) > $length 
            ? substr($this->description, 0, $length) . '...'
            : $this->description;
    }
}
