<?php

namespace App\Http\Requests\Backend\Rule;

use Illuminate\Foundation\Http\FormRequest;

class RuleIndexRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:all,draft,active,inactive,archived',
            'active' => 'nullable|boolean',
            'type' => 'nullable|string|in:all,purchase,referral,birthday,anniversary',
            'priority_min' => 'nullable|integer|min:0|max:100',
            'priority_max' => 'nullable|integer|min:0|max:100|gte:priority_min',
            'points_min' => 'nullable|integer|min:0',
            'points_max' => 'nullable|integer|min:0|gte:points_min',
            'date_filter' => 'nullable|string|in:all,last_30_days,last_90_days,last_year,custom',
            'start_date' => 'nullable|date|required_if:date_filter,custom',
            'end_date' => 'nullable|date|after_or_equal:start_date|required_if:date_filter,custom',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
            'sort_by' => 'nullable|string|in:name,status,priority,points_earned,created_at,updated_at',
            'sort_direction' => 'nullable|string|in:asc,desc',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.in' => 'The status must be one of: all, draft, active, inactive, archived.',
            'type.in' => 'The type must be one of: all, purchase, referral, birthday, anniversary.',
            'priority_min.min' => 'The minimum priority must be at least 0.',
            'priority_max.max' => 'The maximum priority must not exceed 100.',
            'priority_max.gte' => 'The maximum priority must be greater than or equal to the minimum priority.',
            'points_min.min' => 'The minimum points must be at least 0.',
            'points_max.gte' => 'The maximum points must be greater than or equal to the minimum points.',
            'date_filter.in' => 'The date filter must be one of: all, last_30_days, last_90_days, last_year, custom.',
            'start_date.required_if' => 'The start date is required when using custom date filter.',
            'end_date.required_if' => 'The end date is required when using custom date filter.',
            'end_date.after_or_equal' => 'The end date must be after or equal to the start date.',
            'per_page.max' => 'The per page value must not exceed 100.',
            'sort_by.in' => 'The sort by field must be one of: name, status, priority, points_earned, created_at, updated_at.',
            'sort_direction.in' => 'The sort direction must be either asc or desc.',
        ];
    }

    /**
     * Get the validated data with defaults
     *
     * @return array
     */
    public function getValidatedData(): array
    {
        $validated = $this->validated();
        
        return [
            'search' => $validated['search'] ?? '',
            'status' => $validated['status'] ?? 'all',
            'active' => $validated['active'] ?? null,
            'type' => $validated['type'] ?? 'all',
            'priority_min' => $validated['priority_min'] ?? null,
            'priority_max' => $validated['priority_max'] ?? null,
            'points_min' => $validated['points_min'] ?? null,
            'points_max' => $validated['points_max'] ?? null,
            'date_filter' => $validated['date_filter'] ?? 'all',
            'start_date' => $validated['start_date'] ?? '',
            'end_date' => $validated['end_date'] ?? '',
            'page' => $validated['page'] ?? 1,
            'per_page' => $validated['per_page'] ?? 15,
            'sort_by' => $validated['sort_by'] ?? 'created_at',
            'sort_direction' => $validated['sort_direction'] ?? 'desc',
        ];
    }
}
