<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programme_presences', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('programme_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->unsignedInteger('nombre_participants');
            $table->timestamps();

            $table->unique(['programme_id', 'date']);
            $table->index(['programme_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programme_presences');
    }
};
