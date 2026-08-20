@extends('layouts.pos')

@section('title', 'Financials - '.config('app.name'))

@section('content')
<div class="flex flex-col h-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
    {{-- Header --}}
    <header class="px-6 py-4 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between flex-shrink-0 backdrop-blur-sm">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-purple-650 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <x-icon name="wallet" size="18" class="text-white" />
            </div>
            <div>
                <h1 class="text-lg font-bold text-slate-900 dark:text-white">Financial Management</h1>
                <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Overall profit & loss statement</p>
            </div>
        </div>
        <button type="button" onclick="openExpenseModal()" class="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/25">
            <x-icon name="plus" size="15" />
            Record Expense
        </button>
    </header>

    <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {{-- KPI Cards --}}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div class="w-12 h-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <x-icon name="trending-up" size="22" />
                </div>
                <div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Total Revenue</p>
                    <p class="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">LKR {{ number_format($totalRevenue, 2) }}</p>
                </div>
            </div>

            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div class="w-12 h-12 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <x-icon name="trending-down" size="22" />
                </div>
                <div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Total Expenses</p>
                    <p class="text-xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">LKR {{ number_format($totalExpenses, 2) }}</p>
                </div>
            </div>

            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                <div class="w-12 h-12 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <x-icon name="wallet" size="22" />
                </div>
                <div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Net Profit</p>
                    <p class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">LKR {{ number_format($netProfit, 2) }}</p>
                </div>
            </div>
        </div>

        {{-- Expense category breakdown & list --}}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {{-- Category Summary (Col 1) --}}
            <div class="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm h-fit space-y-4">
                <h2 class="text-sm font-bold text-slate-900 dark:text-white">Outflow Breakdown</h2>
                
                <div class="space-y-3">
                    @foreach(['utilities' => 'bg-blue-500', 'rent' => 'bg-amber-500', 'salaries' => 'bg-purple-500', 'inventory' => 'bg-teal-500', 'marketing' => 'bg-pink-500', 'other' => 'bg-slate-500'] as $cat => $color)
                        @php $amt = $expenseCategories[$cat] ?? 0; @endphp
                        <div class="space-y-1">
                            <div class="flex justify-between text-xs font-semibold">
                                <span class="text-slate-600 dark:text-slate-400 capitalize">{{ $cat }}</span>
                                <span class="text-slate-850 dark:text-slate-200">LKR {{ number_format($amt) }}</span>
                            </div>
                            <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div class="{{ $color }} h-full" style="width: {{ $totalExpenses > 0 ? ($amt / $totalExpenses * 100) : 0 }}%"></div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- Expenses Log List (Col 2 & 3) --}}
            <div class="lg:col-span-2 space-y-4">
                <h2 class="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    Expenses Records Log
                </h2>

                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">
                                <th class="px-6 py-4">Category</th>
                                <th class="px-6 py-4">Description</th>
                                <th class="px-6 py-4">Date</th>
                                <th class="px-6 py-4">Branch</th>
                                <th class="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm">
                            @forelse($expenses as $e)
                                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td class="px-6 py-4">
                                        <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 capitalize">
                                            {{ $e->category }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-slate-900 dark:text-white font-medium truncate max-w-[200px]">{{ $e->description ?: 'No Description' }}</td>
                                    <td class="px-6 py-4 text-slate-500 dark:text-slate-400">{{ date('Y-m-d', strtotime($e->date)) }}</td>
                                    <td class="px-6 py-4 text-slate-500 dark:text-slate-400">{{ $e->branch->name ?? 'All Branches' }}</td>
                                    <td class="px-6 py-4 text-right font-bold text-red-500">-LKR {{ number_format($e->amount, 2) }}</td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                                        <div class="flex flex-col items-center gap-2">
                                            <x-icon name="wallet" size="24" />
                                            <p class="font-medium text-sm">No expenses recorded yet</p>
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

{{-- Add Expense Modal --}}
<div id="expense-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick="closeExpenseModal()"></div>
    <div class="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 class="text-slate-900 dark:text-white font-bold text-base">Record Cash Expense</h2>
            <button type="button" onclick="closeExpenseModal()" class="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <x-icon name="x" size="18" />
            </button>
        </div>
        <div class="px-6 py-5 space-y-4">
            <div>
                <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Expense Category</label>
                <select id="exp-category" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
                    <option value="utilities">Utilities (Water, Power, Internet)</option>
                    <option value="rent">Rent & Leasing</option>
                    <option value="salaries">Salaries & Employee Wages</option>
                    <option value="inventory">Inventory Restocking</option>
                    <option value="marketing">Marketing & Promotion</option>
                    <option value="other">Other Incidentals</option>
                </select>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Amount (LKR)</label>
                    <input type="number" id="exp-amount" min="0.01" step="0.01" placeholder="0.00" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 text-right font-medium">
                </div>
                <div>
                    <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Date</label>
                    <input type="date" id="exp-date" value="{{ date('Y-m-d') }}" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
                </div>
            </div>
            <div>
                <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Select Branch</label>
                <select id="exp-branch" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500">
                    @foreach ($branches as $branch)
                        <option value="{{ $branch->id }}">{{ $branch->name }}</option>
                    @endforeach
                </select>
            </div>
            <div>
                <label class="block text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Description</label>
                <textarea id="exp-desc" rows="2" placeholder="e.g. Paid electricity bill for January" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"></textarea>
            </div>
        </div>
        <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50 dark:bg-slate-850">
            <button type="button" onclick="closeExpenseModal()" class="px-4 py-2 text-slate-500 dark:text-slate-400 text-sm font-medium rounded-xl hover:text-slate-900">Cancel</button>
            <button type="button" onclick="submitExpense()" class="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-rose-500/20">Save Outflow</button>
        </div>
    </div>
</div>

{{-- Toast Container --}}
<div id="exp-toast" class="hidden fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
    <x-icon name="check" size="16" class="text-emerald-500 dark:text-emerald-400" />
    <span id="exp-toast-text"></span>
</div>
@endsection

@section('scripts')
<script>
    const modal = document.getElementById('expense-modal');

    function openExpenseModal() {
        document.getElementById('exp-amount').value = '';
        document.getElementById('exp-desc').value = '';
        modal.classList.remove('hidden');
    }

    function closeExpenseModal() {
        modal.classList.add('hidden');
    }

    // Toast
    let toastTimer;
    function showToast(message) {
        const toast = document.getElementById('exp-toast');
        const text = document.getElementById('exp-toast-text');
        text.textContent = message;
        toast.classList.remove('hidden');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    function submitExpense() {
        const category = document.getElementById('exp-category').value;
        const amount = parseFloat(document.getElementById('exp-amount').value);
        const date = document.getElementById('exp-date').value;
        const branch_id = document.getElementById('exp-branch').value;
        const description = document.getElementById('exp-desc').value.trim();

        if (isNaN(amount) || amount <= 0) {
            alert('Please specify a valid expense amount.');
            return;
        }
        if (!date) {
            alert('Please select a date.');
            return;
        }

        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        fetch('/pos/financial/expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify({ category, amount, date, branch_id, description })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showToast('Expense recorded successfully');
                closeExpenseModal();
                setTimeout(() => window.location.reload(), 1200);
            } else {
                alert('Action failed: ' + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error recording expense.');
        });
    }
</script>
@endsection
