<?php

use App\Models\Backend\LoyaltySetting\LoyaltySetting;
use App\Models\Backend\LoyaltyTransaction\LoyaltyTransaction;
use App\Models\User\User;

return [
    /*
    |--------------------------------------------------------------------------
    | Model and Table Mappings
    |--------------------------------------------------------------------------
    |
    | This configuration file contains mappings for models and their corresponding
    | table names. This allows for centralized management of model references
    | and makes it easier to change table names or model classes in the future.
    |
    */

    'models' => [
        'user' => [
            'class' => User::class,
            'table' => 'users',
        ],
        'loyalty_transaction' => [
            'class' => LoyaltyTransaction::class,
            'table' => 'loyalty_transactions',
        ],
        'loyalty_setting' => [
            'class' => LoyaltySetting::class,
            'table' => 'loyalty_settings',
        ],
    ]
];
