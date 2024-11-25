<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Events\FileUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth; 

class FileController extends Controller
{
    function create_file(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string',
            'content' => 'nullable|string',
        ]);

        $path = 'files/' . $validated['name'];

        Storage::disk('public')->put($path, $validated['content'] ?? '');

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
    public function fetch_all_files(){
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
    public function fetch_file($id){
        // finding file by ID
        $file = File::findOrFail($id);

        // getting the content from storage
        $content = Storage::disk('public')->get($file->path);

        return response()->json([
            'file' => $file,
            'content' => $content,
        ]);
    }

    // editing a file
    public function edit_file(Request $request, $id){
        // validating if there is content 
        $validated = $request->validate([
            'content' => 'nullable|string',
        ]);

        // finding file
        $file = File::findOrFail($id);

        // updating content in storage
        if (!empty($validated['content'])) {
            Storage::disk('public')->put($file->path, $validated['content']);

            // updating timstamp in db
            $file->touch();

            // Broadcast file changes to collaborators
            broadcast(new FileUpdated($id, $validated['content']))->toOthers();
        }

        return response()->json([
            'message' => 'File updated successfully!',
            'file' => $file,
        ]);
    }


    // deleting a file
    public function delete_file($id){
        // finding file by ID
        $file = File::findOrFail($id);

        // deleting file from storage
        Storage::disk('public')->delete($file->path);

        // deleting file in db
        $file->delete();

        return response()->json([
        'message' => 'File deleted successfully!',
        ]);
    }
}
