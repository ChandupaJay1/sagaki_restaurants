@extends('layouts.pos')

@section('title', 'POS Billing - '.config('app.name'))

@php
    $serviceChargeRate = $serviceChargeRate ?? 0.10;
@endphp

@section('content')
<div id="pos-billing" class="flex h-full overflow-hidden">
    {{-- ── LEFT: Menu Panel ──────────────────────────────────────────────── --}}
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">

        {{-- Header --}}
        <header class="relative z-10 px-6 py-4 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-2xl flex items-center justify-between gap-4 flex-shrink-0 flex-wrap">
            <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
                    <x-icon name="utensils" size="18" class="text-white" />
                </div>
                <div class="min-w-0">
                    <h1 class="text-lg font-bold text-slate-800 dark:text-white leading-none">POS Billing</h1>
                    <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">New Order</p>
                </div>
            </div>

            <div class="flex items-center gap-3 flex-shrink-0">
                {{-- Order type toggle --}}
                <div class="flex bg-slate-100 dark:bg-slate-800/60 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700/60 flex-shrink-0">
                    <button type="button" data-order-type="dine-in"
                        @class([
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                            'bg-indigo-600 text-white shadow-md' => true,
                        ])>
                        Dine In
                    </button>
                    <button type="button" data-order-type="takeaway"
                        @class([
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                            'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white' => true,
                        ])>
                        Take Away
                    </button>
                </div>

                {{-- Search --}}
                <div class="relative max-w-xs w-full">
                    <x-icon name="search" size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input id="search-input" type="text" placeholder="Search menu..."
                        class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl pl-9 pr-9 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors" />
                    <button type="button" id="search-clear" class="hidden absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <x-icon name="x" size="14" />
                    </button>
                </div>

                {{-- Table input (dine-in only) --}}
                <div id="table-wrap" class="hidden items-center gap-2 sm:flex">
                    <label class="text-slate-500 dark:text-slate-400 text-sm whitespace-nowrap">Table</label>
                    <input id="table-number" type="text" placeholder="e.g. T4"
                        class="w-20 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-center font-semibold" />
                </div>
            </div>
        </header>

        {{-- Category Tabs --}}
        <div class="px-6 py-3 bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl flex-shrink-0">
            <div id="category-tabs" class="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                @foreach ($posCategories as $cat)
                    <button type="button" data-category="{{ $cat['id'] }}"
                        @class([
                            'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 border',
                            'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-indigo-400/50 border-transparent' => $cat['id'] === 'all',
                            'bg-slate-200/50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-600/40' => $cat['id'] !== 'all',
                        ])>
                        <x-icon :name="$cat['icon']" size="15" />
                        {{ $cat['label'] }}
                    </button>
                @endforeach
            </div>
        </div>

        {{-- Menu Grid --}}
        <div class="flex-1 overflow-y-auto px-6 py-5">
            <div id="menu-empty" class="hidden flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 gap-3">
                <x-icon name="search" size="40" class="text-slate-400 dark:text-slate-500" />
                <p class="text-lg font-medium">No items found</p>
                <p class="text-sm">Try a different category or search term</p>
            </div>

            <div id="menu-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                @foreach ($posMenuItems as $item)
                    <button type="button" data-menu-id="{{ $item['id'] }}" data-name="{{ $item['name'] }}" data-category="{{ $item['category'] }}" data-price="{{ $item['price'] }}" data-emoji="{{ $item['emoji'] }}"
                        @class([
                            'group bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/60 shadow-sm dark:shadow-xl dark:shadow-black/40 rounded-2xl p-4 text-left transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-95 flex flex-col',
                        ])>
                        <div class="text-3xl mb-3 leading-none group-hover:scale-110 transition-transform duration-200">{{ $item['emoji'] }}</div>
                        <div class="flex-1">
                            <p class="text-slate-800 dark:text-white font-semibold text-sm leading-tight mb-1 line-clamp-2">{{ $item['name'] }}</p>
                            @if (count($item['tags']) > 0)
                                <div class="flex flex-wrap gap-1 mt-2">
                                    @foreach ($item['tags'] as $tag)
                                        @if ($tag === 'spicy')
                                            <span class="text-xs px-1.5 py-0.5 rounded-md font-medium bg-red-500/20 text-red-400">{{ $tag }}</span>
                                        @elseif ($tag === 'vegan')
                                            <span class="text-xs px-1.5 py-0.5 rounded-md font-medium bg-emerald-500/20 text-emerald-400">{{ $tag }}</span>
                                        @else
                                            <span class="text-xs px-1.5 py-0.5 rounded-md font-medium bg-slate-200 dark:bg-slate-600/60 text-slate-600 dark:text-slate-300">{{ $tag }}</span>
                                        @endif
                                    @endforeach
                                </div>
                            @endif
                        </div>
                        <div class="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between w-full">
                            <span class="text-indigo-600 dark:text-indigo-400 font-bold text-base">LKR {{ number_format($item['price'], 2) }}</span>
                            <span class="w-7 h-7 bg-indigo-600 group-hover:bg-indigo-500 rounded-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-md">
                                <x-icon name="plus" size="14" class="text-white" />
                            </span>
                        </div>
                    </button>
                @endforeach
            </div>
        </div>
    </div>

    {{-- ── RIGHT: Cart Sidebar ───────────────────────────────────────────── --}}
    <aside class="w-96 flex flex-col bg-white dark:bg-slate-900/80 backdrop-blur-2xl border-l border-slate-200 dark:border-slate-800/80 flex-shrink-0 shadow-lg shadow-black/5 dark:shadow-black/40">

        {{-- Cart Header --}}
        <div class="px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between flex-shrink-0">
            <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                    <x-icon name="shopping-cart" size="16" class="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h2 class="text-slate-800 dark:text-white font-bold text-sm">Current Order</h2>
                    <p id="cart-subtitle" class="text-slate-500 dark:text-slate-400 text-xs">No table set</p>
                </div>
                <span id="cart-count" class="hidden bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    0
                </span>
            </div>
            <button type="button" id="clear-cart"
                class="hidden text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1 text-xs px-2 py-1 rounded-lg hover:bg-red-500/10">
                <x-icon name="trash" size="13" />
                Clear
            </button>
        </div>

        {{-- Cart Items --}}
        <div class="flex-1 overflow-y-auto px-5">
            <div id="cart-empty" class="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 gap-3 py-16">
                <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800/60 rounded-2xl flex items-center justify-center border border-slate-200/60 dark:border-slate-800/80">
                    <x-icon name="shopping-cart" size="32" class="text-slate-400 dark:text-slate-500" />
                </div>
                <p class="text-sm font-medium">Cart is empty</p>
                <p class="text-xs text-center text-slate-500 dark:text-slate-400">Tap items from the menu to add them</p>
            </div>
            <div id="cart-items" class="hidden py-2"></div>
        </div>

        {{-- Order Note --}}
        <div id="order-note-wrap" class="hidden px-5 pt-2 pb-2.5 border-t border-slate-200/80 dark:border-slate-800/40">
            <textarea id="order-note" rows="2" placeholder="Order note (allergies, preferences...)"
                class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none transition-colors"></textarea>
        </div>

        {{-- Customer Selector --}}
        <div id="customer-select-wrap" class="hidden px-5 py-2 border-t border-slate-200/80 dark:border-slate-800/40 space-y-1">
            <label class="text-slate-500 dark:text-slate-400 text-[11px] font-semibold">Customer (CRM)</label>
            <select id="customer-select" class="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500">
                <option value="">Walk-in Customer</option>
                @foreach ($customers as $c)
                    <option value="{{ $c->id }}">{{ $c->name }} ({{ ucfirst($c->tier) }})</option>
                @endforeach
            </select>
        </div>

        {{-- Discount Selector --}}
        <div id="discount-wrap" class="hidden px-5 py-2 border-t border-slate-200/80 dark:border-slate-800/40 flex items-center justify-between gap-3">
            <span class="text-slate-500 dark:text-slate-400 text-xs font-semibold">Discount</span>
            <div class="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl px-2.5 py-1">
                <input id="discount-pct" type="number" min="0" max="100" placeholder="0" class="w-10 bg-transparent text-xs text-slate-800 dark:text-white focus:outline-none text-right font-semibold border-0 p-0" />
                <span class="text-xs text-slate-400 font-bold">%</span>
            </div>
        </div>

        {{-- Payment Method Selection --}}
        <div id="payment-wrap" class="hidden px-5 py-2 border-t border-slate-200/80 dark:border-slate-800/40 space-y-1.5">
            <span class="text-slate-500 dark:text-slate-400 text-xs font-semibold">Payment Method</span>
            <div class="grid grid-cols-3 gap-2">
                <button type="button" data-payment-method="Cash" class="py-1.5 rounded-lg text-xs font-medium border border-indigo-650 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 transition-all duration-200">Cash</button>
                <button type="button" data-payment-method="Card" class="py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all duration-200">Card</button>
                <button type="button" data-payment-method="QR" class="py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all duration-200">QR</button>
            </div>
        </div>

        {{-- Totals --}}
        <div class="px-5 pt-3 pb-2 border-t border-slate-200/80 dark:border-slate-800/60 space-y-2 flex-shrink-0">
            <div class="flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Subtotal</span>
                <span id="cart-subtotal" class="text-slate-800 dark:text-white font-semibold tabular-nums">LKR 0.00</span>
            </div>
            <div id="service-row" class="hidden flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Service Charge (10%)</span>
                <span id="cart-service" class="text-slate-800 dark:text-white font-semibold tabular-nums">LKR 0.00</span>
            </div>
            <div id="discount-row" class="hidden flex justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Discount</span>
                <span id="cart-discount" class="text-red-500 font-semibold tabular-nums">-LKR 0.00</span>
            </div>
            <div class="flex justify-between text-base font-bold pt-2 border-t border-slate-200/80 dark:border-slate-800/60">
                <span class="text-slate-800 dark:text-white">Grand Total</span>
                <span id="cart-total" class="text-indigo-600 dark:text-indigo-400 text-lg tabular-nums">LKR 0.00</span>
            </div>
        </div>

        {{-- Action Buttons --}}
        <div class="px-5 pb-5 pt-3 space-y-2.5 flex-shrink-0">
            <div class="flex gap-2">
                <button type="button" id="split-bill-btn" disabled
                    class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-xs border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/10 cursor-not-allowed opacity-50 transition-all duration-200">
                    <x-icon name="arrow-right-left" size="13" />
                    Split Bill
                </button>
                <button type="button" id="print-invoice-btn" disabled
                    class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-not-allowed opacity-50 transition-all duration-200">
                    <x-icon name="printer" size="13" />
                    Bill PDF
                </button>
            </div>

            <button type="button" id="print-kot" disabled
                class="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-sm border transition-all duration-200 bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-transparent cursor-not-allowed">
                <x-icon name="printer" size="16" />
                <span id="kot-label">Print KOT</span>
            </button>

            <button type="button" id="checkout-btn" disabled
                class="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 bg-slate-100 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 cursor-not-allowed">
                <x-icon name="credit-card" size="16" />
                <span id="checkout-label">Checkout — LKR 0.00</span>
            </button>
        </div>
    </aside>
</div>
@endsection

@section('scripts')
<script>
    window.POS_CATEGORIES = @json($posCategories);
    window.POS_MENU_ITEMS = @json($posMenuItems);
</script>
@vite('resources/js/pages/pos-index.js')
@endsection