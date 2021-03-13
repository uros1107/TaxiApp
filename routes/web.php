<?php

use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::view('/{path?}', 'app');

Route::get('/{url?}', function () {
    return view('app');
})->where('', 'list');

Route::group(['prefix' => 'auth'], function () {
  Route::get('install', 'MainController@install');

  Route::get('load', 'MainController@load');

  Route::get('uninstall', function () {
    echo 'uninstall';
    return app()->version();
  });

  Route::get('remove-user', function () {
    echo 'remove-user';
    return app()->version();
  });
});

Route::any('/bc-api/{endpoint}', 'MainController@proxyBigCommerceAPIRequest')
  ->where('endpoint', 'v2\/.*|v3\/.*');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
