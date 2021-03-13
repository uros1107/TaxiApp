<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Notification;
use App\Models\Order;
use App\Models\Rating;
use App\Models\Setting;
use App\Models\Withdrawal;
use App\Models\AdminNotification;
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Mail;
use App\Mail\RideAcceptMail;
use App\Mail\RideRejectMail;
use Auth;
use Image;
use DB;
use Session;
use Stripe;
use GetStream;

class DriverController extends Controller
{
    public function driverSearch(Request $request) 
    {
        $departure_lat = $request->departure_lat;
        $departure_lon = $request->departure_lon;
        $destination_lat = $request->destination_lat;
        $destination_lon = $request->destination_lon;
        $drivers = array();

        $setting = Setting::where('id', 1)->first();
        // $trip_distance = $this->distance($departure_lat, $departure_lon, $destination_lat, $destination_lon, 'M');
        $trip_distance = $this->getDrivingDistance($departure_lat, $departure_lon, $destination_lat, $destination_lon);
        Session::put('trip_distance', $trip_distance);
        $trip_fare = round($trip_distance * $setting->fare_per_mile); 
        Session::put('trip_fare', $trip_fare);

        $datas = DB::table('users')
                        ->leftJoin('vehicles', 'users.id', '=', 'vehicles.driver_id')
                        ->select('users.id', 'users.name', 'users.email', 'users.latitude', 'users.longitude', 'users.current_location', 'users.phone', 'users.photo', 'vehicles.car_image')
                        ->where('role', 1)
                        ->where('is_online', 1)
                        ->where('is_actived', 1)
                        ->get();
        
        foreach($datas as $data) {
            $distance = $this->distance($data->latitude, $data->longitude, $departure_lat, $departure_lon, 'M');
            if($distance <= $setting->radius) {
                $drivers[] = $data;
            }
        }

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
        
        //get ride count
        $ride_count = 0;
        $rides = array();
        foreach(User::where('role', 1)->get() as $driver) {
            $datas = Order::where('driver_id', $driver->id)->where('status', 1)->get();
            if(count($datas) != 0) {
                $ride_count = count($datas);
                $rides[$driver->id] = $ride_count;
            } else {
                $rides[$driver->id] = 0;
            }
        }

        return response()->json([
            'drivers' => $drivers,
            'ratings' => $ratings,
            'rides' => $rides,
            'trip_fare' => $trip_fare
        ]);
    }

    private function distance($lat1, $lon1, $lat2, $lon2, $unit) {
        if (($lat1 == $lat2) && ($lon1 == $lon2)) {
            return 0;
        }
        else {
            $theta = $lon1 - $lon2;
            $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
            $dist = acos($dist);
            $dist = rad2deg($dist);
            $miles = $dist * 60 * 1.1515;
            $unit = strtoupper($unit);
      
            if ($unit == "K") {
                return (round($miles * 1.609344, 2));
            } else if ($unit == "N") {
                return (round($miles * 0.8684, 2));
            } else {
                return round($miles, 2);
            }
        }
    }

    private function getDrivingDistance($lat1, $long1, $lat2, $long2)
    {
        $url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=".$lat1.",".$long1."&destinations=".$lat2.",".$long2."&mode=driving&language=pl-PL&key=AIzaSyBoY4Yn60USF1fDNIm65QVpRBowNeBBgbA";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_PROXYPORT, 3128);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        $response = curl_exec($ch);
        curl_close($ch);
        $response_a = json_decode($response, true);
        $dist = intval($response_a['rows'][0]['elements'][0]['distance']['text']) * 0.621371;       //change km to mile
        $time = $response_a['rows'][0]['elements'][0]['duration']['text'];

        // return array('distance' => $dist, 'time' => $time);
        return round($dist, 2);
    }

    public function driverInfo(Request $request) 
    {
        $driver_id = $request->driver_id;
        $driver = User::where('id', $driver_id)->first();

        return response()->json($driver);
    }

    public function getNewNotification() 
    {
        $notification = Notification::where('driver_id', Auth::user()->id)->where('is_read', 0)->where('whose_notify', 1)->get();
        $notification_count = count($notification);

        return response()->json([
            'notification' => $notification,
            'notification_count' => $notification_count,
        ]);
    }

    public function removeNewNotification() 
    {
        $notifications = Notification::where('driver_id', Auth::user()->id)->where('whose_notify', 1)->get();
        foreach ($notifications as $notification) {
            $notification->is_read = 1;
            $notification->save();
        }

        return response()->json([
            'success' => true,
        ]);
    }

