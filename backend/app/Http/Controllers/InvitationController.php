<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class InvitationController extends Controller
{
    public function sendInvitation(Request $request)
{
    $validated = $request->validate([
        'file_id' => 'required|exists:files,id',
        'invited_email' => 'required|email',
    ]);

    $existingInvitation = Invitation::where('file_id', $validated['file_id'])
        ->where('invited_email', $validated['invited_email'])
        ->first();

    if ($existingInvitation) {
        return response()->json(['message' => 'Invitation already sent.'], 409);
    }

    $invitation = Invitation::create($validated);

    Mail::to($validated['invited_email'])->send(new InvitationMail($invitation));

    return response()->json(['message' => 'Invitation sent successfully!', 'invitation' => $invitation], 201);
}
}
