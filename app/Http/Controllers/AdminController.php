<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;
use App\Models\Notification;
use App\Models\Vehicle;
use App\Models\Rating;
use App\Models\Setting;
use App\Models\AdminNotification;
use App\Models\Withdrawal;
use App\Models\SocialAccount;
use Twilio\Rest\Client;
use App\Mail\RideAcceptMail;
use App\Mail\RideRejectMail;
use Illuminate\Support\Facades\Mail;
use Image;
use Stripe;
use Hash;
use DB;
use Auth;
use Exception;

class AdminController extends Controller
{
    public function getAllPassenger()
    {
        $passengers = User::where('role', 0)->orderby('created_at', 'desc')->get();

        return response()->json($passengers);
    }

    public function getAllDriver()
    {
        $drivers = User::where('role', 1)->orderby('created_at', 'desc')->get();

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
            'drivers' => $drivers,
            'ratings' => $ratings
        ]);
    }

    public function getNewNotification()
    {
        $notification = AdminNotification::where('is_read', 0)->get();
        $notification_count = count($notification);

        return response()->json([
            'notification_count' => $notification_count,
        ]);
    }

    public function removeNewNotification() 
    {
        $notifications = AdminNotification::where('is_read', 0)->get();
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
        $notification = DB::table('admin_notifications')
                        ->leftJoin('users', 'users.id', '=', 'admin_notifications.user_id')
                        ->select('users.name', 'users.phone', 'users.photo','admin_notifications.id', 'admin_notifications.user_id', 'admin_notifications.system_message', 'admin_notifications.created_at', 'admin_notifications.updated_at')
                        ->orderby('created_at', 'desc')
                        ->get();
        $ratings = '';

        return response()->json([
            'notification' => $notification,
            'ratings' => $ratings
        ]);
    }

    public function removeAdminNotify(Request $request) 
    {
        AdminNotification::where('id', $request->notification_id)->delete();

        return response()->json(['success' => true]);
    }

    public function customDelete(Request $request)
    {
        $custom_id = $request->custom_id;
        Notification::where('passenger_id', $custom_id)->where('whose_notify', 0)->delete();
        Order::where('passenger_id', $custom_id)->delete();
        Rating::where('passenger_id', $custom_id)->delete();
        SocialAccount::where('user_id', $custom_id)->delete();
        User::where('id', $custom_id)->delete();

        return response()->json(['success' => true]);
    }

    public function customEdit(Request $request)
    {
        $custom = User::where('id', $request->custom_id)->first();

        return response()->json($custom);
    }

    public function driverEdit(Request $request)
    {
        $driver = User::where('id', $request->driver_id)->first();
        $vehicle = Vehicle::where('driver_id', $request->driver_id)->first();

        return response()->json([
            'driver' => $driver,
            'vehicle' => $vehicle
        ]);
    }

    public function driverView(Request $request)
    {
        $driver_id = $request->driver_id;

        $driver = User::where('id', $request->driver_id)->first();
        $vehicle = Vehicle::where('driver_id', $request->driver_id)->first();

        $ratings = DB::table('users')
                        ->leftJoin('ratings', 'users.id', '=', 'ratings.passenger_id')
                        ->select('users.name', 'users.phone', 'users.photo','ratings.id', 'ratings.rating', 'ratings.review', 'ratings.driver_id', 'ratings.created_at', 'ratings.updated_at')
                        ->where('driver_id', $driver_id)
                        ->orderby('ratings.created_at', 'desc')
                        ->get();

        return response()->json([
            'driver' => $driver,
            'vehicle' => $vehicle,
            'ratings' => $ratings
        ]);
    }


    public function profileupdate(Request $request)
    {
        $user_id = $request->id;
        $username = $request->name;
        $email = $request->email;
        // $password = $request->password;
        $phone = $request->phone;
        $photo = $request->file('image');
        $uploadCheck = $request->uploadCheck;

        if ($file = $request->get('file') && $uploadCheck) 
        {       
            $image = $request->get('file');
            $name = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            Image::make($request->get('file'))->save(public_path("assets/images/users/a").$name);        
        } 

        $user = User::where('id', $user_id)->first();
        $user->name = $username;
        $user->email = $email;
        // $user->password = Hash::make($password);
        $user->phone = $phone;
        if ($file = $request->get('file') && $uploadCheck) {
            $user->photo = $name;
        }
        $user->save();

        if ($user->save()) {
            return response()->json(['success' => true, 'user' => $user]);
        } else {
            return response()->json(['success' => false]);
        }
    }

    public function driverProfileupdate(Request $request)
    {
        // profile
        $user_id = $request->id;
        $username = $request->name;
        $email = $request->email;
        // $password = $request->password;
        $phone = $request->phone;
        $is_actived = $request->is_actived;
        $photo = $request->file('image');
        $uploadCheck = $request->uploadCheck;

        // vehicle
        $brand = $request->brand;
        $model = $request->model;
        $carplate = $request->carplate;
        $photo1 = $request->file('image1');
        $uploadCheck1 = $request->uploadCheck1;

        // profile
        if ($file = $request->get('file') && $uploadCheck) 
        {       
            $image = $request->get('file');
            $name = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            Image::make($request->get('file'))->save(public_path("assets/images/users/a").$name);        
        } 

        // vehicle
        if ($file = $request->get('file1') && $uploadCheck1) 
        {       
            $image1 = $request->get('file1');
            $name1 = time().'.' . explode('/', explode(':', substr($image1, 0, strpos($image1, ';')))[1])[1];
            Image::make($request->get('file1'))->save(public_path("assets/images/cars/a").$name1);        
        } 

        // profile
        $user = User::where('id', $user_id)->first();
        $user->name = $username;
        $user->email = $email;
        // $user->password = Hash::make($password);
        $user->phone = $phone;
        $user->is_actived = $is_actived;
        if ($file = $request->get('file') && $uploadCheck) {
            $user->photo = $name;
        }
        $user->save();
        if (!$user->save()) {
            return response()->json(['status' => 0]);
        }

        // vehicle
        $vehicle = Vehicle::where('driver_id', $user_id)->first();
        if ($vehicle != null) {
            $vehicle->car_brand = $brand;
            $vehicle->car_model = $model;
            $vehicle->car_plate = $carplate;
            if ($file = $request->get('file1') && $uploadCheck1) {
                $vehicle->car_image = $name1;
            }
            $vehicle->save();
            if (!$vehicle->save()) {
                return response()->json(['status' => 1]);
            }
        } else {
            $vehicle = new Vehicle;
            $vehicle->driver_id = $user_id;
            $vehicle->car_brand = $brand;
            $vehicle->car_model = $model;
            $vehicle->car_plate = $carplate;
            if ($file = $request->get('file1') && $uploadCheck1) {
                $vehicle->car_image = $name1;
            }
            $vehicle->save();
        }
        

        return response()->json(['status' => 2]);
    }

    public function addNewDriver(Request $request)
    {
        // profile
        $username = $request->name;
        $email = $request->email;
        $password = $request->password;
        $phone = $request->phone;
        $photo = $request->file('image');
        $uploadCheck = $request->uploadCheck;

        // vehicle
        $brand = $request->brand;
        $model = $request->model;
        $carplate = $request->carplate;
        $photo1 = $request->file('image1');
        $uploadCheck1 = $request->uploadCheck1;

        // profile
        if ($file = $request->get('file') && $uploadCheck) 
        {       
            $image = $request->get('file');
            $name = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            Image::make($request->get('file'))->save(public_path("assets/images/users/a").$name);        
        } 

        // vehicle
        if ($file = $request->get('file1') && $uploadCheck1) 
        {       
            $image1 = $request->get('file1');
            $name1 = time().'.' . explode('/', explode(':', substr($image1, 0, strpos($image1, ';')))[1])[1];
            Image::make($request->get('file1'))->save(public_path("assets/images/cars/a").$name1);        
        } 

        // profile
        $user = new User;
        $user->name = $username;
        $user->email = $email;
        $user->password = Hash::make($password);
        $user->phone = $phone;
        $user->role = 1;
        if ($file = $request->get('file') && $uploadCheck) {
            $user->photo = $name;
        }
        $user->save();
        if (!$user->save()) {
            return response()->json(['status' => 0]);
        }

        // vehicle
        $vehicle = new Vehicle;
        $vehicle->car_brand = $brand;
        $vehicle->car_model = $model;
        $vehicle->car_plate = $carplate;
        $vehicle->driver_id = $user->id;
        if ($file = $request->get('file1') && $uploadCheck1) {
            $vehicle->car_image = $name1;
        }
        $vehicle->save();
        if (!$vehicle->save()) {
            return response()->json(['status' => 1]);
        }

        return response()->json(['status' => 2]);
    }

    public function driverDelete(Request $request)
    {
        $driver_id = $request->driver_id;
        Notification::where('driver_id', $driver_id)->where('whose_notify', 1)->delete();
        Vehicle::where('driver_id', $driver_id)->delete();
        Rating::where('driver_id', $driver_id)->delete();
        Order::where('driver_id', $driver_id)->delete();
        Withdrawal::where('user_id', $driver_id)->delete();
        SocialAccount::where('user_id', $driver_id)->delete();
        User::where('id', $driver_id)->delete();

        return response()->json(['success' => true]);
    }
    
    public function addCustom(Request $request)
    {
        $token = $request->token;
        $user_email = $request->email;
        $user_password = $request->password;
        $user_name = $request->username;
        $user_phone = $request->phone_number;
        $user_photo = $request->file('image');

        if ($file = $request->get('file')) 
        {       
            $image = $request->get('file');
            $name = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            Image::make($request->get('file'))->save(public_path("assets/images/users/a").$name);        
        } 

        $user = User::where('email', $user_email)->first();
        if (!empty($user)) {
            return response()->json(['success' => false]);
        }

        Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

        $customer = \Stripe\Customer::create([
            'source' => $token,
            'email' => $user_email,
        ]);

        $user = new User;
        $user->name = $user_name;
        $user->email = $user_email;
        $user->password = Hash::make($user_password);
        $user->phone = $user_phone;
        $user->card_token = $customer->id;
        $user->remember_token = Hash::make($user_email);
        $user->email_verified = 'no';
        $user->role = '0';
        if ($file = $request->get('file')) {
            $user->photo = $name;
        }
        $user->save();
        if ($user->save()) {
            return response()->json(['success' => true]);
        } else {
            return response()->json(['error' => true]);
        }
    }

    public function getSettings(Request $request) 
    {
        $settings = Setting::all();
        return response()->json($settings);
    }

    public function settings(Request $request) 
    {
        $radius = $request->radius;
        $fee = $request->fee;
        $fare = $request->fare_mile;
        $cancel_fee = $request->cancel_fee;

        $settings = Setting::where('id', 1)->first();
        $settings->radius = $radius;
        $settings->fee = $fee;
        $settings->fare_per_mile = $fare;
        $settings->cancel_fee = $cancel_fee;
        $settings->save();

        if($settings->save()) {
            return response()->json(['success' => true]);
        } else {
            return response()->json(['success' => false]);
        }
    }

    public function getAllWithdrawal()
    {
        $withdrawals = DB::table('withdraw')
                        ->leftJoin('users', 'users.id', '=', 'withdraw.user_id')
                        ->select('users.name', 'users.phone', 'users.photo','withdraw.id', 'withdraw.user_id', 'withdraw.card_number', 'withdraw.exp_month', 'withdraw.exp_year', 'withdraw.cvc', 'withdraw.amount', 'withdraw.status')
                        ->orderby('withdraw.created_at', 'desc')
                        ->get();

        return response()->json($withdrawals);
    }

    public function withdrawDelete(Request $request)
    {
        Withdrawal::where('id', $request->withdraw_id)->delete();

        return response()->json(1);
    }

    public function withdrawView(Request $request)
    {
        $withdraw_id = $request->withdraw_id;
        $withdraw = DB::table('withdraw')
                        ->leftJoin('users', 'users.id', '=', 'withdraw.user_id')
                        ->select('users.name', 'users.phone', 'users.photo','withdraw.id', 'withdraw.user_id', 'withdraw.card_number', 'withdraw.exp_month', 'withdraw.exp_year', 'withdraw.cvc', 'withdraw.amount', 'withdraw.status', 'withdraw.created_at', 'withdraw.updated_at')
                        ->where('withdraw.id', $withdraw_id)
                        ->orderby('withdraw.created_at', 'desc')
                        ->first();

        return response()->json($withdraw);
    }

    public function withdrawApproved(Request $request)
    {
        $withdraw_id = $request->withdraw_id;
        $withdraw = Withdrawal::where('id', $withdraw_id)->first();
        $user = User::where('id', $withdraw->user_id)->first();

        $user->balance = $user->balance - $withdraw->amount;
        $user->save();
        $withdraw->status = 1;
        $withdraw->save();

        $notify = new Notification;
        $notify->driver_id = $withdraw->user_id;
        $notify->passenger_id = 1;
        $notify->system_message = "Withdrawal success!. We sent you a payment of $".$withdraw->amount;
        $notify->is_system_message = 1;
        $notify->status = 3;        //admin msg
        $notify->whose_notify = 1;  //to driver
        $notify->save();

        return response()->json(1);
    }

    public function withdrawDeclined(Request $request)
    {
        $withdraw_id = $request->withdraw_id;
        $withdraw = Withdrawal::where('id', $withdraw_id)->first();

        $notify = new Notification;
        $notify->driver_id = $withdraw->user_id;
        $notify->passenger_id = 1;
        $notify->system_message = "Withdrawal failed. Your card number is incorrect or invalid";
        $notify->is_system_message = 1;
        $notify->status = 3;        // admin msg
        $notify->whose_notify = 1;  //to driver
        $notify->save();

        return response()->json(1);
    }

    public function getAllIncome()
    {
        $incomes = DB::table('users')
                        ->leftJoin('orders', 'users.id', '=', 'orders.driver_id')
                        ->select('users.photo', 'users.name', 'users.id', DB::raw('sum(orders.price) price'))
                        ->where('orders.status', 1)
                        ->whereYear('orders.created_at', '=', date('Y'))
                        ->whereMonth('orders.created_at', '=', date('m'))
                        ->groupby('users.id')
                        ->orderby('orders.created_at', 'desc')
                        ->get();

        $total_income = 0;
        foreach ($incomes as $income) {
            $total_income += $income->price;
        }

        return response()->json([
            'total_income' => number_format($total_income, 2, '.', ''),
            'incomes' => $incomes
        ]);
    }

    public function sendNotification(Request $request)
    {
        $message = $request->message;
        $who = $request->who;

        if ($who == 0) {                                    // ----------------- to all passengers 
            $passengers = User::where('role', 0)->get();
            foreach ($passengers as $passenger) {
                $notify = new Notification;
                $notify->passenger_id = $passenger->id;
                $notify->driver_id = 1;
                $notify->system_message = $message;
                $notify->is_system_message = 1;
                $notify->status = 3;        // admin msg
                $notify->whose_notify = 0;  //to passsenger
                $notify->save();

                // send sms to driver
                $sid    = env("TWILIO_SID");
                $token  = env("TWILIO_AUTH_TOKEN");
                $client = new Client($sid, $token );
        
                try {
                    $client->messages->create(
                        '+'.$passenger->phone,
                        [
                            'from' => '+19418776757',
                            'body' => $message,
                        ]
                    );
                }
                catch (Exception $e)
                {
                    // echo "Error: " . $e->getMessage();
                    return response()->json(['status' => $e->getMessage()]);
                }
            }

            return response()->json(['status' => true]);
        } elseif ($who == 1) {                              // ------------ to all drivers
            $drivers = User::where('role', 1)->get();
            foreach ($drivers as $driver) {
                $notify = new Notification;
                $notify->driver_id = $driver->id;
                $notify->passenger_id = 1;
                $notify->system_message = $message;
                $notify->is_system_message = 1;
                $notify->status = 3;        // admin msg
                $notify->whose_notify = 1;  //to driver
                $notify->save();

                // send sms to driver
                $sid    = env("TWILIO_SID");
                $token  = env("TWILIO_AUTH_TOKEN");
                $client = new Client( $sid, $token );
        
                try {
                    $client->messages->create(
                        '+'.$driver->phone,
                        [
                            'from' => '+19418776757',
                            'body' => $message,
                        ]
                    );
                }
                catch (Exception $e)
                {
                    // echo "Error: " . $e->getMessage();
                    return response()->json(['status' => $e->getMessage()]);
                }
            }

            return response()->json(['status' => true]);
        } else {                        // ----------- to all users
            $users = User::all();
            foreach ($users as $user) {
                $notify = new Notification;
                $notify->passenger_id = $user->id;
                $notify->driver_id = 1;
                $notify->system_message = $message;
                $notify->is_system_message = 1;
                $notify->status = 3;        // admin msg
                $notify->whose_notify = 0;  //to passenger
                $notify->save();

                $notify = new Notification;
                $notify->driver_id = $user->id;
                $notify->passenger_id = 1;
                $notify->system_message = $message;
                $notify->is_system_message = 1;
                $notify->status = 3;        // admin msg
                $notify->whose_notify = 1;  //to driver
                $notify->save();

                // send sms to all user
                $sid    = env("TWILIO_SID");
                $token  = env("TWILIO_AUTH_TOKEN");
                $client = new Client( $sid, $token );
        
                try {
                    $client->messages->create(
                        '+'.$user->phone,
                        [
                            'from' => '+19418776757',
                            'body' => $message,
                        ]
                    );
                }
                catch (Exception $e)
                {
                    // echo "Error: " . $e->getMessage();
                    return response()->json(['status' => $e->getMessage()]);
                }
            }

            return response()->json(['status' => true]);
        }
    }

    public function getPassengerHistory(Request $request)
    {
        $histories = DB::table('users')
                        ->leftJoin('orders', 'users.id', '=', 'orders.driver_id')
                        ->select('users.name', 'users.phone', 'users.photo','orders.id', 'orders.departure', 'orders.driver_id', 'orders.destination', 'orders.status', 'orders.price', 'orders.updated_at')
                        ->where('passenger_id', $request->passenger_id)
                        // ->where('status', 1)
                        ->orderby('orders.created_at', 'desc')
                        ->get();

        return response()->json($histories);
    }

    public function getDriverHistory(Request $request)
    {
        $histories = DB::table('users')
                        ->leftJoin('orders', 'users.id', '=', 'orders.passenger_id')
                        ->select('users.name', 'users.phone', 'users.photo','orders.id', 'orders.departure', 'orders.driver_id', 'orders.destination', 'orders.status', 'orders.price', 'orders.updated_at')
                        ->where('driver_id', $request->driver_id)
                        // ->where('status', 1)
                        ->orderby('orders.created_at', 'desc')
                        ->get();

        return response()->json($histories);
    }

    public function getAllRides()
    {
        $histories = DB::table('orders')
                        ->leftJoin('users', 'users.id', '=', 'orders.passenger_id')
                        ->select('users.name', 'users.phone', 'users.photo','orders.id', 'orders.departure', 'orders.driver_id', 'orders.destination', 'orders.order_time', 'orders.status', 'orders.price', 'orders.updated_at')
                        // ->where('status', 1)
                        ->orderby('orders.created_at', 'desc')
                        ->get();

        return response()->json($histories);
    }

    public function orderEdit(Request $request)
    {
        $order = Order::where('id', $request->order_id)->first();

        return response()->json($order);
    }

    public function orderUpdate(Request $request)
    {
        $order_id = $request->id;
        $order = Order::where('id', $order_id)->first();
        $order->price = $request->price;
        $order->order_time = $request->order_time;
        $order->message = $request->message;
        $order->status = $request->status;
        $order->save();

        $driver = User::where('id', $order->driver_id)->first();
        $set_notify = new Notification;
        $set_notify->driver_id = $order->driver_id;
        $set_notify->passenger_id = $order->passenger_id;
        if($request->status = 1) {
            $set_notify->system_message = $driver->name." accepted your ride";
        } elseif ($request->status = 2) {
            $set_notify->system_message = $driver->name." rejected your ride";
        }
        $set_notify->is_read = 0;
        $set_notify->is_system_message = 1;
        $set_notify->status = $order->status;    
        $set_notify->save();

        //send ride mail to passenger
        $name = $driver->name;
        $email = $driver->email;
        if($request->status = 1) {
            $message = $driver->name." accepted your ride request";
        } elseif ($request->status = 2) {
            $message = $driver->name." rejected your ride request";
        }
        $to = User::where('id', $order->passenger_id)->first()->email;

        $data = array();
        $data = [
            'name' => $name,
            'email' => $email,
            'message' => $message,
            'departure' => $order->departure,
            'destination' => $order->destination,
            'number_people' => $order->number_people,
            'order_time' => $order->order_time,
        ];

        if($request->status = 1) {
            Mail::to($to)->send(new RideAcceptMail($data));
        } elseif ($request->status = 2) {
            Mail::to($to)->send(new RideRejectMail($data));
        }

        //send text message to passenger
        $account_sid = env("TWILIO_SID");
        $auth_token = env("TWILIO_AUTH_TOKEN");
        $from = Auth::user()->phone;
        $to = User::where('id', $order->passenger_id)->first()->phone;

        $client = new Client($account_sid, $auth_token);

        if($request->status = 1) {
            $client->messages->create(
                '+'.$to,
                array(
                    "from" => '+19418776757',
                    "body" => $driver->name." accepted your ride request"
                )
            );
        } elseif ($request->status = 2) {
            $client->messages->create(
                '+'.$to,
                array(
                    "from" => '+19418776757',
                    "body" => $driver->name." rejected your ride request"
                )
            );
        }

        return response()->json(1);
    }

    public function processPayment(Request $request) 
    {
        $order_id = $request->order_id;
        $order = Order::where('id', $order_id)->first();
        $passenger = User::where('id', $order->passenger_id)->first();

        if ($order->is_paid == 0 && $order->status == 1) {                     //when no pay
            Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
            $status = Stripe\Charge::create([
                    "amount" => $order->price * 100,
                    "currency" => "usd",
                    "customer" => $passenger->card_token,                 //stripe customer id
                    "description" => "Ride fare charged from mydcstaxi.com."
            ]);
    
            if ($status[ 'status' ] == "succeeded") { 
                // $order->status = 1;       //accepted
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
        
                try {
                    $client->messages->create(
                        $driver->phone,
                        [
                            'from' => '+19418776757',
                            'body' => "You earned $".$order->price." from ".User::where('id', $order->passenger_id)->first()->name,
                        ]
                    );
                }
                catch (Exception $e)
                {
                    return response()->json(['success' => 0, 'error' => $e->getMessage()]);
                }
    
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
        
                try {
                    $client->messages->create(
                        $passenger->phone,
                        [
                            'from' => '+19418776757',
                            'body' => "You paid $".$order->price." to ".User::where('id', $order->driver_id)->first()->name." for your ride"
                        ]
                    );
                }
                catch (Exception $e)
                {
                    return response()->json(['success' => 0, 'error' => $e->getMessage()]);
                }
    
                return response()->json(['success' => 1, 'status' => $status]);
            } else {
                return response()->json(['success' => 2, 'error' => $status]);
            }
        } elseif($order->is_paid == 0 && $order->status != 1) {
            return response()->json(['success' => 3]);
        } elseif($order->is_paid == 0 && $order->status == 1) {
            return response()->json(['success' => 4]);
        } elseif($order->is_paid == 1) {
            return response()->json(['success' => 6]);
        } else {
            return response()->json(['success' => 5]);
        }
    }
}
