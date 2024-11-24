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
        $user = JWTAuth::parseToken()->authenticate();

        // generating a unique file path using uniqid()
        $path = 'files/' . uniqid() . '_' . $validated['name'];

        // saving in public storage, if empty save empty file
        Storage::disk('public')->put($path, $validated['content'] ?? '');

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

     // fetching all files
     public function fetch_all_files()
     {
        // getting authenticated user
        $user = JWTAuth::parseToken()->authenticate();
    
        // fetching all files belonging to user
        $files = File::where('user_id', $user->id)->get();

        return response()->json([
            "message" => "Fetched all files successfully!",
            'files' => $files
        ]);
     }

      // fetching a specific file by ID
    public function fetch_file($id)
    {
        // finding file by ID
        $file = File::findOrFail($id);
        
        // getting the content from storage
        $content = Storage::disk('public')->get($file->path);

        return response()->json([
            'file' => $file,
            'content' => $content,
        ]);
    }

}
