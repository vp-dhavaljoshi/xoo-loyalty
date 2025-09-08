<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        
        // If user is authenticated, get only their actual permissions
        if ($user) {
            try {
                // Get only loyalty permissions the user actually has
                $userPermissions = $user->getLoyaltyPermissions();
                
                // Create a clean user object without the complex permission objects
                $cleanUser = [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'full_name' => $user->first_name . ' ' . $user->last_name,
                ];
                
                return [
                    ...parent::share($request),
                    'auth' => [
                        'user' => $cleanUser,
                        'permissions' => $userPermissions, // Only send loyalty permissions
                    ],
                ];
            } catch (\Exception $e) {
                Log::error('Error fetching user permissions in HandleInertiaRequests', [
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
                    ...parent::share($request),
                    'auth' => [
                        'user' => $cleanUser,
                        'permissions' => [],
                    ],
                ];
            }
        }
        
        // If user is not authenticated
        return [
            ...parent::share($request),
            'auth' => [
                'user' => null,
                'permissions' => [],
            ],
        ];
    }
}
