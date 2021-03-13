<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\AdminNotification;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMail;
use Hash;
use Auth;
use Image;
use GetStream;

class UserController extends Controller
{
    public function profile() 
    {
        $user = User::where('id', Auth::user()->id)->first();
        return response()->json([$user]);
    }

    public function todriver(Request $request) 
    {
        $brand = $request->brand;
        $model = $request->model;
        $carplate = $request->carplate;
        $user_id = $request->user_id;
        $user_photo = $request->file('image');

        if ($file = $request->get('file')) 
        {       
            $image = $request->get('file');
            $name = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            Image::make($request->get('file'))->save(public_path("assets/images/cars/a").$name);        
        } 

        $user = User::where('id', $user_id)->first();
        $user->role = 1;
        $user->save();

        $vehicle = new Vehicle;
        $vehicle->car_brand = $brand;
        $vehicle->car_model = $model;
        $vehicle->car_plate = $carplate;
        $vehicle->driver_id = $user_id;
        if ($file = $request->get('file')) {
            $vehicle->car_image = $name;
        }
        $vehicle->save();

        $admin_notify = new AdminNotification;
        $admin_notify->user_id = $user->id;
        $admin_notify->system_message = "New driver was registered to website";
        $admin_notify->save();

        return response()->json(['success' => true]);
    }

    public function update(Request $request) 
    {
        $username = $request->name;
        $email = $request->email;
        $password = $request->password;
        $phone = $request->phone;
        $photo = $request->file('image');
        $uploadCheck = $request->uploadCheck;

        if ($file = $request->get('file') && $uploadCheck) 
        {       
            $image = $request->get('file');
            $name = time().'.' . explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            Image::make($request->get('file'))->save(public_path("assets/images/users/a").$name);        
        } 

        $user = User::where('id', Auth::user()->id)->first();
        $user->name = $username;
        $user->email = $email;
        $user->password = Hash::make($password);
        $user->phone = $phone;
        if ($file = $request->get('file') && $uploadCheck) {
            $user->photo = $name;
        }
        $user->save();

        return response()->json(['success' => true, 'user' => $user]);
    }

    public function contactus(Request $request)
    {
        $name = $request->name;
        $email = $request->email;
        $message = $request->message;

        $data = array();
        $data = [
            'name' => $name,
            'email' => $email,
            'message' => $message,
        ];

        Mail::to("mydcstaxi@gmail.com")->send(new ContactMail($data));

        return ['success' => true];
    }
}
