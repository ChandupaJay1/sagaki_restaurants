@extends('layouts.pos')

@section('title', 'Table Management - '.config('app.name', 'Sagaki Restaurant POS'))

@php
    $tables = $tables ?? [];
    $tablesById = $tablesById ?? collect($tables)->keyBy('id');

    $statusConfig = [
        'available' => [
            'label' => 'Available', 'dot' => 'bg-emerald-400',
            'bg' => 'bg-emerald-500/15', 'border' => 'border-emerald-500/40',
            'text' => 'text-emerald-600 dark:text-emerald-400',
            'hover' => 'hover:border-emerald-500/60 hover:bg-emerald-500/20',
            'icon' => 'circle-check', 'tileBg' => 'bg-emerald-500/20', 'tileText' => 'text-emerald-600 dark:text-emerald-400',
            'hex' => 'emerald',
        ],
        'occupied' => [
            'label' => 'Occupied', 'dot' => 'bg-red-400',
            'bg' => 'bg-red-500/15', 'border' => 'border-red-500/40',
            'text' => 'text-red-600 dark:text-red-400',
            'hover' => 'hover:border-red-500/60 hover:bg-red-500/20',
            'icon' => 'users', 'tileBg' => 'bg-red-500/20', 'tileText' => 'text-red-600 dark:text-red-400',
            'hex' => 'red',
        ],
        'reserved' => [
            'label' => 'Reserved', 'dot' => 'bg-amber-400',
            'bg' => 'bg-amber-500/15', 'border' => 'border-amber-500/40',
            'text' => 'text-amber-600 dark:text-amber-400',
            'hover' => 'hover:border-amber-500/60 hover:bg-amber-500/20',
            'icon' => 'clock', 'tileBg' => 'bg-amber-500/20', 'tileText' => 'text-amber-600 dark:text-amber-400',
            'hex' => 'amber',
        ],
    ];

    $layout = [
        [14, 1, 2, 10, 15],
        [4,  3, 7, 5, 9],
        [11, 12, 13, 6, 16],
    ];

    $stats = [
        'available' => collect($tables)->where('status', 'available')->count(),
        'occupied'  => collect($tables)->where('status', 'occupied')->count(),
        'reserved'  => collect($tables)->where('status', 'reserved')->count(),
    ];

    $typeLegend = [
        ['label' => '2-Top',   'color' => 'bg-slate-400 dark:bg-slate-600'],
        ['label' => '4-Top',   'color' => 'bg-slate-500'],
        ['label' => '6-Top',   'color' => 'bg-slate-600 dark:bg-slate-400'],
        ['label' => '8-Top',   'color' => 'bg-slate-700 dark:bg-slate-300'],
        ['label' => 'Bar',     'color' => 'bg-violet-600'],
        ['label' => 'Patio',   'color' => 'bg-emerald-600'],
        ['label' => 'Private', 'color' => 'bg-amber-600'],
    ];
@endphp

