<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Membuat tabel penyimpanan kode OTP beserta status pemakaiannya.
     */
    public function up(): void
    {
        Schema::create('otp_codes', function (Blueprint $table) {
            $table->id();
            $table->string('phone');
            $table->string('code_hash');
            $table->string('purpose');
            $table->timestamp('expires_at');
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->timestamp('consumed_at')->nullable();
            $table->timestamps();

            // Lookup verifikasi selalu memakai pasangan nomor HP dan purpose.
            $table->index(['phone', 'purpose']);
        });
    }

    /**
     * Menghapus tabel kode OTP.
     */
    public function down(): void
    {
        Schema::dropIfExists('otp_codes');
    }
};
