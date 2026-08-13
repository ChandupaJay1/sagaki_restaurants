@extends('layouts.pos')

@section('title', 'Menu Manager - '.config('app.name'))

@section('content')
<div class="flex flex-col h-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
    {{-- Header --}}
    <header class="px-6 py-4 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between flex-shrink-0 backdrop-blur-sm">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                <x-icon name="utensils" size="18" class="text-white" />
            </div>
            <div>
                <h1 class="text-lg font-bold text-slate-900 dark:text-white">Menu Management</h1>
                <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{{ count($menuItems) }} total menu items</p>
            </div>
        </div>
    </header>

    <div class="flex-1 overflow-y-auto px-6 py-5">
        {{-- Filters & Search --}}
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-4 mb-5 shadow-sm space-y-4">
            <div class="flex flex-col md:flex-row gap-3">
                <div class="relative flex-1">
                    <x-icon name="search" size="15" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" id="menu-search" placeholder="Search dish or item..."
                        class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors">
                </div>
                <div class="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                    <button type="button" data-cat-filter="all" class="px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap bg-indigo-600 text-white shadow-md">All Categories</button>
                    @foreach ($categories as $cat)
                        <button type="button" data-cat-filter="{{ $cat->slug }}" class="px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-250/30 hover:bg-slate-200 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white transition-all">{{ $cat->name }}</button>
                    @endforeach
                </div>
            </div>
        </div>

        {{-- Menu Grid --}}
        <div id="menu-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            @foreach ($menuItems as $item)
                <div class="menu-card bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700"
                    data-id="{{ $item->id }}" data-category="{{ $item->category->slug }}" data-name="{{ $item->name }}">
                    
                    <div>
                        <div class="flex justify-between items-start mb-3">
                            <span class="text-3xl p-2 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200/40 dark:border-transparent">{{ $item->emoji ?: '🍛' }}</span>
                            
                            {{-- Availability Switch --}}
                            <label class="relative inline-flex items-center cursor-pointer select-none">
                                <input type="checkbox" class="sr-only peer" {{ $item->is_available ? 'checked' : '' }} onchange="toggleAvailability({{ $item->id }}, this)">
                                <div class="w-9 h-5 bg-slate-250 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                            </label>
                        </div>
                        
                        <h3 class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ $item->name }}</h3>
                        <p class="text-slate-400 dark:text-slate-500 text-xs mt-0.5">{{ $item->category->name }}</p>

                        <div class="flex flex-wrap gap-1 mt-2">
                            @if($item->tags)
                                @foreach($item->tags as $tag)
                                    <span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-semibold rounded-md uppercase tracking-wider">{{ $tag }}</span>
                                @endforeach
                            @endif
                        </div>
                    </div>

                    <div class="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800/40 flex justify-between items-center">
                        <div>
                            <p class="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Price</p>
                            <div class="flex items-center gap-1 mt-0.5 cursor-pointer group" onclick="editPrice({{ $item->id }}, {{ $item->price }})">
                                <span class="text-indigo-600 dark:text-indigo-400 font-bold text-sm" id="price-display-{{ $item->id }}">LKR {{ number_format($item->price) }}</span>
                                <x-icon name="edit-3" size="11" class="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        
                        <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full {{ $item->is_available ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-500' }}" id="status-badge-{{ $item->id }}">
                            <span class="w-1.5 h-1.5 rounded-full {{ $item->is_available ? 'bg-emerald-500' : 'bg-red-500' }}"></span>
                            {{ $item->is_available ? 'Available' : 'Unavailable' }}
                        </span>
                    </div>
                </div>
            @endforeach
        </div>

        <div id="menu-empty" class="hidden flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
            <x-icon name="utensils" size="32" class="text-slate-500" />
            <p class="text-sm font-semibold">No menu items match your search</p>
            <p class="text-xs">Try selecting a different category or refining your query</p>
        </div>
    </div>
</div>

{{-- Toast Container --}}
<div id="menu-toast" class="hidden fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
    <x-icon name="check" size="16" class="text-emerald-500 dark:text-emerald-400" />
    <span id="menu-toast-text"></span>
</div>
@endsection

@section('scripts')
<script>
    // Category chips filters
    document.querySelectorAll('[data-cat-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-cat-filter]').forEach(b => {
                b.className = 'px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-250/30 hover:bg-slate-200 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white transition-all';
            });
            btn.className = 'px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap bg-indigo-600 text-white shadow-md';
            
            const activeCategory = btn.getAttribute('data-cat-filter');
            filterMenu(activeCategory, document.getElementById('menu-search').value.trim().toLowerCase());
        });
    });

    // Search filter
    document.getElementById('menu-search').addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        const activeCatBtn = document.querySelector('[data-cat-filter].bg-indigo-600');
        const activeCategory = activeCatBtn ? activeCatBtn.getAttribute('data-cat-filter') : 'all';
        filterMenu(activeCategory, query);
    });

    function filterMenu(category, query) {
        let count = 0;
        document.querySelectorAll('.menu-card').forEach(card => {
            const matchCategory = category === 'all' || card.dataset.category === category;
            const matchSearch = card.dataset.name.toLowerCase().includes(query);
            const show = matchCategory && matchSearch;
            card.classList.toggle('hidden', !show);
            if (show) count++;
        });
        document.getElementById('menu-empty').classList.toggle('hidden', count > 0);
    }

    // Toast logic
    let toastTimer;
    function showToast(message) {
        const toast = document.getElementById('menu-toast');
        const text = document.getElementById('menu-toast-text');
        text.textContent = message;
        toast.classList.remove('hidden');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    // Toggle availability
    function toggleAvailability(id, checkbox) {
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        fetch('/pos/menu/toggle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify({ id })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showToast(data.is_available ? 'Item marked as Available' : 'Item marked as Out of Stock');
                const badge = document.getElementById(`status-badge-${id}`);
                badge.className = `inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${data.is_available ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-500'}`;
                badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full ${data.is_available ? 'bg-emerald-500' : 'bg-red-500'}"></span> ${data.is_available ? 'Available' : 'Unavailable'}`;
            } else {
                checkbox.checked = !checkbox.checked;
                alert('Action failed: ' + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            checkbox.checked = !checkbox.checked;
            alert('Error updating availability');
        });
    }

    // Edit price inline
    function editPrice(id, currentPrice) {
        const newPrice = prompt('Enter new price (LKR):', currentPrice);
        if (newPrice === null) return;
        const priceNum = parseFloat(newPrice);
        if (isNaN(priceNum) || priceNum < 0) {
            alert('Please enter a valid price.');
            return;
        }

        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        fetch('/pos/menu/price', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify({ id, price: priceNum })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showToast('Menu price updated successfully');
                document.getElementById(`price-display-${id}`).textContent = 'LKR ' + new Intl.NumberFormat('en-LK').format(data.price);
            } else {
                alert('Action failed: ' + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error updating price');
        });
    }
</script>
@endsection
