<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            // Increment rate limiter with configurable decay time
            $decayMinutes = (int) env('LOGIN_RATE_LIMIT_MINUTES', 15);
            RateLimiter::hit($this->throttleKey(), $decayMinutes * 60);

            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        // Get rate limit configuration from environment
        $maxAttempts = (int) env('LOGIN_RATE_LIMIT_ATTEMPTS', 2);
        $decayMinutes = (int) env('LOGIN_RATE_LIMIT_MINUTES', 15);
        
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), $maxAttempts)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        // Log rate limit violations for security monitoring
        \Log::warning('Login rate limit exceeded', [
            'email' => $this->email,
            'ip' => $this->ip(),
            'user_agent' => $this->userAgent(),
            'attempts' => $maxAttempts,
            'lockout_minutes' => $decayMinutes
        ]);

        // Use custom message from environment or fallback to default
        $customMessage = env('LOGIN_RATE_LIMIT_MESSAGE');
        
        if ($customMessage) {
            throw ValidationException::withMessages([
                'email' => $customMessage,
            ]);
        }

        throw ValidationException::withMessages([
            'email' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
