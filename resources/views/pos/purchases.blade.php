@extends('layouts.pos')

@section('title', 'Purchases - '.config('app.name'))

@section('content')
<div class="flex flex-col h-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
    {{-- Header --}}
    <header class="px-6 py-4 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between flex-shrink-0 backdrop-blur-sm">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-teal-650 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                <x-icon name="shopping-bag" size="18" class="text-white" />
            </div>
            <div>
                <h1 class="text-lg font-bold text-slate-900 dark:text-white">Purchase Management</h1>
                <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{{ count($purchases) }} recorded supply logs</p>
            </div>
        </div>
        <button type="button" onclick="openAddModal()" class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/25">
            <x-icon name="plus" size="15" />
            Record Purchase
        </button>
    </header>

    <div class="flex-1 overflow-y-auto px-6 py-5">
        {{-- Purchase Log Table --}}
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-sm overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">
                        <th class="px-6 py-4">Purchase ID</th>
                        <th class="px-6 py-4">Date</th>
                        <th class="px-6 py-4">Supplier</th>
                        <th class="px-6 py-4">Branch</th>
                        <th class="px-6 py-4">Items Summary</th>
                        <th class="px-6 py-4 text-right">Total Cost</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm">
                    @forelse($purchases as $p)
                        <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                            <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">#PUR-{{ $p->id }}</td>
                            <td class="px-6 py-4 text-slate-500 dark:text-slate-400">{{ $p->created_at->format('Y-m-d H:i') }}</td>
                            <td class="px-6 py-4 font-medium">{{ $p->supplier }}</td>
                            <td class="px-6 py-4 text-slate-500 dark:text-slate-400">{{ $p->branch->name ?? 'All Branches' }}</td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col gap-0.5 max-w-xs">
                                    @foreach($p->items as $item)
                                        <span class="text-xs text-slate-600 dark:text-slate-400 truncate">
                                            • {{ $item->inventoryItem->name ?? 'Deleted Item' }} ({{ $item->qty }} {{ $item->inventoryItem->unit ?? '' }})
                                        </span>
                                    @endforeach
                                </div>
                            </td>
                            <td class="px-6 py-4 text-right font-bold text-indigo-650 text-indigo-600 dark:text-indigo-400">LKR {{ number_format($p->total_amount, 2) }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                                <div class="flex flex-col items-center gap-2">
                                    <x-icon name="shopping-bag" size="24" />
                                    <p class="font-medium text-sm">No purchases recorded yet</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

{{-- Record Purchase Modal --}}
<div id="purchase-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="closeAddModal()"></div>
    <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
            <h2 class="text-slate-900 dark:text-white font-bold text-base">Record Inventory Purchase</h2>
            <button type="button" onclick="closeAddModal()" class="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <x-icon name="x" size="18" />
            </button>
        </div>
        <div class="px-6 py-5 space-y-4 overflow-y-auto flex-1">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Supplier Name</label>
                    <input type="text" id="pur-supplier" placeholder="e.g. Keells Wholesale" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
                </div>
                <div>
                    <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Select Branch</label>
                    <select id="pur-branch" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
                        @foreach ($branches as $branch)
                            <option value="{{ $branch->id }}">{{ $branch->name }}</option>
                        @endforeach
                    </select>
                </div>
            </div>

            <div class="border-t border-slate-200/80 dark:border-slate-800/40 pt-4">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Items Purchased</span>
                    <button type="button" onclick="addItemRow()" class="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                        <x-icon name="plus" size="12" /> Add Item
                    </button>
                </div>

                <div id="purchase-items-rows" class="space-y-2.5">
                    {{-- Row will be added dynamically --}}
                </div>
            </div>
        </div>
        <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850 flex-shrink-0">
            <div>
                <p class="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Cost</p>
                <p id="pur-total-display" class="text-indigo-650 text-indigo-600 dark:text-indigo-400 font-bold text-lg">LKR 0.00</p>
            </div>
            <div class="flex gap-2">
                <button type="button" onclick="closeAddModal()" class="px-4 py-2 text-slate-500 dark:text-slate-400 text-sm font-medium rounded-xl hover:text-slate-900">Cancel</button>
                <button type="button" onclick="submitPurchase()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/20">Submit Record</button>
            </div>
        </div>
    </div>
</div>

{{-- Toast Container --}}
<div id="pur-toast" class="hidden fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
    <x-icon name="check" size="16" class="text-emerald-500 dark:text-emerald-400" />
    <span id="pur-toast-text"></span>
</div>
@endsection

@section('scripts')
<script>
    const inventoryItems = @json($inventoryItems);
    const modal = document.getElementById('purchase-modal');
    const itemsContainer = document.getElementById('purchase-items-rows');

    function openAddModal() {
        modal.classList.remove('hidden');
        itemsContainer.innerHTML = '';
        addItemRow(); // add first default row
    }

    function closeAddModal() {
        modal.classList.add('hidden');
    }

    function addItemRow() {
        const rowId = Date.now() + Math.random().toString(36).substr(2, 5);
        const div = document.createElement('div');
        div.className = 'grid grid-cols-12 gap-3 items-center purchase-item-row bg-slate-50/50 dark:bg-slate-950 p-2.5 border border-slate-200/50 dark:border-slate-800/40 rounded-xl';
        div.id = rowId;

        let options = '';
        inventoryItems.forEach(i => {
            options += `<option value="${i.id}" data-unit="${i.unit}" data-price="${i.price}">${i.name} (${i.unit})</option>`;
        });

        div.innerHTML = `
            <div class="col-span-6">
                <select class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs focus:outline-none item-select" onchange="onItemChange(this)">
                    <option value="" data-unit="kg" data-price="0">-- Select Raw Item --</option>
                    ${options}
                </select>
            </div>
            <div class="col-span-2">
                <input type="number" min="0.01" step="0.01" placeholder="Qty" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs focus:outline-none text-right font-medium item-qty" oninput="calculateTotal()">
            </div>
            <div class="col-span-3">
                <div class="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-2">
                    <span class="text-[10px] text-slate-400 font-bold">LKR</span>
                    <input type="number" min="0" step="1" placeholder="Cost" class="w-full bg-transparent border-0 p-0 text-xs focus:outline-none text-right font-medium item-price" oninput="calculateTotal()">
                </div>
            </div>
            <div class="col-span-1 flex justify-center">
                <button type="button" onclick="deleteRow('${rowId}')" class="text-red-500 hover:text-red-650 transition-colors">
                    <x-icon name="trash" size="14" />
                </button>
            </div>
        `;
        itemsContainer.appendChild(div);
    }

    function deleteRow(id) {
        const rows = document.querySelectorAll('.purchase-item-row');
        if (rows.length <= 1) {
            alert('A purchase order must contain at least one item.');
            return;
        }
        const row = document.getElementById(id);
        if (row) row.remove();
        calculateTotal();
    }

    function onItemChange(select) {
        const option = select.options[select.selectedIndex];
        const defaultPrice = option.getAttribute('data-price') || 0;
        const row = select.closest('.purchase-item-row');
        const priceInput = row.querySelector('.item-price');
        priceInput.value = parseFloat(defaultPrice) || '';
        calculateTotal();
    }

    function calculateTotal() {
        let total = 0;
        document.querySelectorAll('.purchase-item-row').forEach(row => {
            const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            total += qty * price;
        });
        document.getElementById('pur-total-display').textContent = 'LKR ' + new Intl.NumberFormat('en-LK', { minimumFractionDigits: 2 }).format(total);
    }

    // Toast
    let toastTimer;
    function showToast(message) {
        const toast = document.getElementById('pur-toast');
        const text = document.getElementById('pur-toast-text');
        text.textContent = message;
        toast.classList.remove('hidden');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    function submitPurchase() {
        const supplier = document.getElementById('pur-supplier').value.trim();
        const branch_id = document.getElementById('pur-branch').value;
        if (!supplier) {
            alert('Please enter a supplier name.');
            return;
        }

        const items = [];
        let valid = true;
        document.querySelectorAll('.purchase-item-row').forEach(row => {
            const select = row.querySelector('.item-select');
            const qty = parseFloat(row.querySelector('.item-qty').value);
            const price = parseFloat(row.querySelector('.item-price').value);

            if (!select.value) {
                valid = false;
                alert('Please select an item for all rows.');
                return;
            }
            if (isNaN(qty) || qty <= 0) {
                valid = false;
                alert('Please specify a valid quantity greater than zero.');
                return;
            }
            if (isNaN(price) || price < 0) {
                valid = false;
                alert('Please specify a valid unit price cost.');
                return;
            }

            items.push({
                inventory_item_id: Number(select.value),
                qty: qty,
                unit_price: price
            });
        });

        if (!valid) return;
        if (items.length === 0) {
            alert('Please add at least one item.');
            return;
        }

        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        fetch('/pos/purchases/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify({ supplier, branch_id, items })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showToast('Purchase recorded and raw stock inventory updated successfully');
                closeAddModal();
                setTimeout(() => window.location.reload(), 1200);
            } else {
                alert('Action failed: ' + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error recording purchase order.');
        });
    }
</script>
@endsection
