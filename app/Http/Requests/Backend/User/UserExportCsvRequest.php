<?php

namespace App\Http\Requests\Backend\User;

use App\Constants\AppConstants;
use Illuminate\Foundation\Http\FormRequest;

class UserExportCsvRequest extends FormRequest
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
            'search' => 'nullable|string|max:' . AppConstants::MAX_SEARCH_LENGTH,
            'status' => 'nullable|string|in:' . implode(',', AppConstants::getAllowedStatusValues()),
            'date_filter' => 'nullable|string|in:' . implode(',', AppConstants::getAllowedDateFilterValues()),
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
            'search.string' => 'Search must be a valid string.',
            'search.max' => 'Search cannot exceed ' . AppConstants::MAX_SEARCH_LENGTH . ' characters.',
            'status.in' => 'Status must be one of: ' . implode(', ', AppConstants::getAllowedStatusValues()) . '.',
            'date_filter.in' => 'Date filter must be one of: ' . implode(', ', AppConstants::getAllowedDateFilterValues()) . '.',
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
        ];
    }
}
