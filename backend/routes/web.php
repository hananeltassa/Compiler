<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::middleware('auth:sanctum')->get('/api/files/{fileName}', [FileController::class, 'serveFile']);
