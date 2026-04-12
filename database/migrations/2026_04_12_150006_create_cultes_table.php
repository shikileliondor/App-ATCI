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
        Schema::create('cultes', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->date('date_culte');
            $table->string('theme')->nullable();
            $table->string('pasteur')->nullable();

            $table->unsignedInteger('hommes_adultes')->default(0);
            $table->unsignedInteger('femmes_adultes')->default(0);
            $table->unsignedInteger('jeunes_hommes')->default(0);
            $table->unsignedInteger('jeunes_filles')->default(0);
            $table->unsignedInteger('enfants')->default(0);
            $table->unsignedInteger('visiteurs')->default(0);
            $table->unsignedInteger('total_personnes')->default(0);

            $table->text('observations')->nullable();
            $table->timestamps();

            $table->index('date_culte');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cultes');
    }
};
