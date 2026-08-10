<?php

namespace App\Http\Controllers\Auth;

use App\Auth\HardcodedUserProvider;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.login', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     *
     * Authentication is performed strictly against the hardcoded
     * credentials and bypasses the database entirely.
     *
     * @throws ValidationException
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->ensureIsNotRateLimited();

        $remember = $request->boolean('remember');

        if (! HardcodedUserProvider::check(
            $request->string('email')->toString(),
            $request->string('password')->toString(),
        )) {
            RateLimiter::hit($request->throttleKey());

            throw ValidationException::withMessages([
                'email' => 'These credentials do not match our records',
            ]);
        }

        RateLimiter::clear($request->throttleKey());

        Auth::login(HardcodedUserProvider::user(), $remember);

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        foreach (config('auth.guards') as $name => $guard) {
            if (($guard['driver'] ?? null) === 'session') {
                Auth::guard($name)->logout();
            }
        }

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
