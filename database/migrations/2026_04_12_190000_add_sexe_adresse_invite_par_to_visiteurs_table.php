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
        Schema::table('visiteurs', function (Blueprint $table) {
            $table->enum('sexe', ['homme', 'femme'])->nullable()->after('prenom');
            $table->string('invite_par')->nullable()->after('date_visite');
            $table->string('adresse', 500)->nullable()->after('invite_par');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('visiteurs', function (Blueprint $table) {
            $table->dropColumn(['sexe', 'invite_par', 'adresse']);
        });
    }
};
