<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only apply security headers if enabled
        if (!config('security.headers.content_security_policy', true)) {
            return $response;
        }

        // Content Security Policy
        $cspDirectives = config('security.csp_directives', []);
        if (!empty($cspDirectives)) {
            $csp = collect($cspDirectives)
                ->map(fn($value, $key) => "{$key} {$value}")
                ->implode('; ');
            $response->headers->set('Content-Security-Policy', $csp);
        }

        // X-Frame-Options
        $xFrameOptions = config('security.headers.x_frame_options', 'DENY');
        $response->headers->set('X-Frame-Options', $xFrameOptions);

        // X-Content-Type-Options
        $xContentType = config('security.headers.x_content_type_options', 'nosniff');
        $response->headers->set('X-Content-Type-Options', $xContentType);

        // Referrer Policy
        $referrerPolicy = config('security.headers.referrer_policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Referrer-Policy', $referrerPolicy);

        // Permissions Policy
        $response->headers->set('Permissions-Policy', 
            'geolocation=(), microphone=(), camera=()'
        );

        // Strict Transport Security (Only enable if using HTTPS)
        if ($request->secure() && config('security.headers.strict_transport_security', true)) {
            $response->headers->set('Strict-Transport-Security', 
                'max-age=31536000; includeSubDomains; preload'
            );
        }

        return $response;
    }
}
