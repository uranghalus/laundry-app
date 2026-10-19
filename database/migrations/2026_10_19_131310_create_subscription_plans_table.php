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
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Basic, Pro
            $table->decimal('price_monthly', 12, 2);
            $table->decimal('price_annual', 12, 2);
            $table->json('feature_flags')->nullable();
            $table->unsignedInteger('max_outlets')->default(1);
            $table->unsignedInteger('max_users')->nullable()->default(2);
            $table->unsignedInteger('max_photos_per_month')->nullable(); // null = unlimited
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
