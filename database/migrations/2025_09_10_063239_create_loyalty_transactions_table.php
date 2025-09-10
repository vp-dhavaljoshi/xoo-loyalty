<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('loyalty_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('transaction_type'); // 'signup_bonus', 'product_points', 'cart_points', 'redemption', 'adjustment', 'expiration'
            $table->string('description');
            $table->integer('points'); // Can be positive or negative
            $table->integer('points_balance_after'); // Points balance after this transaction
            $table->string('reference_id')->nullable(); // Reference to order, campaign, etc.
            $table->string('reference_type')->nullable(); // 'order', 'campaign', 'manual', etc.
            $table->json('metadata')->nullable(); // Additional data like order details, campaign info
            $table->timestamp('expires_at')->nullable(); // For expiring points
            $table->boolean('is_active')->default(true); // For soft deletes or reversals
            $table->timestamps();

            // Indexes for performance
            $table->index(['user_id', 'created_at']);
            $table->index(['transaction_type', 'created_at']);
            $table->index(['reference_id', 'reference_type']);
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loyalty_transactions');
    }
};