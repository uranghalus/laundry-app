<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->unsignedBigInteger('tenant_id')->nullable()->after('id');
        });

        Schema::table('proof_of_conditions', function (Blueprint $table) {
            $table->unsignedBigInteger('tenant_id')->nullable()->after('id');
        });

        DB::table('order_items')->update([
            'tenant_id' => DB::raw('(select tenant_id from orders where orders.id = order_items.order_id)'),
        ]);

        DB::table('proof_of_conditions')->update([
            'tenant_id' => DB::raw('(select tenant_id from orders where orders.id = proof_of_conditions.order_id)'),
        ]);

        Schema::table('order_items', function (Blueprint $table) {
            $table->unsignedBigInteger('tenant_id')->nullable(false)->change();
        });

        Schema::table('proof_of_conditions', function (Blueprint $table) {
            $table->unsignedBigInteger('tenant_id')->nullable(false)->change();
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
        });

        Schema::table('proof_of_conditions', function (Blueprint $table) {
            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['tenant_id']);
        });

        Schema::table('proof_of_conditions', function (Blueprint $table) {
            $table->dropForeign(['tenant_id']);
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn('tenant_id');
        });

        Schema::table('proof_of_conditions', function (Blueprint $table) {
            $table->dropColumn('tenant_id');
        });
    }
};
