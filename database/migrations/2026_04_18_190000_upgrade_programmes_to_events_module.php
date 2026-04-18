<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('programmes', function (Blueprint $table): void {
            $table->string('type')->nullable()->after('nom');
            $table->boolean('participants_enabled')->default(false)->after('statut');
            $table->enum('participants_mode', ['simple', 'advanced'])->nullable()->after('participants_enabled');
            $table->unsignedInteger('participants_expected')->nullable()->after('participants_mode');
            $table->unsignedInteger('participants_actual')->nullable()->after('participants_expected');
        });

        Schema::create('programme_participants', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('programme_id')->constrained()->cascadeOnDelete();
            $table->string('nom');
            $table->enum('sexe', ['homme', 'femme'])->nullable();
            $table->string('departement')->nullable();
            $table->timestamps();

            $table->index('programme_id');
            $table->index('sexe');
            $table->index('departement');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programme_participants');

        Schema::table('programmes', function (Blueprint $table): void {
            $table->dropColumn([
                'type',
                'participants_enabled',
                'participants_mode',
                'participants_expected',
                'participants_actual',
            ]);
        });
    }
};
