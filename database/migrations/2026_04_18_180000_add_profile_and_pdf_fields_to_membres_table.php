<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('membres', function (Blueprint $table): void {
            $table->string('photo_path')->nullable()->after('email');
            $table->string('fonction_eglise')->nullable()->after('profession');
            $table->string('niveau_etude')->nullable()->after('fonction_eglise');
            $table->string('contact_urgence_nom')->nullable()->after('niveau_etude');
            $table->string('contact_urgence_telephone', 30)->nullable()->after('contact_urgence_nom');
            $table->boolean('pdf_afficher_logo')->default(true)->after('observations');
            $table->boolean('pdf_afficher_nom_eglise')->default(true)->after('pdf_afficher_logo');
            $table->string('pdf_titre_document')->nullable()->after('pdf_afficher_nom_eglise');
        });
    }

    public function down(): void
    {
        Schema::table('membres', function (Blueprint $table): void {
            $table->dropColumn([
                'photo_path',
                'fonction_eglise',
                'niveau_etude',
                'contact_urgence_nom',
                'contact_urgence_telephone',
                'pdf_afficher_logo',
                'pdf_afficher_nom_eglise',
                'pdf_titre_document',
            ]);
        });
    }
};
