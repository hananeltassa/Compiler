<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class FileUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
 
    public $filePath;
    public $content;

    public function __construct($filePath, $content)
    {
        $this->filePath = $filePath;
        $this->content = $content;
    }

    public function broadcastOn()
    {
        return new Channel('file.' . $this->filePath);
    }

    public function broadcastAs()
    {
        return 'FileUpdated';
    }

}
