<?php

namespace App\Repositories\Backend\LoyaltyTransaction;

use App\Constants\AppConstants;
use Illuminate\Support\Facades\Log;
use Illuminate\Pagination\LengthAwarePaginator;

class LoyaltyTransactionRepository
{
    /**
     * Get paginated transactions with search and filters
     *
     * @param array $filters
     * @param int $perPage
     * @param int $page
     * @param string $sortBy
     * @param string $sortDirection
     * @return array
     */
    public function getPaginatedTransactions(
        array $filters = [], 
        int $perPage = AppConstants::DEFAULT_PER_PAGE, 
        int $page = AppConstants::DEFAULT_PAGE, 
        string $sortBy = 'created_at', 
        string $sortDirection = AppConstants::SORT_DESC): array
    {
        try {
            $query = config('models.models.loyalty_transaction.class')::with('user')->active();

            // Apply user filter
            if (!empty($filters['user_id'])) {
                $query->byUser($filters['user_id']);
            }

            // Apply search filter using scope
            if (!empty($filters['search'])) {
                $query->search($filters['search']);
            }

            // Apply transaction type filter
            if (!empty($filters['transaction_type']) && $filters['transaction_type'] !== 'all') {
                $query->byType($filters['transaction_type']);
            }

            // Apply date filter using scope
            if (!empty($filters['date_filter']) && $filters['date_filter'] !== AppConstants::DATE_FILTER_ALL) {
                $query->byDateFilter($filters['date_filter']);
            }

            // Apply custom date range
            if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
                $query->byDateRange($filters['start_date'], $filters['end_date']);
            }

            // Apply points filter
            if (!empty($filters['points_filter'])) {
                if ($filters['points_filter'] === 'earnings') {
                    $query->earnings();
                } elseif ($filters['points_filter'] === 'redemptions') {
                    $query->redemptions();
                }
            }

            // Apply sorting
            $allowedSortFields = ['created_at', 'points', 'transaction_type', 'description'];
            if (in_array($sortBy, $allowedSortFields) && in_array($sortDirection, AppConstants::getAllowedSortDirections())) {
                $query->orderBy($sortBy, $sortDirection);
            } else {
                // Default sorting
                $query->orderBy('created_at', AppConstants::SORT_DESC);
            }

            // Get paginated results
            $transactions = $query->paginate($perPage, ['*'], 'page', $page);

            // Transform the data to match frontend expectations
            $transformedTransactions = $transactions->getCollection()->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'user_id' => $transaction->user_id,
                    'user_name' => $transaction->user->full_name ?? 'Unknown User',
                    'user_email' => $transaction->user->email ?? '',
                    'transaction_type' => $transaction->transaction_type,
                    'transaction_type_label' => $transaction->transaction_type_label,
                    'transaction_type_color' => $transaction->transaction_type_color,
                    'description' => $transaction->description,
                    'short_description' => $transaction->short_description,
                    'points' => $transaction->points,
                    'formatted_points' => $transaction->formatted_points,
                    'points_color' => $transaction->points_color,
                    'points_balance_after' => $transaction->points_balance_after,
                    'reference_id' => $transaction->reference_id,
                    'reference_type' => $transaction->reference_type,
                    'metadata' => $transaction->metadata,
                    'expires_at' => $transaction->expires_at?->format('m-d-Y H:i:s'),
                    'is_expired' => $transaction->is_expired,
                    'formatted_date' => $transaction->formatted_date,
                    'formatted_time' => $transaction->formatted_time,
                    'formatted_date_time' => $transaction->formatted_date_time,
                    'formatted_date_time_with_seconds' => $transaction->formatted_date_time_with_seconds,
                    'created_at' => $transaction->created_at->format('m-d-Y H:i:s'),
                ];
            });

            // Create a new paginator with transformed data
            $paginatedTransactions = new LengthAwarePaginator(
                $transformedTransactions,
                $transactions->total(),
                $transactions->perPage(),
                $transactions->currentPage(),
                [
                    'path' => request()->url(),
                    'pageName' => 'page',
                ]
            );

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => [
                    'transactions' => $paginatedTransactions->items(),
                    'pagination' => [
                        'current_page' => $paginatedTransactions->currentPage(),
                        'last_page' => $paginatedTransactions->lastPage(),
                        'per_page' => $paginatedTransactions->perPage(),
                        'total' => $paginatedTransactions->total(),
                        'from' => $paginatedTransactions->firstItem(),
                        'to' => $paginatedTransactions->lastItem(),
                        'has_more_pages' => $paginatedTransactions->hasMorePages(),
                    ]
                ],
                'message' => 'Transactions retrieved successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error fetching paginated transactions', [
                'filters' => $filters,
                'per_page' => $perPage,
                'page' => $page,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => [
                    'transactions' => [],
                    'pagination' => [
                        'current_page' => AppConstants::DEFAULT_PAGE,
                        'last_page' => AppConstants::DEFAULT_PAGE,
                        'per_page' => $perPage,
                        'total' => 0,
                        'from' => 0,
                        'to' => 0,
                        'has_more_pages' => false,
                    ]
                ],
                'message' => 'Failed to retrieve transactions'
            ];
        }
    }

    /**
     * Get user's transaction history
     *
     * @param int $userId
     * @param int $limit
     * @return array
     */
    public function getUserTransactionHistory(int $userId, int $limit = 10): array
    {
        try {
            $transactions = config('models.models.loyalty_transaction.class')::byUser($userId)
                ->active()
                ->latest()
                ->limit($limit)
                ->get();

            $transformedTransactions = $transactions->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'transaction_type' => $transaction->transaction_type,
                    'transaction_type_label' => $transaction->transaction_type_label,
                    'transaction_type_color' => $transaction->transaction_type_color,
                    'description' => $transaction->description,
                    'points' => $transaction->points,
                    'formatted_points' => $transaction->formatted_points,
                    'points_color' => $transaction->points_color,
                    'points_balance_after' => $transaction->points_balance_after,
                    'formatted_date' => $transaction->formatted_date,
                    'formatted_date_time' => $transaction->formatted_date_time,
                    'created_at' => $transaction->created_at->format('m-d-Y H:i:s'),
                ];
            });

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $transformedTransactions,
                'message' => 'User transaction history retrieved successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error fetching user transaction history', [
                'user_id' => $userId,
                'limit' => $limit,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => [],
                'message' => 'Failed to retrieve user transaction history'
            ];
        }
    }

    /**
     * Get transaction by ID
     *
     * @param int $id
     * @return array
     */
    public function getTransactionById(int $id): array
    {
        try {
            $transaction = config('models.models.loyalty_transaction.class')::with('user')->find($id);
            
            if (!$transaction) {
                return [
                    'status' => AppConstants::STATUS_ERROR,
                    'data' => null,
                    'message' => 'Transaction not found'
                ];
            }

            $transactionData = [
                'id' => $transaction->id,
                'user_id' => $transaction->user_id,
                'user_name' => $transaction->user->full_name ?? 'Unknown User',
                'user_email' => $transaction->user->email ?? '',
                'transaction_type' => $transaction->transaction_type,
                'transaction_type_label' => $transaction->transaction_type_label,
                'transaction_type_color' => $transaction->transaction_type_color,
                'description' => $transaction->description,
                'points' => $transaction->points,
                'formatted_points' => $transaction->formatted_points,
                'points_color' => $transaction->points_color,
                'points_balance_after' => $transaction->points_balance_after,
                'reference_id' => $transaction->reference_id,
                'reference_type' => $transaction->reference_type,
                'metadata' => $transaction->metadata,
                'expires_at' => $transaction->expires_at?->format('m-d-Y H:i:s'),
                'is_expired' => $transaction->is_expired,
                'is_active' => $transaction->is_active,
                'created_at' => $transaction->created_at->format('m-d-Y H:i:s'),
                'updated_at' => $transaction->updated_at->format('m-d-Y H:i:s'),
            ];

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $transactionData,
                'message' => 'Transaction retrieved successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error fetching transaction by ID', [
                'transaction_id' => $id,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => null,
                'message' => 'Failed to retrieve transaction'
            ];
        }
    }

    /**
     * Create a new transaction
     *
     * @param array $data
     * @return array
     */
    public function createTransaction(array $data): array
    {
        try {
            $transaction = config('models.models.loyalty_transaction.class')::createTransaction($data);

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $transaction,
                'message' => 'Transaction created successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error creating transaction', [
                'data' => $data,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => null,
                'message' => 'Failed to create transaction'
            ];
        }
    }

    /**
     * Get transaction statistics
     *
     * @param array $filters
     * @return array
     */
    public function getTransactionStats(array $filters = []): array
    {
        try {
            $query = config('models.models.loyalty_transaction.class')::active();

            // Apply user filter
            if (!empty($filters['user_id'])) {
                $query->byUser($filters['user_id']);
            }

            // Apply date filter
            if (!empty($filters['date_filter']) && $filters['date_filter'] !== AppConstants::DATE_FILTER_ALL) {
                $query->byDateFilter($filters['date_filter']);
            }

            $transactions = $query->get();

            $stats = [
                'total_transactions' => $transactions->count(),
                'total_earned' => $transactions->where('points', '>', 0)->sum('points'),
                'total_redeemed' => abs($transactions->where('points', '<', 0)->sum('points')),
                'by_type' => $transactions->groupBy('transaction_type')->map->count(),
                'average_points_per_transaction' => $transactions->avg('points'),
                'most_common_type' => $transactions->groupBy('transaction_type')->sortDesc()->keys()->first(),
            ];

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $stats,
                'message' => 'Transaction statistics retrieved successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error fetching transaction statistics', [
                'filters' => $filters,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => [],
                'message' => 'Failed to retrieve transaction statistics'
            ];
        }
    }
}
