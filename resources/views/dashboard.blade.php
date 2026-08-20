@extends('layouts.pos')

@section('title', 'Dashboard - '.config('app.name'))

@php
    $todayI = $today ?? (now()->dayOfWeek === 0 ? 6 : now()->dayOfWeek - 1);

    $salesMax = collect($weeklySales ?? [])->max('sales');

    $peakMax = max(array_column($peakHours ?? [], 'traffic') ?: [1]);

    $statusClasses = [
        'paid' => 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        'preparing' => 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        'served' => 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        'pending' => 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    ];
    $methodClasses = [
        'Cash' => 'bg-emerald-500/15 text-emerald-400',
        'Card' => 'bg-indigo-500/15 text-indigo-400',
        'QR' => 'bg-violet-500/15 text-violet-400',
    ];

    function donut($value, $color): string
    {
        $circumference = 2 * M_PI * 38;
        $offset = $circumference - ($value / 100) * $circumference;

        return sprintf(
            '<svg class="w-20 h-20 -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="38" stroke="%s" stroke-width="10" fill="none" class="dark:stroke-slate-700 stroke-slate-200"></circle><circle cx="50" cy="50" r="38" stroke="%s" stroke-width="10" fill="none" stroke-dasharray="%f" stroke-dashoffset="%f" stroke-linecap="round" style="filter: drop-shadow(0 0 6px %s)"></circle></svg>',
            'rgb(51,65,85)', $color, $circumference, $offset, $color
        );
    }
@endphp

