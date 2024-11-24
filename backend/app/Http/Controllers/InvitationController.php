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
        ]);

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
        ]);

        if (!$invitation) {
            return response()->json(['message' => 'Failed to create invitation.'], 500);
        }

        $invitationLink = url("/api/invitations/accept/{$invitation->id}");



        Mail::to($validated['invited_email'])->send(new InvitationMail($invitation, $invitationLink));


        return response()->json(['message' => 'Invitation sent successfully!', 'invitation' => $invitation], 201);
    }


    public function acceptInvitation($id)
    {
        \Log::info('Invitation Accepting', ['invitation_id' => $id]);
    
        try {
            $invitation = Invitation::findOrFail($id);
    
            \Log::info('Invitation Found', ['invitation' => $invitation]);
    
            // Check if status is exactly 'pending' (lowercase)
            if ($invitation->status !== 'pending') {
                \Log::info('Invitation Already Processed', ['invitation_id' => $id, 'status' => $invitation->status]);
                return response()->json(['message' => 'This invitation has already been processed.'], 400);
            }
    
            // Update status to 'accepted' and save
            $invitation->status = 'accepted';
            $invitation->save();
            
            \Log::info('Invitation Accepted and Saved', ['invitation_id' => $id, 'status' => $invitation->status]);
    
            return response()->json(['message' => 'Invitation accepted successfully!'], 200);
        } catch (\Exception $e) {
            \Log::error('Error accepting invitation', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to process the request.'], 500);
        }
    }
    


}
