<?php

use App\Models\User\User;
use Illuminate\Support\Facades\Log;

if (!function_exists('getLoginUserArray')) {
    /**
     * Generate login token
     *
     * @param User $user
     * @return array
     */
    function getLoginUserArray(): array
    {
        $user = auth()->user();

        if (!$user) {
            return [
                'auth' => [
                    'user' => null,
                    'permissions' => []
                ]
            ];
        }

        try {
            $loyaltyPermissions = $user->getLoyaltyPermissions();            
            return [
                'auth' => [
                    'user' => $user,
                    'permissions' => $loyaltyPermissions
                ]
            ];
        } catch (\Exception $e) {
            Log::error('Error fetching user permissions', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);            
            
            return [
                'auth' => [
                    'user' => $user,
                    'permissions' => []
                ]
            ];
        }
    }
}