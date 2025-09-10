<?php

use App\Models\User\User;
use Illuminate\Support\Facades\Auth;
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
        $user = Auth::user();

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
            
            // Create a clean user object consistent with HandleInertiaRequests
            $cleanUser = [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'full_name' => $user->first_name . ' ' . $user->last_name,
            ];
            
            return [
                'auth' => [
                    'user' => $cleanUser,
                    'permissions' => $loyaltyPermissions
                ]
            ];
        } catch (\Exception $e) {
            Log::error('Error fetching user permissions', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);            
            
            // Create a clean user object even in error case
            $cleanUser = [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'full_name' => $user->first_name . ' ' . $user->last_name,
            ];
            
            return [
                'auth' => [
                    'user' => $cleanUser,
                    'permissions' => []
                ]
            ];
        }
    }
}


if (! function_exists('includeRouteFiles')) {
    /**
     * Loops through a folder and requires all PHP files
     * Searches sub-directories as well.
     */
    function includeRouteFiles(string $folder): void
    {
        try {
            $iterator = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($folder)
            );
            foreach ($iterator as $file) {
                if ($file->isFile() && $file->isReadable() && $file->getExtension() === 'php') {
                    require $file->getPathname();
                }
            }
        } catch (Exception $ex) {
            Log::error($ex);
        }
    }
}