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
            $table->enum('participants_mode', ['simple', 'avance'])->nullable()->after('participants_enabled');
            $table->unsignedInteger('expected_participants')->nullable()->after('participants_mode');
            $table->unsignedInteger('actual_participants')->nullable()->after('expected_participants');
        });
    }

    public function down(): void
    {
        Schema::table('programmes', function (Blueprint $table): void {
            $table->dropColumn([
                'type',
                'participants_enabled',
                'participants_mode',
                'expected_participants',
                'actual_participants',
            ]);
        });
    }
};
