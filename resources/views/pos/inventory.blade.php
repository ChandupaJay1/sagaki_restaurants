@extends('layouts.pos')

@section('title', 'Inventory - '.config('app.name', 'Sagaki Restaurant POS'))

@php
    $categories = $categories ?? [];
    $inventoryItems = $inventoryItems ?? [];
    $units = $units ?? ['kg', 'pcs', 'bags', 'tins', 'liters', 'bundles'];

    $statusStyles = [
        'ok'       => 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        'low'      => 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
        'critical' => 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 animate-pulse',
    ];
    $statusLabels = ['ok' => 'In Stock', 'low' => 'Low', 'critical' => 'Critical'];

    $glassCard = 'bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm dark:bg-slate-900/80 dark:backdrop-blur-2xl dark:border-slate-800/80 dark:hover:border-indigo-500/40 dark:shadow-xl dark:shadow-black/40 transition-colors duration-300';

    $totalValue = collect($inventoryItems)->sum(fn ($item) => $item['price'] * $item['qty']);
    $lowCount = collect($inventoryItems)->whereNotIn('status', ['ok'])->count();
    $criticalCount = collect($inventoryItems)->where('status', 'critical')->count();

    $statCards = [
        ['key' => 'total',    'label' => 'Total Items', 'value' => count($inventoryItems),                                       'icon' => 'package',       'color' => 'text-indigo-600 dark:text-indigo-400', 'bg' => 'bg-indigo-500/10'],
        ['key' => 'value',    'label' => 'Total Value', 'value' => 'LKR '.round($totalValue / 1000).'k',                        'icon' => 'trending-up',   'color' => 'text-emerald-600 dark:text-emerald-400', 'bg' => 'bg-emerald-500/10'],
        ['key' => 'low',      'label' => 'Low Stock',   'value' => $lowCount,                                                   'icon' => 'alert-triangle','color' => 'text-amber-600 dark:text-amber-400', 'bg' => 'bg-amber-500/10'],
        ['key' => 'critical', 'label' => 'Critical',    'value' => $criticalCount,                                              'icon' => 'trending-down', 'color' => 'text-red-600 dark:text-red-400', 'bg' => 'bg-red-500/10'],
    ];
@endphp

