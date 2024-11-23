<?php

namespace App\Http\Controllers;

use App\Models\File;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth; 

class FileController extends Controller
{
    function create_file(Request $request){
        // validating request data
        $validated = $request->validate([
            'name' => 'required|string',
            'content' => 'nullable|string',   
        ]);

        // getting authenticated user from JWT token
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Unauthorized User'
            ], 401);
        }

        // generating a unique file path using uniqid()
        $path = 'files/' . uniqid() . '_' . $validated['name'];

        // saving in public storage, if empty save empty file
        Storage::disk('public')
        ->put($path, !empty($validated['content']) ? $validated['content'] : '');

        // creating a new file
        $file = File::create([
            'name' => $validated['name'],
            'path' => $path,
            'user_id' => $user->id, 
        ]);

        return response()->json([
            "message" => "File created successfully!",
            "file" => $file
        ]);
    }
}
