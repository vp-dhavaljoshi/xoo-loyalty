<?php

namespace App\Http\Controllers\Backend\LoyaltyTransaction;

use App\Constants\AppConstants;
use App\Http\Controllers\Controller;
use App\Repositories\Backend\LoyaltyTransaction\LoyaltyTransactionRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LoyaltyTransactionController extends Controller
{
    protected LoyaltyTransactionRepository $loyaltyTransactionRepository;

    /**
     * LoyaltyTransactionController constructor.
     *
     * @param LoyaltyTransactionRepository $loyaltyTransactionRepository
     */
    public function __construct(LoyaltyTransactionRepository $loyaltyTransactionRepository)
    {
        $this->loyaltyTransactionRepository = $loyaltyTransactionRepository;
    }

    /**
     * Get paginated transactions with search and filters
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'user_id',
            'search',
            'transaction_type',
            'date_filter',
            'start_date',
            'end_date',
            'points_filter'
        ]);

        $perPage = (int) $request->get('per_page', AppConstants::DEFAULT_PER_PAGE);
        $page = (int) $request->get('page', AppConstants::DEFAULT_PAGE);
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', AppConstants::SORT_DESC);

        $result = $this->loyaltyTransactionRepository->getPaginatedTransactions(
            $filters,
            $perPage,
            $page,
            $sortBy,
            $sortDirection
        );

        return response()->json($result, $result['status'] ? AppConstants::HTTP_OK : AppConstants::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * Get user's transaction history
     *
     * @param int $userId
     * @param Request $request
     * @return JsonResponse
     */
    public function getUserHistory(int $userId, Request $request): JsonResponse
    {
        $limit = (int) $request->get('limit', 10);
        
        $result = $this->loyaltyTransactionRepository->getUserTransactionHistory($userId, $limit);

        return response()->json($result, $result['status'] ? AppConstants::HTTP_OK : AppConstants::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * Get transaction by ID
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $result = $this->loyaltyTransactionRepository->getTransactionById($id);

        return response()->json($result, $result['status'] ? AppConstants::HTTP_OK : AppConstants::HTTP_NOT_FOUND);
    }

    /**
     * Create a new transaction
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'transaction_type' => 'required|string|in:signup_bonus,product_points,cart_points,redemption,adjustment,expiration,refund,transfer',
            'description' => 'required|string|max:255',
            'points' => 'required|integer',
            'reference_id' => 'nullable|string|max:255',
            'reference_type' => 'nullable|string|max:255',
            'metadata' => 'nullable|array',
            'expires_at' => 'nullable|date|after:now',
        ]);

        $result = $this->loyaltyTransactionRepository->createTransaction($validatedData);

        return response()->json($result, $result['status'] ? AppConstants::HTTP_CREATED : AppConstants::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * Get transaction statistics
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function stats(Request $request): JsonResponse
    {
        $filters = $request->only([
            'user_id',
            'date_filter',
            'start_date',
            'end_date'
        ]);

        $result = $this->loyaltyTransactionRepository->getTransactionStats($filters);

        return response()->json($result, $result['status'] ? AppConstants::HTTP_OK : AppConstants::HTTP_INTERNAL_SERVER_ERROR);
    }
}