@section('content')
<div class="flex flex-col h-full relative transition-colors duration-300">
    {{-- Ambient background glow --}}
    <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -top-32 -right-24 w-[480px] h-[480px] bg-indigo-600/10 dark:bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div class="absolute -bottom-24 -left-24 w-[420px] h-[420px] bg-violet-600/10 dark:bg-violet-500/10 rounded-full blur-[120px]"></div>
        <div class="absolute top-1/2 left-1/3 w-72 h-72 bg-fuchsia-600/5 dark:bg-fuchsia-500/5 rounded-full blur-[100px]"></div>
    </div>

    {{-- Header --}}
    <header class="relative z-10 px-6 py-3.5 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-2xl flex items-center justify-between flex-shrink-0 transition-colors duration-300">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
                <x-icon name="bar-chart" size="18" class="text-white" />
            </div>
            <div class="min-w-0">
                <h1 class="text-base font-semibold leading-tight text-slate-900 dark:text-white">Dashboard</h1>
                <p id="dashboard-clock" class="text-xs leading-tight text-slate-400 dark:text-slate-500">{{ now()->format('D, M j, Y') }} · {{ now()->format('g:i A') }}</p>
            </div>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
            <div id="period-selector" class="flex rounded-xl p-0.5 border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800/80 transition-colors duration-300">
                @foreach (['today', 'week', 'month'] as $p)
                    <button type="button" data-period="{{ $p }}"
                        @class([
                            'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
                            'bg-indigo-600 text-white shadow-md' => $p === 'today',
                            'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white' => $p !== 'today',
                        ])>{{ ucfirst($p) }}</button>
                @endforeach
            </div>

            <span class="hidden sm:flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
                <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full fg-pulse-soft"></span>
                Open
            </span>
        </div>
    </header>

    {{-- Scrollable content --}}
    <div class="flex-1 overflow-y-auto relative px-6 py-6 transition-colors duration-300">
        {{-- Metric cards --}}
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6" id="metric-cards" data-stats="today">
            @foreach ([
                ['label' => "Today's Sales", 'value' => 'LKR '.number_format($periodStats['today']['sales']), 'change' => $periodStats['today']['change'], 'up' => true, 'icon' => 'dollar-sign', 'color' => 'from-indigo-500 to-violet-500', 'glow' => 'bg-indigo-500', 'sub' => 'vs yesterday', 'cls' => 'fg-kpi-1'],
                ['label' => 'Total Orders', 'value' => $periodStats['today']['orders'], 'change' => '+8.2%', 'up' => true, 'icon' => 'shopping-cart', 'color' => 'from-emerald-500 to-teal-500', 'glow' => 'bg-emerald-500', 'sub' => number_format($periodStats['today']['guests']).' guests served', 'cls' => 'fg-kpi-2'],
                ['label' => 'Open Tables', 'value' => $openTablesStr, 'change' => $tablePercent.'% occ.', 'up' => true, 'icon' => 'utensils', 'color' => 'from-amber-500 to-orange-500', 'glow' => 'bg-amber-500', 'sub' => $tableSub, 'cls' => 'fg-kpi-3'],
                ['label' => 'Low Stock Alerts', 'value' => count($stockAlerts), 'change' => 'Needs reorder', 'up' => false, 'icon' => 'alert-triangle', 'color' => 'from-red-500 to-rose-500', 'glow' => 'bg-red-500', 'sub' => count(array_filter($stockAlerts, fn($a) => $a['urgency'] === 'high')) . ' critical', 'cls' => 'fg-kpi-4'],
            ] as $stat)
                <div class="{{ $stat['cls'] }} relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 dark:bg-slate-900/80 dark:backdrop-blur-2xl dark:border-slate-800/80 dark:hover:border-indigo-500/40 dark:shadow-xl dark:shadow-black/40 dark:hover:shadow-2xl dark:hover:shadow-indigo-500/10">
                    <div class="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent dark:via-indigo-500/40"></div>
                    <div class="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20 {{ $stat['glow'] }}"></div>

                    <div class="flex items-center justify-between mb-3 relative">
                        <div class="w-11 h-11 rounded-xl bg-gradient-to-br {{ $stat['color'] }} flex items-center justify-center shadow-lg shadow-black/20 transition-transform duration-300 hover:scale-110 flex-shrink-0">
                            <x-icon :name="$stat['icon']" size="18" class="text-white" />
                        </div>
                        <span data-metric-change="sales" @class([
                            'flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0',
                            'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:shadow-[0_0_14px_-4px] dark:shadow-emerald-500/40' => $stat['up'],
                            'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-500/10 dark:border-red-500/20 dark:shadow-[0_0_14px_-4px] dark:shadow-red-500/40' => ! $stat['up'],
                        ])>
                            <x-icon :name="$stat['up'] ? 'arrow-up-right' : 'trending-down'" size="12" />
                            {{ $stat['change'] }}
                        </span>
                    </div>
                    <p class="text-xs mb-1 truncate relative text-slate-500 dark:text-slate-400">{{ $stat['label'] }}</p>
                    <p class="font-bold text-2xl leading-tight truncate relative text-slate-900 dark:text-white metric-value" @if ($loop->first) data-metric="sales" @endif @if ($loop->index === 1) data-metric="orders" @endif>{{ $stat['value'] }}</p>
                    <p class="text-xs mt-1 truncate relative text-slate-400 dark:text-slate-500 metric-sub" @if ($loop->first) data-metric-sub="sales" @endif @if ($loop->index === 1) data-metric-sub="orders" @endif>{{ $stat['sub'] }}</p>
                </div>
            @endforeach
        </div>

        {{-- Charts row 1: Weekly Sales + Peak Hours --}}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            {{-- Weekly Sales --}}
            <div class="fg-chart rounded-2xl p-6 bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 dark:bg-slate-900/80 dark:backdrop-blur-2xl dark:border-slate-800/80 dark:hover:border-indigo-500/40 dark:shadow-xl dark:shadow-black/40 transition-all duration-300">
                <div class="flex items-center justify-between mb-5">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <div class="w-8 h-8 bg-indigo-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                            <x-icon name="bar-chart" size="15" class="text-indigo-400" />
                        </div>
                        <div class="min-w-0">
                            <h2 class="font-semibold text-sm leading-tight text-slate-900 dark:text-white">Weekly Sales</h2>
                            <p class="text-xs leading-tight truncate text-slate-400 dark:text-slate-500">LKR {{ number_format($salesMax / 1000) }}k peak (Sat)</p>
                        </div>
                    </div>
                    <span class="flex items-center gap-1 text-emerald-400 text-sm font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex-shrink-0 shadow-[0_0_12px_-4px] shadow-emerald-500/40">
                        <x-icon name="arrow-up-right" size="14" /> +18.3%
                    </span>
                </div>
                <div class="w-full">
                    <div class="flex items-end justify-between gap-1 mb-2">
                        @foreach ($weeklySales as $i => $day)
                            <div class="flex-1 flex justify-center">
                                <span class="text-[10px] font-medium tabular-nums {{ $i === $todayI ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-500' }}">{{ round($day['sales'] / 1000) }}k</span>
                            </div>
                        @endforeach
                    </div>
                    <div class="flex items-end justify-between gap-1 h-40">
                        @foreach ($weeklySales as $i => $day)
                            <div class="flex-1 flex flex-col items-center gap-1.5">
                                <div class="w-full flex justify-center" style="height: 160px">
                                    @if ($i === $todayI)
                                        <div class="w-full max-w-[36px] rounded-t-md bg-gradient-to-t from-indigo-600 via-violet-600 to-violet-400 shadow-lg shadow-indigo-500/40 fg-bar-anim" style="height: {{ ($day['sales'] / $salesMax) * 100 }}%; animation-delay: {{ $i * 0.06 }}s"></div>
                                    @else
                                        <div class="w-full max-w-[36px] rounded-t-md bg-slate-200 hover:bg-indigo-400 dark:bg-slate-700/60 dark:hover:bg-indigo-600/60 transition-all duration-500 ease-out fg-bar-anim" style="height: {{ ($day['sales'] / $salesMax) * 100 }}%; animation-delay: {{ $i * 0.06 }}s"></div>
                                    @endif
                                </div>
                                <span class="text-xs font-semibold whitespace-nowrap {{ $i === $todayI ? 'text-indigo-500' : 'text-slate-400 dark:text-slate-500' }}">{{ $day['day'] }}</span>
                            </div>
                        @endforeach
                    </div>
                </div>

                <div class="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60">
                    <div class="flex items-center gap-3">
                        <div class="flex items-center gap-1.5">
                            <span class="w-2.5 h-2.5 rounded-sm bg-indigo-500 shadow-[0_0_8px_-1px] shadow-indigo-500"></span>
                            <span class="text-slate-400 dark:text-slate-500">This Week</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <span class="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-700"></span>
                            <span class="text-slate-400 dark:text-slate-500">Prev</span>
                        </div>
                    </div>
                    <span class="text-slate-900 dark:text-white text-sm font-bold tabular-nums metric-total" data-total="sales">LKR {{ number_format($periodStats['today']['sales']) }}</span>
                </div>
            </div>

            {{-- Peak Hours --}}
            <div class="fg-chart rounded-2xl p-6 bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 dark:bg-slate-900/80 dark:backdrop-blur-2xl dark:border-slate-800/80 dark:hover:border-indigo-500/40 dark:shadow-xl dark:shadow-black/40 transition-all duration-300">
                <div class="flex items-center justify-between mb-5">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <div class="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                            <x-icon name="zap" size="15" class="text-amber-400" />
                        </div>
                        <div class="min-w-0">
                            <h2 class="font-semibold text-sm leading-tight text-slate-900 dark:text-white">Peak Hours</h2>
                            <p class="text-xs leading-tight truncate text-slate-400 dark:text-slate-500">1–2 PM & 7–8 PM busiest</p>
                        </div>
                    </div>
                    <span class="flex items-center gap-1 text-amber-400 text-sm font-semibold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex-shrink-0 shadow-[0_0_12px_-4px] shadow-amber-500/30">
                        <x-icon name="zap" size="12" /> 100% cap.
                    </span>
                </div>

                <div class="w-full">
                    <div class="flex items-end justify-between gap-0.5 mb-1.5">
                        @foreach ($peakHours as $h)
                            <div class="flex-1 flex justify-center"><span class="text-[9px] tabular-nums text-slate-400 dark:text-slate-600">{{ $h['traffic'] }}</span></div>
                        @endforeach
                    </div>
                    <div class="flex items-end justify-between gap-0.5 h-36">
                        @foreach ($peakHours as $i => $hour)
                            <div class="flex-1 flex flex-col items-center gap-1.5">
                                <div class="w-full flex justify-center" style="height: 140px">
                                    @if ($hour['traffic'] >= 80)
                                        <div class="w-full max-w-[28px] rounded-t-sm bg-gradient-to-t from-amber-600 via-amber-500 to-amber-300 shadow-lg shadow-amber-500/30 fg-bar-anim" style="height: {{ ($hour['traffic'] / $peakMax) * 100 }}%; animation-delay: {{ ($i + 7) * 0.05 }}s"></div>
                                    @else
                                        <div class="w-full max-w-[28px] rounded-t-sm bg-slate-200 hover:bg-amber-400 dark:bg-slate-700/60 dark:hover:bg-amber-500/60 transition-all duration-300 fg-bar-anim" style="height: {{ ($hour['traffic'] / $peakMax) * 100 }}%; animation-delay: {{ ($i + 7) * 0.05 }}s"></div>
                                    @endif
                                </div>
                                <span class="text-[9px] whitespace-nowrap text-slate-400 dark:text-slate-600">{{ $hour['hour'] }}</span>
                            </div>
                        @endforeach
                    </div>
                </div>

                <div class="flex items-center gap-4 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60">
                    @foreach ([['label' => 'Lunch Peak', 'time' => '12–2 PM', 'pct' => '85'], ['label' => 'Dinner Peak', 'time' => '7–9 PM', 'pct' => '95']] as $peak)
                        <div class="flex items-center gap-2 flex-1 min-w-0">
                            <span class="text-slate-400 dark:text-slate-500 text-xs flex-shrink-0">{{ $peak['time'] }}</span>
                            <div class="flex-1 min-w-0 bg-slate-100 dark:bg-slate-800/80 rounded-full h-1.5">
                                <div class="bg-gradient-to-r from-amber-500 to-orange-400 h-1.5 rounded-full transition-all duration-700 shadow-[0_0_8px_-2px] shadow-amber-500" style="width: {{ $peak['pct'] }}%"></div>
                            </div>
                            <span class="text-amber-400 text-xs font-semibold flex-shrink-0">{{ $peak['pct'] }}%</span>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>

        {{-- Charts row 2: Revenue Breakdown + Top Products --}}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            <div class="fg-chart rounded-2xl p-6 bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 dark:bg-slate-900/80 dark:backdrop-blur-2xl dark:border-slate-800/80 dark:hover:border-indigo-500/40 dark:shadow-xl dark:shadow-black/40 transition-all duration-300">
                <div class="flex items-center gap-2.5 mb-5">
                    <div class="w-8 h-8 bg-violet-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                        <x-icon name="percent" size="15" class="text-violet-400" />
                    </div>
                    <h2 class="font-semibold text-sm text-slate-900 dark:text-white">Revenue Breakdown</h2>
                </div>
                <div class="flex flex-wrap justify-center gap-3 mb-5">
                    @foreach ($donuts as $card)
                        <div class="flex flex-col items-center gap-1.5">
                            <div class="relative w-20 h-20 flex-shrink-0">
                                {!! donut($card['value'], $card['color']) !!}
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <span class="text-slate-900 dark:text-white font-bold text-xs">{{ $card['value'] }}%</span>
                                </div>
                            </div>
                            <p class="text-slate-900 dark:text-white text-xs font-semibold text-center leading-tight">{{ $card['label'] }}</p>
                            <p class="text-slate-400 dark:text-slate-500 text-[10px] text-center leading-tight">{{ $card['sub'] }}</p>
                        </div>
                    @endforeach
                </div>
                <div class="pt-3 border-t border-slate-200 dark:border-slate-800/60 grid grid-cols-2 gap-3">
                    <div>
                        <p class="text-slate-400 dark:text-slate-500">Total Revenue</p>
                        <p class="text-slate-900 dark:text-white font-bold text-sm tabular-nums metric-total" data-total="sales">LKR {{ number_format($periodStats['today']['sales']) }}</p>
                    </div>
                    <div>
