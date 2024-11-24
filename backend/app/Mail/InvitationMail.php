<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $invitation;
    public $invitationLink;

    /**
     * Create a new message instance.
     *
     * @param $invitation
     */
    public function __construct($invitation, $invitationLink)
    {
        $this->invitation = $invitation;
        $this->invitationLink = $invitationLink;
    }


    /**
     * Build the message.
     */
    public function build()
    {
        return $this->view('emails.invitation')
            ->subject('You Have Been Invited to Collaborate')
            ->with([
                'invitation' => $this->invitation,
                'invitationLink' => $this->invitationLink,
            ]);
    }
}
