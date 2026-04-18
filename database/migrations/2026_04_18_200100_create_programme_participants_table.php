<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programme_participants', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('programme_id')->constrained()->cascadeOnDelete();
            $table->string('nom');
            $table->enum('sexe', ['homme', 'femme'])->nullable();
            $table->string('departement')->nullable();
            $table->timestamps();

            $table->index('programme_id');
            $table->index('departement');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programme_participants');
    }
};
