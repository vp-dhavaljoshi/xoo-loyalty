<?php

namespace App\Models\Backend\Rule\Traits\Relationships;

trait RuleRelationships
{
    /**
     * Get the user who created the rule
     */
    public function creator()
    {
        return $this->belongsTo(config('models.models.user.class'), 'created_by');
    }

    /**
     * Get the user who last updated the rule
     */
    public function updater()
    {
        return $this->belongsTo(config('models.models.user.class'), 'updated_by');
    }

    /**
     * Get all loyalty transactions that used this rule
     */
    public function loyaltyTransactions()
    {
        return $this->hasMany(config('models.models.loyalty_transaction.class'), 'rule_id');
    }

    /**
     * Get the rule's usage count
     */
    public function getUsageCount(): int
    {
        return $this->loyaltyTransactions()->count();
    }

    /**
     * Get the rule's total points awarded
     */
    public function getTotalPointsAwarded(): int
    {
        return $this->loyaltyTransactions()->sum('points');
    }

    /**
     * Get the rule's recent usage (last 30 days)
     */
    public function getRecentUsageCount(): int
    {
        return $this->loyaltyTransactions()
            ->where('created_at', '>=', now()->subDays(30))
            ->count();
    }

    /**
     * Get the rule's usage statistics
     */
    public function getUsageStatistics(): array
    {
        $totalUsage = $this->getUsageCount();
        $recentUsage = $this->getRecentUsageCount();
        $totalPoints = $this->getTotalPointsAwarded();

        return [
            'total_usage' => $totalUsage,
            'recent_usage' => $recentUsage,
            'total_points_awarded' => $totalPoints,
            'average_points_per_usage' => $totalUsage > 0 ? round($totalPoints / $totalUsage) : 0,
            'usage_trend' => $this->getUsageTrend(),
        ];
    }

    /**
     * Get the rule's usage trend (comparing last 30 days to previous 30 days)
     */
    public function getUsageTrend(): string
    {
        $recentUsage = $this->loyaltyTransactions()
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        $previousUsage = $this->loyaltyTransactions()
            ->whereBetween('created_at', [now()->subDays(60), now()->subDays(30)])
            ->count();

        if ($previousUsage == 0) {
            return $recentUsage > 0 ? 'up' : 'stable';
        }

        $change = (($recentUsage - $previousUsage) / $previousUsage) * 100;

        if ($change > 10) {
            return 'up';
        } elseif ($change < -10) {
            return 'down';
        } else {
            return 'stable';
        }
    }

    /**
     * Check if rule has been used recently
     */
    public function hasRecentUsage(): bool
    {
        return $this->getRecentUsageCount() > 0;
    }

    /**
     * Check if rule is being used frequently
     */
    public function isFrequentlyUsed(): bool
    {
        return $this->getRecentUsageCount() >= 10; // 10+ uses in last 30 days
    }

    /**
     * Get the rule's performance score (0-100)
     */
    public function getPerformanceScore(): int
    {
        $usageCount = $this->getUsageCount();
        $recentUsage = $this->getRecentUsageCount();
        $isActive = $this->is_active;

        $score = 0;

        // Base score for being active
        if ($isActive) {
            $score += 20;
        }

        // Score for total usage
        if ($usageCount > 0) {
            $score += min(40, $usageCount * 2);
        }

        // Score for recent usage
        if ($recentUsage > 0) {
            $score += min(40, $recentUsage * 4);
        }

        return min(100, $score);
    }

    /**
     * Get the rule's effectiveness rating
     */
    public function getEffectivenessRating(): string
    {
        $score = $this->getPerformanceScore();

        if ($score >= 80) {
            return 'Excellent';
        } elseif ($score >= 60) {
            return 'Good';
        } elseif ($score >= 40) {
            return 'Average';
        } elseif ($score >= 20) {
            return 'Poor';
        } else {
            return 'Inactive';
        }
    }
}
