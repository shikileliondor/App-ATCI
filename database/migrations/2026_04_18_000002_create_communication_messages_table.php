<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('communication_messages', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->unsignedInteger('recipient_count')->default(0);
            $table->string('status', 20)->default('envoye');
            $table->string('recipient_type', 20)->default('all');
            $table->string('channel', 20)->default('sms');
            $table->timestamp('sent_at')->nullable();
            $table->text('error_details')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('communication_messages');
    }
};
