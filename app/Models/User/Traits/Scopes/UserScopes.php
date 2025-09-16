<?php

namespace App\Models\User\Traits\Scopes;

use App\Constants\AppConstants;
use Carbon\Carbon;

trait UserScopes
{
    /**
     * Scope to filter active users
     */
    public function scopeActive($query)
    {
        return $query->where('status', 1);
    }

    /**
     * Scope to filter inactive users
     */
    public function scopeInactive($query)
    {
        return $query->where('status', 0);
    }

    /**
     * Scope to filter users by status
     */
    public function scopeByStatus($query, string $status)
    {
        if ($status === AppConstants::USER_STATUS_ACTIVE) {
            return $query->active();
        } elseif ($status === AppConstants::USER_STATUS_INACTIVE) {
            return $query->inactive();
        }
        
        return $query;
    }

    /**
     * Scope to search users by name or email
     */
    public function scopeSearch($query, string $searchTerm)
    {
        if (empty($searchTerm)) {
            return $query;
        }

        return $query->where(function ($q) use ($searchTerm) {
            $q->where('first_name', 'like', "%{$searchTerm}%")
              ->orWhere('last_name', 'like', "%{$searchTerm}%")
              ->orWhere('email', 'like', "%{$searchTerm}%");
        });
    }

    /**
     * Scope to filter users by date range
     */
    public function scopeByDateFilter($query, string $dateFilter, string $startDate = '', string $endDate = '')
    {
        if ($dateFilter === AppConstants::DATE_FILTER_ALL) {
            return $query;
        }

        // Handle custom date range
        if ($dateFilter === AppConstants::DATE_FILTER_CUSTOM) {
            if (!empty($startDate) && !empty($endDate)) {
                return $query->whereBetween('created_at', [
                    \Carbon\Carbon::parse($startDate)->startOfDay(),
                    \Carbon\Carbon::parse($endDate)->endOfDay()
                ]);
            } elseif (!empty($startDate)) {
                return $query->where('created_at', '>=', \Carbon\Carbon::parse($startDate)->startOfDay());
            } elseif (!empty($endDate)) {
                return $query->where('created_at', '<=', \Carbon\Carbon::parse($endDate)->endOfDay());
            }
            return $query;
        }

        $now = now();
        
        switch ($dateFilter) {
            case AppConstants::DATE_FILTER_LAST_30_DAYS:
                return $query->where('created_at', '>=', $now->subDays(AppConstants::getDateFilterDays()[AppConstants::DATE_FILTER_LAST_30_DAYS]));
            case AppConstants::DATE_FILTER_LAST_90_DAYS:
                return $query->where('created_at', '>=', $now->subDays(AppConstants::getDateFilterDays()[AppConstants::DATE_FILTER_LAST_90_DAYS]));
            case AppConstants::DATE_FILTER_LAST_YEAR:
                return $query->where('created_at', '>=', $now->subDays(AppConstants::getDateFilterDays()[AppConstants::DATE_FILTER_LAST_YEAR]));
        }
        
        return $query;
    }

    /**
     * Scope to filter users created between dates
     */
    public function scopeCreatedBetween($query, Carbon $startDate, Carbon $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Scope to filter users with verified email
     */
    public function scopeEmailVerified($query)
    {
        return $query->whereNotNull('email_verified_at');
    }

    /**
     * Scope to filter users with unverified email
     */
    public function scopeEmailUnverified($query)
    {
        return $query->whereNull('email_verified_at');
    }

    /**
     * Scope to filter users with phone number
     */
    public function scopeWithPhone($query)
    {
        return $query->whereNotNull('phone')->where('phone', '!=', '');
    }

    /**
     * Scope to filter users without phone number
     */
    public function scopeWithoutPhone($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('phone')->orWhere('phone', '');
        });
    }

    /**
     * Scope to order users by name
     */
    public function scopeOrderByName($query, string $direction = 'asc')
    {
        return $query->orderBy('first_name', $direction)->orderBy('last_name', $direction);
    }

    /**
     * Scope to order users by email
     */
    public function scopeOrderByEmail($query, string $direction = 'asc')
    {
        return $query->orderBy('email', $direction);
    }

    /**
     * Scope to order users by signup date
     */
    public function scopeOrderBySignupDate($query, string $direction = 'desc')
    {
        return $query->orderBy('created_at', $direction);
    }

    /**
     * Scope to get recent users
     */
    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Scope to get users with loyalty points (placeholder for future implementation)
     */
    public function scopeWithLoyaltyPoints($query)
    {
        // This would be implemented when loyalty points system is added
        // return $query->whereHas('loyaltyPoints');
        return $query;
    }

    /**
     * Scope to get users eligible for loyalty rewards
     */
    public function scopeEligibleForLoyalty($query)
    {
        return $query->active()->emailVerified();
    }
}
