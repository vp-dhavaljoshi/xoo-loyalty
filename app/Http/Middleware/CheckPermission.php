<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!Auth::check()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return redirect()->route('home')->with('error', 'Please log in to access this page.');
        }

        $user = Auth::user();
        
        if (!$user->hasPermissionTo($permission)) {
            \Log::warning('Permission denied', [
                'user_id' => $user->id,
                'permission' => $permission,
                'route' => $request->route()?->getName(),
                'ip' => $request->ip()
            ]);
            
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Forbidden.'], 403);
            }
            return redirect()->route('home')->with('error', 'You do not have permission to access this page.');
        }

        return $next($request);
    }
}
