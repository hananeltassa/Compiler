<?php

namespace App\Http\Controllers;

use App\Models\Collaborator;
use App\Models\User; 
use App\Models\File;  
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\CollaborationInvitationMail;

class CollaboratorController extends Controller
{

    public function index(Request $request){

        $request->validate([
            'file_id' => 'required|exists:files,id',
        ]);

        $collaborators = Collaborator::with('user')
            ->where('file_id', $request->file_id)
            ->get();

        return response()->json([
            'collaborators' => $collaborators
        ]);
    }

    public function delete(Request $request)
    {
        $request->validate([
            'file_id' => 'required|exists:files,id',
            'user_id' => 'required|exists:users,id', 
        ]);
        

        $collaborator = Collaborator::where('file_id', $request->file_id)
                                    ->where('user_id', $request->user_id)
                                    ->first();

        if (!$collaborator) {
            return response()->json(['error' => 'Collaborator not found for this file.'], 404);
        }

        $collaborator->delete();

        return response()->json([
            'message' => 'Collaborator removed successfully.'
        ]);
    }

}
