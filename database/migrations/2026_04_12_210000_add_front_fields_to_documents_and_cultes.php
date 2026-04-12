<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->string('categorie')->nullable()->after('type');
            $table->string('uploaded_by')->nullable()->after('description');
            $table->string('file_size')->nullable()->after('uploaded_by');
        });

        Schema::table('cultes', function (Blueprint $table) {
            $table->string('heure')->nullable()->after('date_culte');
            $table->string('lieu')->nullable()->after('heure');
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn(['categorie', 'uploaded_by', 'file_size']);
        });

        Schema::table('cultes', function (Blueprint $table) {
            $table->dropColumn(['heure', 'lieu']);
        });
    }
};
