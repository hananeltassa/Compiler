<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collaborator extends Model
{
    protected $fillable = [
        'file_id',
        'user_id',
        'invited_email',
        'role',
        'status',
        'invited_at',
        'accepted_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function file()
    {
        return $this->belongsTo(File::class);
    }

    public function collaborators()
    {
        return $this->belongsToMany(User::class, 'collaborators');
    }
}