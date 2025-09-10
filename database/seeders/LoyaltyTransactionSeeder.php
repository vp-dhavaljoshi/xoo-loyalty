<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Backend\LoyaltyTransaction\LoyaltyTransaction;
use App\Models\User\User;

class LoyaltyTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }

        $transactionTypes = [
            'signup_bonus' => 'Welcome bonus for new account',
            'product_points' => 'Purchase: Premium Coffee Beans',
            'cart_points' => 'Cart total over $100',
            'redemption' => 'Redeemed: $10 discount coupon',
            'adjustment' => 'Manual points adjustment',
            'refund' => 'Order refund - points restored',
        ];

        foreach ($users as $user) {
            // Create signup bonus
            LoyaltyTransaction::createTransaction([
                'user_id' => $user->id,
                'transaction_type' => 'signup_bonus',
                'description' => 'Welcome bonus for new account',
                'points' => 100,
                'reference_id' => 'signup_' . $user->id,
                'reference_type' => 'signup',
                'metadata' => ['bonus_type' => 'welcome', 'amount' => 100],
            ]);

            // Create some random transactions
            $numTransactions = rand(3, 8);
            $currentBalance = 100; // Starting with signup bonus

            for ($i = 0; $i < $numTransactions; $i++) {
                $type = array_rand($transactionTypes);
                $description = $transactionTypes[$type];
                
                // Generate points based on transaction type
                $points = match($type) {
                    'signup_bonus' => 100,
                    'product_points' => rand(10, 50),
                    'cart_points' => rand(50, 200),
                    'redemption' => -rand(50, 150),
                    'adjustment' => rand(-50, 100),
                    'refund' => rand(20, 80),
                    default => rand(10, 50)
                };

                // Don't allow negative balance
                if ($currentBalance + $points < 0) {
                    $points = -$currentBalance;
                }

                $currentBalance += $points;

                LoyaltyTransaction::createTransaction([
                    'user_id' => $user->id,
                    'transaction_type' => $type,
                    'description' => $description,
                    'points' => $points,
                    'reference_id' => $type . '_' . $user->id . '_' . $i,
                    'reference_type' => $type,
                    'metadata' => [
                        'transaction_number' => $i + 1,
                        'order_id' => 'ORD-' . rand(1000, 9999),
                        'amount' => abs($points)
                    ],
                ]);

                // Add some time delay between transactions
                $createdAt = now()->subDays(rand(1, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59));
                LoyaltyTransaction::where('user_id', $user->id)
                    ->where('transaction_type', $type)
                    ->where('reference_id', $type . '_' . $user->id . '_' . $i)
                    ->update(['created_at' => $createdAt]);
            }
        }

        $this->command->info('Loyalty transactions seeded successfully!');
    }
}