<p class="text-slate-400 dark:text-slate-500">Avg. Order</p>
                    <p class="text-slate-900 dark:text-white font-bold text-sm tabular-nums metric-total" data-total="avg">LKR {{ number_format($periodStats['today']['avgOrder']) }}</p>
                    </div>
                </div>
            </div>

            <div class="fg-chart lg:col-span-2 rounded-2xl p-6 bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 dark:bg-slate-900/80 dark:backdrop-blur-2xl dark:border-slate-800/80 dark:hover:border-indigo-500/40 dark:shadow-xl dark:shadow-black/40 transition-all duration-300">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                            <x-icon name="flame" size="15" class="text-amber-400" />
                        </div>
                        <h2 class="font-semibold text-sm text-slate-900 dark:text-white">Top Selling Products</h2>
                    </div>
                    <span class="text-slate-400 dark:text-slate-500">Today</span>
                </div>
                <div class="space-y-3">
                    @foreach ($topProducts as $i => $product)
                        <div class="fg-row fg-row-{{ $i + 1 }} flex items-center gap-3 group">
                            <span @class([
                                'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                                'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30' => $product['rank'] === 1,
                                'bg-slate-200 text-slate-600 border border-slate-300 dark:bg-slate-400/20 dark:text-slate-300 dark:border-slate-400/30' => $product['rank'] === 2,
                                'bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30' => $product['rank'] === 3,
                                'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800/80 dark:text-slate-500 dark:border-slate-700/60' => $product['rank'] > 3,
                            ])>
                                {{ $product['rank'] }}
                            </span>
                            <div class="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800/80 dark:border-slate-700/60 flex items-center justify-center text-xl flex-shrink-0 group-hover:border-indigo-500/30 transition-colors duration-200">
                                {{ $product['emoji'] }}
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center justify-between mb-1.5">
                                    <p class="text-slate-900 dark:text-white text-sm font-medium truncate">{{ $product['name'] }}</p>
                                    <div class="flex items-center gap-2 flex-shrink-0 ml-3">
                                        <span class="text-indigo-400 text-sm font-semibold tabular-nums whitespace-nowrap shadow-[0_0_10px_-2px] shadow-indigo-500/40">LKR {{ number_format($product['revenue']) }}</span>
                                        @if (str_starts_with($product['trend'], '+'))
                                            <span class="text-xs font-medium whitespace-nowrap px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-500/10">{{ $product['trend'] }}</span>
                                        @else
                                            <span class="text-xs font-medium whitespace-nowrap px-1.5 py-0.5 rounded text-red-400 bg-red-500/10">{{ $product['trend'] }}</span>
                                        @endif
                                    </div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div class="flex-1 min-w-0 bg-slate-100 dark:bg-slate-800/80 rounded-full h-1.5">
                                        <div class="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full transition-all duration-700 shadow-[0_0_8px_-1px] shadow-indigo-500" style="width: {{ $product['pct'] }}%"></div>
                                    </div>
                                    <span class="text-slate-400 dark:text-slate-500">{{ $product['qty'] }} sold</span>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>

        {{-- Bottom Row: Recent Orders + Kitchen + Staff + Alerts --}}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div class="fg-chart lg:col-span-2 rounded-2xl p-6 pt-0 bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 dark:bg-slate-900/80 dark:backdrop-blur-2xl dark:border-slate-800/80 dark:hover:border-indigo-500/40 dark:shadow-xl dark:shadow-black/40 transition-all duration-300 overflow-hidden">
                <div class="-mx-6 px-6 py-3.5 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between !p-0">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 bg-blue-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                            <x-icon name="clock" size="15" class="text-blue-400" />
                        </div>
                        <h2 class="font-semibold text-sm text-slate-900 dark:text-white">Recent Orders</h2>
                    </div>
                    <span class="text-slate-400 dark:text-slate-500">Last 30 min</span>
                </div>
                <div class="-mx-6 -mb-6 overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-slate-200 dark:border-slate-800/60 text-left">
                                @foreach (['Order ID', 'Table', 'Items', 'Total', 'Method', 'Status', 'Time'] as $h)
                                    <th class="px-6 py-2.5 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">{{ $h }}</th>
                                @endforeach
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/40">
                            @foreach ($recentOrders as $i => $order)
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors fg-row fg-row-{{ $i + 1 }}">
                                    <td class="px-6 py-3 text-slate-500 dark:text-slate-400 text-xs font-mono whitespace-nowrap">{{ $order['id'] }}</td>
                                    <td class="px-6 py-3 whitespace-nowrap">
                                        <span class="inline-flex items-center gap-1 bg-indigo-500/15 text-indigo-400 text-xs font-semibold px-2 py-0.5 rounded-full shadow-[0_0_10px_-3px] shadow-indigo-500/50">
                                            <x-icon name="utensils" size="10" />
                                            {{ $order['table'] }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ $order['items'] }}</td>
                                    <td class="px-6 py-3 text-slate-900 dark:text-white font-semibold tabular-nums whitespace-nowrap">LKR {{ number_format($order['total']) }}</td>
                                    <td class="px-6 py-3 whitespace-nowrap"><span class="text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap {{ $methodClasses[$order['method']] ?? 'bg-slate-700 text-slate-400' }}">{{ $order['method'] }}</span></td>
                                    <td class="px-6 py-3 whitespace-nowrap"><span class="text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap bg-clip-padding {{ $statusClasses[$order['status']] ?? $statusClasses['paid'] }}">{{ ucfirst($order['status']) }}</span></td>
                                    <td class="px-6 py-3 text-slate-400 dark:text-slate-500 text-xs whitespace-nowrap">{{ $order['time'] }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="space-y-5">
                {{-- Kitchen Load --}}
                <div class="fg-chart rounded-2xl p-6 bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 dark:bg-slate-900/80 dark:backdrop-blur-2xl dark:border-slate-800/80 dark:hover:border-indigo-500/40 dark:shadow-xl dark:shadow-black/40 transition-all duration-300">
                    <div class="flex items-center gap-2.5 mb-4">
                        <div class="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                            <x-icon name="chef-hat" size="15" class="text-amber-400" />
                        </div>
                        <h2 class="font-semibold text-sm text-slate-900 dark:text-white">Kitchen Load</h2>
                    </div>
                    <div class="space-y-3">
                        @foreach ($kitchenLoad as $item)
                            <div>
                                <div class="flex justify-between text-xs mb-1">
                                    <span class="text-slate-400 dark:text-slate-500">{{ $item['label'] }}</span>
                                    <span class="text-slate-900 dark:text-white">{{ $item['value'] }}/{{ $item['max'] }}</span>
                                </div>
                                <div class="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-2">
                                    <div class="{{ $item['color'] }} h-2 rounded-full transition-all duration-700" style="width: {{ ($item['value'] / $item['max']) * 100 }}%"></div>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/60">
                        <div class="flex items-center justify-between mb-1.5">
                            <span class="text-slate-400 dark:text-slate-500">Customer Rating</span>
                            <span class="text-slate-900 dark:text-white font-bold flex items-center gap-1 text-sm">
                                <x-icon name="star" size="13" class="text-amber-400" fill="currentColor" />
                                4.8
                            </span>
                        </div>
                        <div class="flex gap-0.5">
                            @for ($s = 1; $s <= 5; $s++)
                                <x-icon name="star" size="13" :fill="$s <= 4 ? 'currentColor' : 'none'" :class="$s <= 4 ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'" />
                            @endfor
                        </div>
                        <p class="text-slate-400 dark:text-slate-500">142 reviews</p>
                    </div>
                </div>

                {{-- Staff on Duty --}}
                <div class="fg-chart rounded-2xl p-6 bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 dark:bg-slate-900/80 dark:backdrop-blur-2xl dark:border-slate-800/80 dark:hover:border-indigo-500/40 dark:shadow-xl dark:shadow-black/40 transition-all duration-300">
                    <div class="flex items-center gap-2.5 mb-4">
                        <div class="w-8 h-8 bg-emerald-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                            <x-icon name="users" size="15" class="text-emerald-400" />
                        </div>
                        <h2 class="font-semibold text-sm text-slate-900 dark:text-white">Staff on Duty</h2>
                        <span class="ml-auto text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex-shrink-0">{{ count($staffOnDuty) }} active</span>
                    </div>
                    <div class="space-y-3">
                        @foreach ($staffOnDuty as $member)
                            <div class="flex items-center gap-3 group">
                                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold flex-shrink-0 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-shadow duration-300">
                                    {{ $member['avatar'] }}
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-slate-900 dark:text-white text-sm font-medium">{{ $member['name'] }}</p>
                                    <p class="text-slate-400 dark:text-slate-500">{{ $member['role'] }}</p>
                                </div>
                                <span class="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0 ring-2 ring-emerald-400/40 dark:ring-emerald-400/30 fg-pulse-soft"></span>
                            </div>
                        @endforeach
                    </div>
                </div>

                {{-- Stock Alerts --}}
                <div class="fg-chart rounded-2xl p-6 bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 dark:bg-slate-900/80 dark:backdrop-blur-2xl dark:border-slate-800/80 dark:hover:border-indigo-500/40 dark:shadow-xl dark:shadow-black/40 transition-all duration-300">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 bg-red-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                <x-icon name="package" size="15" class="text-red-400" />
                            </div>
                            <h2 class="font-semibold text-sm text-slate-900 dark:text-white">Stock Alerts</h2>
                        </div>
                        <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 flex-shrink-0">{{ count($stockAlerts) }} items</span>
                    </div>
                    <div class="space-y-3">
                        @foreach ($stockAlerts as $alert)
                            <div class="flex items-center gap-3 group">
                                <span class="w-2 h-2 rounded-full flex-shrink-0 {{ $alert['urgency'] === 'high' ? 'bg-red-500 fg-pulse-soft' : 'bg-amber-500' }}"></span>
                                <div class="flex-1 min-w-0">
                                    <p class="text-slate-900 dark:text-white text-sm font-medium truncate">{{ $alert['item'] }}</p>
                                    <div class="flex items-center gap-2 mt-1.5">
                                        <div class="flex-1 min-w-0 bg-slate-100 dark:bg-slate-800/80 rounded-full h-1.5">
                                            <div class="h-1.5 rounded-full transition-all duration-700 {{ $alert['urgency'] === 'high' ? 'bg-red-500' : 'bg-amber-500' }}" style="width: {{ min(100, ($alert['stock'] / $alert['min']) * 100) }}%"></div>
                                        </div>
                                        <span class="text-slate-400 dark:text-slate-500">{{ $alert['stock'] }}/{{ $alert['min'] }}</span>
                                    </div>
                                </div>
                                <span class="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 {{ $alert['urgency'] === 'high' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30' }}">
                                    {{ $alert['urgency'] === 'high' ? 'URGENT' : 'LOW' }}
                                </span>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
@vite('resources/js/pages/dashboard.js')
@endsection