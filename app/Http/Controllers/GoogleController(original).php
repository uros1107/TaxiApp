<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;
use Session;
use Auth;

class GoogleController extends Controller
{
    public function socialLoginUrl()
    {
        return Response::json([
            'googleurl' => Socialite::driver('google')->stateless()->redirect()->getTargetUrl(),
            'facebookurl' => Socialite::driver('facebook')->stateless()->redirect()->getTargetUrl(),
            'instagramurl' => Socialite::with('instagram')->redirect()->getTargetUrl(),
            'twitterurl' => Socialite::driver('twitter')->redirect()->getTargetUrl(),
            'youtubeurl' => Socialite::driver('facebook')->stateless()->redirect()->getTargetUrl(),
            'linkedinurl' => Socialite::driver('linkedin')->stateless()->redirect()->getTargetUrl(),
        ]);
    }

    public function socialLoginCallback(Request $request)
    {
        $which_social = $request->social;

        if ($which_social == 0) {                                               //is google login
            $socialUser = Socialite::driver('google')->stateless()->user();
            Session::put('social_provider', 'google');
        } elseif ($which_social == 1) {                                         //is facebook login
            $socialUser = Socialite::driver('facebook')->stateless()->user();
            Session::put('social_provider', 'facebook');
        } elseif ($which_social == 2) {                                         //is instagram login
            $socialUser = Socialite::driver('instagram')->user();
            Session::put('social_provider', 'instagram');
        } elseif ($which_social == 3) {                                         //is twitter login
            $socialUser = Socialite::driver('twitter')->user();
            Session::put('social_provider', 'twitter');
        } elseif ($which_social == 4) {                                         //is youtube login
            $socialUser = Socialite::driver('youtube')->stateless()->user();
            Session::put('social_provider', 'youtube');
        } elseif ($which_social == 5) {                                         //is linkedin login
            $socialUser = Socialite::driver('linkedin')->stateless()->user();
            Session::put('social_provider', 'linkedin');
        }
        
        $user = null;

        $is_user = SocialAccount::where('social_id', $socialUser->getId())->first();
        if(!empty($is_user)) {
            $user = User::where('id', $is_user->user_id)->first();
            Auth::login($user);
            return response()->json(['status' => 1, 'user' => Auth::user()]);
        }

        DB::transaction(function () use ($socialUser, &$user) {
            $socialAccount = SocialAccount::firstOrNew(
                ['social_id' => $socialUser->getId(), 'social_provider' => 'google'],
                ['social_name' => $socialUser->getName()]
            );

            if (!($user = $socialAccount->user)) {
                Session::put('socialUser', $socialUser);
            }
        });

        return Response::json([
            'status' => 2,
            'social_user' => $socialUser,
        ]);
    }
}
