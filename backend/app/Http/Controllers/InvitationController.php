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

        $invitationLink = url("/invitation/accept/{$invitation->id}");


        Mail::to($validated['invited_email'])->send(new InvitationMail($invitation, $invitationLink));


        return response()->json(['message' => 'Invitation sent successfully!', 'invitation' => $invitation], 201);
    }

    public function listInvitations(Request $request)
    {
        $invitations = Invitation::with('file')
            ->where('invited_email', $request->user()->email)
            ->orWhereHas('file', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->get();

        return response()->json(['invitations' => $invitations]);
    }


    public function updateInvitationStatus(Request $request, $id){
        $validated = $request->validate([
            'status' => 'required|in:Pending,Accepted,Denied',
        ]);

        $invitation = Invitation::findOrFail($id);

        $invitation->update(['status' => $validated['status']]);

        return response()->json(['message' => 'Invitation status updated successfully!', 'invitation' => $invitation]);
    }


}
