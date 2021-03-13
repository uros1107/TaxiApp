<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// }); here!!!   this is api

//social login
Route::get('social/url', 'GoogleController@socialLoginUrl');
Route::POST('social/callback', 'GoogleController@socialLoginCallback');
Route::get('instagram/url', 'GoogleController@redirectToInstagramProvider');

Route::POST('login', 'LoginController@login');
Route::POST('logout', 'LoginController@logout');
Route::POST('register', 'LoginController@register');
Route::POST('phoneverify', 'LoginController@verify');
Route::POST('creditcard', 'LoginController@creditcard');
Route::POST('carinformation', 'LoginController@carinformation');
Route::POST('contactus', 'UserController@contactus');
Route::POST('forgotpassword', 'LoginController@forgotPassword');
Route::POST('driver/search', 'DriverController@driverSearch');
// Route::POST('getmybooking', 'OrderController@getmybooking');
// Route::POST('profile', 'UserController@profile');

Route::post('generate_token','ChatMessagesController@generateToken');
Route::post('get_channel','ChatMessagesController@getChannel');

//  ---------------------- driver

// Route::middleware(['driver'])->group(function () {
    Route::POST('vehicle', 'DriverController@vehicle');
    Route::POST('vehicleupdate', 'DriverController@vehicleupdate');
    Route::POST('updatelocation', 'DriverController@updatelocation');
    Route::GET('get_driver_new_notification', 'DriverController@getNewNotification');  //real time call
    Route::GET('get_driver_notification', 'DriverController@getNotification');  //when notification
    Route::POST('remove_driver_new_notification', 'DriverController@removeNewNotification');  //when notification
    Route::POST('requestaccept', 'DriverController@requestAccept');
    Route::POST('requestreject', 'DriverController@requestReject');
    Route::GET('getrating', 'DriverController@getRating');
    Route::POST('requestwithdrawal', 'DriverController@requestWithdrawal');
    Route::POST('setonline', 'DriverController@setOnline');
    Route::GET('getmyearnings', 'DriverController@getMyEarning');
    Route::GET('getorderpassengers', 'DriverController@getOrderPassengers');
    Route::POST('getmypickup', 'OrderController@getmybooking');
    // Route::POST('profile', 'UserController@profile');
    // Route::POST('update', 'UserController@update');
    Route::GET('getdriverstreamtoken', 'DriverController@getStreamToken');
    Route::GET('getpassengers', 'DriverController@getPassengers');
    Route::GET('getpassenger', 'DriverController@getPassenger');
// });


//  ------------------------ passenger

// Route::middleware(['passenger'])->group(function () {
    Route::GET('get_passenger_new_notification', 'PassengerController@getNewNotification');  //real time call
    Route::POST('remove_passenger_new_notification', 'PassengerController@removeNewNotification');  //when notification
    Route::GET('get_passenger_notification', 'PassengerController@getNotification');  //when notification
    Route::POST('bookingcancel', 'PassengerController@bookingCancel');
    Route::POST('removenotify', 'PassengerController@removeNotify');
    Route::POST('stripepayment', 'PassengerController@stripePayment');
    Route::GET('getridehistory', 'PassengerController@getRideHistory');
    Route::GET('getorderdrivers', 'PassengerController@getOrderDrivers');
    Route::POST('todriver', 'UserController@todriver');
    Route::POST('passenger/requestorder', 'OrderController@reqeustOrder');
    Route::POST('getmybooking', 'OrderController@getmybooking');
    Route::POST('profile', 'UserController@profile');
    Route::POST('update', 'UserController@update');
    Route::POST('driver/info', 'DriverController@driverInfo');
    Route::GET('getpassengerstreamtoken', 'PassengerController@getStreamToken');
    Route::GET('getdrivers', 'PassengerController@getDrivers');
    Route::GET('getdriver', 'PassengerController@getDriver');
// });


//  -------------------------- admin

// Route::middleware(['admin'])->group(function () {
    Route::GET('getallpassenger', 'AdminController@getAllPassenger');
    Route::GET('getalldriver', 'AdminController@getAllDriver');
    Route::POST('customdelete', 'AdminController@customDelete');
    Route::POST('driverdelete', 'AdminController@driverDelete');
    Route::POST('customedit', 'AdminController@customEdit');
    Route::POST('driveredit', 'AdminController@driverEdit');
    Route::POST('profileupdate', 'AdminController@profileUpdate');
    Route::POST('driverprofileupdate', 'AdminController@driverProfileUpdate');
    Route::POST('addcustom', 'AdminController@addCustom');
    Route::POST('addnewdriver', 'AdminController@addNewDriver');
    Route::POST('settings', 'AdminController@settings');
    Route::GET('getsettings', 'AdminController@getSettings');
    Route::POST('driverview', 'AdminController@driverView');
    Route::GET('getnotification', 'AdminController@getNotification');
    Route::GET('getNewnotification', 'AdminController@getNewNotification');
    Route::POST('remove_admin_new_notification', 'AdminController@removeNewNotification');
    Route::POST('removeadminnotify', 'AdminController@removeAdminNotify');
    Route::GET('getallwithdrawal', 'AdminController@getAllWithdrawal');
    Route::POST('withdrawdelete', 'AdminController@withdrawDelete');
    Route::POST('withdrawview', 'AdminController@withdrawView');
    Route::POST('withdrawapproved', 'AdminController@withdrawApproved');
    Route::POST('withdrawdeclined', 'AdminController@withdrawDeclined');
    Route::POST('sendnotification', 'AdminController@sendNotification');
    Route::GET('getallincome', 'AdminController@getAllIncome');
    Route::POST('getpassengerhistory', 'AdminController@getPassengerHistory');
    Route::POST('getdriverhistory', 'AdminController@getDriverHistory');
    Route::POST('getallrides', 'AdminController@getAllRides');
    Route::POST('orderedit', 'AdminController@orderEdit');
    Route::POST('orderupdate', 'AdminController@orderUpdate');
    Route::POST('processpayment', 'AdminController@processPayment');
// });