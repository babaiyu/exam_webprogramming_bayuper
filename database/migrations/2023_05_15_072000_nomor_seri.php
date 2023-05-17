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
        Schema::create('nomor_seri', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                ->constrained(table: 'barang')
                ->cascadeOnDelete()
                ->cascadeOnUpdate();
            $table->decimal('serial_no')->unique();
            $table->float('price');
            $table->date('prod_date');
            $table->date('warranty_start')->nullable();
            $table->integer('warranty_duration')->nullable();
            $table->integer('used')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
