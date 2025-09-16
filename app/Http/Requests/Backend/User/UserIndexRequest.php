<?php

namespace App\Http\Requests\Backend\User;

use App\Constants\AppConstants;
use Illuminate\Foundation\Http\FormRequest;

class UserIndexRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'page' => 'nullable|integer|min:' . AppConstants::MIN_PER_PAGE,
            'per_page' => 'nullable|integer|min:' . AppConstants::MIN_PER_PAGE . '|max:' . AppConstants::MAX_PER_PAGE,
            'search' => 'nullable|string|max:' . AppConstants::MAX_SEARCH_LENGTH,
            'status' => 'nullable|string|in:' . implode(',', AppConstants::getAllowedStatusValues()),
            'date_filter' => 'nullable|string|in:' . implode(',', AppConstants::getAllowedDateFilterValues()),
            'start_date' => 'nullable|date_format:Y-m-d',
            'end_date' => 'nullable|date_format:Y-m-d|after_or_equal:start_date',
            'sort_by' => 'nullable|string|in:' . implode(',', AppConstants::getAllowedSortFields()),
            'sort_direction' => 'nullable|string|in:' . implode(',', AppConstants::getAllowedSortDirections()),
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
            'page.integer' => 'Page must be a valid integer.',
            'page.min' => 'Page must be at least ' . AppConstants::MIN_PER_PAGE . '.',
            'per_page.integer' => 'Per page must be a valid integer.',
            'per_page.min' => 'Per page must be at least ' . AppConstants::MIN_PER_PAGE . '.',
            'per_page.max' => 'Per page cannot exceed ' . AppConstants::MAX_PER_PAGE . '.',
            'search.string' => 'Search must be a valid string.',
            'search.max' => 'Search cannot exceed ' . AppConstants::MAX_SEARCH_LENGTH . ' characters.',
            'status.in' => 'Status must be one of: ' . implode(', ', AppConstants::getAllowedStatusValues()) . '.',
            'date_filter.in' => 'Date filter must be one of: ' . implode(', ', AppConstants::getAllowedDateFilterValues()) . '.',
            'start_date.date_format' => 'Start date must be in Y-m-d format.',
            'end_date.date_format' => 'End date must be in Y-m-d format.',
            'end_date.after_or_equal' => 'End date must be after or equal to start date.',
            'sort_by.in' => 'Sort by must be one of: ' . implode(', ', AppConstants::getAllowedSortFields()) . '.',
            'sort_direction.in' => 'Sort direction must be one of: ' . implode(', ', AppConstants::getAllowedSortDirections()) . '.',
        ];
    }

    /**
     * Get the validated data with default values.
     *
     * @return array<string, mixed>
     */
    public function getValidatedData(): array
    {
        $validated = $this->validated() ?? [];

        return [
            'page' => $validated['page'] ?? AppConstants::DEFAULT_PAGE,
            'per_page' => $validated['per_page'] ?? AppConstants::DEFAULT_PER_PAGE,
            'search' => $validated['search'] ?? '',
            'status' => $validated['status'] ?? AppConstants::USER_STATUS_ALL,
            'date_filter' => $validated['date_filter'] ?? AppConstants::DATE_FILTER_ALL,
            'start_date' => $validated['start_date'] ?? '',
            'end_date' => $validated['end_date'] ?? '',
            'sort_by' => $validated['sort_by'] ?? AppConstants::SORT_FIELD_CREATED_AT,
            'sort_direction' => $validated['sort_direction'] ?? AppConstants::SORT_DESC,
        ];
    }

    /**
     * Get filters for repository.
     *
     * @return array<string, mixed>
     */
    public function getFilters(): array
    {
        $validated = $this->validated() ?? [];

        return [
            'search' => $validated['search'] ?? '',
            'status' => $validated['status'] ?? AppConstants::USER_STATUS_ALL,
            'date_filter' => $validated['date_filter'] ?? AppConstants::DATE_FILTER_ALL,
            'start_date' => $validated['start_date'] ?? '',
            'end_date' => $validated['end_date'] ?? '',
        ];
    }
}
