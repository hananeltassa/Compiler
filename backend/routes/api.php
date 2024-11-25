<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JWTAuthController;
use App\Http\Controllers\CollaboratorController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\CodeAnalysisController;

Route::post('register', [JWTAuthController::class, 'register']);
Route::post('login', [JWTAuthController::class, 'login'])->name('login');

Route::get('invitations/accept/{id}', [InvitationController::class, 'acceptInvitation'])->name('invitation.accept');
Route::get('/invitations/deny/{id}', [InvitationController::class, 'denyInvitation'])->name('invitation.deny');

Route::middleware('jwt.auth')->group(function () {
    // Authenticated routes
    Route::get('user', [JWTAuthController::class, 'getUser']); 
    Route::post('logout', [JWTAuthController::class, 'logout']);

    Route::post('/analyze', [CodeAnalysisController::class, 'analyze']);

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
    });

});
