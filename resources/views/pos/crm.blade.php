@extends('layouts.pos')

@section('title', 'CRM - '.config('app.name'))

@php
    $customers = $customers ?? [];

    $totalSpend = array_sum(array_column($customers, 'total_spend'));
    $avgSpend = $customers ? (int) round($totalSpend / count($customers)) : 0;
    $goldCount = count(array_filter($customers, fn ($c) => $c['tier'] === 'gold'));

    $tierBadge = [
        'gold'   => 'text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/30',
        'silver' => 'text-slate-500 dark:text-slate-300 bg-slate-400/15 border-slate-400/30',
        'bronze' => 'text-orange-600 dark:text-orange-400 bg-orange-500/15 border-orange-500/30',
    ];
    $initialsOf = fn ($name) => strtoupper(collect(preg_split('/\s+/', trim($name)))->filter()->map(fn ($w) => mb_substr($w, 0, 1))->take(2)->join(''));
@endphp

@section('content')
<div class="flex flex-col h-full">
    {{-- Header --}}
    <header class="px-6 py-4 bg-white/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between flex-shrink-0 backdrop-blur-sm transition-colors duration-300">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <x-icon name="users" size="18" class="text-white" />
            </div>
            <div>
                <h1 class="text-lg font-bold text-slate-900 dark:text-white">Customer Relations</h1>
                <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{{ count($customers) }} customers · LKR {{ number_format($totalSpend) }} total spend</p>
            </div>
        </div>
        <button type="button" data-add-customer class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/25">
            <x-icon name="plus" size="15" />
            Add Customer
        </button>
    </header>

    <div class="flex-1 overflow-y-auto px-6 py-5">
        {{-- Stats --}}
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            @foreach ([
                ['label' => 'Total Customers', 'value' => count($customers), 'icon' => 'users', 'color' => 'text-indigo-600 dark:text-indigo-400', 'bg' => 'bg-indigo-500/10'],
                ['label' => 'Gold Members', 'value' => $goldCount, 'icon' => 'star', 'color' => 'text-amber-600 dark:text-amber-400', 'bg' => 'bg-amber-500/10'],
                ['label' => 'Total Revenue', 'value' => 'LKR '.(int) ($totalSpend / 1000).'k', 'icon' => 'trending-up', 'color' => 'text-emerald-600 dark:text-emerald-400', 'bg' => 'bg-emerald-500/10'],
                ['label' => 'Avg. Spend', 'value' => 'LKR '.number_format($avgSpend), 'icon' => 'star', 'color' => 'text-violet-600 dark:text-violet-400', 'bg' => 'bg-violet-500/10'],
            ] as $stat)
                <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 flex items-center gap-3">
                    <div class="w-9 h-9 {{ $stat['bg'] }} rounded-lg flex items-center justify-center flex-shrink-0">
                        <x-icon :name="$stat['icon']" size="16" class="{{ $stat['color'] }}" />
                    </div>
                    <div>
                        <p class="text-slate-500 dark:text-slate-400 text-xs">{{ $stat['label'] }}</p>
                        <p class="font-bold text-base {{ $stat['color'] }}">{{ $stat['value'] }}</p>
                    </div>
                </div>
            @endforeach
        </div>

        {{-- Filters --}}
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 mb-5 shadow-sm">
            <div class="flex flex-col sm:flex-row gap-3">
                <div class="relative flex-1">
                    <x-icon name="search" size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" id="crm-search" placeholder="Search by name or email..."
                        class="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-600/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors">
                </div>
                <div class="flex items-center gap-2">
                    <x-icon name="settings" size="14" class="text-slate-400 flex-shrink-0" />
                    @foreach (['all', 'gold', 'silver', 'bronze'] as $t)
                        <button type="button" data-tier-filter="{{ $t }}"
                            @class([
                                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                                'bg-indigo-600 text-white' => $t === 'all',
                                'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-600/40' => $t !== 'all',
                            ])>
                            {{ $t === 'all' ? 'All Tiers' : ucfirst($t) }}
                        </button>
                    @endforeach
                </div>
            </div>
        </div>

        {{-- Customer Grid --}}
        <div id="crm-grid" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            @foreach ($customers as $customer)
                <button type="button" data-customer-id="{{ $customer['id'] }}" data-name="{{ $customer['name'] }}" data-tier="{{ $customer['tier'] }}" data-email="{{ $customer['email'] }}"
                    class="crm-card bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 text-left hover:border-slate-300 dark:hover:border-slate-600/80 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all duration-200 group shadow-sm">
                    <div class="flex items-start gap-3 mb-4">
                        <div class="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                            {{ $initialsOf($customer['name']) }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2">
                                <p class="text-slate-900 dark:text-white font-semibold text-sm truncate">{{ $customer['name'] }}</p>
                                <x-icon name="star" size="14" :class="match ($customer['tier']) { 'gold' => 'text-amber-600 dark:text-amber-400', 'silver' => 'text-slate-500 dark:text-slate-300', default => 'text-orange-600 dark:text-orange-400' }" />
                            </div>
                            <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{{ $customer['email'] }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3 mb-4">
                        <div>
                            <p class="text-slate-500 dark:text-slate-400 text-xs">Visits</p>
                            <p class="text-slate-900 dark:text-white font-bold text-sm">{{ $customer['visits'] }}</p>
                        </div>
                        <div>
                            <p class="text-slate-500 dark:text-slate-400 text-xs">Spend</p>
                            <p class="text-indigo-600 dark:text-indigo-400 font-bold text-sm">LKR {{ number_format($customer['total_spend'] / 1000, 1) }}k</p>
                        </div>
                        <div>
                            <p class="text-slate-500 dark:text-slate-400 text-xs">Last</p>
                            <p class="text-slate-900 dark:text-white font-bold text-sm">{{ substr($customer['lastVisit'], 5) }}</p>
                        </div>
                    </div>

                    <div class="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700/40">
                        <span class="text-slate-500 dark:text-slate-400 text-xs truncate">📅 {{ $customer['favorite'] }}</span>
                        <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border {{ $tierBadge[$customer['tier']] }}">
                            <x-icon :name="match ($customer['tier']) { 'gold' => 'star', 'silver' => 'star', default => 'heart' }" size="12" />
                            {{ ucfirst($customer['tier']) }}
                        </span>
                    </div>
                </button>
            @endforeach
        </div>

        <div id="crm-empty" class="hidden flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
            <x-icon name="users" size="32" class="text-slate-500" />
            <p class="text-sm font-medium">No customers found</p>
            <p class="text-xs">Try adjusting your search or filters</p>
        </div>
    </div>
</div>

{{-- Customer Modal --}}
<div id="crm-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" data-modal-close></div>
    <div class="relative w-full max-w-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div id="modal-avatar" class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-sm"></div>
                <div>
                    <h2 id="modal-name" class="text-slate-900 dark:text-white font-bold text-base"></h2>
                    <span id="modal-tier" class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border"></span>
                </div>
            </div>
            <button type="button" data-modal-close class="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <x-icon name="x" size="18" />
            </button>
        </div>

        <div class="flex border-b border-slate-200 dark:border-slate-700/60 px-6">
            @foreach (['details', 'history', 'notes'] as $tab)
                <button type="button" data-modal-tab="{{ $tab }}"
                    @class([
                        'px-4 py-3 text-sm font-medium border-b-2 transition-all',
                        'border-indigo-500 text-indigo-600 dark:text-indigo-400' => $tab === 'details',
                        'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white' => $tab !== 'details',
                    ])>{{ ucfirst($tab) }}</button>
            @endforeach
        </div>

        <div class="px-6 py-5 min-h-56">
            <div id="modal-tab-details" class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                    <div class="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-100 dark:border-transparent">
                        <div class="flex items-center gap-2 mb-1">
                            <x-icon name="calendar" size="13" class="text-indigo-600 dark:text-indigo-400" />
                            <span class="text-slate-500 dark:text-slate-400 text-xs">Total Visits</span>
                        </div>
                        <p id="modal-visits" class="text-slate-900 dark:text-white font-semibold text-sm"></p>
                    </div>
                    <div class="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-100 dark:border-transparent">
                        <div class="flex items-center gap-2 mb-1">
                            <x-icon name="credit-card" size="13" class="text-indigo-600 dark:text-indigo-400" />
                            <span class="text-slate-500 dark:text-slate-400 text-xs">Total Spend</span>
                        </div>
                        <p id="modal-spend" class="text-slate-900 dark:text-white font-semibold text-sm"></p>
                    </div>
                    <div class="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-100 dark:border-transparent">
                        <div class="flex items-center gap-2 mb-1">
                            <x-icon name="up" size="13" class="text-indigo-600 dark:text-indigo-400" />
                            <span class="text-slate-500 dark:text-slate-400 text-xs">Avg. Order</span>
                        </div>
                        <p id="modal-avg" class="text-slate-900 dark:text-white font-semibold text-sm"></p>
                    </div>
                    <div class="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-100 dark:border-transparent">
                        <div class="flex items-center gap-2 mb-1">
                            <x-icon name="users" size="13" class="text-indigo-600 dark:text-indigo-400" />
                            <span class="text-slate-500 dark:text-slate-400 text-xs">Member Since</span>
                        </div>
                        <p id="modal-joined" class="text-slate-900 dark:text-white font-semibold text-sm"></p>
                    </div>
                </div>
                <div class="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-100 dark:border-transparent">
                    <div class="flex items-center gap-2 mb-1">
                        <x-icon name="map-pin" size="13" class="text-indigo-600 dark:text-indigo-400" />
                        <span class="text-slate-500 dark:text-slate-400 text-xs">Favorite Dish</span>
                    </div>
                    <p id="modal-favorite" class="text-slate-900 dark:text-white font-medium text-sm"></p>
                </div>
                <div id="modal-notes-wrap" class="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-100 dark:border-transparent">
                    <div class="flex items-center gap-2 mb-1">
                        <x-icon name="mail" size="13" class="text-indigo-600 dark:text-indigo-400" />
                        <span class="text-slate-500 dark:text-slate-400 text-xs">Notes</span>
                    </div>
                    <p id="modal-notes" class="text-slate-700 dark:text-slate-300 text-sm"></p>
                </div>
                <div class="flex gap-2">
                    <a id="modal-call" href="#" class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-xl transition-colors hover:bg-emerald-600 hover:text-white">
                        <x-icon name="phone" size="14" /> Call
                    </a>
                    <a id="modal-mail" href="#" class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-xl transition-colors hover:bg-indigo-600 hover:text-white">
                        <x-icon name="mail" size="14" /> Email
                    </a>
                </div>
            </div>

            <div id="modal-tab-history" class="space-y-3 hidden">
                <div class="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-transparent rounded-xl p-3">
                    <span class="text-slate-500 dark:text-slate-400 text-xs w-20">2024-01-12</span>
                    <span class="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-2 py-0.5 rounded-full">T3</span>
                    <span class="text-slate-500 dark:text-slate-400 text-xs">4 items</span>
                    <span class="text-slate-900 dark:text-white font-semibold text-sm ml-auto">LKR 1,850</span>
                    <span class="text-emerald-600 dark:text-emerald-400 text-xs font-medium">Paid</span>
                </div>
                <div class="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-transparent rounded-xl p-3">
                    <span class="text-slate-500 dark:text-slate-400 text-xs w-20">2024-01-08</span>
                    <span class="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-2 py-0.5 rounded-full">T7</span>
                    <span class="text-slate-500 dark:text-slate-400 text-xs">2 items</span>
                    <span class="text-slate-900 dark:text-white font-semibold text-sm ml-auto">LKR 900</span>
                    <span class="text-emerald-600 dark:text-emerald-400 text-xs font-medium">Paid</span>
                </div>
                <div class="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-transparent rounded-xl p-3">
                    <span class="text-slate-500 dark:text-slate-400 text-xs w-20">2024-01-03</span>
                    <span class="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-2 py-0.5 rounded-full">T1</span>
                    <span class="text-slate-500 dark:text-slate-400 text-xs">5 items</span>
                    <span class="text-slate-900 dark:text-white font-semibold text-sm ml-auto">LKR 2,200</span>
                    <span class="text-emerald-600 dark:text-emerald-400 text-xs font-medium">Paid</span>
                </div>
            </div>

            <div id="modal-tab-notes" class="space-y-3 hidden">
                <textarea rows="4" placeholder="Add a note about this customer..."
                    class="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none transition-colors"></textarea>
                <button type="button" data-modal-close class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">Save Note</button>
            </div>
        </div>
    </div>
</div>

{{-- Add Customer Modal --}}
<div id="add-customer-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" data-add-modal-close></div>
    <div class="relative w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <h2 class="text-slate-900 dark:text-white font-bold text-base">Add New Customer</h2>
            <button type="button" data-add-modal-close class="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <x-icon name="x" size="18" />
            </button>
        </div>
        <div class="px-6 py-5 space-y-4">
            <div>
                <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Name</label>
                <input type="text" id="add-cust-name" placeholder="Name" class="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
            </div>
            <div>
                <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Phone</label>
                <input type="text" id="add-cust-phone" placeholder="Phone e.g. 077-123-4567" class="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
            </div>
            <div>
                <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Email</label>
                <input type="email" id="add-cust-email" placeholder="Email" class="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
            </div>
            <div>
                <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Favorite Dish</label>
                <input type="text" id="add-cust-favorite" placeholder="Favorite Dish" class="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
            </div>
            <div>
                <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Notes</label>
                <textarea id="add-cust-notes" rows="2" placeholder="Notes (allergies, seating preference...)" class="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"></textarea>
            </div>
        </div>
        <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-end gap-2 bg-slate-50 dark:bg-slate-800">
            <button type="button" data-add-modal-close class="px-4 py-2 text-slate-500 dark:text-slate-400 text-sm font-medium rounded-xl hover:text-slate-900">Cancel</button>
            <button type="button" id="submit-add-customer" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl">Save</button>
        </div>
    </div>
</div>

{{-- Toast --}}
<div id="crm-toast" class="hidden fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
    <x-icon name="check" size="16" class="text-emerald-500 dark:text-emerald-400" />
    <span id="crm-toast-text"></span>
</div>
@endsection

@section('scripts')
@vite('resources/js/pages/crm.js')
@endsection