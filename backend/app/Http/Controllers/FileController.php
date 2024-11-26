<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;

class FileController extends Controller
{
    // Create a new file
    public function create_file(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $validated = $request->validate([
            'name' => 'required|string',
            'content' => 'nullable|string',
            'language' => 'required|string', 
        ]);

        $content = $validated['content'] ?? '';

        $path = 'files/' . $validated['name'];

        Storage::disk('public')->put($path, $validated['content'] ?? '');

        $fileUrl = url('storage/' . $path);  

        $file = File::create([
            'name' => $validated['name'],
            'path' => $fileUrl,
            'user_id' => $user->id,
            'content' => $validated['content'],  
            'language' => $validated['language'],  
        ]);

        return response()->json([
            "message" => "File created successfully!",
            "file" => $file
        ]);
    }

    // Fetching all files
    public function fetch_all_files()
    {
        $user = JWTAuth::parseToken()->authenticate();
    
        // Fetch all files belonging to the user
        $files = File::where('user_id', $user->id)->get();

        return response()->json([
            "message" => "Fetched all files successfully!",
            'files' => $files
        ]);
    }

    public function fetch_file($fileName)
    {
        $file = File::where('name', $fileName)->firstOrFail();
        $content = $file->content;
    
        return response()->json([
            'file' => $file,
            'content' => $content,
            'language' => $file->language, 
        ]);
    }

    // Editing a file
    public function edit_file(Request $request, $id)
    {
        $validated = $request->validate([
            'content' => 'nullable|string',
            'language' => 'nullable|string',
        ]);

        $file = File::findOrFail($id);

        if (isset($validated['content'])) {
            $file->content = $validated['content'];  
        }

        if (isset($validated['language'])) {
            $file->language = $validated['language'];  
        }

        $file->touch();

        $file->save();

        return response()->json([
            'message' => 'File updated successfully!',
            'file' => $file,
        ]);
    }


    // Deleting a file
    public function delete_file($id)
    {
        $file = File::findOrFail($id);

        // Delete file from storage
        Storage::disk('public')->delete($file->path);

        // Delete file record from DB
        $file->delete();

        return response()->json([
            'message' => 'File deleted successfully!',
        ]);
    }
}
