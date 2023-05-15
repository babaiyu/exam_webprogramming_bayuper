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
        Schema::create('transaksi_detail', function(Blueprint $table) {
            $table->id();
            $table->integer('transaksi_id')->unsigned();
            $table->integer('product_id')->unsigned();
            $table->decimal('serial_no');
            $table->float('price');
            $table->integer('discount');
            $table->foreign('transaksi_id')->references('id')->on('transaksi');
            $table->foreign('product_id')->references('id')->on('barang');
            $table->timestamps();
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
