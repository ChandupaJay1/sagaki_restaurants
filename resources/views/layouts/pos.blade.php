<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>@yield('title', config('app.name', 'Sagaki Restaurant POS'))</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600|inter:400,500,600,700&display=swap" rel="stylesheet" />

        <script>
            (function () {
                var theme = localStorage.getItem('pos-theme');
                var dark = theme ? theme === 'dark' : true;
                var root = document.documentElement;
                root.classList.toggle('dark', dark);
                if (!theme) localStorage.setItem('pos-theme', dark ? 'dark' : 'light');
            })();
        </script>

        @vite(['resources/css/app.css', 'resources/js/app.js'])
        @stack('styles')
    </head>
    <body class="font-sans">
        @php
            $user = Auth::user();
            $initials = collect(preg_split('/\s+/', trim((string) ($user->name ?? ''))))
                ->filter()->take(2)->map(fn ($w) => mb_strtoupper(mb_substr($w, 0, 1)))->join('');
            $initials = $initials ?: 'U';

            $navItems = [
                ['name' => 'dashboard',        'label' => 'Dashboard',     'icon' => 'bar-chart',       'route' => 'dashboard',     'active' => request()->routeIs('dashboard')],
                ['name' => 'pos.index',        'label' => 'POS Billing',   'icon' => 'shopping-cart',  'route' => 'pos.index',     'active' => request()->routeIs('pos.index')],
                ['name' => 'pos.tables',       'label' => 'Tables',        'icon' => 'table-2',        'route' => 'pos.tables',    'active' => request()->routeIs('pos.tables')],
                ['name' => 'pos.kds',          'label' => 'Kitchen (KDS)', 'icon' => 'chef-hat',       'route' => 'pos.kds',       'active' => request()->routeIs('pos.kds')],
                ['name' => 'pos.inventory',    'label' => 'Inventory',     'icon' => 'package',        'route' => 'pos.inventory', 'active' => request()->routeIs('pos.inventory')],
                ['name' => 'pos.crm',          'label' => 'CRM',            'icon' => 'users',          'route' => 'pos.crm',       'active' => request()->routeIs('pos.crm')],
                ['name' => 'pos.reports',      'label' => 'Reports',       'icon' => 'bar-chart-3',    'route' => 'pos.reports',   'active' => request()->routeIs('pos.reports')],
            ];
        @endphp

        <div class="flex h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white overflow-hidden transition-colors duration-300">
            {{-- Mobile overlay --}}
            <div id="sidebar-overlay" class="fixed inset-0 bg-black/60 z-40 lg:hidden hidden" data-sidebar-close></div>

            {{-- Sidebar --}}
            <aside id="sidebar"
                class="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800/80 backdrop-blur-xl flex flex-col transition-transform duration-300 ease-in-out -translate-x-full lg:translate-x-0"
            >
                <div class="px-5 py-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                    <a href="{{ route('pos.index') }}" class="flex items-center gap-3">
                        <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <x-icon name="utensils" size="18" class="text-white" />
                        </div>
                        <div>
                            <h1 class="text-slate-900 dark:text-white font-bold text-sm leading-none">Restaurant</h1>
                            <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">POS System</p>
                        </div>
                    </a>
                    <button type="button" data-sidebar-close class="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <x-icon name="x" size="20" />
                    </button>
                </div>

                <nav class="flex-1 px-3 py-4 overflow-y-auto space-y-1">
                    @foreach ($navItems as $item)
                        <a href="{{ route($item['route']) }}" data-sidebar-close
                            @class([
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border border-indigo-400/30 shadow-lg shadow-indigo-500/30' => $item['active'],
                                'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white' => !$item['active'],
                            ])
                        >
                            <x-icon :name="$item['icon']" size="18" />
                            {{ $item['label'] }}
                        </a>
                    @endforeach
                </nav>

                <div class="px-3 py-4 border-t border-slate-200 dark:border-slate-800/80">
                    <div class="flex items-center gap-2 px-3 py-2 mb-2">
                        <button type="button" id="theme-toggle" class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                            <x-icon name="sun" size="16" class="dark:hidden" />
                            <x-icon name="moon" size="16" class="hidden dark:block" />
                            <span class="theme-label">Light Mode</span>
                        </button>
                    </div>
                    <div class="flex items-center gap-3 px-3 py-2 mb-2 min-w-0">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/20">
                            {{ $initials }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-slate-900 dark:text-white text-sm font-semibold truncate">{{ $user->name ?? 'User' }}</p>
                            <p class="text-slate-500 dark:text-slate-400 text-xs truncate">{{ $user->email ?? '' }}</p>
                        </div>
                    </div>
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors w-full rounded-lg hover:bg-red-500/10 dark:hover:bg-red-500/10">
                            <x-icon name="log-out" size="16" />
                            Log Out
                        </button>
                    </form>
                </div>
            </aside>

            {{-- Main content --}}
            <div class="flex-1 flex flex-col overflow-hidden">
                <header class="lg:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 flex-shrink-0">
                    <button type="button" data-sidebar-open class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <x-icon name="menu" size="22" />
                    </button>
                    <div class="flex items-center gap-2">
                        <div class="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <x-icon name="utensils" size="14" class="text-white" />
                        </div>
                        <span class="text-slate-900 dark:text-white font-bold text-sm">Restaurant POS</span>
                    </div>
                </header>

                <main class="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
                    @yield('content')
                </main>

                <footer class="flex-shrink-0 px-6 py-3 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 text-center">
                    <p class="text-xs text-slate-400 dark:text-slate-500">2026 © NerdTech Labs. All rights reserved.</p>
                </footer>
            </div>
        </div>

        @yield('scripts')
    </body>
</html>