    public function getNotification() 
    {
        $notification = DB::table('users')
                        ->leftJoin('notifications', 'users.id', '=', 'notifications.passenger_id')
                        ->select('users.name', 'users.phone', 'users.photo','notifications.id', 'notifications.driver_message', 'notifications.departure', 'notifications.destination', 'notifications.order_time', 'notifications.number_people', 'notifications.trip_fare', 'notifications.trip_distance', 'notifications.passenger_message', 'notifications.is_system_message', 'notifications.system_message', 'notifications.status', 'notifications.whose_notify', 'notifications.created_at', 'notifications.updated_at')
                        ->where('driver_id', Auth::user()->id)
                        ->where('whose_notify', 1)
                        ->orderby('notifications.created_at', 'desc')
                        ->get();

        return response()->json($notification);
    }

    public function requestAccept(Request $request) 
    {
        $notification = Notification::where('id', $request->notification_id)->first();
        // $order = new Order;
        // $order->driver_id = $notification->driver_id;
        // $order->passenger_id = $notification->passenger_id;
        // $order->departure = $notification->departure;
        // $order->destination = $notification->destination;
        // $order->number_people = $notification->number_people;
        // $order->order_time = $notification->order_time;
        // $order->message = $notification->passenger_message;
        // $order->price = $notification->trip_fare;
        // $order->trip_distance = $notification->trip_distance;
        // $order->status = 1;     //ride accepted
        // $order->save();

        if($this->processPayment($notification->order_id)) {
            $order = Order::where('id', $notification->order_id)->first();
            $order->status = 1;         //ride accepted
            $order->save();
    
            $driver = User::where('id', $notification->driver_id)->first();
            $set_notify = new Notification;
            $set_notify->driver_id = $notification->driver_id;
            $set_notify->passenger_id = $notification->passenger_id;
            $set_notify->system_message = $driver->name." accepted your ride";
            $set_notify->is_read = 0;
            $set_notify->is_system_message = 1;
            $set_notify->status = 1;    //accept
            $set_notify->save();
    
            //send ride accept mail to passenger
            $name = Auth::user()->name;
            $email = Auth::user()->email;
            $message = Auth::user()->name." accepted your ride request";
            $to = User::where('id', $notification->passenger_id)->first()->email;
    
            $data = array();
            $data = [
                'name' => $name,
                'email' => $email,
                'message' => $message,
                'departure' => $notification->departure,
                'destination' => $notification->destination,
                'number_people' => $notification->number_people,
                'order_time' => $notification->order_time,
            ];
    
            Mail::to($to)->send(new RideAcceptMail($data));
    
            //send sms message to passenger
            $account_sid = env("TWILIO_SID");
            $auth_token = env("TWILIO_AUTH_TOKEN");
            $from = Auth::user()->phone;
            $to = User::where('id', $notification->passenger_id)->first()->phone;
    
            $client = new Client($account_sid, $auth_token);
    
            $client->messages->create(
                '+'.$to,
                array(
                    "from" => '+19418776757',
                    "body" => Auth::user()->name." accepted your ride request"
                )
            );
    
            Notification::where('id', $request->notification_id)->where('is_system_message', 0)->delete();

            return response()->json(['success' => true]);
        } else {
            return response()->json(['success' => false]);
        }
    }

