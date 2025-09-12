<?php

namespace App\Models\User\Traits\Relationships;


trait UserRelationships
{
    /**
     * Get all loyalty permissions for the user
     */
    public function getLoyaltyPermissions(): array
    {
        $permissions = $this->getAllPermissions();
        $loyaltyPermissions = [];
        
        foreach ($permissions as $permission) {
            if (str_starts_with($permission->name, 'loyalty-') || 
                in_array($permission->menu_type, [
                    'loyalty_dashboard', 'loyalty_customers', 'loyalty_rules', 
                    'loyalty_campaigns', 'loyalty_rewards', 'loyalty_settings', 'loyalty_login'
                ])) {
                $loyaltyPermissions[] = $permission->name;
            }
        }
        
        return $loyaltyPermissions;
    }

    /**
     * Check if user has specific loyalty permission
     */
    public function hasLoyaltyPermission(string $permission): bool
    {
        return $this->hasPermissionTo($permission);
    }

    /**
     * Check if user can access loyalty system
     */
    public function canAccessLoyalty(): bool
    {
        return $this->hasPermissionTo('loyalty-login.view');
    }

    /**
     * Get user's loyalty transactions
     */
    public function loyaltyTransactions()
    {
        return $this->hasMany(config('models.models.loyalty_transaction.class'));
    }

    /**
     * Get user's total loyalty points
     */
    public function getTotalLoyaltyPoints(): int
    {
        return config('models.models.loyalty_transaction.class')::getPointsBalance($this->id);
    }

    /**
     * Get user's loyalty tier (placeholder for future implementation)
     */
    public function loyaltyTier()
    {
        // This would be implemented when loyalty tiers system is added
        // return $this->belongsTo(LoyaltyTier::class);
        return null;
    }

    /**
     * Check if user is eligible for loyalty rewards
     */
    public function isEligibleForLoyaltyRewards(): bool
    {
        return $this->is_active && $this->is_email_verified;
    }

    /**
     * Get user's recent loyalty activity
     */
    public function getRecentLoyaltyActivity(int $limit = 10)
    {
        return config('models.models.loyalty_transaction.class')::getUserTransactionHistory($this->id, $limit);
    }
}
