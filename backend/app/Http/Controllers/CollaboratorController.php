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

    public function invite(Request $request){
        $request->validate([
            'role' => 'required|in:Editor,Viewer', 
        ]);




        $file = File::find($request->file_id);
        if (!$file) {
            return response()->json(['error' => 'The specified file does not exist.'], 404);
        }

        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json(['error' => 'The specified user does not exist.'], 404);
        }

        $collaborator = Collaborator::create([
            'file_id' => $request->file_id,
            'user_id' => $request->user_id,
            'role' => $request->role
        ]);

        return response()->json([
            'message' => 'Collaborator invited successfully',
            'collaborator' => $collaborator
        ], 201);
    }

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
