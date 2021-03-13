<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Rating;
use App\Models\Setting;
use App\Mail\RideCancelMail;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Mail;
use Auth;
use DB;
use Stripe;
use Validator;
use Exception;
use GetStream;

class PassengerController extends Controller
{
    public function getNewNotification() 
    {
        $notification = Notification::where('passenger_id', Auth::user()->id)->where('is_read', 0)->where('is_system_message', 1)->where('whose_notify', 0)->get();
        $notification_count = count($notification);

        return response()->json([
            'notification_count' => $notification_count,
        ]);
    }

    public function getNotification() 
    {
        $notification = DB::table('users')
                        ->leftJoin('notifications', 'users.id', '=', 'notifications.driver_id')
                        ->select('users.name', 'users.phone', 'users.photo','notifications.id', 'notifications.driver_id', 'notifications.system_message', 'notifications.status', 'notifications.created_at', 'notifications.updated_at')
                        ->where('passenger_id', Auth::user()->id)
                        ->where('is_system_message', 1)
                        ->where('whose_notify', 0)
                        ->orderby('created_at', 'desc')
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
            'notification' => $notification,
            'ratings' => $ratings,
        ]);
    }

    public function removeNotify(Request $request) 
    {
        $notify_id = $request->notification_id;
        Notification::where('id', $notify_id)->delete();

        return response()->json(true);
    }

    public function removeNewNotification() 
    {
        $notifications = Notification::where('passenger_id', Auth::user()->id)->where('is_system_message', 1)->where('whose_notify', 0)->get();
        foreach ($notifications as $notification) {
            $notification->is_read = 1;
            $notification->save();
        }

        return response()->json([
            'success' => true,
        ]);
    }

    public function getRideHistory() 
    {
        $histories = DB::table('users')
                        ->leftJoin('orders', 'users.id', '=', 'orders.driver_id')
                        ->select('users.name', 'users.phone', 'users.photo','orders.id', 'orders.departure', 'orders.driver_id', 'orders.destination', 'orders.price', 'orders.trip_distance', 'orders.status', 'orders.order_time', 'orders.number_people', 'orders.created_at', 'orders.updated_at')
                        ->where('passenger_id', Auth::user()->id)
                        // ->where('status', 1)
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
            'histories' => $histories,
            'ratings' => $ratings
        ]);
    }

    public function stripePayment(Request $request)
    {
        $tip = $request->tip;
        $booking_id = $request->booking_id;
        $rating = $request->rating;
        $review = $request->review;
        $booking = Order::where('id', $booking_id)->first();
        $passenger = User::where('id', $booking->passenger_id)->first();
        $driver = User::where('id', $booking->driver_id)->first();

        Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
        $status = Stripe\Charge::create ([
                "amount" => $tip * 100,
                "currency" => "usd",
                "customer" => $passenger->card_token,
                "description" => "Ride tip charged from mydcstaxi.com." 
        ]);

        if ($status[ 'status' ] == "succeeded") { 
            // send text to driver
            $sid    = 'AC8bb1945c1bdce2ba906a02dc9a09b0e9';
            $token  = 'f59efa535be84d309e1e9be7d3683e52';
            $client = new Client($sid, $token);
    
            try {
                $client->messages->create(
                    $driver->phone,
                    [
                        // phone number that you purchased from twilio
                        'from' => '+19418776757',
                        'body' => "You earned $".$booking->price." tip from ".User::where('id', $booking->passenger_id)->first()->name,
                    ]
                );

                $booking->status = 3;       //completed
                $booking->save();

                $driver->balance = $driver->balance + $tip;
                $driver->save();

                $new_rating = new Rating;
                $new_rating->passenger_id = $booking->passenger_id;
                $new_rating->driver_id = $booking->driver_id;
                $new_rating->rating = $rating;
                $new_rating->review = $review;
                $new_rating->save();

                $notify = new Notification;
                $notify->passenger_id = $booking->passenger_id;
                $notify->driver_id = $booking->driver_id;
                $notify->system_message = "You earned $".$booking->price." tip from ".User::where('id', $booking->passenger_id)->first()->name;
                $notify->is_system_message = 1;
                $notify->status = 0;
                $notify->whose_notify = 1;  //to driver
                $notify->status = 2;
                $notify->save();
            } catch (Exception $e) {
                return response()->json(['success' => 0, 'error' => $e->getMessage()]);
            }

            return response()->json(['success' => 1]);
        } else {
            return response()->json(['success' => 2, 'error' => $status]);
        }
    }

    public function stripePayment1(Request $request)
    {
        $stripeToken = $request->token;
        $booking_id = $request->booking_id;
        $rating = $request->rating;
        $review = $request->review;
        $booking = Order::where('id', $booking_id)->first();
        $setting = Setting::where('id', 1)->first();

        Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
        $status = Stripe\Charge::create ([
                "amount" => $booking->price * 100,
                "currency" => "usd",
                "customer" => $stripeToken,
                "description" => "Ride fare charged from mydcstaxi.com." 
        ]);

        if ($status[ 'status' ] == "succeeded") { 
            $booking->status = 1;       //completed
            $booking->save();

            $driver = User::where('id', $booking->driver_id)->first();
            $driver->balance = $driver->balance + $booking->price;
            $driver->save();

            $new_rating = new Rating;
            $new_rating->passenger_id = $booking->passenger_id;
            $new_rating->driver_id = $booking->driver_id;
            $new_rating->rating = $rating;
            $new_rating->review = $review;
            $new_rating->save();

            $notify = new Notification;
            $notify->passenger_id = $booking->passenger_id;
            $notify->driver_id = $booking->driver_id;
            $notify->system_message = "You earned $".$booking->price." from ".User::where('id', $booking->passenger_id)->first()->name;
            $notify->is_system_message = 1;
            $notify->status = 0;
            $notify->whose_notify = 1;  //to driver
            $notify->status = 2;
            $notify->save();

            // send text to driver
            $sid    = env("TWILIO_SID");
            $token  = env("TWILIO_TOKEN");
            $client = new Client( $sid, $token );
    
            try {
                $client->messages->create(
                    $driver->phone,
                    [
                        // phone number that you purchased from twilio
                        'from' => '+19418776757',
                        'body' => "You earned $".$booking->price." from ".User::where('id', $booking->passenger_id)->first()->name,
                    ]
                );
            }
            catch (Exception $e)
            {
                return response()->json(['success' => 0, 'error' => $e->getMessage()]);
            }

            return response()->json(['success' => 1]);
        } else {
            return response()->json(['success' => 2, 'error' => $status]);
        }
    }

    public function bookingCancel(Request $request) 
    {
        $booking_id = $request->booking_id;
        $booking = Order::where('id', $booking_id)->first();
        $passenger = User::where('id', $booking->passenger_id)->first();
        $setting = Setting::where('id', 1)->first();

        Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
        // $cancel_fee = $booking->price * $setting->cancel_fee / 100;
        $cancel_fee = $setting->cancel_fee;
        $status = Stripe\Charge::create ([
                "amount" => $cancel_fee * 100,
                "currency" => "usd",
                "customer" => $passenger->card_token,
                "description" => "Cancel fee from mydcstaxi.com." 
        ]);

        if ($status[ 'status' ] == "succeeded") { 
            $notify = new Notification;
            $notify->passenger_id = $booking->passenger_id;
            $notify->driver_id = $booking->driver_id;
            $notify->system_message = $passenger->name." canceled ride and you got cancel fee $".$cancel_fee;
            $notify->is_system_message = 1;
            $notify->status = 0;
            $notify->whose_notify = 1;  //to driver
            $notify->save();

            $driver = User::where('id', $booking->driver_id)->first();
            $driver->balance += $cancel_fee;
            $driver->save(); 

            //send ride accept mail to passenger
            $name = Auth::user()->name;
            $email = Auth::user()->email;
            $message = Auth::user()->name." canceled ride and you got cancel fee $".$cancel_fee;
            $to = User::where('id', $booking->driver_id)->first()->email;

            $data = array();
            $data = [
                'name' => $name,
                'email' => $email,
                'message' => $message,
                'departure' => $booking->departure,
                'destination' => $booking->destination,
                'number_people' => $booking->number_people,
                'order_time' => $booking->order_time,
            ];

            Mail::to($to)->send(new RideCancelMail($data));

            //send to passenger sms message
            $account_sid = env("TWILIO_SID");
            $auth_token = env("TWILIO_AUTH_TOKEN");
            $from = Auth::user()->phone;
            $to = User::where('id', $booking->driver_id)->first()->phone;

            $client = new Client($account_sid, $auth_token);

            $client->messages->create(
                '+'.$to,
                array(
                    "from" => '+19418776757',
                    "body" => Auth::user()->name." canceled ride request and you got cancel fee $".$cancel_fee
                )
            );

            $booking->status = 2;               //booking canceled
            $booking->save();

            return response()->json(['success' => true, 'cancel_fee' => $cancel_fee]);
        } else {
            return response()->json(['success' => false, 'error' => $status]);
        }
    }

    //in mybookings.js
    public function getOrderDrivers() 
    {
        $drivers = DB::table('users')
                        ->leftJoin('orders', 'users.id', '=', 'orders.driver_id')
                        ->select('orders.id', 'orders.departure', 'orders.destination', 'users.name', 'users.email', 'users.photo', 'users.latitude', 'users.longitude', 'users.current_location')
                        ->where('orders.passenger_id', Auth::user()->id)
                        ->where('orders.status', 1)
                        ->orderby('orders.created_at', 'desc')
                        ->get();

        return response()->json(['drivers' => $drivers]);
    }


    //call in chat.js 
    public function getDrivers() 
    {
        $drivers = DB::table('users')
                        ->leftJoin('orders', 'users.id', '=', 'orders.driver_id')
                        ->select('users.id', 'users.name', 'users.email', 'users.photo')
                        ->where('orders.passenger_id', Auth::user()->id)
                        ->where('orders.status', 1)
                        ->orderby('orders.created_at', 'desc')
                        ->get();

        return response()->json(['drivers' => $drivers]);
    }

    // call in chat.js
    public function getDriver(Request $request)
    {
        $driver_id = $request->driver_id;
        $driver = User::where('id', $driver_id)->first();

        return response()->json($driver);
    }
}
