<?php

namespace App\Repositories\Backend\User;

use App\Constants\AppConstants;
use Illuminate\Support\Facades\Log;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository
{
    /**
     * Get paginated users with search and filters
     *
     * @param array $filters
     * @param int $perPage
     * @param int $page
     * @param string $sortBy
     * @param string $sortDirection
     * @return array
     */
    public function getPaginatedUsers(
        array $filters = [], 
        int $perPage = AppConstants::DEFAULT_PER_PAGE, 
        int $page = AppConstants::DEFAULT_PAGE, 
        string $sortBy = AppConstants::SORT_FIELD_CREATED_AT, 
        string $sortDirection = AppConstants::SORT_DESC): array
    {
        try {
            $query = config('models.models.user.class')::query();

            // Apply search filter using scope
            if (!empty($filters['search'])) {
                $query->search($filters['search']);
            }

            // Apply status filter using scope
            if (!empty($filters['status']) && $filters['status'] !== AppConstants::USER_STATUS_ALL) {
                $query->byStatus($filters['status']);
            }

            // Apply date filter using scope
            if (!empty($filters['date_filter']) && $filters['date_filter'] !== AppConstants::DATE_FILTER_ALL) {
                $query->byDateFilter(
                    $filters['date_filter'],
                    $filters['start_date'] ?? '',
                    $filters['end_date'] ?? ''
                );
            }

            // Apply sorting
            if (in_array($sortBy, AppConstants::getAllowedSortFields()) && in_array($sortDirection, AppConstants::getAllowedSortDirections())) {
                $query->orderBy($sortBy, $sortDirection);
            } else {
                // Default sorting
                $query->orderBy(AppConstants::SORT_FIELD_CREATED_AT, AppConstants::SORT_DESC);
            }

            // Get paginated results
            $users = $query->paginate($perPage, ['*'], 'page', $page);

            // Transform the data to match frontend expectations
            $transformedUsers = $users->getCollection()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->full_name,
                    'email' => $user->email,
                    'status' => $user->status == 1 ? AppConstants::USER_STATUS_ACTIVE : AppConstants::USER_STATUS_INACTIVE,
                    'totalPoints' => $this->getUserTotalPoints($user->id),
                    'signupDate' => $user->created_at->format('m-d-Y'),
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'punchh_token' => $user->punchh_token,
                    'punchh_sync_status' => $this->getUserPunchhSyncStatus($user->id),
                    'last_punchh_sync' => $this->getUserLastPunchhSync($user->id),
                ];
            });

            // Create a new paginator with transformed data
            $paginatedUsers = new LengthAwarePaginator(
                $transformedUsers,
                $users->total(),
                $users->perPage(),
                $users->currentPage(),
                [
                    'path' => request()->url(),
                    'pageName' => 'page',
                ]
            );

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => [
                    'users' => $paginatedUsers->items(),
                    'pagination' => [
                        'current_page' => $paginatedUsers->currentPage(),
                        'last_page' => $paginatedUsers->lastPage(),
                        'per_page' => $paginatedUsers->perPage(),
                        'total' => $paginatedUsers->total(),
                        'from' => $paginatedUsers->firstItem(),
                        'to' => $paginatedUsers->lastItem(),
                        'has_more_pages' => $paginatedUsers->hasMorePages(),
                    ]
                ],
                'message' => AppConstants::MESSAGE_USERS_RETRIEVED_SUCCESS
            ];
        } catch (\Exception $exception) {
            Log::error('Error fetching paginated users', [
                'filters' => $filters,
                'per_page' => $perPage,
                'page' => $page,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => [
                    'users' => [],
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
                'message' => AppConstants::MESSAGE_USERS_RETRIEVED_FAILED
            ];
        }
    }

    /**
     * Get user by ID
     *
     * @param int $id
     * @return array
     */
    public function getUserById(int $id): array
    {
        try {
            $user = config('models.models.user.class')::find($id);
            
            if (!$user) {
                return [
                    'status' => AppConstants::STATUS_ERROR,
                    'data' => null,
                    'message' => AppConstants::MESSAGE_USER_NOT_FOUND
                ];
            }

            $userData = [
                'id' => $user->id,
                'name' => $user->full_name,
                'email' => $user->email,
                'status' => $user->status == 1 ? AppConstants::USER_STATUS_ACTIVE : AppConstants::USER_STATUS_INACTIVE,
                'totalPoints' => $this->getUserTotalPoints($user->id),
                'signupDate' => $user->created_at->format('Y-m-d'),
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'phone' => $user->phone,
                'country_code' => $user->country_code,
                'email_verified_at' => $user->email_verified_at,
            ];

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $userData,
                'message' => AppConstants::MESSAGE_USER_RETRIEVED_SUCCESS
            ];
        } catch (\Exception $exception) {
            Log::error('Error fetching user by ID', [
                'user_id' => $id,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => null,
                'message' => AppConstants::MESSAGE_USER_RETRIEVED_FAILED
            ];
        }
    }

    /**
     * Get user's total points
     *
     * @param int $userId
     * @return int
     */
    private function getUserTotalPoints(int $userId): int
    {
        return config('models.models.loyalty_transaction.class')::getPointsBalance($userId);
    }

    /**
     * Get user's Punchh sync status
     *
     * @param int $userId
     * @return string
     */
    private function getUserPunchhSyncStatus(int $userId): string
    {
        $user = config('models.models.user.class')::find($userId);
        
        if (!$user || !$user->punchh_token) {
            return 'not_connected';
        }

        // Check if user has recent sync transactions
        $lastSyncTransaction = config('models.models.loyalty_transaction.class')::where('user_id', $userId)
            ->where('reference_type', 'punchh_sync')
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$lastSyncTransaction) {
            return 'pending';
        }

        // Check if sync was successful (no error in metadata)
        $metadata = $lastSyncTransaction->metadata ?? [];
        if (isset($metadata['error'])) {
            return 'error';
        }

        return 'synced';
    }

    /**
     * Get user's last Punchh sync date
     *
     * @param int $userId
     * @return string|null
     */
    private function getUserLastPunchhSync(int $userId): ?string
    {
        $lastSyncTransaction = config('models.models.loyalty_transaction.class')::where('user_id', $userId)
            ->where('reference_type', 'punchh_sync')
            ->orderBy('created_at', 'desc')
            ->first();

        return $lastSyncTransaction ? $lastSyncTransaction->created_at->toISOString() : null;
    }

    /**
     * Export users to CSV format
     *
     * @param array $filters
     * @return array
     */
    public function exportUsersToCsv(array $filters = []): array
    {
        try {
            $query = config('models.models.user.class')::query();

            // Apply same filters as getPaginatedUsers using scopes
            if (!empty($filters['search'])) {
                $query->search($filters['search']);
            }

            if (!empty($filters['status']) && $filters['status'] !== AppConstants::USER_STATUS_ALL) {
                $query->byStatus($filters['status']);
            }

            if (!empty($filters['date_filter']) && $filters['date_filter'] !== AppConstants::DATE_FILTER_ALL) {
                $query->byDateFilter(
                    $filters['date_filter'],
                    $filters['start_date'] ?? '',
                    $filters['end_date'] ?? ''
                );
            }

            $users = $query->orderBy(AppConstants::SORT_FIELD_CREATED_AT, AppConstants::SORT_DESC)->get();

            $csvData = [];
            $csvData[] = ['Name', 'Email', 'Status', 'Total Points', 'Signup Date', 'Phone'];

            foreach ($users as $user) {
                $csvData[] = [
                    $user->full_name,
                    $user->email,
                    $user->status == 1 ? AppConstants::USER_STATUS_ACTIVE : AppConstants::USER_STATUS_INACTIVE,
                    $this->getUserTotalPoints($user->id),
                    $user->created_at->format('m-d-Y'),
                    $user->phone ?? ''
                ];
            }

            // Convert array to CSV string
            $csvString = '';
            foreach ($csvData as $row) {
                $escapedRow = array_map(function($field) {
                    // Escape fields that contain commas, quotes, or newlines
                    $field = str_replace('"', '""', $field);
                    if (strpos($field, ',') !== false || strpos($field, '"') !== false || strpos($field, "\n") !== false) {
                        return '"' . $field . '"';
                    }
                    return $field;
                }, $row);
                $csvString .= implode(',', $escapedRow) . "\n";
            }

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $csvString,
                'message' => AppConstants::MESSAGE_CSV_GENERATED_SUCCESS
            ];
        } catch (\Exception $exception) {
            Log::error('Error exporting users to CSV', [
                'filters' => $filters,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => [],
                'message' => AppConstants::MESSAGE_CSV_EXPORT_FAILED
            ];
        }
    }
}
