<?php

namespace App\Models\Backend\Rule\Traits\Scopes;

use App\Constants\AppConstants;
use Carbon\Carbon;

trait RuleScopes
{
    /**
     * Scope to filter active rules
     */
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    /**
     * Scope to filter inactive rules
     */
    public function scopeInactive($query)
    {
        return $query->where('active', false);
    }

    /**
     * Scope to filter rules by status
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter rules by type
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to search rules by name or description
     */
    public function scopeSearch($query, string $searchTerm)
    {
        if (empty($searchTerm)) {
            return $query;
        }

        return $query->where(function ($q) use ($searchTerm) {
            $q->where('name', 'like', "%{$searchTerm}%")
              ->orWhere('description', 'like', "%{$searchTerm}%");
        });
    }

    /**
     * Scope to filter rules by priority range
     */
    public function scopeByPriorityRange($query, int $minPriority, int $maxPriority)
    {
        return $query->whereBetween('priority', [$minPriority, $maxPriority]);
    }

    /**
     * Scope to filter high priority rules
     */
    public function scopeHighPriority($query)
    {
        return $query->where('priority', '>=', 80);
    }

    /**
     * Scope to filter medium priority rules
     */
    public function scopeMediumPriority($query)
    {
        return $query->whereBetween('priority', [50, 79]);
    }

    /**
     * Scope to filter low priority rules
     */
    public function scopeLowPriority($query)
    {
        return $query->where('priority', '<', 50);
    }

    /**
     * Scope to filter rules by points earned range
     */
    public function scopeByPointsRange($query, int $minPoints, int $maxPoints)
    {
        return $query->whereBetween('points_earned', [$minPoints, $maxPoints]);
    }

    /**
     * Scope to filter rules by date range
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
                    Carbon::parse($startDate)->startOfDay(),
                    Carbon::parse($endDate)->endOfDay()
                ]);
            } elseif (!empty($startDate)) {
                return $query->where('created_at', '>=', Carbon::parse($startDate)->startOfDay());
            } elseif (!empty($endDate)) {
                return $query->where('created_at', '<=', Carbon::parse($endDate)->endOfDay());
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
     * Scope to filter rules created between dates
     */
    public function scopeCreatedBetween($query, Carbon $startDate, Carbon $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Scope to filter rules by creator
     */
    public function scopeByCreator($query, int $creatorId)
    {
        return $query->where('created_by', $creatorId);
    }

    /**
     * Scope to filter rules by updater
     */
    public function scopeByUpdater($query, int $updaterId)
    {
        return $query->where('updated_by', $updaterId);
    }

    /**
     * Scope to filter lifetime rules
     */
    public function scopeLifetime($query)
    {
        return $query->where('is_lifetime', true);
    }

    /**
     * Scope to filter limited rules
     */
    public function scopeLimited($query)
    {
        return $query->where('is_lifetime', false);
    }

    /**
     * Scope to filter rules with cooldown
     */
    public function scopeWithCooldown($query)
    {
        return $query->whereNotNull('cooldown_period')->where('cooldown_period', '>', 0);
    }

    /**
     * Scope to filter rules without cooldown
     */
    public function scopeWithoutCooldown($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('cooldown_period')->orWhere('cooldown_period', 0);
        });
    }

    /**
     * Scope to filter rules with max applications
     */
    public function scopeWithMaxApplications($query)
    {
        return $query->whereNotNull('max_applications')->where('max_applications', '>', 0);
    }

    /**
     * Scope to filter rules without max applications
     */
    public function scopeWithoutMaxApplications($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('max_applications')->orWhere('max_applications', 0);
        });
    }

    /**
     * Scope to order rules by priority
     */
    public function scopeOrderByPriority($query, string $direction = 'desc')
    {
        return $query->orderBy('priority', $direction);
    }

    /**
     * Scope to order rules by points earned
     */
    public function scopeOrderByPoints($query, string $direction = 'desc')
    {
        return $query->orderBy('points_earned', $direction);
    }

    /**
     * Scope to order rules by name
     */
    public function scopeOrderByName($query, string $direction = 'asc')
    {
        return $query->orderBy('name', $direction);
    }

    /**
     * Scope to order rules by creation date
     */
    public function scopeOrderByCreatedAt($query, string $direction = 'desc')
    {
        return $query->orderBy('created_at', $direction);
    }

    /**
     * Scope to order rules by update date
     */
    public function scopeOrderByUpdatedAt($query, string $direction = 'desc')
    {
        return $query->orderBy('updated_at', $direction);
    }

    /**
     * Scope to get recent rules
     */
    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Scope to get frequently used rules
     */
    public function scopeFrequentlyUsed($query, int $minUsage = 10, int $days = 30)
    {
        return $query->whereHas('loyaltyTransactions', function ($q) use ($days) {
            $q->where('created_at', '>=', now()->subDays($days));
        }, '>=', $minUsage);
    }

    /**
     * Scope to get unused rules
     */
    public function scopeUnused($query)
    {
        return $query->whereDoesntHave('loyaltyTransactions');
    }

    /**
     * Scope to get rules with conditions
     */
    public function scopeWithConditions($query)
    {
        return $query->whereNotNull('condition_objects')->where('condition_objects', '!=', '[]');
    }

    /**
     * Scope to get rules without conditions
     */
    public function scopeWithoutConditions($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('condition_objects')->orWhere('condition_objects', '[]');
        });
    }
}
