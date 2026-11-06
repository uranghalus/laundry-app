<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambahkan flag izin tulis operasional pada outlet.
     */
    public function up(): void
    {
        Schema::table('outlets', function (Blueprint $table) {
            $table->boolean('write_enabled')->default(true)->after('operating_hours');
        });
    }

    /**
     * Menghapus flag izin tulis operasional dari outlet.
     */
    public function down(): void
    {
        Schema::table('outlets', function (Blueprint $table) {
            $table->dropColumn('write_enabled');
        });
    }
};
