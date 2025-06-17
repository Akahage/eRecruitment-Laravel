<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        // Get the user by ID from the route parameter
        $user = User::findOrFail($request->route('id'));
        
        // Verify the hash matches
        if (!hash_equals(sha1($user->getEmailForVerification()), (string) $request->route('hash'))) {
            abort(403, 'Invalid verification link.');
        }

        // Check if already verified
        if ($user->hasVerifiedEmail()) {
            return redirect()->route('login')
                ->with('status', 'Email sudah diverifikasi sebelumnya. Silakan login.');
        }

        // Mark as verified
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // Logout if user is currently logged in
        if (Auth::check()) {
            Auth::logout();
        }

        return redirect()->route('login')
            ->with('status', 'Email berhasil diverifikasi! Silakan login untuk melanjutkan pendaftaran Anda.');
    }
}
