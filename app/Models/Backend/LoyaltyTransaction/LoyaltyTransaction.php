<?php

namespace App\Models\Backend\LoyaltyTransaction;

use App\Models\Backend\LoyaltyTransaction\Traits\Attributes\LoyaltyTransactionAttributes;
use App\Models\Backend\LoyaltyTransaction\Traits\Relationships\LoyaltyTransactionRelationships;
use App\Models\Backend\LoyaltyTransaction\Traits\Scopes\LoyaltyTransactionScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyTransaction extends Model
{
    use HasFactory, LoyaltyTransactionAttributes, LoyaltyTransactionRelationships, LoyaltyTransactionScopes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'loyalty_transactions';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'transaction_type',
        'description',
        'points',
        'points_balance_after',
        'reference_id',
        'reference_type',
        'metadata',
        'expires_at',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'points' => 'integer',
        'points_balance_after' => 'integer',
        'metadata' => 'array',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];
}