    public function processPayment($order_id) 
    {
        $order = Order::where('id', $order_id)->first();
        $passenger = User::where('id', $order->passenger_id)->first();

        Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
        $status = Stripe\Charge::create([
                "amount" => $order->price * 100,
                "currency" => "usd",
                "customer" => $passenger->card_token,                 //stripe customer id
                "description" => "Ride fare charged from mydcstaxi.com."
        ]);

        if ($status[ 'status' ] == "succeeded") { 
            $order->is_paid = 1;        //paid   
            $order->save();
            
            //-------------------------------------- Send notification, email and text to driver for payment
            $driver = User::where('id', $order->driver_id)->first();
            // $driver->balance = round($driver->balance + $order->price * (1 - $setting->fee/100), 2);
            $driver->balance = $driver->balance + $order->price;
            $driver->save();

            $notify = new Notification;
            $notify->passenger_id = $order->passenger_id;
            $notify->driver_id = $order->driver_id;
            // $notify->system_message = "You earned $".round($order->price * (1 - $setting->fee/100), 2)." from ".User::where('id', $order->passenger_id)->first()->name;
            $notify->system_message = "You earned $".$order->price." from ".User::where('id', $order->passenger_id)->first()->name;
            $notify->is_system_message = 1;
            $notify->status = 0;
            $notify->whose_notify = 1;  //to driver
            $notify->status = 2;
            $notify->save();

            // send text to driver
            $sid    = env("TWILIO_SID");
            $token  = env("TWILIO_AUTH_TOKEN");
            $client = new Client( $sid, $token );
    
            $client->messages->create(
                $driver->phone,
                [
                    'from' => '+19418776757',
                    'body' => "You earned $".$order->price." from ".User::where('id', $order->passenger_id)->first()->name,
                ]
            );

            //-------------------------------------- Send notification, email and text to passenger for payment
            $passenger = User::where('id', $order->passenger_id)->first();

            $notify = new Notification;
            $notify->passenger_id = $order->passenger_id;
            $notify->driver_id = $order->driver_id;
            $notify->system_message = "You paid $".$order->price." to ".User::where('id', $order->driver_id)->first()->name." for your ride";
            $notify->is_system_message = 1;
            $notify->status = 0;
            $notify->whose_notify = 0;  //to driver
            $notify->status = 2;
            $notify->save();

            // send text to driver
            $sid    = env("TWILIO_SID");
            $token  = env("TWILIO_AUTH_TOKEN");
            $client = new Client( $sid, $token );

            $client->messages->create(
                $passenger->phone,
                [
                    'from' => '+19418776757',
                    'body' => "You paid $".$order->price." to ".User::where('id', $order->driver_id)->first()->name." for your ride"
                ]
            );

            return true;
        } else {
            return false;
        }
    }

    public function requestReject(Request $request) 
    {
        $notification = Notification::where('id', $request->notification_id)->first();
        $driver = User::where('id', $notification->driver_id)->first();

        //send ride accept mail to passenger
        $name = Auth::user()->name;
        $email = Auth::user()->email;
        $message = Auth::user()->name." declined your ride request";
        $to = User::where('id', $notification->passenger_id)->first()->email;

        $data = array();
        $data = [
            'name' => $name,
            'email' => $email,
            'message' => $message,
            'departure' => $notification->departure,
            'destination' => $notification->destination,
            'number_people' => $notification->number_people,
            'order_time' => $notification->order_time,
        ];

        Mail::to($to)->send(new RideRejectMail($data));

        //send to passenger sms message
        $account_sid = env("TWILIO_SID");
        $auth_token = env("TWILIO_AUTH_TOKEN");
        $from = Auth::user()->phone;
        $to = User::where('id', $notification->passenger_id)->first()->phone;

        $client = new Client($account_sid, $auth_token);

        $client->messages->create(
            '+'.$to,
            array(
                "from" => '+19418776757',
                "body" => Auth::user()->name." declined your ride request"
            )
        );

        $set_notify = new Notification;
        $set_notify->driver_id = $notification->driver_id;
        $set_notify->passenger_id = $notification->passenger_id;
        $set_notify->system_message = $driver->name." declined your ride";
        $set_notify->is_read = 0;
        $set_notify->is_system_message = 1;
        $set_notify->status = 0;    //declined
        $set_notify->save();

        // $order = new Order;
        // $order->driver_id = $notification->driver_id;
        // $order->passenger_id = $notification->passenger_id;
        // $order->departure = $notification->departure;
        // $order->destination = $notification->destination;
        // $order->number_people = $notification->number_people;
        // $order->order_time = $notification->order_time;
        // $order->message = $notification->passenger_message;
        // $order->price = $notification->trip_fare;
        // $order->status = 2; //order canceled
        // $order->save();

        $order = Order::where('id', $notification->order_id)->first();
        $order->status = 2;         //order canceled
        $order->save();

        Notification::where('id', $request->notification_id)->where('is_system_message', 0)->delete();

        return response()->json(['success' => true]);
    }

    public function vehicle() 
    {
        $vehicle = Vehicle::where('driver_id', Auth::user()->id)->first();

        return response()->json($vehicle);
    }

