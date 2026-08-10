@extends('layouts.pos')

@section('title', 'Reports - '.config('app.name'))

@php
    $salesData = $salesData ?? [];
    $data = $salesData['today'] ?? [];

    $maxRevenue = max(array_column($data, 'revenue') ?: [1]);
    $peak = collect($data)->sortByDesc('revenue')->first();

    $totalRevenue = array_sum(array_column($data, 'revenue'));
    $totalOrders = array_sum(array_column($data, 'orders'));
    $totalCost = (int) round($totalRevenue * 0.38);
    $profit = $totalRevenue - $totalCost;
    $profitMargin = number_format(($profit / $totalRevenue) * 100, 1);
    $avgOrder = (int) round($totalRevenue / $totalOrders);

    $paymentBreakdown = [
        ['method' => 'Card',   'amount' => 85400, 'pct' => 60],
        ['method' => 'Cash',   'amount' => 42700, 'pct' => 30],
        ['method' => 'QR Code', 'amount' => 14200, 'pct' => 10],
    ];
    $topItems = [
        ['name' => 'Chicken Kottu',    'qty' => 48, 'revenue' => 40800, 'pct' => 100],
        ['name' => 'Lamprais',          'qty' => 36, 'revenue' => 34200, 'pct' => 84],
        ['name' => 'Fish Ambul Thiyal', 'qty' => 29, 'revenue' => 31900, 'pct' => 78],
        ['name' => 'Mutton Kottu',      'qty' => 18, 'revenue' => 21600, 'pct' => 53],
        ['name' => 'Hoppers (3 pcs)',   'qty' => 24, 'revenue' => 10800, 'pct' => 26],
    ];
    $periods = ['today', 'week', 'month'];
@endphp

