<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;
use App\Models\Rating;
use App\Models\Notification;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Mail;
use App\Mail\RideRequestMail;
use Session;
use DB;
use Auth;

class OrderController extends Controller
{
    public function reqeustOrder(Request $request) 
    {
        $passenger_name = $request->passenger_name;
        $passenger_phone = $request->phone_number;
        $departure = $request->departure;
        $destination = $request->destination;
        $order_time = $request->booking_time;
        $number_people = $request->number_people;
        $message = $request->message;
        $driver_id = $request->driver_id;

        //send ride request mail to driver 
        $name = Auth::user()->name;
        $email = Auth::user()->email;
        $message = "You have a new ride request from ".Auth::user()->name;
        $to = User::where('id', $driver_id)->first()->email;

        $data = array();
        $data = [
            'name' => $name,
            'email' => $email,
            'message' => $message,
            'departure' => $departure,
            'destination' => $destination,
            'number_people' => $number_people,
            'order_time' => $order_time,
        ];

        Mail::to($to)->send(new RideRequestMail($data));

        //send ride request sms message to driver 
        $account_sid = env("TWILIO_SID");
        $auth_token = env("TWILIO_AUTH_TOKEN");
        $from = Auth::user()->phone;
        $to = User::where('id', $driver_id)->first()->phone;

        $client = new Client($account_sid, $auth_token);

        $client->messages->create(
            '+'.$to,
            array(
                "from" => '+19418776757',
                "body" => "You have a new ride request from ".Auth::user()->name
            )
        );

        $order = new Order;
        $order->driver_id = $driver_id;
        $order->passenger_id = Auth::user()->id;
        $order->departure = $departure;
        $order->destination = $destination;
        $order->number_people = $number_people;
        $order->order_time = $order_time;
        $order->message = $message;
        $order->price = Session::get('trip_fare');
        $order->trip_distance = Session::get('trip_distance');
        $order->status = 0;     //ride pending
        $order->save();

        $notification = new Notification;
        $notification->driver_id = $driver_id;
        $notification->passenger_id = Auth::user()->id;
        $notification->departure = $departure;
        $notification->destination = $destination;
        $notification->order_time = $order_time;
        $notification->number_people = $number_people;
        $notification->passenger_message = $message;
        $notification->driver_message = Auth::user()->name." requests ride now";
        $notification->whose_notify = 1;        //to driver
        $notification->trip_fare = Session::get('trip_fare');
        $notification->trip_distance = Session::get('trip_distance');
        $notification->order_id = $order->id;
        $notification->save();

        // try {
        //     $push_notification = $client->notify->v1->services("MG4ce2704c25cf87298465597cccf34f4a")
        //                            ->notifications
        //                            ->create([
        //                                         "body" => "You have new ride(push notification)",
        //                                         "identity" => ["00000001"]
        //                                     ]
        //                            );
        // } catch(Exception $e) {
        //     return response()->json(['success' => 0, 'error' => $e->getMessage()]);
        // }

        return response()->json(['success' => true]);
    }

    public function getmybooking() 
    {
        $order = new Order;
        if(Auth::user()->role == 0) {       //when passenger

            $bookings = DB::table('users')
                            ->leftJoin('orders', 'users.id', '=', 'orders.driver_id')
                            ->leftJoin('vehicles', 'orders.driver_id', '=', 'vehicles.driver_id')
                            ->select('orders.id', 'orders.departure', 'orders.destination', 'orders.order_time', 'orders.driver_id', 'orders.number_people', 'orders.price', 'orders.trip_distance', 'orders.status', 'vehicles.car_image', 'users.name', 'users.email', 'users.photo')
                            ->where('orders.passenger_id', Auth::user()->id)
                            ->whereIn('status', array(0, 1))
                            ->orderby('orders.created_at', 'desc')
                            ->get();

            // get rating of every driver
            $driver_rating = 0;
            $ratings = array();
            foreach(User::where('role', 1)->get() as $driver) {
                $datas = Rating::where('driver_id', $driver->id)->get();
                if(count($datas) != 0) {
                    $count = count($datas);
                    foreach ($datas as $data) {
                        $driver_rating += $data->rating;
                    }
                    $ratings[$driver->id] = round($driver_rating / $count, 1);
                } else {
                    $ratings[$driver->id] = 0;
                }
            }
           
            return response()->json([
                'bookings' => $bookings,
                'ratings' => $ratings
            ]);

        } elseif(Auth::user()->role == 1) {     //when driver

            $bookings = DB::table('users')
                            ->leftJoin('orders', 'users.id', '=', 'orders.passenger_id')
                            ->select('*')
                            ->where('orders.driver_id', Auth::user()->id)
                            ->where('orders.status', 1)
                            ->orderby('orders.created_at', 'desc')
                            ->get();
            return response()->json([
                'bookings' => $bookings,
                'ratings' => ''
            ]);
        }
    }
}
