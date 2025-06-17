<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register helper files
        require_once app_path('Helpers/SocialMediaHelper.php');
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
    }

    /**
     * Configure the rate limiters for the application.
     */
    protected function configureRateLimiting(): void
    {
        // Email verification rate limiting
        RateLimiter::for('email-verification', function (Request $request) {
            $attempts = env('EMAIL_VERIFICATION_ATTEMPTS', 3);
            $minutes = env('EMAIL_VERIFICATION_MINUTES', 10);
            
            return Limit::perMinutes($minutes, $attempts)
                ->by($request->ip())
                ->response(function () {
                    \Log::channel('security')
                        ->warning('Email verification rate limit exceeded', [
                            'ip' => request()->ip(),
                            'user_agent' => request()->userAgent(),
                            'timestamp' => now(),
                        ]);
                });
        });

        // Password reset rate limiting
        RateLimiter::for('password-reset', function (Request $request) {
            $attempts = env('PASSWORD_RESET_ATTEMPTS', 2);
            $minutes = env('PASSWORD_RESET_MINUTES', 30);
            
            return Limit::perMinutes($minutes, $attempts)
                ->by($request->email ?? $request->ip())
                ->response(function () {
                    \Log::channel('security')
                        ->warning('Password reset rate limit exceeded', [
                            'email' => request()->email,
                            'ip' => request()->ip(),
                            'user_agent' => request()->userAgent(),
                            'timestamp' => now(),
                        ]);
                });
        });
    }
}
