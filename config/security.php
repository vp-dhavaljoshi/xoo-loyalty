<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Security Headers Configuration
    |--------------------------------------------------------------------------
    |
    | Configure security headers for your application
    |
    */

    'headers' => [
        'content_security_policy' => env('CSP_ENABLED', true),
        'x_frame_options' => env('X_FRAME_OPTIONS', 'DENY'),
        'x_content_type_options' => env('X_CONTENT_TYPE_OPTIONS', 'nosniff'),
        'referrer_policy' => env('REFERRER_POLICY', 'strict-origin-when-cross-origin'),
        'strict_transport_security' => env('HSTS_ENABLED', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Content Security Policy
    |--------------------------------------------------------------------------
    |
    | Define CSP directives for your application
    |
    */

    'csp_directives' => [
        'default-src' => "'self'",
        'script-src' => "'self' 'unsafe-inline' 'unsafe-eval' https://fonts.bunny.net http://xoo-loyalty.loc:5173 http://localhost:5173",
        'style-src' => "'self' 'unsafe-inline' https://fonts.bunny.net",
        'font-src' => "'self' https://fonts.bunny.net",
        'img-src' => "'self' data: https:",
        'connect-src' => "'self' http://xoo-loyalty.loc:5173 http://localhost:5173 ws://xoo-loyalty.loc:5173 ws://localhost:5173",
        'frame-ancestors' => "'none'",
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | Configure rate limiting for different endpoints
    |
    */

    'rate_limiting' => [
        'api' => env('API_RATE_LIMIT', '60:1'),
        'auth' => env('AUTH_RATE_LIMIT', '5:1'),
        'global' => env('GLOBAL_RATE_LIMIT', '1000:1'),
    ],

    /*
    |--------------------------------------------------------------------------
    | CORS Configuration
    |--------------------------------------------------------------------------
    |
    | Configure CORS settings
    |
    */

    'cors' => [
        'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', '*')),
        'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        'allowed_headers' => ['*'],
        'exposed_headers' => [],
        'max_age' => 0,
        'supports_credentials' => false,
    ],
];