    public function updatelocation(Request $request) 
    {
        $user = User::where('id', Auth::user()->id)->first();
        $user->latitude = $request->latitude;
        $user->longitude = $request->longitude;

        // get google address from lat and lng
        $url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=".$request->latitude.",".$request->longitude."&key=AIzaSyBoY4Yn60USF1fDNIm65QVpRBowNeBBgbA";
        $json = file_get_contents($url);
        $data=json_decode($json);
        $status = $data->status;

        if ($status=="OK") {
            $user->current_location = $data->results[0]->formatted_address;
        } else {
            return response()->json(['success' => false]);
        }
        $user->save();

        return response()->json(['success' => true]);
    }

    public function getRating() 
    {
        $ratings = DB::table('users')
                        ->leftJoin('ratings', 'users.id', '=', 'ratings.passenger_id')
                        ->select('users.name', 'users.phone', 'users.photo','ratings.id', 'ratings.rating', 'ratings.review', 'ratings.driver_id', 'ratings.created_at', 'ratings.updated_at')
                        ->where('driver_id', Auth::user()->id)
                        ->orderby('ratings.created_at', 'desc')
                        ->get();

        return response()->json($ratings);
    }

    public function setOnline(Request $request) 
    {
        $is_online = $request->set_online;
        $driver = User::where('id', Auth::user()->id)->first();
        $driver->is_online = $is_online == "true"? 1 : 0 ;
        $driver->save();

        return response()->json(['success' => true]);
    }

    public function requestWithdrawal(Request $request) 
    {
        $amount = $request->amount;
        $number = $request->number;
        $exp_month = $request->exp_month;
        $exp_year = $request->exp_year;
        $cvc = $request->cvc;

        $driver = User::where('id', Auth::user()->id)->first();
        if ($driver->balance >= 0) {
            $withdraw = new Withdrawal;
            $withdraw->user_id = $driver->id;
            $withdraw->amount = $amount;
            $withdraw->method = "stripe";
            $withdraw->card_number = $number;
            $withdraw->exp_month = $exp_month;
            $withdraw->exp_year = $exp_year;
            $withdraw->cvc = $cvc;
            $withdraw->save();

            if ($withdraw->save()) { 
                $admin_notify = new AdminNotification;
                $admin_notify->user_id = $driver->id;
                $admin_notify->system_message = $driver->name." requests withdrawal of $".$amount;
                $admin_notify->save();
                return response()->json(['success' => true]);
            } else {
                return response()->json(['success' => false]);
            }
        } else {
            return response()->json(['error' => 'No your balance is enough']);
        }
    }

    public function getMyEarning() 
    {
        $user = User::where('id', Auth::user()->id)->first();

        return response()->json(number_format($user->balance, 2, '.', ''));
    }

    public function vehicleupdate(Request $request) 
    {
        $brand = $request->brand;
        $model = $request->model;
        $carplate = $request->carplate;
        $photo = $request->file('image');
        $uploadCheck = $request->uploadCheck;

        if ($file = $request->get('file') && $uploadCheck) 
        {       
            $image = $request->get('file');
            $name = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            Image::make($request->get('file'))->save(public_path("assets/images/cars/a").$name);        
        } 

        $vehicle = Vehicle::where('driver_id', Auth::user()->id)->first();
        $vehicle->car_brand = $brand;
        $vehicle->car_model = $model;
        $vehicle->car_plate = $carplate;
        if ($file = $request->get('file') && $uploadCheck) {
            $vehicle->car_image = $name;
        }
        $vehicle->save();

        return response()->json(['success' => true]);
    }

    public function getOrderPassengers()
    {
        $passengers = DB::table('users')
                    ->leftJoin('orders', 'users.id', '=', 'orders.passenger_id')
                    ->select('*')
                    ->where('orders.driver_id', Auth::user()->id)
                    ->where('orders.status', 1)
                    ->orderby('orders.created_at', 'desc')
                    ->get();
        return response()->json($passengers);
    }

    // call in chat.js
    public function getPassengers()
    {
        $passengers = DB::table('users')
                    ->leftJoin('orders', 'users.id', '=', 'orders.passenger_id')
                    ->select('users.id', 'users.name', 'users.photo')
                    ->where('orders.driver_id', Auth::user()->id)
                    ->where('orders.status', 1)
                    ->orderby('orders.created_at', 'desc')
                    ->get();
        return response()->json($passengers);
    }

    // call in chat.js
    public function getPassenger(Request $request)
    {
        $passenger_id = $request->passenger_id;
        $passenger = User::where('id', $passenger_id)->first();

        return response()->json($passenger);
    }
}
