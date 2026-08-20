@extends('layouts.pos')

@section('title', 'Delivery Management - '.config('app.name'))

@section('content')
<div class="flex flex-col h-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
    {{-- Header --}}
    <header class="px-6 py-4 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between flex-shrink-0 backdrop-blur-sm">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-orange-650 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <x-icon name="truck" size="18" class="text-white" />
            </div>
            <div>
                <h1 class="text-lg font-bold text-slate-900 dark:text-white">Delivery Management</h1>
                <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{{ count($deliveries) }} active shipments</p>
            </div>
        </div>
    </header>

    <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {{-- Pending Assigning (Col 1) --}}
            <div class="lg:col-span-1 space-y-4">
                <h2 class="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                    Pending Rider Assignment ({{ count($pendingDeliveryOrders) }})
                </h2>
                
                <div class="space-y-3">
                    @forelse($pendingDeliveryOrders as $order)
                        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm space-y-3">
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm font-bold text-slate-900 dark:text-white">#{{ $order->id }}</p>
                                    <p class="text-slate-400 text-xs mt-0.5">Dine-in / Takeaway: Takeaway</p>
                                </div>
                                <span class="px-2.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20">Preparing</span>
                            </div>
                            
                            <div class="text-xs text-slate-500 dark:text-slate-400 space-y-1 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                                <p><strong class="text-slate-850 dark:text-slate-300">Customer:</strong> {{ $order->customer->name ?? 'Walk-in Customer' }}</p>
                                <p><strong class="text-slate-850 dark:text-slate-300">Phone:</strong> {{ $order->customer->phone ?? 'N/A' }}</p>
                                <p><strong class="text-slate-850 dark:text-slate-300">Total Bill:</strong> LKR {{ number_format($order->total, 2) }}</p>
                            </div>
                            
                            <button type="button" onclick="openAssignModal('{{ $order->id }}')" class="w-full flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md">
                                <x-icon name="plus" size="13" /> Assign Delivery Rider
                            </button>
                        </div>
                    @empty
                        <div class="bg-white/40 dark:bg-slate-900/40 border border-dashed border-slate-250 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-400 dark:text-slate-500">
                            <x-icon name="check" size="20" class="mx-auto mb-2 text-slate-400" />
                            <p class="text-xs font-semibold">All delivery orders have riders assigned</p>
                        </div>
                    @endforelse
                </div>
            </div>

            {{-- active Shipments (Col 2 & 3) --}}
            <div class="lg:col-span-2 space-y-4">
                <h2 class="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Active Shipments ({{ count($deliveries) }})
                </h2>

                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">
                                <th class="px-6 py-4">Order ID</th>
                                <th class="px-6 py-4">Rider Name</th>
                                <th class="px-6 py-4">Customer Details</th>
                                <th class="px-6 py-4">Delivery Fee</th>
                                <th class="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm">
                            @forelse($deliveries as $d)
                                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">#{{ $d->order_id }}</td>
                                    <td class="px-6 py-4 font-medium">{{ $d->rider_name }}</td>
                                    <td class="px-6 py-4">
                                        <div class="flex flex-col">
                                            <span class="font-semibold">{{ $d->order->customer->name ?? 'Walk-in Customer' }}</span>
                                            <span class="text-xs text-slate-400 mt-0.5">{{ $d->order->customer->phone ?? 'N/A' }}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 font-semibold text-slate-800 dark:text-slate-300">LKR {{ number_format($d->delivery_charge) }}</td>
                                    <td class="px-6 py-4">
                                        <span class="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border {{ $d->status === 'delivered' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' }}">
                                            {{ ucfirst($d->status) }}
                                        </span>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                                        <div class="flex flex-col items-center gap-2">
                                            <x-icon name="truck" size="24" />
                                            <p class="font-medium text-sm">No shipments currently recorded</p>
                                        </div>
                                    </td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Assign Rider Modal --}}
<div id="assign-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="closeAssignModal()"></div>
    <div class="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 class="text-slate-900 dark:text-white font-bold text-base">Assign Delivery Rider</h2>
            <button type="button" onclick="closeAssignModal()" class="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <x-icon name="x" size="18" />
            </button>
        </div>
        <div class="px-6 py-5 space-y-4">
            <input type="hidden" id="assign-order-id">
            <div>
                <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Rider Name</label>
                <input type="text" id="assign-rider-name" placeholder="e.g. Kasun Fernando" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
            </div>
            <div>
                <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Delivery Charge (LKR)</label>
                <input type="number" id="assign-charge" placeholder="e.g. 250" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 text-right font-medium">
            </div>
        </div>
        <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50 dark:bg-slate-850">
            <button type="button" onclick="closeAssignModal()" class="px-4 py-2 text-slate-500 dark:text-slate-400 text-sm font-medium rounded-xl hover:text-slate-900">Cancel</button>
            <button type="button" onclick="submitRiderAssignment()" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/20">Assign Rider</button>
        </div>
    </div>
</div>

{{-- Toast Container --}}
<div id="deliv-toast" class="hidden fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
    <x-icon name="check" size="16" class="text-emerald-500 dark:text-emerald-400" />
    <span id="deliv-toast-text"></span>
</div>
@endsection

@section('scripts')
<script>
    const modal = document.getElementById('assign-modal');

    function openAssignModal(orderId) {
        document.getElementById('assign-order-id').value = orderId;
        document.getElementById('assign-rider-name').value = '';
        document.getElementById('assign-charge').value = '250';
        modal.classList.remove('hidden');
    }

    function closeAssignModal() {
        modal.classList.add('hidden');
    }

    // Toast
    let toastTimer;
    function showToast(message) {
        const toast = document.getElementById('deliv-toast');
        const text = document.getElementById('deliv-toast-text');
        text.textContent = message;
        toast.classList.remove('hidden');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    function submitRiderAssignment() {
        const orderId = document.getElementById('assign-order-id').value;
        const riderName = document.getElementById('assign-rider-name').value.trim();
        const deliveryCharge = parseFloat(document.getElementById('assign-charge').value);

        if (!riderName) {
            alert('Please specify a rider name.');
            return;
        }
        if (isNaN(deliveryCharge) || deliveryCharge < 0) {
            alert('Please specify a valid delivery fee.');
            return;
        }

        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        fetch('/pos/delivery/rider', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify({ order_id: orderId, rider_name: riderName, delivery_charge: deliveryCharge })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showToast('Rider assigned successfully');
                closeAssignModal();
                setTimeout(() => window.location.reload(), 1200);
            } else {
                alert('Action failed: ' + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error assigning delivery rider.');
        });
    }
</script>
@endsection
