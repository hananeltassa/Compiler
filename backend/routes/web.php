<?php

use Illuminate\Support\Facades\Route;
use App\Events\CodeUpdated;

Route::get('/test-broadcast', function () {
    event(new CodeUpdated('This is a test update.'));
    return 'Event has been broadcast!';
});

Route::get('/', function () {
    return view('welcome');
});


Route::middleware('auth:sanctum')->get('/api/files/{fileName}', [FileController::class, 'serveFile']);
