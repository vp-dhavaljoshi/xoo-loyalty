<?php

namespace App\Models\Backend\LoyaltySetting;

use App\Models\Backend\LoyaltySetting\Traits\Attributes\LoyaltySettingAttributes;
use App\Models\Backend\LoyaltySetting\Traits\Relationships\LoyaltySettingRelationships;
use App\Models\Backend\LoyaltySetting\Traits\Scopes\LoyaltySettingScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltySetting extends Model
{
    use HasFactory, LoyaltySettingAttributes, LoyaltySettingRelationships, LoyaltySettingScopes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'loyalty_settings';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'value' => 'string',
    ];

    // All methods moved to Traits:
    // - LoyaltySettingAttributes: getBooleanValueAttribute, getDisplayNameAttribute, getCategoryAttribute, etc.
    // - LoyaltySettingRelationships: getValue, setValue, getAllSettings, updateFromArray, etc.
    // - LoyaltySettingScopes: scopeByCategory, scopeGeneral, scopeSecurity, scopeRewards, etc.
}
