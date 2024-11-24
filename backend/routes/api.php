<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JWTAuthController;
use App\Http\Controllers\FileController;

// Public routes
Route::post('register', [JWTAuthController::class, 'register']);
Route::post('login', [JWTAuthController::class, 'login'])->name('login');

// Protected routes using JWT authentication
Route::middleware('auth:api')->group(function () {
    Route::get('user', [JWTAuthController::class, 'getUser']); 
    Route::post('logout', [JWTAuthController::class, 'logout']);

    Route::post('files', [FileController::class, 'create_file']);
    Route::get('files', [FileController::class, 'fetch_all_files']);

});
