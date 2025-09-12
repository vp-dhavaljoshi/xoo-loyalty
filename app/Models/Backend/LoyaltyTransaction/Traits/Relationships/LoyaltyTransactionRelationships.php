<?php

namespace App\Models\Backend\LoyaltyTransaction\Traits\Relationships;

trait LoyaltyTransactionRelationships
{
    /**
     * Get the user that owns the transaction
     */
    public function user()
    {
        return $this->belongsTo(config('models.models.user.class'));
    }

    /**
     * Get user's current points balance
     *
     * @param int $userId
     * @return int
     */
    public static function getPointsBalance(int $userId): int
    {
        return static::where('user_id', $userId)
            ->where('is_active', true)
            ->sum('points');
    }

    /**
     * Get user's points balance at a specific date
     *
     * @param int $userId
     * @param string $date
     * @return int
     */
    public static function getPointsBalanceAtDate(int $userId, string $date): int
    {
        return static::where('user_id', $userId)
            ->where('is_active', true)
            ->where('created_at', '<=', $date)
            ->sum('points');
    }

    /**
     * Get user's transaction history
     *
     * @param int $userId
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getUserTransactionHistory(int $userId, int $limit = 10)
    {
        return static::where('user_id', $userId)
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get user's transactions by type
     *
     * @param int $userId
     * @param string $type
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getUserTransactionsByType(int $userId, string $type)
    {
        return static::where('user_id', $userId)
            ->where('transaction_type', $type)
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get transactions by reference
     *
     * @param string $referenceId
     * @param string $referenceType
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getTransactionsByReference(string $referenceId, string $referenceType)
    {
        return static::where('reference_id', $referenceId)
            ->where('reference_type', $referenceType)
            ->where('is_active', true)
            ->get();
    }

    /**
     * Create a new transaction
     *
     * @param array $data
     * @return static
     */
    public static function createTransaction(array $data): static
    {
        // Calculate points balance after transaction
        $currentBalance = static::getPointsBalance($data['user_id']);
        $data['points_balance_after'] = $currentBalance + $data['points'];

        return static::create($data);
    }

    /**
     * Reverse a transaction
     *
     * @return bool
     */
    public function reverse(): bool
    {
        $this->is_active = false;
        return $this->save();
    }

    /**
     * Get transaction statistics for user
     *
     * @param int $userId
     * @return array
     */
    public static function getUserTransactionStats(int $userId): array
    {
        $transactions = static::where('user_id', $userId)
            ->where('is_active', true)
            ->get();

        return [
            'total_earned' => $transactions->where('points', '>', 0)->sum('points'),
            'total_redeemed' => abs($transactions->where('points', '<', 0)->sum('points')),
            'total_transactions' => $transactions->count(),
            'last_transaction' => $transactions->sortByDesc('created_at')->first(),
            'by_type' => $transactions->groupBy('transaction_type')->map->count(),
        ];
    }
}
