<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\User;
use Response;

class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $token = $request->header('Authorization');
        if(!empty($token)){
            $user = User::where('remember_token', $token)->where('role', 2)->orwhere('role', 1)->first();
            if(!empty($user)) {
                return $next($request);
            } else {
                return Response::json(array('error'=>'You do not have permission to call that function or you are not registered user!-admin')); 
            }
        }

        return Response::json(array('error'=>'Unauthenticated-admin-middleware!')); 
    }
}
