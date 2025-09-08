<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LoyaltySettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Module Configuration
            'loyalty_module_enabled' => 'true',
            
            // Fraud Detection & Point Freezing
            'fraud_detection_enabled' => 'true',
            'require_order_completion' => 'true',
            'time_based_freeze' => 'true',
            'freeze_duration_hours' => '24',
            'new_customer_freeze' => 'true',
            'customer_age_threshold_days' => '7',
            
            // Points & Currency
            'point_to_currency_rate' => '0.01',
            'currency' => 'USD',
            
            // Signup Rewards
            'signup_bonus_points' => '100',
        ];

        foreach ($settings as $key => $value) {
            DB::table('loyalty_settings')->updateOrInsert(
                ['key' => $key],
                [
                    'key' => $key,
                    'value' => $value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
        }
    }
}