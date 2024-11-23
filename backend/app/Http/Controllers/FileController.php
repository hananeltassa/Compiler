<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FileController extends Controller
{
    function create_file(Request $request, $user_id){
        // validating request data
        $validated = $request->validate([
            'name' => 'required|string',
            'content' => 'nullable|string',   
            'user_id' => 'required|exists:users,id',
        ]);
    }
}
