@extends('layouts.pos')

@section('title', 'Multi Branch - '.config('app.name'))

@section('content')
<div class="flex flex-col h-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
    {{-- Header --}}
    <header class="px-6 py-4 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between flex-shrink-0 backdrop-blur-sm">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-emerald-650 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <x-icon name="git-fork" size="18" class="text-white" />
            </div>
            <div>
                <h1 class="text-lg font-bold text-slate-900 dark:text-white">Multi-Branch Management</h1>
                <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{{ count($branches) }} active locations</p>
            </div>
        </div>
    </header>

    <div class="flex-1 overflow-y-auto px-6 py-5">
        {{-- Branch Cards --}}
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            @foreach($branches as $b)
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all duration-200">
                    <div class="space-y-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-base">
                                {{ strtoupper(substr($b->name, 0, 2)) }}
                            </div>
                            <div>
                                <h3 class="text-base font-bold text-slate-905 text-slate-900 dark:text-white">{{ $b->name }}</h3>
                                <p class="text-slate-450 dark:text-slate-400 text-xs mt-0.5">{{ $b->location ?: 'Location details unavailable' }}</p>
                            </div>
                        </div>

                        <div class="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                            <p><strong>Contact:</strong> {{ $b->contact ?: 'No phone recorded' }}</p>
                            <p><strong>Roster Tables:</strong> {{ $b->tables_count }} seating arrangements</p>
                            <p><strong>Inventory Items:</strong> {{ $b->inventory_items_count }} stock materials</p>
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-150 dark:border-slate-800/40 grid grid-cols-2 gap-4">
                        <div class="bg-slate-50 dark:bg-slate-850 rounded-xl p-3 border border-slate-100 dark:border-transparent">
                            <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Total Orders</p>
                            <p class="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">{{ $b->sales_count }} orders</p>
                        </div>
                        <div class="bg-slate-50 dark:bg-slate-850 rounded-xl p-3 border border-slate-100 dark:border-transparent">
                            <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Revenue</p>
                            <p class="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">LKR {{ number_format($b->revenue) }}</p>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</div>
@endsection
