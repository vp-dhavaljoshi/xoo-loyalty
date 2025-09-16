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
        Schema::create('rules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('status', ['draft', 'active', 'inactive'])->default('draft');
            $table->integer('points_earned')->default(0);
            $table->integer('priority')->default(50);
            $table->integer('reward_multiplier')->default(1);
            $table->boolean('active')->default(true);
            $table->text('conditions')->nullable(); // Human readable conditions
            $table->json('condition_objects')->nullable(); // Structured condition data
            $table->enum('type', ['purchase', 'referral', 'birthday', 'anniversary'])->default('purchase');
            $table->boolean('is_lifetime')->default(true);
            $table->integer('max_applications')->nullable();
            $table->integer('cooldown_period')->nullable(); // in months
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['status', 'active']);
            $table->index('priority');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rules');
    }
};
