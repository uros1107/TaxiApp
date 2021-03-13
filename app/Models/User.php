<?php

// namespace App;
namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Model;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'users'; 
    protected $fillable = ['name', 'lastname', 'email', 'password', 'photo', 'phone', 'card_token', 'phone_verified', 'role', 'remember_token'];

    public function drivers()
    {
        return $this->hasMany('App\Models\Order', 'driver_id');
    }

    public function passengers()
    {
        return $this->hasMany('App\Models\Order', 'passenger_id');
    }

    public function messages()
    {
        return $this->hasMany('App\Models\Message');
    }
}
