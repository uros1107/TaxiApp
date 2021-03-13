<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'orders'; 
    protected $fillable = ['driver_id','passenger_id','departure','destination','order_time','number_people','car_type', 'price', 'trip_distance', 'status', 'message'];

    public function drivers()
    {
        return $this->hasMany('App\Models\User', 'id');
    }

    public function passengers()
    {
        return $this->hasMany('App\Models\User', 'id');
    }
}
