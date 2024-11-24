<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{
    protected $fillable = ['file_id', 'invited_email', 'user_id', 'status', 'role'];


    public function file()
    {
        return $this->belongsTo(File::class);
    }
}
