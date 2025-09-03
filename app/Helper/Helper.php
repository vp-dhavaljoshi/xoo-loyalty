<?php

use App\Models\User\User;

if (!function_exists('getLoginUserArray')) {
    /**
     * Generate login token
     *
     * @param User $user
     * @return array
     */
    function getLoginUserArray(): array
    {
        return [
            'auth' => [
                'user' => auth()->user()
            ]
        ];
    }
}