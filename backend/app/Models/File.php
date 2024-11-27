<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $fillable = [
        "name", 
        "language",
        "path", 
        "user_id"
    ];

    // Define relationship with invitations
    public function invitations()
    {
        return $this->hasMany(Invitation::class);
    }

    // Define relationship with the user who owns the file
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
