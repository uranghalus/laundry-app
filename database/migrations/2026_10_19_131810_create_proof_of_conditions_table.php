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
        Schema::create('proof_of_conditions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('photo_url');
            $table->json('watermark_data'); // timestamp, order_id
            $table->enum('customer_approval_status', ['pending', 'approved', 'timeout'])->default('pending');
            $table->timestamp('approved_at')->nullable();
            $table->string('wa_message_ref')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proof_of_conditions');
    }
};
