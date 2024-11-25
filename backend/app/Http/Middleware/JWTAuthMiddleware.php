<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class JWTAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Attempt to parse the token and authenticate the user
            $user = JWTAuth::parseToken()->authenticate();

            // If the user is not found, return an error
            if (!$user) {
                return response()->json(['error' => 'User not found'], 401);
            }

        } catch (JWTException $e) {
            // If there's an error with the token (expired, invalid, etc.)
            return response()->json(['error' => 'Token is invalid or expired'], 401);
        }

        // If authentication was successful, continue with the request
        return $next($request);
    }
}