@section('content')
<div class="flex flex-col h-full">
    {{-- Header --}}
    <header class="px-6 py-4 bg-white/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between flex-shrink-0 backdrop-blur-sm transition-colors duration-300">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <x-icon name="bar-chart-3" size="18" class="text-white" />
            </div>
            <div>
                <h1 class="text-lg font-bold text-slate-900 dark:text-white">Reports</h1>
                <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Financial &amp; sales analytics</p>
            </div>
        </div>
        <button type="button" data-export class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/25">
            <x-icon name="down" size="15" />
            Export
        </button>
    </header>

    <div class="flex-1 overflow-y-auto px-6 py-5">
        {{-- Period Selector --}}
        <div class="flex items-center justify-between mb-5">
            <div class="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl p-0.5 shadow-sm">
                @foreach ($periods as $p)
                    <button type="button" data-period="{{ $p }}"
                        @class([
                            'px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200',
                            'bg-indigo-600 text-white shadow-md' => $p === 'today',
                            'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white' => $p !== 'today',
                        ])>{{ ucfirst($p) }}</button>
                @endforeach
            </div>
            <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <x-icon name="calendar" size="14" />
                <span id="reports-range">{{ now()->format('M j') }}</span>
            </div>
        </div>

        {{-- Summary Cards --}}
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            @foreach ([
                ['label' => 'Total Revenue', 'value' => 'LKR '.number_format($totalRevenue), 'icon' => 'dollar-sign', 'color' => 'text-indigo-600 dark:text-indigo-400', 'bg' => 'bg-indigo-500/10', 'change' => '+12.5%', 'up' => true, 'key' => 'revenue'],
                ['label' => 'Total Orders', 'value' => number_format($totalOrders), 'icon' => 'shopping-cart', 'color' => 'text-emerald-600 dark:text-emerald-400', 'bg' => 'bg-emerald-500/10', 'change' => '+8.2%', 'up' => true, 'key' => 'orders'],
                ['label' => 'Profit', 'value' => 'LKR '.number_format($profit), 'icon' => 'arrow-up-right', 'color' => 'text-violet-600 dark:text-violet-400', 'bg' => 'bg-violet-500/10', 'change' => $profitMargin.'% margin', 'up' => true, 'key' => 'profit'],
                ['label' => 'Avg. Order', 'value' => 'LKR '.number_format($avgOrder), 'icon' => 'clock', 'color' => 'text-amber-600 dark:text-amber-400', 'bg' => 'bg-amber-500/10', 'change' => '-2.1%', 'up' => false, 'key' => 'avg'],
            ] as $stat)
                <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 shadow-sm" data-report-card="{{ $stat['key'] }}">
                    <div class="flex items-center justify-between mb-3">
                        <div class="w-9 h-9 {{ $stat['bg'] }} rounded-lg flex items-center justify-center">
                            <x-icon :name="$stat['icon']" size="16" class="{{ $stat['color'] }}" />
                        </div>
                        <span class="flex items-center gap-1 text-xs font-semibold data-report-change {{ $stat['up'] ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400' }}">
                            <x-icon :name="$stat['up'] ? 'arrow-up-right' : 'arrow-up-right'" size="12" />
                            {{ $stat['change'] }}
                        </span>
                    </div>
                    <p class="text-slate-500 dark:text-slate-400 text-xs mb-1">{{ $stat['label'] }}</p>
                    <p class="text-slate-900 dark:text-white font-bold text-lg data-report-value">{{ $stat['value'] }}</p>
                </div>
            @endforeach
        </div>

        {{-- Charts Row --}}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            {{-- Revenue Chart --}}
            <div class="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm">
                <div class="flex items-center justify-between mb-5">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 bg-indigo-500/15 rounded-lg flex items-center justify-center">
                            <x-icon name="bar-chart-3" size="15" class="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h2 class="text-slate-900 dark:text-white font-bold text-sm">Revenue Trend</h2>
                            <p class="text-slate-500 dark:text-slate-400 text-xs">Peak: {{ $peak['label'] }} — LKR {{ number_format($peak['revenue']) }}</p>
                        </div>
                    </div>
                </div>
                <div class="w-full">
                    <div class="flex items-end justify-between gap-1 mb-1">
                        @foreach ($data as $d)
                            <div class="flex-1 flex justify-center">
                                <span class="text-[10px] text-slate-400 dark:text-slate-600 tabular-nums">{{ (int) ($d['revenue'] / 1000) }}k</span>
                            </div>
                        @endforeach
                    </div>
                    <div class="flex items-end justify-between gap-1 h-40" data-report-bars>
                        @foreach ($data as $i => $d)
                            <div class="flex-1 flex flex-col items-center gap-1">
                                <div class="w-full flex justify-center" style="height: 160px">
                                    @if ($d['revenue'] === $peak['revenue'])
                                        <div class="w-full max-w-[44px] rounded-t-md bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-lg shadow-indigo-500/30 fg-bar-anim" style="height: {{ ($d['revenue'] / $maxRevenue) * 100 }}%; animation-delay: {{ $i * 0.05 }}s"></div>
                                    @else
                                        <div class="w-full max-w-[44px] rounded-t-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors duration-500 fg-bar-anim" style="height: {{ ($d['revenue'] / $maxRevenue) * 100 }}%; animation-delay: {{ $i * 0.05 }}s"></div>
                                    @endif
                                </div>
                                <span @class([
                                    'text-xs font-semibold whitespace-nowrap',
                                    'text-indigo-600 dark:text-indigo-400' => $d['revenue'] === $peak['revenue'],
                                    'text-slate-400 dark:text-slate-500' => $d['revenue'] !== $peak['revenue'],
                                ])>{{ $d['label'] }}</span>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>

            {{-- Payment Breakdown --}}
            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm">
                <div class="flex items-center gap-2.5 mb-5">
                    <div class="w-8 h-8 bg-emerald-500/15 rounded-lg flex items-center justify-center">
                        <x-icon name="dollar-sign" size="15" class="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 class="text-slate-900 dark:text-white font-bold text-sm">Payment Methods</h2>
                </div>
                <div class="space-y-4">
                    @foreach ($paymentBreakdown as $pm)
                        <div>
                            <div class="flex items-center justify-between mb-1.5">
                                <span class="text-slate-700 dark:text-slate-300 text-sm font-medium">{{ $pm['method'] }}</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-slate-900 dark:text-white font-semibold text-sm tabular-nums">LKR {{ number_format($pm['amount']) }}</span>
                                    <span class="text-slate-500 dark:text-slate-400 text-xs w-8 text-right">{{ $pm['pct'] }}%</span>
                                </div>
                            </div>
                            <div class="w-full bg-slate-100 dark:bg-slate-700/60 rounded-full h-2">
                                <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-700" style="width: {{ $pm['pct'] }}%"></div>
                            </div>
                        </div>
                    @endforeach
                </div>
                <div class="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700/40">
                    <div class="flex items-center justify-between">
                        <span class="text-slate-500 dark:text-slate-400 text-xs">Total Processed</span>
                        <span class="text-slate-900 dark:text-white font-bold text-sm tabular-nums data-payment-total">LKR {{ number_format($totalRevenue) }}</span>
                    </div>
                </div>
            </div>
        </div>

        {{-- Bottom Row: Cost Analysis + Top Items --}}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm">
                <div class="flex items-center gap-2.5 mb-5">
                    <div class="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center">
                        <x-icon name="percent" size="15" class="text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 class="text-slate-900 dark:text-white font-bold text-sm">Cost vs Revenue</h2>
                </div>
                <div class="space-y-3" data-cost-rows>
                    @foreach ($data as $d)
                        @php $costPct = isset($d['cost']) ? (int) round(($d['cost'] / $d['revenue']) * 100) : 38; @endphp
                        <div class="flex items-center gap-3">
                            <span class="text-slate-500 dark:text-slate-400 text-xs w-12 flex-shrink-0">{{ $d['label'] }}</span>
                            <div class="flex-1 flex gap-1 items-center">
                                <div class="h-3 rounded-l-sm bg-red-500/50 dark:bg-red-500/60" style="width: {{ $costPct }}%"></div>
                                <div class="h-3 rounded-r-sm bg-emerald-500/50 dark:bg-emerald-500/60 flex-1" style="width: {{ 100 - $costPct }}%"></div>
                            </div>
                            <span class="text-slate-500 dark:text-slate-400 text-xs w-16 text-right tabular-nums">{{ $costPct }}%</span>
                        </div>
                    @endforeach
                </div>
                <div class="flex items-center gap-6 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/40">
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-sm bg-red-500/60"></span>
                        <span class="text-slate-500 dark:text-slate-400 text-xs">Cost ({{ (int) round(($totalCost / $totalRevenue) * 100) }}%)</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-sm bg-emerald-500/60"></span>
                        <span class="text-slate-500 dark:text-slate-400 text-xs">Profit ({{ $profitMargin }}%)</span>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm">
                <div class="flex items-center gap-2.5 mb-5">
                    <div class="w-8 h-8 bg-violet-500/15 rounded-lg flex items-center justify-center">
                        <x-icon name="printer" size="15" class="text-violet-600 dark:text-violet-400" />
                    </div>
                    <h2 class="text-slate-900 dark:text-white font-bold text-sm">Top Items by Revenue</h2>
                </div>
                <div class="space-y-3">
                    @foreach ($topItems as $i => $item)
                        <div class="flex items-center gap-3">
                            <span class="text-slate-400 dark:text-slate-600 text-xs font-mono w-4">{{ $i + 1 }}</span>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center justify-between mb-1">
                                    <p class="text-slate-900 dark:text-white text-sm font-medium truncate">{{ $item['name'] }}</p>
                                    <span class="text-indigo-600 dark:text-indigo-400 text-sm font-semibold tabular-nums ml-2">LKR {{ number_format($item['revenue']) }}</span>
                                </div>
                                <div class="w-full bg-slate-100 dark:bg-slate-700/60 rounded-full h-1.5">
                                    <div class="bg-gradient-to-r from-violet-500 to-indigo-400 h-1.5 rounded-full" style="width: {{ $item['pct'] }}%"></div>
                                </div>
                            </div>
                            <span class="text-slate-500 dark:text-slate-400 text-xs w-12 text-right flex-shrink-0">{{ $item['qty'] }} sold</span>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
@vite('resources/js/pages/reports.js')
@endsection