<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    function create_file(Request $request, $user_id){
        // validating request data
        $validated = $request->validate([
            'name' => 'required|string',
            'content' => 'nullable|string',   
            'user_id' => 'required|exists:users,id',
        ]);

        // generating a unique file path using uniqid()
        $path = 'files/' . uniqid() . '_' . $validated['name'];

        // saving in public storage, if empty save empty file
        Storage::disk('public')
        ->put($path, !empty($validated['content']) ? $validated['content'] : '');


    }
}
