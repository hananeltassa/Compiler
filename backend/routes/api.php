<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JWTAuthController;

// Public routes
Route::post('register', [JWTAuthController::class, 'register']);
Route::post('login', [JWTAuthController::class, 'login']);

// Protected routes using JWT authentication
Route::middleware('auth:api')->group(function () {
    Route::get('user', [JWTAuthController::class, 'getUser']); 
    Route::post('logout', [JWTAuthController::class, 'logout']); 
    Route::post('refresh', [JWTAuthController::class, 'refresh']); 
});
