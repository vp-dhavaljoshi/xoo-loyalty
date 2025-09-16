<?php

namespace App\Repositories\Backend\Rule;

use App\Constants\AppConstants;
use Illuminate\Support\Facades\Log;
use Illuminate\Pagination\LengthAwarePaginator;

class RuleRepository
{
    /**
     * Get paginated rules with search and filters
     *
     * @param array $filters
     * @param int $perPage
     * @param int $page
     * @param string $sortBy
     * @param string $sortDirection
     * @return array
     */
    public function getPaginatedRules(
        array $filters = [], 
        int $perPage = AppConstants::DEFAULT_PER_PAGE, 
        int $page = AppConstants::DEFAULT_PAGE, 
        string $sortBy = AppConstants::SORT_FIELD_CREATED_AT, 
        string $sortDirection = AppConstants::SORT_DESC): array
    {
        try {
            $query = config('models.models.rule.class')::with(['creator', 'updater']);

            // Apply search filter using scope
            if (!empty($filters['search'])) {
                $query->search($filters['search']);
            }

            // Apply status filter using scope
            if (!empty($filters['status']) && $filters['status'] !== 'all') {
                $query->byStatus($filters['status']);
            }

            // Apply active filter
            if (isset($filters['active'])) {
                $query->where('active', $filters['active']);
            }

            // Apply type filter using scope
            if (!empty($filters['type']) && $filters['type'] !== 'all') {
                $query->byType($filters['type']);
            }

            // Apply priority filter
            if (!empty($filters['priority_min']) || !empty($filters['priority_max'])) {
                $minPriority = $filters['priority_min'] ?? 0;
                $maxPriority = $filters['priority_max'] ?? 100;
                $query->byPriorityRange($minPriority, $maxPriority);
            }

            // Apply points filter
            if (!empty($filters['points_min']) || !empty($filters['points_max'])) {
                $minPoints = $filters['points_min'] ?? 0;
                $maxPoints = $filters['points_max'] ?? 999999;
                $query->byPointsRange($minPoints, $maxPoints);
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
            $allowedSortFields = ['name', 'status', 'priority', 'points_earned', 'created_at', 'updated_at'];
            if (in_array($sortBy, $allowedSortFields) && in_array($sortDirection, AppConstants::getAllowedSortDirections())) {
                $query->orderBy($sortBy, $sortDirection);
            } else {
                // Default sorting
                $query->orderBy('priority', 'desc')->orderBy('created_at', 'desc');
            }

            // Get paginated results
            $rules = $query->paginate($perPage, ['*'], 'page', $page);

            // Transform the data to match frontend expectations
            $transformedRules = $rules->getCollection()->map(function ($rule) {
                return [
                    'id' => $rule->id,
                    'name' => $rule->name,
                    'description' => $rule->description,
                    'status' => $rule->status,
                    'status_text' => $rule->status_text,
                    'active' => $rule->active,
                    'is_active' => $rule->is_active,
                    'points_earned' => $rule->points_earned,
                    'effective_points' => $rule->effective_points,
                    'priority' => $rule->priority,
                    'priority_level' => $rule->priority_level,
                    'reward_multiplier' => $rule->reward_multiplier,
                    'type' => $rule->type,
                    'type_text' => $rule->type_text,
                    'is_lifetime' => $rule->is_lifetime,
                    'lifetime_status' => $rule->lifetime_status,
                    'max_applications' => $rule->max_applications,
                    'max_applications_text' => $rule->max_applications_text,
                    'cooldown_period' => $rule->cooldown_period,
                    'cooldown_text' => $rule->cooldown_text,
                    'conditions' => $rule->conditions,
                    'formatted_conditions' => $rule->formatted_conditions,
                    'condition_count' => $rule->condition_count,
                    'created_at' => $rule->created_at->format('Y-m-d H:i:s'),
                    'created_at_human' => $rule->created_at_human,
                    'updated_at' => $rule->updated_at->format('Y-m-d H:i:s'),
                    'updated_at_human' => $rule->updated_at_human,
                    'creator' => $rule->creator ? [
                        'id' => $rule->creator->id,
                        'name' => $rule->creator->full_name,
                        'email' => $rule->creator->email,
                    ] : null,
                    'updater' => $rule->updater ? [
                        'id' => $rule->updater->id,
                        'name' => $rule->updater->full_name,
                        'email' => $rule->updater->email,
                    ] : null,
                    'usage_count' => $rule->getUsageCount(),
                    'total_points_awarded' => $rule->getTotalPointsAwarded(),
                    'recent_usage_count' => $rule->getRecentUsageCount(),
                    'performance_score' => $rule->getPerformanceScore(),
                    'effectiveness_rating' => $rule->getEffectivenessRating(),
                ];
            });

            // Create a new paginator with transformed data
            $paginatedRules = new LengthAwarePaginator(
                $transformedRules,
                $rules->total(),
                $rules->perPage(),
                $rules->currentPage(),
                [
                    'path' => request()->url(),
                    'pageName' => 'page',
                ]
            );

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => [
                    'rules' => $paginatedRules->items(),
                    'pagination' => [
                        'current_page' => $paginatedRules->currentPage(),
                        'last_page' => $paginatedRules->lastPage(),
                        'per_page' => $paginatedRules->perPage(),
                        'total' => $paginatedRules->total(),
                        'from' => $paginatedRules->firstItem(),
                        'to' => $paginatedRules->lastItem(),
                        'has_more_pages' => $paginatedRules->hasMorePages(),
                    ]
                ],
                'message' => 'Rules retrieved successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error fetching paginated rules', [
                'filters' => $filters,
                'per_page' => $perPage,
                'page' => $page,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => [
                    'rules' => [],
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
                'message' => 'Failed to retrieve rules'
            ];
        }
    }

    /**
     * Get rule by ID
     *
     * @param int $id
     * @return array
     */
    public function getRuleById(int $id): array
    {
        try {
            $rule = config('models.models.rule.class')::with(['creator', 'updater'])->find($id);
            
            if (!$rule) {
                return [
                    'status' => AppConstants::STATUS_ERROR,
                    'data' => null,
                    'message' => 'Rule not found'
                ];
            }

            $ruleData = [
                'id' => $rule->id,
                'name' => $rule->name,
                'description' => $rule->description,
                'status' => $rule->status,
                'status_text' => $rule->status_text,
                'active' => $rule->active,
                'is_active' => $rule->is_active,
                'points_earned' => $rule->points_earned,
                'effective_points' => $rule->effective_points,
                'priority' => $rule->priority,
                'priority_level' => $rule->priority_level,
                'reward_multiplier' => $rule->reward_multiplier,
                'type' => $rule->type,
                'type_text' => $rule->type_text,
                'is_lifetime' => $rule->is_lifetime,
                'lifetime_status' => $rule->lifetime_status,
                'max_applications' => $rule->max_applications,
                'max_applications_text' => $rule->max_applications_text,
                'cooldown_period' => $rule->cooldown_period,
                'cooldown_text' => $rule->cooldown_text,
                'conditions' => $rule->conditions,
                'condition_objects' => $rule->condition_objects,
                'formatted_conditions' => $rule->formatted_conditions,
                'condition_count' => $rule->condition_count,
                'created_at' => $rule->created_at->format('Y-m-d H:i:s'),
                'created_at_human' => $rule->created_at_human,
                'updated_at' => $rule->updated_at->format('Y-m-d H:i:s'),
                'updated_at_human' => $rule->updated_at_human,
                'creator' => $rule->creator ? [
                    'id' => $rule->creator->id,
                    'name' => $rule->creator->full_name,
                    'email' => $rule->creator->email,
                ] : null,
                'updater' => $rule->updater ? [
                    'id' => $rule->updater->id,
                    'name' => $rule->updater->full_name,
                    'email' => $rule->updater->email,
                ] : null,
                'usage_statistics' => $rule->getUsageStatistics(),
            ];

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $ruleData,
                'message' => 'Rule retrieved successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error fetching rule by ID', [
                'rule_id' => $id,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => null,
                'message' => 'Failed to retrieve rule'
            ];
        }
    }

    /**
     * Create a new rule
     *
     * @param array $data
     * @return array
     */
    public function createRule(array $data): array
    {
        try {
            // Convert conditions to readable string
            $conditionString = collect($data['conditions'])->map(function ($condition, $index) {
                $prefix = $index > 0 && isset($condition['connector']) ? " {$condition['connector']} " : '';
                return $prefix . $condition['field'] . ' ' . $condition['operator'] . ' ' . $condition['value'];
            })->join('');

            $ruleData = [
                'name' => $data['name'],
                'description' => $data['description'] ?? '',
                'points_earned' => $data['points_earned'],
                'priority' => $data['priority'],
                'reward_multiplier' => $data['reward_multiplier'],
                'active' => $data['active'] ?? true,
                'conditions' => $conditionString,
                'condition_objects' => $data['conditions'],
                'type' => $data['type'] ?? 'purchase',
                'status' => ($data['active'] ?? true) ? 'active' : 'inactive',
                'is_lifetime' => $data['is_lifetime'] ?? true,
                'max_applications' => $data['max_applications'] ?? null,
                'cooldown_period' => $data['cooldown_period'] ?? null,
                'created_by' => $data['created_by'],
                'updated_by' => $data['created_by']
            ];

            $rule = config('models.models.rule.class')::create($ruleData);

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $rule->load(['creator', 'updater']),
                'message' => 'Rule created successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error creating rule', [
                'data' => $data,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => null,
                'message' => 'Failed to create rule'
            ];
        }
    }

    /**
     * Update an existing rule
     *
     * @param int $id
     * @param array $data
     * @return array
     */
    public function updateRule(int $id, array $data): array
    {
        try {
            $rule = config('models.models.rule.class')::find($id);
            
            if (!$rule) {
                return [
                    'status' => AppConstants::STATUS_ERROR,
                    'data' => null,
                    'message' => 'Rule not found'
                ];
            }

            // Update condition string if conditions are provided
            if (isset($data['conditions'])) {
                $conditionString = collect($data['conditions'])->map(function ($condition, $index) {
                    $prefix = $index > 0 && isset($condition['connector']) ? " {$condition['connector']} " : '';
                    return $prefix . $condition['field'] . ' ' . $condition['operator'] . ' ' . $condition['value'];
                })->join('');

                $data['conditions'] = $conditionString;
                $data['condition_objects'] = $data['conditions'];
            }

            // Update status based on active status
            if (isset($data['active'])) {
                $data['status'] = $data['active'] ? 'active' : 'inactive';
            }

            $rule->update($data);

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $rule->load(['creator', 'updater']),
                'message' => 'Rule updated successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error updating rule', [
                'rule_id' => $id,
                'data' => $data,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => null,
                'message' => 'Failed to update rule'
            ];
        }
    }

    /**
     * Delete a rule
     *
     * @param int $id
     * @return array
     */
    public function deleteRule(int $id): array
    {
        try {
            $rule = config('models.models.rule.class')::find($id);
            
            if (!$rule) {
                return [
                    'status' => AppConstants::STATUS_ERROR,
                    'data' => null,
                    'message' => 'Rule not found'
                ];
            }

            $rule->delete();

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => null,
                'message' => 'Rule deleted successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error deleting rule', [
                'rule_id' => $id,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => null,
                'message' => 'Failed to delete rule'
            ];
        }
    }

    /**
     * Toggle rule active status
     *
     * @param int $id
     * @return array
     */
    public function toggleRuleStatus(int $id): array
    {
        try {
            $rule = config('models.models.rule.class')::find($id);
            
            if (!$rule) {
                return [
                    'status' => AppConstants::STATUS_ERROR,
                    'data' => null,
                    'message' => 'Rule not found'
                ];
            }

            $rule->update([
                'active' => !$rule->active,
                'status' => !$rule->active ? 'active' : 'inactive',
                'updated_by' => auth()->id()
            ]);

            return [
                'status' => AppConstants::STATUS_SUCCESS,
                'data' => $rule,
                'message' => 'Rule status updated successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error toggling rule status', [
                'rule_id' => $id,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => null,
                'message' => 'Failed to update rule status'
            ];
        }
    }

    /**
     * Export rules to CSV format
     *
     * @param array $filters
     * @return array
     */
    public function exportRulesToCsv(array $filters = []): array
    {
        try {
            $query = config('models.models.rule.class')::with(['creator', 'updater']);

            // Apply same filters as getPaginatedRules using scopes
            if (!empty($filters['search'])) {
                $query->search($filters['search']);
            }

            if (!empty($filters['status']) && $filters['status'] !== 'all') {
                $query->byStatus($filters['status']);
            }

            if (isset($filters['active'])) {
                $query->where('active', $filters['active']);
            }

            if (!empty($filters['type']) && $filters['type'] !== 'all') {
                $query->byType($filters['type']);
            }

            if (!empty($filters['date_filter']) && $filters['date_filter'] !== AppConstants::DATE_FILTER_ALL) {
                $query->byDateFilter(
                    $filters['date_filter'],
                    $filters['start_date'] ?? '',
                    $filters['end_date'] ?? ''
                );
            }

            $rules = $query->orderBy('priority', 'desc')->orderBy('created_at', 'desc')->get();

            $csvData = [];
            $csvData[] = ['Name', 'Description', 'Status', 'Active', 'Points Earned', 'Priority', 'Type', 'Created At', 'Creator'];

            foreach ($rules as $rule) {
                $csvData[] = [
                    $rule->name,
                    $rule->description,
                    $rule->status_text,
                    $rule->active ? 'Yes' : 'No',
                    $rule->points_earned,
                    $rule->priority,
                    $rule->type_text,
                    $rule->created_at->format('Y-m-d H:i:s'),
                    $rule->creator ? $rule->creator->full_name : 'N/A'
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
                'message' => 'CSV generated successfully'
            ];
        } catch (\Exception $exception) {
            Log::error('Error exporting rules to CSV', [
                'filters' => $filters,
                'error' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString()
            ]);

            return [
                'status' => AppConstants::STATUS_ERROR,
                'data' => '',
                'message' => 'Failed to export rules to CSV'
            ];
        }
    }
}
