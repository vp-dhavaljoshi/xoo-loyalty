<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
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
                // Get only the permissions the user actually has
                $userPermissions = $user->getAllPermissions()->pluck('name')->toArray();
                
                return [
                    ...parent::share($request),
                    'auth' => [
                        'user' => $user,
                        'permissions' => $userPermissions, // Only send actual permissions
                    ],
                ];
            } catch (\Exception $e) {
                \Log::error('Error fetching user permissions in HandleInertiaRequests', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage()
                ]);
                
                return [
                    ...parent::share($request),
                    'auth' => [
                        'user' => $user,
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
