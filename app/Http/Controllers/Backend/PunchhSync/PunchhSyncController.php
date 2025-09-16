<?php

namespace App\Http\Controllers\Backend\PunchhSync;

use App\Constants\AppConstants;
use App\Http\Controllers\Controller;
use App\Repositories\Backend\PunchhSync\PunchhSyncRepository;
use App\Services\Punchh\PunchhService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PunchhSyncController extends Controller
{
    protected PunchhSyncRepository $punchhSyncRepository;

    /**
     * PunchhSyncController constructor.
     *
     * @param PunchhSyncRepository $punchhSyncRepository
     */
    public function __construct(PunchhSyncRepository $punchhSyncRepository)
    {
        $this->punchhSyncRepository = $punchhSyncRepository;
    }

    /**
     * Sync all users' reward points from Punchh
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function syncAllUsers(Request $request): JsonResponse
    {
        $options = [
            'dry_run' => $request->boolean('dry_run', false),
            'user_id' => $request->integer('user_id'),
            'batch_size' => $request->integer('batch_size', 50)
        ];

        // Validate batch size
        if ($options['batch_size'] < 1 || $options['batch_size'] > 100) {
            return response()->json([
                'status' => AppConstants::STATUS_ERROR,
                'message' => 'Batch size must be between 1 and 100'
            ], AppConstants::HTTP_BAD_REQUEST);
        }

        $result = $this->punchhSyncRepository->syncAllUsersRewardPoints($options);

        $httpStatus = $result['status'] ? AppConstants::HTTP_OK : AppConstants::HTTP_INTERNAL_SERVER_ERROR;

        return response()->json($result, $httpStatus);
    }

    /**
     * Sync specific user's reward points from Punchh
     *
     * @param Request $request
     * @param int $userId
     * @return JsonResponse
     */
    public function syncUser(Request $request, int $userId): JsonResponse
    {
        $dryRun = $request->boolean('dry_run', false);

        $result = $this->punchhSyncRepository->syncUserRewardPoints(
            config('models.models.user.class')::findOrFail($userId),
            $dryRun
        );

        $httpStatus = $result['status'] ? AppConstants::HTTP_OK : AppConstants::HTTP_INTERNAL_SERVER_ERROR;

        return response()->json($result, $httpStatus);
    }

    /**
     * Get sync status
     *
     * @return JsonResponse
     */
    public function getSyncStatus(): JsonResponse
    {
        $result = $this->punchhSyncRepository->getSyncStatus();

        $httpStatus = $result['status'] ? AppConstants::HTTP_OK : AppConstants::HTTP_INTERNAL_SERVER_ERROR;

        return response()->json($result, $httpStatus);
    }

    /**
     * Get user's sync history
     *
     * @param int $userId
     * @param Request $request
     * @return JsonResponse
     */
    public function getUserSyncHistory(int $userId, Request $request): JsonResponse
    {
        $limit = $request->integer('limit', 10);

        // Validate limit
        if ($limit < 1 || $limit > 100) {
            return response()->json([
                'status' => AppConstants::STATUS_ERROR,
                'message' => 'Limit must be between 1 and 100'
            ], AppConstants::HTTP_BAD_REQUEST);
        }

        $result = $this->punchhSyncRepository->getUserSyncHistory($userId, $limit);

        $httpStatus = $result['status'] ? AppConstants::HTTP_OK : AppConstants::HTTP_INTERNAL_SERVER_ERROR;

        return response()->json($result, $httpStatus);
    }

    /**
     * Test Punchh connection
     *
     * @return JsonResponse
     */
    public function testConnection(): JsonResponse
    {
        try {
            $punchhService = app(PunchhService::class);
            $result = $punchhService->testConnection();

            $httpStatus = $result['status'] ? AppConstants::HTTP_OK : AppConstants::HTTP_INTERNAL_SERVER_ERROR;

            return response()->json($result, $httpStatus);

        } catch (\Exception $e) {
            return response()->json([
                'status' => AppConstants::STATUS_ERROR,
                'message' => 'Failed to test connection: ' . $e->getMessage()
            ], AppConstants::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get sync statistics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getSyncStats(Request $request): JsonResponse
    {
        try {
            $dateFilter = $request->get('date_filter', 'last_30_days');
            $startDate = $request->get('start_date');
            $endDate = $request->get('end_date');

            // Build date range query
            $query = config('models.models.loyalty_transaction.class')::where('reference_type', 'punchh_sync');

            if ($startDate && $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            } else {
                switch ($dateFilter) {
                    case 'today':
                        $query->whereDate('created_at', today());
                        break;
                    case 'last_7_days':
                        $query->where('created_at', '>=', now()->subDays(7));
                        break;
                    case 'last_30_days':
                        $query->where('created_at', '>=', now()->subDays(30));
                        break;
                    case 'last_90_days':
                        $query->where('created_at', '>=', now()->subDays(90));
                        break;
                }
            }

            $transactions = $query->get();

            $stats = [
                'total_sync_transactions' => $transactions->count(),
                'total_points_synced' => $transactions->sum('points'),
                'earned_points' => $transactions->where('points', '>', 0)->sum('points'),
                'adjusted_points' => $transactions->where('points', '<', 0)->sum('points'),
                'unique_users_synced' => $transactions->pluck('user_id')->unique()->count(),
                'by_type' => $transactions->groupBy('transaction_type')->map->count(),
                'by_date' => $transactions->groupBy(function ($transaction) {
                    return $transaction->created_at->format('m-d-Y');
                })->map->count(),
                'last_sync' => $transactions->max('created_at')?->format('m-d-Y H:i:s'),
                'first_sync' => $transactions->min('created_at')?->format('m-d-Y H:i:s'),
            ];

            return response()->json([
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $stats,
                'message' => 'Sync statistics retrieved successfully'
            ], AppConstants::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'status' => AppConstants::STATUS_ERROR,
                'message' => 'Failed to get sync statistics: ' . $e->getMessage()
            ], AppConstants::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
