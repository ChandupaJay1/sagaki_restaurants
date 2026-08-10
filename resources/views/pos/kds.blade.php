@extends('layouts.pos')

@section('title', 'Kitchen Display (KDS) - '.config('app.name', 'Sagaki Restaurant POS'))

@php
    $orders = $orders ?? [];

    $statusColumns = [
        ['id' => 'new',       'label' => 'New',       'bg' => 'bg-blue-500/10',  'border' => 'border-blue-500/30',  'dot' => 'bg-blue-500',  'count' => 'bg-blue-500/20 text-blue-600 dark:text-blue-400',  'actionColor' => 'blue'  ],
        ['id' => 'preparing', 'label' => 'Preparing', 'bg' => 'bg-amber-500/10', 'border' => 'border-amber-500/30', 'dot' => 'bg-amber-500', 'count' => 'bg-amber-500/20 text-amber-600 dark:text-amber-400', 'actionColor' => 'amber' ],
        ['id' => 'ready',     'label' => 'Ready',     'bg' => 'bg-emerald-500/10','border' => 'border-emerald-500/30','dot' => 'bg-emerald-500','count' => 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400', 'actionColor' => 'emerald'],
        ['id' => 'served',    'label' => 'Served',    'bg' => 'bg-slate-500/10', 'border' => 'border-slate-500/30', 'dot' => 'bg-slate-500',  'count' => 'bg-slate-500/20 text-slate-600 dark:text-slate-400',  'actionColor' => 'slate' ],
    ];

    $counts = collect($orders)->groupBy('status')->map->count();
@endphp

@section('content')
<div class="flex flex-col h-full">
    {{-- Header --}}
    <header class="px-6 py-4 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between flex-shrink-0 backdrop-blur-2xl transition-colors duration-300 flex-wrap gap-3">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <x-icon name="chef-hat" size="18" class="text-white" />
            </div>
            <div>
                <h1 class="text-lg font-bold text-slate-900 dark:text-white">Kitchen Display System</h1>
                <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Real-time order tracking</p>
            </div>
        </div>

        <div class="flex items-center gap-3 flex-shrink-0">
            @php
                $statStyles = [
                    'new'       => 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30',
                    'preparing' => 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30',
                    'ready'     => 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
                    'served'    => 'text-slate-600 dark:text-slate-400 bg-slate-500/10 border-slate-500/30',
                ];
            @endphp
            @foreach ($statusColumns as $col)
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium {{ $statStyles[$col['id']] }}">
                    <span>{{ $col['label'] }}</span>
                    <span class="font-bold" data-kds-count="{{ $col['id'] }}">{{ $counts->get($col['id'], 0) }}</span>
                </div>
            @endforeach
        </div>
    </header>

    {{-- Kanban board --}}
    <div class="flex-1 overflow-x-auto overflow-y-hidden">
        <div class="flex gap-4 p-6 h-full min-w-max">
            @foreach ($statusColumns as $col)
                <div class="flex flex-col w-72">
                    {{-- Column header --}}
                    <div class="flex items-center gap-2.5 px-4 py-3 mb-3 {{ $col['bg'] }} border {{ $col['border'] }} rounded-xl">
                        <span class="w-2 h-2 rounded-full {{ $col['dot'] }}"></span>
                        <span class="text-slate-900 dark:text-white font-bold text-sm flex-1">{{ $col['label'] }}</span>
                        <span class="text-xs font-bold px-2 py-0.5 rounded-full {{ $col['count'] }}">{{ $counts->get($col['id'], 0) }}</span>
                    </div>

                    {{-- Orders --}}
                    <div class="flex-1 space-y-3 overflow-y-auto" data-kds-column="{{ $col['id'] }}">
                        @php
                            $colOrders = collect($orders)->where('status', $col['id'])->values();
                        @endphp
                        @forelse ($colOrders as $order)
                            <div class="kds-card p-4 rounded-xl transition-all duration-200 hover:shadow-lg bg-white dark:bg-slate-900/80 border
                                {{ $order['time'] > 10 && $order['status'] !== 'served' ? 'border-red-500/50 shadow-red-500/10' : ($order['status'] === 'new' ? 'border-blue-500/30 shadow-lg' : 'border-slate-200 dark:border-slate-700/60') }}"
                                data-kds-card data-id="{{ $order['id'] }}" data-status="{{ $order['status'] }}" data-time="{{ $order['time'] }}">
                                {{-- Card header --}}
                                <div class="flex items-center justify-between mb-3">
                                    <div class="flex items-center gap-2">
                                        <span class="text-slate-900 dark:text-white font-bold text-sm">{{ $order['id'] }}</span>
                                        @if ($order['priority'] === 'high')
                                            <span class="flex items-center gap-1 text-red-600 dark:text-red-400 text-xs font-medium bg-red-500/10 px-2 py-0.5 rounded-full">
                                                <x-icon name="alert-circle" size="12" />
                                                HIGH
                                            </span>
                                        @endif
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <span class="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs bg-slate-100 dark:bg-slate-700/60 px-2 py-1 rounded-lg">
                                            <x-icon name="clock" size="12" />
                                            <span class="kds-time">{{ $order['time'] }}m</span>
                                        </span>
                                        <span class="kds-overdue {{ $order['time'] > 10 && $order['status'] !== 'served' ? '' : 'hidden' }} flex items-center gap-1 text-red-500 dark:text-red-400 text-xs bg-red-500/10 px-2 py-1 rounded-lg animate-pulse">
                                            <x-icon name="clock" size="12" />
                                            OVERDUE
                                        </span>
                                    </div>
                                </div>

                                {{-- Table --}}
                                <div class="mb-3">
                                    <span class="inline-flex items-center gap-1.5 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-lg">
                                        <x-icon name="utensils" size="12" />
                                        Table {{ $order['table'] }}
                                    </span>
                                </div>

                                {{-- Items --}}
                                <div class="space-y-1.5 mb-4">
                                    @foreach ($order['items'] as $item)
                                        <div class="flex items-start gap-2">
                                            <span class="bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5">{{ $item['qty'] }}</span>
                                            <div class="flex-1 min-w-0">
                                                <p class="text-slate-900 dark:text-white text-sm font-medium truncate">{{ $item['name'] }}</p>
                                                @if (count($item['options']) > 0)
                                                    <p class="text-slate-400 dark:text-slate-500 text-xs truncate">
                                                        @foreach ($item['options'] as $opt)
                                                            • {{ $opt }}
                                                        @endforeach
                                                    </p>
                                                @endif
                                            </div>
                                        </div>
                                    @endforeach
                                </div>

                                {{-- Action / served state --}}
                                <button type="button" class="kds-advance w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[.97] {{ $order['status'] === 'served' ? 'hidden' : ($col['actionColor'] === 'blue' ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 bg-blue-500/10' : ($col['actionColor'] === 'amber' ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 bg-amber-500/10' : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 bg-emerald-500/10')) }}">
                                    <span class="flex items-center justify-center gap-2">
                                        <x-icon name="zap" size="14" class="kds-icon zaps {{ $order['status'] === 'new' ? '' : 'hidden' }}" />
                                        <x-icon name="circle-check" size="14" class="kds-icon checks {{ $order['status'] === 'new' ? 'hidden' : '' }}" />
                                        <span class="kds-advance-label">{{ $order['status'] === 'new' ? 'Mark as Preparing' : ($order['status'] === 'preparing' ? 'Mark as Ready' : 'Mark as Served') }}</span>
                                    </span>
                                </button>
                                <div class="kds-served {{ $order['status'] === 'served' ? '' : 'hidden' }} flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 text-sm py-2.5">
                                    <x-icon name="circle-check" size="14" />
                                    Served
                                </div>
                            </div>
                        @empty
                            <div class="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-slate-700/60 rounded-xl">
                                <x-icon name="chef-hat" size="28" />
                                <p class="text-xs mt-2">No orders</p>
                            </div>
                        @endforelse
                    </div>
                </div>
            @endforeach
        </div>
    </div>

    {{-- Footer --}}
    <footer class="px-6 py-2 bg-white/60 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-700/40 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
        <span>Total Orders: <span class="text-slate-900 dark:text-white font-semibold">{{ count($orders) }}</span></span>
        <span class="flex items-center gap-1">
            <x-icon name="zap" size="12" class="text-indigo-600 dark:text-indigo-400" />
            Auto-refreshing every minute
        </span>
    </footer>

    {{-- Flash pulse overlay --}}
    <div id="kds-flash" class="hidden fixed inset-0 z-40 pointer-events-none bg-blue-500/10 fg-fade-in"></div>
</div>
@endsection

@section('scripts')
@vite('resources/js/pages/kds.js')
@endsection