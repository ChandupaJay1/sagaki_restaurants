@extends('layouts.pos')

@section('title', 'Profile - '.config('app.name'))

@php
    $initials = collect(preg_split('/\s+/', trim((string) $user->name ?? '')))
        ->filter()->take(2)->map(fn ($w) => mb_strtoupper(mb_substr($w, 0, 1)))->join('') ?: 'U';
@endphp

@section('content')
<div class="flex flex-col h-full relative transition-colors duration-300">
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -top-32 -right-24 w-[480px] h-[480px] bg-indigo-600/10 dark:bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div class="absolute -bottom-24 -left-24 w-[420px] h-[420px] bg-violet-600/10 dark:bg-violet-500/10 rounded-full blur-[120px]"></div>
    </div>

    <header class="relative z-10 px-6 py-3.5 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-2xl flex items-center gap-3 flex-shrink-0 transition-colors duration-300">
        <div class="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
            <x-icon name="users" size="18" class="text-white" />
        </div>
        <div class="min-w-0">
            <h1 class="text-base font-semibold leading-tight text-slate-900 dark:text-white">Profile</h1>
            <p class="text-xs leading-tight text-slate-400 dark:text-slate-500">Your account details</p>
        </div>
    </header>

    <div class="flex-1 overflow-y-auto relative px-6 py-6 transition-colors duration-300">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-4xl">
            <div class="fg-chart rounded-2xl p-6 bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 dark:bg-slate-900/80 dark:backdrop-blur-2xl dark:border-slate-800/80 dark:hover:border-indigo-500/40 dark:shadow-xl dark:shadow-black/40 transition-all duration-300">
                <div class="flex items-center gap-4 mb-6">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl font-bold text-white shadow-xl shadow-indigo-500/40 ring-2 ring-indigo-500/20 flex-shrink-0">
                        {{ $initials }}
                    </div>
                    <div class="min-w-0">
                        <h2 class="text-slate-900 dark:text-white font-bold text-lg leading-tight truncate">{{ $user->name ?? 'User' }}</h2>
                        <p class="text-slate-400 dark:text-slate-500 text-sm truncate">{{ $user->email ?? '' }}</p>
                        <span class="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 mt-1">
                            <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full fg-pulse-soft"></span>
                            Active
                        </span>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-800/60">
                        <span class="text-sm text-slate-400 dark:text-slate-500">Name</span>
                        <span class="text-sm font-medium text-slate-900 dark:text-white">{{ $user->name ?? 'User' }}</span>
                    </div>
                    <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-800/60">
                        <span class="text-sm text-slate-400 dark:text-slate-500">Email Address</span>
                        <span class="text-sm font-medium text-slate-900 dark:text-white">{{ $user->email ?? '' }}</span>
                    </div>
                    <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-800/60">
                        <span class="text-sm text-slate-400 dark:text-slate-500">Role</span>
                        <span class="text-sm font-medium text-slate-900 dark:text-white">Administrator</span>
                    </div>
                    <div class="flex items-center justify-between py-3">
                        <span class="text-sm text-slate-400 dark:text-slate-500">Account Status</span>
                        <span class="text-sm font-medium text-emerald-400">Active</span>
                    </div>
                </div>
            </div>

            <div class="fg-chart rounded-2xl p-6 bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 dark:bg-slate-900/80 dark:backdrop-blur-2xl dark:border-slate-800/80 dark:hover:border-indigo-500/40 dark:shadow-xl dark:shadow-black/40 transition-all duration-300">
                <h2 class="font-semibold text-sm text-slate-900 dark:text-white mb-4">Account Security</h2>
                <p class="text-sm text-slate-400 dark:text-slate-500 leading-relaxed mb-4">
                    This demo system uses a built-in administrator account. Password management and profile
                    editing are handled by the system administrator.
                </p>
                <div class="flex items-center gap-3 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <x-icon name="lock" size="16" class="text-indigo-400 flex-shrink-0" />
                    <p class="text-xs text-indigo-300 leading-relaxed">
                        Credentials are authenticated against the hardcoded provider — no database storage is involved.
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection