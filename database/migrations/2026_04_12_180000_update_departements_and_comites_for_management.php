<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('departements', function (Blueprint $table): void {
            $table->enum('statut', ['actif', 'inactif'])->default('actif')->after('description');
        });

        Schema::table('comites', function (Blueprint $table): void {
            $table->foreignId('departement_id')
                ->nullable()
                ->after('description')
                ->constrained('departements')
                ->nullOnDelete()
                ->cascadeOnUpdate();
            $table->enum('statut', ['actif', 'inactif'])->default('actif')->after('departement_id');
        });
    }

    public function down(): void
    {
        Schema::table('comites', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('departement_id');
            $table->dropColumn('statut');
        });

        Schema::table('departements', function (Blueprint $table): void {
            $table->dropColumn('statut');
        });
    }
};
