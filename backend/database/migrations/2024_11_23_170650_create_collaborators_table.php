<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('collaborators', function (Blueprint $table) {
            $table->id();  
            $table->foreignId('file_id')  
                ->constrained('files')  
                ->onDelete('cascade');  
            
            $table->foreignId('user_id')  
                ->nullable()  
                ->constrained('users')  
                ->onDelete('cascade');  
            
            $table->string('invited_email')->nullable();  
            $table->enum('role', ['editor', 'viewer'])->default('viewer');  
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');  
            $table->timestamp('invited_at')->nullable();  
            $table->timestamp('accepted_at')->nullable();  

            $table->timestamps();  
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collaborators');
    }
};
