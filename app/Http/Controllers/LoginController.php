<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\MySendMail;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\AdminNotification;
use Twilio\Rest\Client;
use App\Models\SocialAccount;
use Auth;
use Stripe;
use Session;
use Image;
use Hash;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'remember_me' => 'boolean'
        ]);

        $credentials = request(['email', 'password']);

        if (!Auth::attempt($credentials))
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized Access, please confirm credentials or verify your email'
            ]);

        $user = $request->user();
        
        return response()->json(['success' => true, 'user' => $user]);
    }
        
    public function logout(Request $request)
    {
        Auth::logout();
        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out'
        ]);
    }

    public function register(Request $request)
    {
        $user_email = $request->email;
        $user_password = $request->password;
        $firstname = $request->firstname;
        $lastname = $request->lastname;
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

        $user = User::where('phone', $user_phone)->first();
        if (!empty($user)) {
            return response()->json(['success' => -1]);
        }

        $token = env("TWILIO_AUTH_TOKEN");
        $twilio_sid = env("TWILIO_SID");
        $twilio_verify_sid = env("TWILIO_VERIFY_SID");

        
        $twilio = new Client($twilio_sid, $token);

        $status = $twilio->verify->v2->services($twilio_verify_sid)
                ->verifications
                ->create('+'.$user_phone, "sms");
        // if($status)
        //     return response()->json(['success' => -2, 'status' => $status]);
        
        return response()->json(['success' => true]);
    }

    protected function verify(Request $request)
    {
        $phone_number = $request->phone_number;
        $verify_code = $request->verify_code;

        // phone verify
        $token = env("TWILIO_AUTH_TOKEN");
        $twilio_sid = env("TWILIO_SID");
        $twilio_verify_sid = env("TWILIO_VERIFY_SID");
        $twilio = new Client($twilio_sid, $token);
        $verification = $twilio->verify->v2->services($twilio_verify_sid)
                               ->verificationChecks
                               ->create($verify_code, array('to' => '+'.$phone_number));
        
        if ($verification->valid) {
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false]);
    }

    protected function creditcard(Request $request)
    {
        $name = $request->name;
        $lastname = $request->lastname;
        $email = $request->email;
        $password = $request->password;
        $phone_number = $request->phone_number;
        $role = $request->role;
        $token = $request->token;

        $password = $password == ''? $email : $password;
        if (Session::has('socialUser')) {
            $role = 0;
        }

        Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

        $customer = \Stripe\Customer::create([
            'source' => $token,
            'email' => $email,
        ]);

        //profile image
        if ($file = $request->get('file')) 
        {       
            $image = $request->get('file');
            $img_name = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            Image::make($request->get('file'))->save(public_path("assets/images/users/a").$img_name);        
        } 

        User::create([
            'name' => $name,
            'lastname' => $lastname,
            'email' => $email,
            'password' => Hash::make($password),
            'phone' => $phone_number,
            'photo' => isset($img_name)? $img_name : null,
            'card_token' => $customer->id,
            'remember_token' => Hash::make($phone_number),
            'phone_verified' => 1,
            'role' => 0,
        ]);

        $user = User::where('phone', $phone_number)->where('email', $email)->first();
        $admin_notify = new AdminNotification;
        $admin_notify->user_id = $user->id;
        $admin_notify->system_message = "New customer was registered to website";
        $admin_notify->save();

        //if user log in with google account
        if(Session::has('socialUser')) {
            $socialUser = Session::get('socialUser');
            $socialAccount = new SocialAccount;
            $socialAccount->social_id = $socialUser->getId();
            $socialAccount->social_provider = Session::get('social_provider');
            $socialAccount->social_name = $socialUser->getName();
            $socialAccount->social_id = $socialUser->getId();
            $socialAccount->user_id = $user->id;
            $socialAccount->save();
        }

        Auth::login($user);
        return response()->json(['success' => true, 'user' => Auth::user()]);
    }

    public function carinformation(Request $request)
    {
        $name = $request->name;
        $lastname = $request->lastname;
        $email = $request->email;
        $password = $request->password;
        $phone_number = $request->phone_number;
        $role = $request->role;
        $brand = $request->brand;
        $model = $request->model;
        $carplate = $request->carplate;

        //profile image
        if ($file = $request->get('file')) 
        {       
            $image = $request->get('file');
            $img_name = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            Image::make($request->get('file'))->save(public_path("assets/images/users/a").$img_name);        
        } 

        $password = $password == ''? $email : $password;

        User::create([
            'name' => $name,
            'lastname' => $lastname,
            'email' => $email,
            'password' => Hash::make($password),
            'phone' => $phone_number,
            'photo' => isset($img_name)? $img_name : null,
            'remember_token' => Hash::make($phone_number),
            'phone_verified' => 1,
            'role' => 1,
        ]);

        $user = User::where('phone', $phone_number)->where('email', $email)->first();

        //car image
        if ($file = $request->get('file1')) 
        {       
            $image = $request->get('file1');
            $name1 = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            Image::make($request->get('file1'))->save(public_path("assets/images/cars/a").$name1);        
        } 

        $vehicle = new Vehicle;
        $vehicle->car_brand = $brand;
        $vehicle->car_model = $model;
        $vehicle->car_plate = $carplate;
        $vehicle->driver_id = $user->id;
        if ($file = $request->get('file1')) {
            $vehicle->car_image = $name1;
        }
        $vehicle->save();

        $admin_notify = new AdminNotification;
        $admin_notify->user_id = $user->id;
        $admin_notify->system_message = "New driver was registered to website";
        $admin_notify->save();

        //if user log in with google account
        if(Session::has('socialUser')) {
            $socialUser = Session::get('socialUser');
            $socialAccount = new SocialAccount;
            $socialAccount->social_id = $socialUser->getId();
            $socialAccount->social_provider = Session::get('social_provider');
            $socialAccount->social_name = $socialUser->getName();
            $socialAccount->social_id = $socialUser->getId();
            $socialAccount->user_id = $user->id;
            $socialAccount->save();
        }

        Auth::login($user);
        return response()->json(['success' => true, 'user' => Auth::user()]);
    }

    public function forgotPassword(Request $request)
    {
        $email = $request->email;
        $user = User::where('email', $email)->first();

        if(empty($user)) {
            return response()->json(['success' => false]);
        } else {
            $autopass = str_random(8);
            $user->password = Hash::make($autopass);
            $user->save();

            Mail::to($email)->send(new MySendMail($autopass));

            return response()->json(['success' => true]);
        }
    }
}
