<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Events\FileUpdated;
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

    public function serveFile($fileName)
    {
        $filePath = "files/{$fileName}";

        // Check if the file exists
        if (!Storage::exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        // Serve the file content
        return response()->file(storage_path("app/{$filePath}"));
    }


    public function fetch_all_files()
    {
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $ownedFiles = File::where('user_id', $user->id)->get();

        $invitedFiles = File::whereHas('invitations', function ($query) use ($user) {
            $query->where('invitations.invited_email', $user->email)  // Match based on email
                ->where('invitations.status', 'accepted');
        })->get();


        $files = $ownedFiles->merge($invitedFiles);

        // Return the combined result
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

    public function updateFile(Request $request)
    {
        $request->validate([
            'fileName' => 'required|string',
            'content' => 'required|string',
        ]);
    
        $fileName = $request->input('fileName');
        $content = $request->input('content');
    
        // Find the file in the database using the file name
        $file = File::where('name', $fileName)->first();
    
        if (!$file) {
            return response()->json(['message' => 'File not found'], 404);
        }
    
        // Extract the file path from the stored URL (if URL is stored)
        $filePath = str_replace(url('storage'), '', $file->path);
    
        // Ensure the file path is correct
        if (!$filePath) {
            return response()->json(['message' => 'Invalid file path'], 400);
        }
    
        try {
            // Update the file content on the disk
            Storage::disk('public')->put($filePath, $content);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update file content: ' . $e->getMessage()], 500);
        }
    
        broadcast(new FileUpdated($fileName, $content));
    
        return response()->json([
            'message' => 'File updated successfully!'
        ]);
    }
    
}
