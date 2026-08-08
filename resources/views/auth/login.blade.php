@extends('layouts.guest')

@section('title', config('app.name', 'Sagaki Restaurant POS'))

@section('content')
<div class="h-screen w-screen flex bg-slate-950 overflow-hidden">
    {{-- LEFT PANEL — Brand Showcase --}}
    <div class="hidden lg:flex lg:w-3/5 xl:w-[65%] relative overflow-hidden">
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style="background-image:url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop')"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-transparent to-slate-950/60"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-indigo-500/5"></div>

        <div class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div class="absolute top-24 left-16 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl fg-pulse"></div>
            <div class="absolute bottom-40 right-16 w-56 h-56 bg-violet-600/15 rounded-full blur-3xl fg-drift"></div>
            <div class="absolute top-1/2 left-1/3 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl fg-drift-slow"></div>
        </div>

        <div class="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16 fg-brand">
            <div class="fg-slide-r" style="animation-delay: .1s">
                <div class="flex items-center gap-3 mb-2">
                    <div class="relative">
                        <div class="absolute inset-0 bg-indigo-500/50 rounded-xl blur-md"></div>
                        <div class="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-500/40">
                            <x-icon name="utensils" size="20" class="text-white" />
                        </div>
                    </div>
                    <span class="text-white font-semibold text-lg tracking-wide">Sagaki</span>
                </div>
                <div class="h-px w-14 bg-gradient-to-r from-indigo-400 to-transparent mt-4"></div>
            </div>

            <div class="max-w-md fg-slide-r" style="animation-delay: .25s">
                <p class="text-indigo-300/70 text-xs font-semibold tracking-[.2em] uppercase mb-4">Restaurant POS System</p>
                <h1 class="text-4xl xl:text-5xl font-bold text-white leading-[1.1] mb-6">
                    Elevate Your<br>
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-violet-200 to-indigo-300">Dining Service</span>
                </h1>
                <p class="text-slate-400 text-base leading-relaxed max-w-sm">
                    Streamline orders, manage tables, and deliver exceptional guest experiences — all from one powerful platform.
                </p>
                <div class="flex flex-wrap gap-3 mt-10">
                    <div class="fg-float flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-slate-200 text-sm" style="animation-delay: 1.32s">
                        <x-icon name="chef-hat" size="14" class="text-indigo-300" />
                        Kitchen Display
                    </div>
                    <div class="fg-float flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-slate-200 text-sm" style="animation-delay: 1.44s">
                        <x-icon name="coffee" size="14" class="text-indigo-300" />
                        Table Management
                    </div>
                    <div class="fg-float flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-slate-200 text-sm" style="animation-delay: 1.56s">
                        <x-icon name="star" size="14" class="text-indigo-300" />
                        Real-time Reports
                    </div>
                </div>
            </div>

            <div class="flex items-center justify-between text-xs text-slate-600 fg-slide-r" style="animation-delay: .4s">
                <span>© {{ date('Y') }} Sagaki Restaurant POS</span>
                <span class="flex items-center gap-1.5 text-slate-500">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 fg-pulse"></span>
                    System Online
                </span>
            </div>
        </div>

        <div class="absolute right-0 top-0 bottom-0 w-px fg-panel-sep"></div>
        <div class="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none"></div>
    </div>

    {{-- RIGHT PANEL RIGHT PANEL with Dark Login Card --}}
    <div class="w-full lg:w-2/5 xl:w-[35%] flex items-center justify-center px-6 py-8 bg-slate-950 relative overflow-hidden">
        <div class="absolute inset-0 pointer-events-none" aria-hidden="true"
            style="background-image: radial-gradient(ellipse 60% 50% at 60% 40%, rgba(79,70,229,.07), transparent 60%)"></div>
        <div class="absolute w-80 h-80 rounded-full pointer-events-none" aria-hidden="true"
            style="bottom:-10%; right:-5%; background: radial-gradient(circle, rgba(139,92,246,.06) 0%, transparent 65%); filter: blur(50px)"></div>
        <div class="absolute w-64 h-64 rounded-full pointer-events-none" aria-hidden="true"
            style="top:10%; left:-5%; background: radial-gradient(circle, rgba(79,70,229,.05) 0%, transparent 65%); filter: blur(40px)"></div>
        <div class="absolute inset-0 opacity-[.02] pointer-events-none" aria-hidden="true"
            style="background-image: radial-gradient(circle, rgba(255,255,255,.4) 1px, transparent 1px); background-size: 24px 24px"></div>

        <div class="relative w-full max-w-sm fg-card">
            <div class="flex items-center gap-3 mb-6 lg:hidden">
                <div class="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <x-icon name="utensils" size="18" class="text-white" />
                </div>
                <span class="text-white font-semibold text-base">Sagaki Restaurant POS</span>
            </div>

            <div class="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-black/60">
                <div class="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

                <div class="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium px-3 py-1.5 rounded-full text-xs mb-5">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 fg-pulse"></span>
                    Welcome back!
                </div>

                <h2 class="text-xl font-bold text-white tracking-tight mb-1">Sign in to your account</h2>
                <p class="text-sm text-slate-400 mb-6">Enter your credentials below to access your dashboard.</p>

                @if (session('status'))
                    <div class="mb-4 flex items-center gap-2 text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                        <span>{{ session('status') }}</span>
                    </div>
                @endif

                @if ($errors->any())
                    <div class="mb-4 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                        <x-icon name="alert-circle" size="16" class="shrink-0" />
                        <span>{{ $errors->first() }}</span>
                    </div>
                @endif

                <form method="POST" action="{{ route('login') }}" class="space-y-4">
                    @csrf

                    <div>
                        <label for="email" class="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                <x-icon name="mail" size="16" />
                            </div>
                            <input id="email" name="email" type="email" value="{{ old('email') }}" required
                                autofocus autocomplete="username"
                                class="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-slate-700 transition-all duration-200"
                                placeholder="you@example.com">
                        </div>
                    </div>

                    <div>
                        <label for="password" class="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                <x-icon name="lock" size="16" />
                            </div>
                            <input id="password" name="password" type="password" required
                                autocomplete="current-password"
                                class="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-12 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 hover:border-slate-700 transition-all duration-200"
                                placeholder="Enter your password">
                            <button type="button" id="toggle-password" class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors duration-200" tabindex="-1">
                                <x-icon id="eye-icon" name="eye" size="16" />
                                <x-icon id="eye-off-icon" name="eye-off" size="16" class="hidden" />
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <label class="flex items-center gap-2 cursor-pointer group">
                            <div class="relative">
                                <input type="checkbox" name="remember" value="1" class="peer sr-only">
                                <div class="w-4 h-4 rounded border border-slate-600 bg-slate-800/60 peer-checked:bg-indigo-600 peer-checked:border-indigo-500 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500/40 transition-all duration-200 flex items-center justify-center">
                                    <svg class="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <span class="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                        </label>
                    </div>

                    <button type="submit" id="login-submit"
                        class="relative w-full mt-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[.98] overflow-hidden flex items-center justify-center gap-2">
                        <span class="fg-shimmer-btn absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
                        <span class="relative flex items-center gap-2 login-submit-label">
                            <x-icon name="arrow-right" size="16" />
                            Sign In
                        </span>
                    </button>
                </form>

                <div class="mt-5 border-t border-slate-800/60"></div>
                <p class="mt-3 text-xs text-slate-600 text-center">2026 © NerdTech Labs. All rights reserved.</p>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        var toggle = document.getElementById('toggle-password');
        var password = document.getElementById('password');
        if (toggle && password) {
            toggle.addEventListener('click', function () {
                var show = password.type === 'password';
                password.type = show ? 'text' : 'password';
                document.getElementById('eye-icon').classList.toggle('hidden', show);
                document.getElementById('eye-off-icon').classList.toggle('hidden', !show);
            });
        }

        var form = document.querySelector('form[action*="login"]');
        var submit = document.getElementById('login-submit');
        if (form && submit) {
            form.addEventListener('submit', function () {
                submit.disabled = true;
                submit.classList.add('disabled:from-slate-700', 'disabled:to-slate-700', 'cursor-not-allowed');
                var label = submit.querySelector('.login-submit-label');
                if (label) {
                    label.innerHTML =
                        '<svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="M16.2 7.8 19.1 4.9"/><path d="M18 12h4"/><path d="M16.2 16.2 19.1 19.1"/><path d="M12 18v4"/><path d="M4.9 19.1 7.8 16.2"/><path d="M2 12h4"/><path d="M4.9 4.9 7.8 7.8"/></svg> Signing in…';
                }
            });
        }
    });
</script>
@endsection