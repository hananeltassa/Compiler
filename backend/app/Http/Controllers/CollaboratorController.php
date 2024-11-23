<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\User;
use Illuminate\Http\Request;

class CollaboratorController extends Controller
{
    //invite users to collab
    public function invite(Request $request){
        $request -> validate([
            'file_id' => 'required|exi'
        ]);
    }
}
