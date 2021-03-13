<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Message extends Model
{
    protected $table = 'messages'; 

    // add the mimeType attribute to the array
    protected $appends = array('user');

    // code for $this->mimeType attribute
    public function getUserAttribute($value) {
        return User::find($this->user_id);
    }

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}