@section('content')
<div class="flex flex-col h-full relative transition-colors duration-300">

    {{-- Ambient background glow --}}
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -top-32 -right-24 w-[480px] h-[480px] bg-indigo-600/10 dark:bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div class="absolute -bottom-24 -left-24 w-[420px] h-[420px] bg-violet-600/10 dark:bg-violet-500/10 rounded-full blur-[120px]"></div>
    </div>

    {{-- Header --}}
    <header class="relative z-10 px-6 py-3.5 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-2xl flex items-center justify-between flex-shrink-0 transition-colors duration-300">
        <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
                <x-icon name="package" size="18" class="text-white" />
            </div>
            <div class="min-w-0">
                <h1 class="text-base font-semibold leading-tight text-slate-900 dark:text-white">Inventory Management</h1>
                <p id="inv-summary" class="text-xs leading-tight text-slate-400 dark:text-slate-500 mt-0.5">{{ count($inventoryItems) }} items · LKR {{ number_format($totalValue) }} total value</p>
            </div>
        </div>

        <button type="button" data-inv-open class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all duration-200 flex-shrink-0">
            <x-icon name="plus" size="15" /> Add Item
        </button>
    </header>

    <div class="flex-1 overflow-y-auto relative z-10 px-6 py-5 transition-colors duration-300">

        {{-- Stats --}}
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            @foreach ($statCards as $i => $stat)
                <div class="{{ $glassCard }} rounded-xl p-4 flex items-center gap-3 fg-kpi-{{ $i + 1 }}">
                    <div class="w-9 h-9 {{ $stat['bg'] }} rounded-lg flex items-center justify-center flex-shrink-0">
                        <x-icon :name="$stat['icon']" size="16" class="{{ $stat['color'] }}" />
                    </div>
                    <div class="min-w-0">
                        <p class="text-xs text-slate-400 dark:text-slate-500">{{ $stat['label'] }}</p>
                        <p data-inv-stat="{{ $stat['key'] }}" class="font-bold text-base {{ $stat['color'] }}">{{ $stat['value'] }}</p>
                    </div>
                </div>
            @endforeach
        </div>

        {{-- Filters --}}
        <div class="{{ $glassCard }} rounded-2xl p-4 shadow-sm">
            <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div class="relative flex-1 min-w-0">
                    <x-icon name="search" size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input id="inv-search" type="text" placeholder="Search items..."
                        class="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200">
                </div>

                <div data-inv-cats class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 sm:pb-0 max-w-full">
                    <x-icon name="filter" size="14" class="text-slate-400 flex-shrink-0" />
                    @foreach ($categories as $cat)
                        <button type="button" data-inv-cat="{{ $cat['id'] }}"
                            @class([
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200',
                                'bg-indigo-600 text-white shadow-md shadow-indigo-500/30' => $cat['id'] === 'all',
                                'bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 hover:border-indigo-300' => $cat['id'] !== 'all',
                            ])>
                            <x-icon :name="$cat['icon']" size="12" />
                            {{ $cat['label'] }}
                        </button>
                    @endforeach
                </div>

                <select id="inv-status"
                    class="bg-slate-100 text-slate-900 dark:bg-slate-800/80 dark:text-white border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none flex-shrink-0">
                    <option value="all">All Status</option>
                    <option value="ok">In Stock</option>
                    <option value="low">Low</option>
                    <option value="critical">Critical</option>
                </select>
            </div>
        </div>

        {{-- Table --}}
        <div class="{{ $glassCard }} rounded-2xl overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-slate-200 dark:border-slate-800/60 text-left">
                            @foreach (['Item', 'Category', 'Stock Level', 'Price', 'Status', 'Supplier', ''] as $heading)
                                <th class="px-5 py-3 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{{ $heading }}</th>
                            @endforeach
                        </tr>
                    </thead>
                    <tbody id="inv-tbody" class="divide-y divide-slate-100 dark:divide-slate-800/40"></tbody>
                </table>
            </div>

            <div id="inv-empty" class="hidden flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500 gap-3">
                <x-icon name="package" size="32" />
                <p class="text-sm font-medium">No items found</p>
                <p class="text-xs">Try adjusting your filters</p>
            </div>
        </div>
    </div>

    {{-- Add Item modal --}}
    <div id="inv-add-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm fg-fade-in" data-inv-close></div>
        <div class="relative w-full max-w-md bg-white dark:bg-slate-900/90 dark:backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden fg-card">
            <div class="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

            <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
                <h2 class="text-slate-900 dark:text-white font-bold text-sm">Add New Item</h2>
                <button type="button" data-inv-close class="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <x-icon name="x" size="18" />
                </button>
            </div>

            <div class="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                    <label for="inv-add-name" class="block text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">Item Name</label>
                    <input id="inv-add-name" type="text" placeholder="Item Name"
                        class="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200">
                </div>
                <div>
                    <label for="inv-add-supplier" class="block text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">Supplier</label>
                    <input id="inv-add-supplier" type="text" placeholder="Supplier"
                        class="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200">
                </div>
                <div>
                    <label for="inv-add-price" class="block text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">Unit Price (LKR)</label>
                    <input id="inv-add-price" type="number" min="0" placeholder="Unit Price (LKR)"
                        class="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200">
                </div>
                <div>
                    <label for="inv-add-qty" class="block text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">Current Quantity</label>
                    <input id="inv-add-qty" type="number" min="0" placeholder="Current Quantity"
                        class="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200">
                </div>
                <div>
                    <label for="inv-add-minqty" class="block text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">Minimum Qty</label>
                    <input id="inv-add-minqty" type="number" min="0" placeholder="Minimum Qty"
                        class="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label for="inv-add-category" class="block text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">Category</label>
                        <select id="inv-add-category"
                            class="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none">
                            @foreach ($categories as $cat)
                                @if ($cat['id'] !== 'all')
                                    <option value="{{ $cat['id'] }}">{{ $cat['label'] }}</option>
                                @endif
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label for="inv-add-unit" class="block text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">Unit</label>
                        <select id="inv-add-unit"
                            class="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none">
                            @foreach ($units as $unit)
                                <option value="{{ $unit }}">{{ $unit }}</option>
                            @endforeach
                        </select>
                    </div>
                </div>
            </div>

            <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-end gap-2">
                <button type="button" data-inv-close class="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors">Cancel</button>
                <button type="button" data-inv-add-submit class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">Add Item</button>
            </div>
        </div>
    </div>

    {{-- Toast --}}
    <div id="inv-toast" class="hidden fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
        <x-icon name="check-circle" size="16" class="text-emerald-500 dark:text-emerald-400" />
        <span id="inv-toast-message"></span>
    </div>
</div>

<script>
    window.POS_INVENTORY = @json($posInventory);
</script>
@endsection

@section('scripts')
@vite('resources/js/pages/inventory.js')
@endsection