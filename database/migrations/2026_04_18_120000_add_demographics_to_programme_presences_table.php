<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('programme_presences', function (Blueprint $table): void {
            $table->unsignedInteger('hommes_adultes')->default(0)->after('nombre_participants');
            $table->unsignedInteger('femmes_adultes')->default(0)->after('hommes_adultes');
            $table->unsignedInteger('jeunes_hommes')->default(0)->after('femmes_adultes');
            $table->unsignedInteger('jeunes_filles')->default(0)->after('jeunes_hommes');
            $table->unsignedInteger('enfants')->default(0)->after('jeunes_filles');
            $table->unsignedInteger('visiteurs')->default(0)->after('enfants');
        });
    }

    public function down(): void
    {
        Schema::table('programme_presences', function (Blueprint $table): void {
            $table->dropColumn([
                'hommes_adultes',
                'femmes_adultes',
                'jeunes_hommes',
                'jeunes_filles',
                'enfants',
                'visiteurs',
            ]);
        });
    }
};
