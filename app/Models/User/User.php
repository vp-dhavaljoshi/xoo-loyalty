<?php

namespace App\Models\User;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Permission;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

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

    /**
     * Get the user's full name
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Get all loyalty permissions for the user
     */
    public function getLoyaltyPermissions(): array
    {
        $permissions = $this->getAllPermissions();
        $loyaltyPermissions = [];
        
        foreach ($permissions as $permission) {
            if (str_starts_with($permission->name, 'loyalty-') || 
                in_array($permission->menu_type, [
                    'loyalty_dashboard', 'loyalty_customers', 'loyalty_rules', 
                    'loyalty_campaigns', 'loyalty_rewards', 'loyalty_settings', 'loyalty_login'
                ])) {
                $loyaltyPermissions[] = $permission->name;
            }
        }
        
        return $loyaltyPermissions;
    }

    /**
     * Check if user has specific loyalty permission
     */
    public function hasLoyaltyPermission(string $permission): bool
    {
        return $this->hasPermissionTo($permission);
    }

    /**
     * Check if user can access loyalty system
     */
    public function canAccessLoyalty(): bool
    {
        return $this->hasPermissionTo('loyalty-login.view');
    }
}
