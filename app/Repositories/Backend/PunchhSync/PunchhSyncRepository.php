<?php

namespace App\Repositories\Backend\PunchhSync;

use App\Constants\AppConstants;
use App\Models\Backend\LoyaltyTransaction\LoyaltyTransaction;
use App\Models\User\User;
use App\Services\Punchh\PunchhService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PunchhSyncRepository
{
    protected PunchhService $punchhService;

    /**
     * PunchhSyncRepository constructor.
     *
     * @param PunchhService $punchhService
     */
    public function __construct(PunchhService $punchhService)
    {
        $this->punchhService = $punchhService;
    }

    /**
     * Sync all users' reward points from Punchh
     *
     * @param array $options
     * @return array
     */
    public function syncAllUsersRewardPoints(array $options = []): array
    {
        try {
            $dryRun = $options['dry_run'] ?? false;
            $userId = $options['user_id'] ?? null;
            $batchSize = $options['batch_size'] ?? 50;

            Log::info('Starting Punchh sync process', [
                'dry_run' => $dryRun,
                'user_id' => $userId,
                'batch_size' => $batchSize
            ]);

            // Get users to sync
            $users = $this->getUsersToSync($userId);
            
            if ($users->isEmpty()) {
                return [
                    'status' => AppConstants::STATUS_SUCCESS,
                    'data' => [
                        'synced_users' => 0,
                        'total_transactions' => 0,
                        'errors' => []
                    ],
                    'message' => 'No users found to sync'
                ];
            }

            $syncedUsers = 0;
            $totalTransactions = 0;
            $errors = [];

            // Process users in batches
            $users->chunk($batchSize)->each(function ($userBatch) use ($dryRun, &$syncedUsers, &$totalTransactions, &$errors) {
                foreach ($userBatch as $user) {
                    try {
                        $result = $this->syncUserRewardPoints($user, $dryRun);
                        
                        if ($result['status']) {
                            $syncedUsers++;
                            $totalTransactions += $result['data']['transactions_created'] ?? 0;
                        } else {
                            $errors[] = [
                                'user_id' => $user->id,
                                'user_email' => $user->email,
                                'error' => $result['message']
                            ];
                        }
                    } catch (\Exception $e) {
                        Log::error('Error syncing user reward points', [
                            'user_id' => $user->id,
                            'user_email' => $user->email,
                            'error' => $e->getMessage(),
                            'trace' => $e->getTraceAsString()
                        ]);

                        $errors[] = [
                            'user_id' => $user->id,
                            'user_email' => $user->email,
                            'error' => 'Unexpected error: ' . $e->getMessage()
                        ];
                    }
                }
            });

            Log::info('Punchh sync process completed', [
                'synced_users' => $syncedUsers,
                'total_transactions' => $totalTransactions,
                'errors_count' => count($errors)
            ]);

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => [
                    'synced_users' => $syncedUsers,
                    'total_transactions' => $totalTransactions,
                    'errors' => $errors,
                    'total_users_processed' => $users->count()
                ],
                'message' => "Sync completed. {$syncedUsers} users synced, {$totalTransactions} transactions created"
            ];

        } catch (\Exception $exception) {
            Log::error('Error in sync all users reward points', [
                'options' => $options,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => [
                    'synced_users' => 0,
                    'total_transactions' => 0,
                    'errors' => []
                ],
                'message' => 'Failed to sync users: ' . $exception->getMessage()
            ];
        }
    }

    /**
     * Sync specific user's reward points from Punchh
     *
     * @param User $user
     * @param bool $dryRun
     * @return array
     */
    public function syncUserRewardPoints(User $user, bool $dryRun = false): array
    {
        try {
            // Check if user has Punchh token
            if (!$user->punchh_token) {
                return [
                    'status' => AppConstants::STATUS_ERROR,
                    'data' => ['transactions_created' => 0],
                    'message' => 'User does not have Punchh token'
                ];
            }

            // Get user's current reward points from Punchh
            $punchhResponse = $this->punchhService->getUserRewardPoints($user->punchh_token);
            
            if (!$punchhResponse['status']) {
                return [
                    'status' => AppConstants::STATUS_ERROR,
                    'data' => ['transactions_created' => 0],
                    'message' => 'Failed to fetch Punchh data: ' . ($punchhResponse['error'] ?? 'Unknown error')
                ];
            }

            $punchhData = $punchhResponse['data'];
            $punchhPoints = $punchhData['points'] ?? 0;
            $punchhBalance = $punchhData['balance'] ?? 0;

            // Get user's current points balance in our system
            $currentBalance = LoyaltyTransaction::getPointsBalance($user->id);

            // Calculate points difference
            $pointsDifference = $punchhBalance - $currentBalance;

            if ($pointsDifference == 0) {
                return [
                    'status' => AppConstants::STATUS_SUCCESS,
                    'data' => ['transactions_created' => 0],
                    'message' => 'User points are already in sync'
                ];
            }

            if ($dryRun) {
                return [
                    'status' => AppConstants::STATUS_SUCCESS,
                    'data' => [
                        'transactions_created' => 0,
                        'points_difference' => $pointsDifference,
                        'current_balance' => $currentBalance,
                        'punchh_balance' => $punchhBalance
                    ],
                    'message' => 'Dry run: Would sync ' . abs($pointsDifference) . ' points'
                ];
            }

            // Create transaction to sync points
            $transactionData = [
                'user_id' => $user->id,
                'transaction_type' => $pointsDifference > 0 ? 'punchh_sync_earned' : 'punchh_sync_adjustment',
                'description' => $pointsDifference > 0 
                    ? "Punchh sync: Earned {$pointsDifference} points from Punchh system"
                    : "Punchh sync: Adjusted {$pointsDifference} points to match Punchh system",
                'points' => $pointsDifference,
                'reference_id' => 'punchh_sync_' . time(),
                'reference_type' => 'punchh_sync',
                'metadata' => [
                    'punchh_points' => $punchhPoints,
                    'punchh_balance' => $punchhBalance,
                    'previous_balance' => $currentBalance,
                    'sync_timestamp' => now()->toISOString(),
                    'punchh_data' => $punchhData
                ]
            ];

            $transaction = LoyaltyTransaction::createTransaction($transactionData);

            Log::info('User reward points synced successfully', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'points_difference' => $pointsDifference,
                'transaction_id' => $transaction->id
            ]);

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => [
                    'transactions_created' => 1,
                    'points_difference' => $pointsDifference,
                    'transaction_id' => $transaction->id
                ],
                'message' => 'User reward points synced successfully'
            ];

        } catch (\Exception $exception) {
            Log::error('Error syncing user reward points', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => ['transactions_created' => 0],
                'message' => 'Failed to sync user: ' . $exception->getMessage()
            ];
        }
    }

    /**
     * Get users that need to be synced
     *
     * @param int|null $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    protected function getUsersToSync(?int $userId = null)
    {
        $query = User::whereNotNull('punchh_token')
            ->where('status', 'active');

        if ($userId) {
            $query->where('id', $userId);
        }

        return $query->get();
    }

    /**
     * Get sync status for all users
     *
     * @return array
     */
    public function getSyncStatus(): array
    {
        try {
            $users = $this->getUsersToSync();
            
            $statusData = [
                'total_users' => $users->count(),
                'users_with_punchh_token' => $users->count(),
                'last_sync_check' => now()->toISOString(),
                'punchh_service_status' => $this->punchhService->isConfigured()
            ];

            // Test Punchh connection
            $connectionTest = $this->punchhService->testConnection();
            $statusData['punchh_connection_status'] = $connectionTest['status'];
            $statusData['punchh_connection_message'] = $connectionTest['message'] ?? '';

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $statusData,
                'message' => 'Sync status retrieved successfully'
            ];

        } catch (\Exception $exception) {
            Log::error('Error getting sync status', [
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => [],
                'message' => 'Failed to get sync status: ' . $exception->getMessage()
            ];
        }
    }

    /**
     * Get user's sync history
     *
     * @param int $userId
     * @param int $limit
     * @return array
     */
    public function getUserSyncHistory(int $userId, int $limit = 10): array
    {
        try {
            $transactions = LoyaltyTransaction::where('user_id', $userId)
                ->where('reference_type', 'punchh_sync')
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();

            $transformedTransactions = $transactions->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'transaction_type' => $transaction->transaction_type,
                    'description' => $transaction->description,
                    'points' => $transaction->points,
                    'points_balance_after' => $transaction->points_balance_after,
                    'metadata' => $transaction->metadata,
                    'created_at' => $transaction->created_at->format('m-d-Y H:i:s'),
                ];
            });

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $transformedTransactions,
                'message' => 'User sync history retrieved successfully'
            ];

        } catch (\Exception $exception) {
            Log::error('Error getting user sync history', [
                'user_id' => $userId,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => [],
                'message' => 'Failed to get user sync history: ' . $exception->getMessage()
            ];
        }
    }
}