@section('content')
<div class="flex flex-col h-full">
    {{-- Header --}}
    <header class="px-6 py-4 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between flex-shrink-0 backdrop-blur-2xl transition-colors duration-300">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <x-icon name="table-2" size="18" class="text-white" />
            </div>
            <div>
                <h1 class="text-lg font-bold text-slate-900 dark:text-white">Table Management</h1>
                <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Floor plan &amp; reservations</p>
            </div>
        </div>

        <div class="flex items-center gap-4">
            @foreach ([
                ['label' => 'Available', 'count' => $stats['available'], 'color' => 'text-emerald-600 dark:text-emerald-400', 'bg' => 'bg-emerald-500/10', 'border' => 'border-emerald-500/30'],
                ['label' => 'Occupied',  'count' => $stats['occupied'],  'color' => 'text-red-600 dark:text-red-400',       'bg' => 'bg-red-500/10',        'border' => 'border-red-500/30'],
                ['label' => 'Reserved',  'count' => $stats['reserved'],  'color' => 'text-amber-600 dark:text-amber-400',   'bg' => 'bg-amber-500/10',      'border' => 'border-amber-500/30'],
            ] as $stat)
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl border {{ $stat['bg'] }} {{ $stat['border'] }}">
                    <span class="text-xs font-semibold {{ $stat['color'] }}">{{ $stat['label'] }}</span>
                    <span class="text-sm font-bold {{ $stat['color'] }}">{{ $stat['count'] }}</span>
                </div>
            @endforeach
            <button type="button" id="refresh-floor" title="Refresh" class="text-slate-500 hover:text-slate-900 dark:hover:text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <x-icon name="refresh" size="16" />
            </button>
        </div>
    </header>

    {{-- Floor plan --}}
    <div class="flex-1 overflow-y-auto px-6 py-6">
        {{-- Legend --}}
        <div class="flex items-center gap-6 mb-6">
            @foreach ($statusConfig as $config)
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full {{ $config['dot'] }}"></span>
                    <span class="text-slate-500 dark:text-slate-400 text-xs">{{ $config['label'] }}</span>
                </div>
            @endforeach
        </div>

        {{-- Floor layout --}}
        <div class="bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/40 rounded-2xl p-6 shadow-sm">
            {{-- Kitchen label --}}
            <div class="mb-4 px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-center">
                <span class="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">
                    <x-icon name="chef-hat" size="12" class="inline mr-1 -mt-0.5" />
                    Kitchen
                </span>
            </div>

            <div class="space-y-3">
                @foreach ($layout as $row)
                    <div class="flex gap-3 justify-center">
                        @foreach ($row as $tableId)
                            @php $table = $tablesById->get($tableId); @endphp
                            @if (!$table)
                                <div class="w-36"></div>
                            @else
                                @php $config = $statusConfig[$table['status']]; @endphp
                                <div class="w-36 flex">
    <button type="button" data-table-card
        data-id="{{ $table['id'] }}"
        data-name="{{ $table['name'] }}"
        data-type="{{ $table['type'] }}"
        data-seats="{{ $table['seats'] }}"
        data-status="{{ $table['status'] }}"
        data-customer="{{ $table['customer'] ?? '' }}"
        data-bill="{{ $table['bill'] }}"
        data-startedat="{{ $table['startedAt'] ?? '' }}"
        class="relative group bg-white dark:bg-slate-900/80 {{ $config['bg'] }} {{ $config['border'] }} border-2 rounded-2xl p-4 text-left transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 flex flex-col justify-between w-full h-[195px] overflow-hidden {{ $config['hover'] }}">
        
        <div class="relative z-10">
            {{-- Status pill --}}
            <div class="absolute -top-1 -right-1">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold {{ $config['bg'] }} {{ $config['text'] }} border {{ $config['border'] }}">
                    <x-icon :name="$config['icon']" size="11" />
                    {{ $config['label'] }}
                </span>
            </div>

            {{-- Table icon --}}
            <div class="flex items-start justify-between pt-1">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center {{ $config['tileBg'] }}">
                    <x-icon name="table-2" size="20" class="{{ $config['tileText'] }}" />
                </div>
            </div>

            {{-- Table info --}}
            <div class="mt-2">
                <p class="text-slate-900 dark:text-white font-bold text-lg leading-none">{{ $table['name'] }}</p>
                <p class="text-slate-500 dark:text-slate-400 text-xs mt-1">{{ $table['seats'] }} seats · {{ str_replace('-', ' ', $table['type']) }}</p>
            </div>
        </div>

        {{-- Mid Section (Occupied / Reserved Info) --}}
        <div class="relative z-10 mt-auto">
            @if ($table['status'] === 'occupied')
                <div class="pt-2 border-t border-slate-200 dark:border-white/10 mt-2 w-full">
                    <p class="text-slate-900 dark:text-white text-sm font-medium">{{ $table['customer'] }}</p>
                    <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Started {{ $table['startedAt'] }}</p>
                    <p class="text-indigo-600 dark:text-indigo-400 font-bold text-sm mt-1">LKR {{ number_format($table['bill']) }}</p>
                </div>
            @endif

            @if ($table['status'] === 'reserved')
                <div class="pt-2 border-t border-slate-200 dark:border-white/10 mt-2 w-full">
                    <p class="text-amber-600 dark:text-amber-400 text-sm font-medium">{{ $table['customer'] }}</p>
                    <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Reserved for {{ $table['startedAt'] }}</p>
                </div>
            @endif
        </div>

        {{-- Hover actions --}}
        <div class="absolute bottom-0 left-0 w-full h-[50%] z-20 rounded-b-2xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            @if ($table['status'] === 'available')
                <span class="text-emerald-600/80 dark:text-emerald-400/80 text-sm font-semibold flex items-center gap-1"><x-icon name="plus" size="14" /> Take Order</span>
            @elseif ($table['status'] === 'occupied')
                <span class="text-indigo-600/80 dark:text-indigo-400/80 text-sm font-semibold flex items-center gap-1"><x-icon name="utensils" size="14" /> View Order</span>
            @else
                <span class="text-amber-600/80 dark:text-amber-400/80 text-sm font-semibold flex items-center gap-1"><x-icon name="circle-check" size="14" /> Seat Guest</span>
            @endif
        </div>
    </button>
