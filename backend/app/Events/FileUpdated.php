<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FileUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $fileId;
    public $content;

    public function __construct($fileId, $content)
    {
        $this->fileId = $fileId;
        $this->content = $content;
    }

    public function broadcastOn()
    {
        return new Channel('file.' . $this->fileId); // File-specific channel
    }
}
