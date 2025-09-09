<?php

namespace App\Models\User;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\User\Traits\Attributes\UserAttributes;
use App\Models\User\Traits\Relationships\UserRelationships;
use App\Models\User\Traits\Scopes\UserScopes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Permission;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, UserAttributes, UserRelationships, UserScopes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'country_code',
        'status',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // All methods moved to Traits:
    // - UserAttributes: getFullNameAttribute, getDisplayNameAttribute, getStatusTextAttribute, etc.
    // - UserRelationships: getLoyaltyPermissions, hasLoyaltyPermission, canAccessLoyalty, etc.
    // - UserScopes: scopeActive, scopeInactive, scopeSearch, scopeByDateFilter, etc.
}
