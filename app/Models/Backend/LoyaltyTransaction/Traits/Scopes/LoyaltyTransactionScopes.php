<?php

namespace App\Models\Backend\LoyaltyTransaction\Traits\Scopes;

use App\Constants\AppConstants;
use Carbon\Carbon;

trait LoyaltyTransactionScopes
{
    /**
     * Scope a query to only include transactions for a specific user
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to only include transactions of a specific type
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('transaction_type', $type);
    }

    /**
     * Scope a query to only include active transactions
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include expired transactions
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', now());
    }

    /**
     * Scope a query to only include non-expired transactions
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeNotExpired($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>', now());
        });
    }

    /**
     * Scope a query to only include earning transactions (positive points)
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeEarnings($query)
    {
        return $query->where('points', '>', 0);
    }

    /**
     * Scope a query to only include redemption transactions (negative points)
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRedemptions($query)
    {
        return $query->where('points', '<', 0);
    }

    /**
     * Scope a query to search transactions by description
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $search
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where('description', 'like', '%' . $search . '%');
    }

    /**
     * Scope a query to filter by date range
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $dateFilter
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByDateFilter($query, string $dateFilter)
    {
        if ($dateFilter === AppConstants::DATE_FILTER_ALL) {
            return $query;
        }

        $days = AppConstants::getDateFilterDays()[$dateFilter] ?? 30;
        $startDate = Carbon::now()->subDays($days);

        return $query->where('created_at', '>=', $startDate);
    }

    /**
     * Scope a query to filter by custom date range
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $startDate
     * @param string $endDate
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByDateRange($query, string $startDate, string $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Scope a query to order by most recent first
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeLatest($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Scope a query to order by oldest first
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOldest($query)
    {
        return $query->orderBy('created_at', 'asc');
    }

    /**
     * Scope a query to filter by reference
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $referenceId
     * @param string $referenceType
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByReference($query, string $referenceId, string $referenceType)
    {
        return $query->where('reference_id', $referenceId)
                    ->where('reference_type', $referenceType);
    }
}