</div>
                            @endif
                        @endforeach
                    </div>
                @endforeach
            </div>

            {{-- Entrance --}}
            <div class="mt-4 px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700/60 rounded-xl text-center">
                <span class="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Entrance</span>
            </div>
        </div>

        {{-- Legend for table types --}}
        <div class="mt-6 flex flex-wrap gap-4 justify-center">
            @foreach ($typeLegend as $type)
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded {{ $type['color'] }}"></span>
                    <span class="text-slate-500 dark:text-slate-400 text-xs">{{ $type['label'] }}</span>
                </div>
            @endforeach
        </div>
    </div>
</div>

{{-- Action Modal --}}
<div id="action-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" data-close-modal></div>

    <div class="relative w-full max-w-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
        {{-- Header --}}
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between bg-white dark:bg-slate-800">
            <div class="flex items-center gap-3">
                <div id="modal-tile" class="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                    <x-icon name="table-2" size="20" class="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                    <h2 class="text-slate-900 dark:text-white font-bold text-base" id="modal-title">T1 — 2 top</h2>
                    <p class="text-slate-500 dark:text-slate-400 text-xs" id="modal-sub">2 seats</p>
                </div>
            </div>
            <button type="button" data-close-modal class="text-slate-400 hover:text-slate-900 dark:hover:text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <x-icon name="x" size="18" />
            </button>
        </div>

        {{-- Tabs --}}
        <div class="flex border-b border-slate-200 dark:border-slate-700/60 px-6">
            @foreach ([['id' => 'details', 'label' => 'Details'], ['id' => 'transfer', 'label' => 'Transfer'], ['id' => 'merge', 'label' => 'Merge']] as $tab)
                <button type="button" data-modal-tab="{{ $tab['id'] }}"
                    class="modal-tab px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 {{ $loop->first ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white' }}">
                    {{ $tab['label'] }}
                </button>
            @endforeach
        </div>

        {{-- Content --}}
        <div class="px-6 py-5 min-h-64">
            {{-- Details tab --}}
            <div class="space-y-4" data-modal-panel="details">
                <div class="grid grid-cols-2 gap-4" id="modal-details-grid"></div>

                <div class="flex gap-2 pt-2" id="modal-actions"></div>
            </div>

            {{-- Transfer tab --}}
            <div class="space-y-4 hidden" data-modal-panel="transfer">
                <p class="text-slate-500 dark:text-slate-400 text-sm">Transfer <span class="text-slate-900 dark:text-white font-semibold" id="transfer-name">Table</span> to another table:</p>
                <div class="space-y-2 max-h-60 overflow-y-auto" id="transfer-list"></div>
            </div>

            {{-- Merge tab --}}
            <div class="space-y-4 hidden" data-modal-panel="merge">
                <p class="text-slate-500 dark:text-slate-400 text-sm">Merge <span class="text-slate-900 dark:text-white font-semibold" id="merge-name">Table</span> with another table:</p>
                <div class="space-y-2 max-h-60 overflow-y-auto" id="merge-list"></div>
            </div>
        </div>

        {{-- Footer --}}
        <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-end gap-2 bg-white dark:bg-slate-800">
            <button type="button" data-close-modal class="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium rounded-xl transition-colors">Close</button>
        </div>
    </div>
</div>

{{-- Toast --}}
<div id="toast" class="hidden fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
    <x-icon name="circle-check" size="16" />
    <span id="toast-msg"></span>
</div>

<script>
    window.TABLES_DATA = @json($tables);
</script>
@endsection

@section('scripts')
@vite('resources/js/pages/tables.js')
@endsection