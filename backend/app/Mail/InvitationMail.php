<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $invitation;
    public $acceptLink;
    public $denyLink;


    /**
     * Create a new message instance.
     *
     * @param $invitation
     */
    public function __construct($invitation)
    {
        $this->invitation = $invitation;
        $this->acceptLink = url("/api/invitations/accept/{$invitation->id}");
        $this->denyLink = url("/api/invitations/deny/{$invitation->id}");
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
                'acceptLink' => $this->acceptLink,
                'denyLink' => $this->denyLink,
            ]);
    }
}
