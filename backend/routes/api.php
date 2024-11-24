<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JWTAuthController;
use App\Http\Controllers\CollaboratorController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\InvitationController;

Route::post('register', [JWTAuthController::class, 'register']);
Route::post('login', [JWTAuthController::class, 'login'])->name('login');

Route::middleware('auth:api')->group(function () {
    // Authenticated routes
    Route::get('user', [JWTAuthController::class, 'getUser']); 
    Route::post('logout', [JWTAuthController::class, 'logout']);

    Route::prefix('files')->group(function () {
        Route::post('/', [FileController::class, 'create_file']);  
        Route::get('/', [FileController::class, 'fetch_all_files']);  
        Route::get('{id}', [FileController::class, 'fetch_file']); 
        Route::put('{id}', [FileController::class, 'edit_file']);
        Route::delete('{id}', [FileController::class, 'delete_file']); 
    });

    Route::prefix('collaborators')->group(function () {
        Route::delete('/', [CollaboratorController::class, 'delete']); 
        Route::get('/', [CollaboratorController::class, 'index']);
    });

    Route::prefix('invitations')->group(function () {
        Route::post('/', [InvitationController::class, 'sendInvitation']); 
        Route::get('/', [InvitationController::class, 'listInvitations']); 
        Route::patch('{id}', [InvitationController::class, 'updateInvitationStatus']);
    });

});
