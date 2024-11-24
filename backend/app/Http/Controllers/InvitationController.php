<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use Illuminate\Support\Facades\Mail;

use App\Mail\InvitationMail;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class InvitationController extends Controller
{
    public function sendInvitation(Request $request)
    {
        $validated = $request->validate([
            'file_id' => 'required|exists:files,id',
            'invited_email' => 'required|email',
            'role' => 'required|in:editor,viewer',
        ]);

        $existingUser = \App\Models\User::where('email', $validated['invited_email'])->first();
        if (!$existingUser) {
            return response()->json(['message' => 'The invited email does not belong to any registered user.'], 404);
        }

        $user = JWTAuth::parseToken()->authenticate();

        $existingInvitation = Invitation::where('file_id', $validated['file_id'])
            ->where('invited_email', $validated['invited_email'])
            ->first();

        if ($existingInvitation) {
            return response()->json(['message' => 'Invitation already sent.'], 409);
        }

        $invitation = Invitation::create([
            'file_id' => $validated['file_id'],
            'invited_email' => $validated['invited_email'],
            'user_id' => $user->id,
            'status' => 'Pending',
            'role' => $validated['role'],
        ]);

        if (!$invitation) {
            return response()->json(['message' => 'Failed to create invitation.'], 500);
        }

        Mail::to($validated['invited_email'])->send(new InvitationMail($invitation));

        return response()->json(['message' => 'Invitation sent successfully!', 'invitation' => $invitation], 201);
    }


    public function acceptInvitation($id)
    {
        \Log::info('Invitation Accepting', ['invitation_id' => $id]);
    
        try {
            $invitation = Invitation::findOrFail($id);
    
            if ($invitation->status !== 'pending') {
                return response()->json(['message' => 'This invitation has already been processed.'], 400);
            }
    
            $invitation->status = 'accepted';
            $invitation->save();
    
            return response()->json(['message' => 'Invitation accepted successfully!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to process the request.'], 500);
        }
    }

    public function denyInvitation($id)
    {
        \Log::info('Invitation Denying', ['invitation_id' => $id]);
    
        try {
            $invitation = Invitation::findOrFail($id);
    
            if ($invitation->status !== 'pending') {
                return response()->json(['message' => 'This invitation has already been processed.'], 400);
            }
    
            $invitation->status = 'declined';
            $invitation->save();
            
    
            return response()->json(['message' => 'Invitation denied successfully!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to process the request.'], 500);
        }
    }
    


}
