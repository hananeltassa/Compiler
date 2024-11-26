<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $fillable = [
        "name", 
        "content",
        "language",
        "path", 
        "user_id"
    ];


}
