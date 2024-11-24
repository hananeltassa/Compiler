<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JWTAuthController;
use App\Http\Controllers\CollaboratorController;
use App\Http\Controllers\FileController;

Route::post('register', [JWTAuthController::class, 'register']);
Route::post('login', [JWTAuthController::class, 'login'])->name('login');

Route::middleware('auth:api')->group(function () {
    // Authenticated routes
    Route::get('user', [JWTAuthController::class, 'getUser']); 
    Route::post('logout', [JWTAuthController::class, 'logout']);

    Route::post('/collaborators', [CollaboratorController::class, 'invite']);
    Route::get('/collaborators', [CollaboratorController::class, 'index']);
    Route::delete('/collaborators', [CollaboratorController::class, 'delete']);

    Route::prefix('files')->group(function () {
        Route::post('/', [FileController::class, 'create_file']);  
        Route::get('/', [FileController::class, 'fetch_all_files']);  
        Route::get('{id}', [FileController::class, 'fetch_file']); 
        Route::put('{id}', [FileController::class, 'edit_file']);
        Route::delete('{id}', [FileController::class, 'delete_file']); 
    });

});
