<?php

namespace App\Models\Backend\Rule;

use App\Models\Backend\Rule\Traits\Attributes\RuleAttributes;
use App\Models\Backend\Rule\Traits\Relationships\RuleRelationships;
use App\Models\Backend\Rule\Traits\Scopes\RuleScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rule extends Model
{
    use HasFactory, SoftDeletes, RuleAttributes, RuleRelationships, RuleScopes;

    protected $fillable = [
        'name',
        'description',
        'status',
        'points_earned',
        'priority',
        'reward_multiplier',
        'active',
        'conditions',
        'condition_objects',
        'type',
        'is_lifetime',
        'max_applications',
        'cooldown_period',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'active' => 'boolean',
        'points_earned' => 'integer',
        'priority' => 'integer',
        'reward_multiplier' => 'integer',
        'condition_objects' => 'array',
        'is_lifetime' => 'boolean',
        'max_applications' => 'integer',
        'cooldown_period' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    protected $attributes = [
        'status' => 'draft',
        'points_earned' => 0,
        'priority' => 50,
        'reward_multiplier' => 1,
        'active' => true,
        'type' => 'purchase',
        'is_lifetime' => true
    ];

}
