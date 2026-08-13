@extends('layouts.guest')

@section('title', 'Sign In - ' . config('app.name', 'Sagaki Restaurant POS'))

@section('content')
<div class="min-h-screen w-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
    {{-- Subtle decorative ambient background glows --}}
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true"
        style="background: radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.45) 0%, rgba(15, 23, 42, 0.98) 100%)"></div>
    <div class="absolute w-[500px] h-[500px] rounded-full pointer-events-none fg-drift opacity-40" aria-hidden="true"
        style="top: 15%; left: 20%; background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%); filter: blur(80px)"></div>
    <div class="absolute w-[450px] h-[450px] rounded-full pointer-events-none fg-drift-slow opacity-40" aria-hidden="true"
        style="bottom: 15%; right: 20%; background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%); filter: blur(80px)"></div>
    <div class="absolute inset-0 opacity-[0.015] pointer-events-none" aria-hidden="true"
        style="background-image: radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px); background-size: 24px 24px"></div>

    <div class="relative z-10 w-full max-w-md mx-auto">
        {{-- Login Card --}}
        <div class="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-8 shadow-2xl shadow-black/80 fg-card relative">
            <div class="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>

            {{-- Card Logo & Title --}}
            <div class="flex flex-col items-center text-center mb-6">
                <div class="relative mb-3.5">
                    <div class="absolute inset-0 bg-indigo-500/40 rounded-2xl blur-md"></div>
                    <div class="relative w-12 h-12 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30">
                        <x-icon name="utensils" size="24" class="text-white" />
                    </div>
                </div>
                <h1 class="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
                <p class="text-xs text-slate-400 mt-1">Enter your credentials to unlock your POS session.</p>
            </div>

            @if (session('status'))
                <div class="mb-5 flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                    <x-icon name="check-circle" size="14" class="shrink-0" />
                    <span>{{ session('status') }}</span>
                </div>
            @endif

            @if ($errors->any())
                <div class="mb-5 flex items-center gap-2 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    <x-icon name="alert-circle" size="14" class="shrink-0" />
                    <span>{{ $errors->first() }}</span>
                </div>
            @endif

            {{-- Standard Credentials Form --}}
            <form id="login-form" method="POST" action="{{ route('login') }}" class="space-y-4">
                @csrf

                <div>
                    <label for="email" class="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200">
                            <x-icon name="mail" size="16" />
                        </div>
                        <input id="email" name="email" type="email" value="{{ old('email') }}" required
                            autofocus autocomplete="username"
                            class="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-slate-700 transition-all duration-200"
                            placeholder="name@restaurant.com">
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between mb-1.5">
                        <label for="password" class="block text-xs font-semibold text-slate-400">Password</label>
                    </div>
                    <div class="relative group">
                        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-200">
                            <x-icon name="lock" size="16" />
                        </div>
                        <input id="password" name="password" type="password" required
                            autocomplete="current-password"
                            class="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-12 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-slate-700 transition-all duration-200"
                            placeholder="••••••••">
                        <button type="button" id="toggle-password" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors duration-200" tabindex="-1">
                            <x-icon id="eye-icon" name="eye" size="16" />
                            <x-icon id="eye-off-icon" name="eye-off" size="16" class="hidden" />
                        </button>
                    </div>
                </div>

                <div class="flex items-center justify-between pt-1">
                    <label class="flex items-center gap-2.5 cursor-pointer group select-none">
                        <div class="relative">
                            <input type="checkbox" name="remember" id="remember" value="1" class="peer sr-only">
                            <div class="w-4.5 h-4.5 rounded border border-slate-700 bg-slate-950/60 peer-checked:bg-indigo-600 peer-checked:border-indigo-500 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500/40 transition-all duration-200 flex items-center justify-center">
                                <svg class="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <span class="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Remember me on this device</span>
                    </label>
                </div>

                <button type="submit" id="login-submit"
                    class="relative w-full mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[.99] overflow-hidden flex items-center justify-center gap-2">
                    <span class="fg-shimmer-btn absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
                    <span class="relative flex items-center gap-2 login-submit-label font-medium">
                        Sign In
                        <x-icon name="arrow-right" size="16" />
                    </span>
                </button>
            </form>

            {{-- Collapsible Development/Demo Accounts Helper --}}
            @php
                $staffUsers = [
                    [
                        'name' => 'Pathum',
                        'email' => 'mgpdesaman@gmail.com',
                        'password' => '88222006',
                        'role' => 'Admin'
                    ],
                    [
                        'name' => 'Amali',
                        'email' => 'amali@sagaki.com',
                        'password' => 'password',
                        'role' => 'Manager'
                    ],
                    [
                        'name' => 'Kamali',
                        'email' => 'kamali@sagaki.com',
                        'password' => 'password',
                        'role' => 'Cashier'
                    ],
                    [
                        'name' => 'Ravi',
                        'email' => 'ravi@sagaki.com',
                        'password' => 'password',
                        'role' => 'Wait Staff'
                    ],
                    [
                        'name' => 'Nimal',
                        'email' => 'nimal@sagaki.com',
                        'password' => 'password',
                        'role' => 'Kitchen'
                    ]
                ];
            @endphp

            <div class="mt-6 border-t border-slate-800/80 pt-5">
                <button type="button" id="toggle-demo-helper" class="w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-400 transition-colors focus:outline-none select-none">
                    <x-icon name="zap" size="12" class="text-indigo-400" />
                    <span>Quick Access Demo Profiles</span>
                    <svg id="helper-arrow" class="w-3 h-3 transform transition-transform duration-200 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <div id="demo-helper-panel" class="hidden mt-3 p-3 bg-slate-950/40 border border-slate-800/60 rounded-xl space-y-2">
                    <p class="text-[10px] text-slate-500 text-center">Click a profile to autofill credentials and sign in.</p>
                    <div class="grid grid-cols-2 gap-2">
                        @foreach ($staffUsers as $user)
                            <button type="button" onclick="quickFill('{{ $user['email'] }}', '{{ $user['password'] }}')"
                                    class="flex flex-col items-start p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-lg text-left transition-all duration-200 group">
                                <span class="text-xs font-semibold text-slate-200 group-hover:text-white">{{ $user['name'] }}</span>
                                <span class="text-[9px] text-slate-500 mt-0.5">{{ $user['role'] }}</span>
                            </button>
                        @endforeach
                    </div>
                </div>
            </div>

            {{-- Footer --}}
            <div class="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-600 select-none">
                <span>Sagaki POS v1.2.0</span>
                <span>© {{ date('Y') }} NerdTech Labs</span>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
    function quickFill(email, password) {
        var emailInput = document.getElementById('email');
        var passwordInput = document.getElementById('password');
        var form = document.getElementById('login-form');

        if (!emailInput || !passwordInput || !form) return;

        emailInput.value = email;
        passwordInput.value = password;

        var submitBtn = document.getElementById('login-submit');
        if (submitBtn) {
            submitBtn.disabled = true;
            var label = submitBtn.querySelector('.login-submit-label');
            if (label) {
                label.innerHTML = '<svg class="animate-spin text-white mr-2 inline" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="M16.2 7.8 19.1 4.9"/><path d="M18 12h4"/><path d="M16.2 16.2 19.1 19.1"/><path d="M12 18v4"/><path d="M4.9 19.1 7.8 16.2"/><path d="M2 12h4"/><path d="M4.9 4.9 7.8 7.8"/></svg> Connecting…';
            }
        }

        setTimeout(function() {
            form.submit();
        }, 200);
    }

    document.addEventListener('DOMContentLoaded', function () {
        var togglePass = document.getElementById('toggle-password');
        var passwordInput = document.getElementById('password');
        if (togglePass && passwordInput) {
            togglePass.addEventListener('click', function () {
                var show = passwordInput.type === 'password';
                passwordInput.type = show ? 'text' : 'password';
                document.getElementById('eye-icon').classList.toggle('hidden', show);
                document.getElementById('eye-off-icon').classList.toggle('hidden', !show);
            });
        }

        var toggleHelper = document.getElementById('toggle-demo-helper');
        var helperPanel = document.getElementById('demo-helper-panel');
        var arrowIcon = document.getElementById('helper-arrow');
        if (toggleHelper && helperPanel) {
            toggleHelper.addEventListener('click', function () {
                var isHidden = helperPanel.classList.toggle('hidden');
                if (arrowIcon) {
                    if (isHidden) {
                        arrowIcon.classList.remove('rotate-180');
                    } else {
                        arrowIcon.classList.add('rotate-180');
                    }
                }
            });
        }

        var form = document.getElementById('login-form');
        var submitBtn = document.getElementById('login-submit');
        if (form && submitBtn) {
            form.addEventListener('submit', function () {
                submitBtn.disabled = true;
                submitBtn.classList.add('disabled:from-slate-700', 'disabled:to-slate-700', 'cursor-not-allowed');
                var label = submitBtn.querySelector('.login-submit-label');
                if (label) {
                    label.innerHTML =
                        '<svg class="animate-spin text-white mr-2 inline" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="M16.2 7.8 19.1 4.9"/><path d="M18 12h4"/><path d="M16.2 16.2 19.1 19.1"/><path d="M12 18v4"/><path d="M4.9 19.1 7.8 16.2"/><path d="M2 12h4"/><path d="M4.9 4.9 7.8 7.8"/></svg> Connecting…';
                }
            });
        }
    });
</script>
@endsection