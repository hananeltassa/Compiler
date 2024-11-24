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

    use SerializesModels;

    public $fileId;
    public $changes;
    public $userId;

    public function __construct($fileId, $changes, $userId)
    {
        $this->fileId = $fileId;
        $this->changes = $changes;
        $this->userId = $userId;
    }

    public function broadcastOn()
    {
        return new PresenceChannel('file.' . $this->fileId);
    }
}
