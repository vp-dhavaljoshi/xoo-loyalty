<?php

namespace App\Http\Controllers\Backend\User;

use App\Constants\AppConstants;
use App\Http\Controllers\Controller;
use App\Http\Requests\Backend\User\UserIndexRequest;
use App\Http\Requests\Backend\User\UserExportCsvRequest;
use App\Repositories\Backend\User\UserRepository;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    protected UserRepository $userRepository;

    /**
     * UserController constructor.
     *
     * @param UserRepository $userRepository
     */
    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Display the customers page
     *
     * @return Response
     */
    public function customers(): Response
    {
        return Inertia::render('Customers');
    }

    /**
     * Get paginated users with search and filters
     *
     * @param UserIndexRequest $request
     * @return JsonResponse
     */
    public function index(UserIndexRequest $request): JsonResponse
    {
        $validatedData = $request->getValidatedData();
        $filters = $request->getFilters();

        $result = $this->userRepository->getPaginatedUsers(
            $filters,
            $validatedData['per_page'],
            $validatedData['page'],
            $validatedData['sort_by'],
            $validatedData['sort_direction']
        );

        return response()->json($result, $result['status'] ? AppConstants::HTTP_OK : AppConstants::HTTP_INTERNAL_SERVER_ERROR);
    }

 

    /**
     * Get user by ID
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $result = $this->userRepository->getUserById($id);

        return response()->json($result, $result['status'] ? AppConstants::HTTP_OK : AppConstants::HTTP_NOT_FOUND);
    }

    /**
     * Export users to CSV
     *
     * @param UserExportCsvRequest $request
     * @return \Illuminate\Http\Response|JsonResponse
     */
    public function exportCsv(UserExportCsvRequest $request)
    {
        $filters = $request->getFilters();
        $result = $this->userRepository->exportUsersToCsv($filters);

        if ($result['status']) {
            $filename = AppConstants::CSV_FILENAME_PREFIX . date('Y-m-d') . AppConstants::CSV_FILENAME_EXTENSION;
            
            return response($result['data'])
                ->header('Content-Type', AppConstants::CSV_CONTENT_TYPE)
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
        }

        return response()->json($result, AppConstants::HTTP_INTERNAL_SERVER_ERROR);
    }
}
