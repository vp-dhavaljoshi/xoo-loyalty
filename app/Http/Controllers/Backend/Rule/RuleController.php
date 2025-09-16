<?php

namespace App\Http\Controllers\Backend\Rule;

use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\Rule\RuleIndexRequest;
use App\Http\Requests\Backend\Rule\RuleStoreRequest;
use App\Http\Requests\Backend\Rule\RuleUpdateRequest;
use App\Repositories\Backend\Rule\RuleRepository;
use Illuminate\Http\JsonResponse;

class RuleController extends Controller
{
    protected RuleRepository $ruleRepository;

    /**
     * RuleController constructor.
     *
     * @param RuleRepository $ruleRepository
     */
    public function __construct(RuleRepository $ruleRepository)
    {
        $this->ruleRepository = $ruleRepository;
    }

    /**
     * Display a listing of rules
     */
    public function index(RuleIndexRequest $request): JsonResponse
    {
        $filters = $request->getValidatedData();
        
        $result = $this->ruleRepository->getPaginatedRules(
            $filters,
            $filters['per_page'],
            $filters['page'],
            $filters['sort_by'],
            $filters['sort_direction']
        );

        if ($result['status']) {
            return response()->json([
                'success' => true,
                'data' => $result['data']['rules'],
                'pagination' => $result['data']['pagination']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message']
        ], 500);
    }

    /**
     * Store a newly created rule
     */
    public function store(RuleStoreRequest $request): JsonResponse
    {
        $data = $request->getValidatedData();
        
        $result = $this->ruleRepository->createRule($data);

        if ($result['status']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => $result['data']
            ], 201);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message']
        ], 500);
    }

    /**
     * Display the specified rule
     */
    public function show(int $id): JsonResponse
    {
        $result = $this->ruleRepository->getRuleById($id);

        if ($result['status']) {
            return response()->json([
                'success' => true,
                'data' => $result['data']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message']
        ], 404);
    }

    /**
     * Update the specified rule
     */
    public function update(RuleUpdateRequest $request, int $id): JsonResponse
    {
        $data = $request->getValidatedData();
        
        $result = $this->ruleRepository->updateRule($id, $data);

        if ($result['status']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => $result['data']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message']
        ], 500);
    }

    /**
     * Remove the specified rule
     */
    public function destroy(int $id): JsonResponse
    {
        $result = $this->ruleRepository->deleteRule($id);

        if ($result['status']) {
            return response()->json([
                'success' => true,
                'message' => $result['message']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message']
        ], 500);
    }

    /**
     * Toggle rule active status
     */
    public function toggleStatus(int $id): JsonResponse
    {
        $result = $this->ruleRepository->toggleRuleStatus($id);

        if ($result['status']) {
            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => $result['data']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message']
        ], 500);
    }

    /**
     * Export rules to CSV
     */
    public function exportCsv(RuleIndexRequest $request): JsonResponse
    {
        $filters = $request->getValidatedData();
        
        $result = $this->ruleRepository->exportRulesToCsv($filters);

        if ($result['status']) {
            return response()->json([
                'success' => true,
                'data' => $result['data'],
                'message' => $result['message']
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => $result['message']
        ], 500);
    }
}
