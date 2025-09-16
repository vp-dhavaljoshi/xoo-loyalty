<?php

namespace App\Http\Requests\Backend\Rule;

use Illuminate\Foundation\Http\FormRequest;

class RuleStoreRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:rules,name',
            'description' => 'nullable|string|max:1000',
            'points_earned' => 'required|integer|min:0|max:999999',
            'priority' => 'required|integer|min:0|max:100',
            'reward_multiplier' => 'required|integer|min:1|max:100',
            'active' => 'boolean',
            'conditions' => 'required|array|min:1',
            'conditions.*.field' => 'required|string|max:255',
            'conditions.*.operator' => 'required|string|in:equals,not_equals,greater_than,less_than,greater_than_or_equal,less_than_or_equal,contains,not_contains,starts_with,ends_with,is_empty,is_not_empty',
            'conditions.*.value' => 'required|string|max:255',
            'conditions.*.connector' => 'nullable|string|in:AND,OR',
            'type' => 'nullable|string|in:purchase,referral,birthday,anniversary',
            'is_lifetime' => 'boolean',
            'max_applications' => 'nullable|integer|min:1|max:999999',
            'cooldown_period' => 'nullable|integer|min:1|max:525600', // Max 1 year in minutes
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
            'name.required' => 'The rule name is required.',
            'name.unique' => 'A rule with this name already exists.',
            'name.max' => 'The rule name must not exceed 255 characters.',
            'description.max' => 'The description must not exceed 1000 characters.',
            'points_earned.required' => 'The points earned is required.',
            'points_earned.min' => 'The points earned must be at least 0.',
            'points_earned.max' => 'The points earned must not exceed 999,999.',
            'priority.required' => 'The priority is required.',
            'priority.min' => 'The priority must be at least 0.',
            'priority.max' => 'The priority must not exceed 100.',
            'reward_multiplier.required' => 'The reward multiplier is required.',
            'reward_multiplier.min' => 'The reward multiplier must be at least 1.',
            'reward_multiplier.max' => 'The reward multiplier must not exceed 100.',
            'conditions.required' => 'At least one condition is required.',
            'conditions.min' => 'At least one condition is required.',
            'conditions.*.field.required' => 'The condition field is required.',
            'conditions.*.field.max' => 'The condition field must not exceed 255 characters.',
            'conditions.*.operator.required' => 'The condition operator is required.',
            'conditions.*.operator.in' => 'The condition operator must be one of: equals, not_equals, greater_than, less_than, greater_than_or_equal, less_than_or_equal, contains, not_contains, starts_with, ends_with, is_empty, is_not_empty.',
            'conditions.*.value.required' => 'The condition value is required.',
            'conditions.*.value.max' => 'The condition value must not exceed 255 characters.',
            'conditions.*.connector.in' => 'The condition connector must be either AND or OR.',
            'type.in' => 'The type must be one of: purchase, referral, birthday, anniversary.',
            'max_applications.min' => 'The max applications must be at least 1.',
            'max_applications.max' => 'The max applications must not exceed 999,999.',
            'cooldown_period.min' => 'The cooldown period must be at least 1 minute.',
            'cooldown_period.max' => 'The cooldown period must not exceed 1 year (525,600 minutes).',
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
            'name' => $validated['name'],
            'description' => $validated['description'] ?? '',
            'points_earned' => $validated['points_earned'],
            'priority' => $validated['priority'],
            'reward_multiplier' => $validated['reward_multiplier'],
            'active' => $validated['active'] ?? true,
            'conditions' => $validated['conditions'],
            'type' => $validated['type'] ?? 'purchase',
            'is_lifetime' => $validated['is_lifetime'] ?? true,
            'max_applications' => $validated['max_applications'] ?? null,
            'cooldown_period' => $validated['cooldown_period'] ?? null,
            'created_by' => auth()->id(),
        ];
    }
}
