<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Notification extends Model
{
    protected $table = 'notifications';

    public function setBookingRequest($passenger_id, $driver_id)
    {
        $passenger = User::where('id', $passenger_id)->first();
        $this->user_id = $driver_id;
        $this->message = $passenger->name.'requests ride';
        $this->save();
    }
}
