<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('comptabilite', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['dime', 'offrande', 'don', 'autre']);
            $table->decimal('montant', 10, 2);
            $table->text('description')->nullable();
            $table->date('date_operation');
            $table->timestamps();

            $table->index('type');
            $table->index('date_operation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comptabilite');
    }
};
