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
        Schema::create('membres', function (Blueprint $table) {
            $table->id();

            $table->string('nom');
            $table->string('prenom');
            $table->enum('sexe', ['homme', 'femme']);
            $table->date('date_naissance')->nullable();

            $table->string('telephone')->unique();
            $table->string('email')->nullable();
            $table->string('adresse')->nullable();

            $table->foreignId('departement_id')
                ->constrained('departements')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
            $table->foreignId('comite_id')
                ->nullable()
                ->constrained('comites')
                ->nullOnDelete()
                ->cascadeOnUpdate();

            $table->boolean('est_converti')->default(false);
            $table->date('date_conversion')->nullable();
            $table->boolean('est_baptise')->default(false);
            $table->date('date_bapteme')->nullable();
            $table->enum('situation_matrimoniale', ['celibataire', 'marie', 'veuf', 'divorce', 'concubin']);
            $table->string('profession')->nullable();

            $table->enum('statut', ['actif', 'inactif'])->default('actif');
            $table->date('date_inscription');
            $table->text('observations')->nullable();

            $table->timestamps();

            $table->index('nom');
            $table->index('prenom');
            $table->index('date_inscription');
            $table->index('statut');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membres');
    }
};
