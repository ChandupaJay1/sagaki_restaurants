@extends('layouts.pos')

@section('title', 'Staff Manager - '.config('app.name'))

@section('content')
<div class="flex flex-col h-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
    {{-- Header --}}
    <header class="px-6 py-4 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between flex-shrink-0 backdrop-blur-sm">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-indigo-650 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <x-icon name="users" size="18" class="text-white" />
            </div>
            <div>
                <h1 class="text-lg font-bold text-slate-900 dark:text-white">Staff & Attendance</h1>
                <p class="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{{ count($staff) }} registered staff members</p>
            </div>
        </div>
    </header>

    <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {{-- Staff Directory (Col 1) --}}
            <div class="xl:col-span-1 space-y-4">
                <h2 class="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    Staff Roster
                </h2>
                
                <div class="grid grid-cols-1 gap-3">
                    @foreach($staff as $member)
                        @php
                            $todayAttendance = $attendance->firstWhere('user_id', $member->id);
                            $isClockedIn = $todayAttendance && $todayAttendance->clock_in && !$todayAttendance->clock_out;
                            $isClockedOut = $todayAttendance && $todayAttendance->clock_out;
                        @endphp
                        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
                            <div class="flex items-center gap-3 min-w-0">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                    {{ strtoupper(substr($member->name, 0, 2)) }}
                                </div>
                                <div class="min-w-0">
                                    <p class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ $member->name }}</p>
                                    <p class="text-slate-400 text-xs mt-0.5">{{ $member->email }}</p>
                                </div>
                            </div>
                            
                            @if($isClockedOut)
                                <span class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700/60">Done</span>
                            @elseif($isClockedIn)
                                <button type="button" onclick="clockStaff({{ $member->id }}, 'out')" class="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-md">
                                    Clock Out
                                </button>
                            @else
                                <button type="button" onclick="clockStaff({{ $member->id }}, 'in')" class="px-3.5 py-1.5 bg-emerald-650 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md">
                                    Clock In
                                </button>
                            @endif
                        </div>
                    @endforeach
                </div>
            </div>

            {{-- Daily Attendance Records (Col 2 & 3) --}}
            <div class="xl:col-span-2 space-y-4">
                <h2 class="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    Today's Attendance Logs ({{ $attendance->count() }})
                </h2>

                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">
                                <th class="px-6 py-4">Employee</th>
                                <th class="px-6 py-4">Clock In</th>
                                <th class="px-6 py-4">Clock Out</th>
                                <th class="px-6 py-4">Hours</th>
                                <th class="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm">
                            @forelse($attendance as $a)
                                <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px]">
                                                {{ strtoupper(substr($a->user->name ?? 'St', 0, 2)) }}
                                            </div>
                                            <span class="font-medium text-slate-900 dark:text-white">{{ $a->user->name ?? 'Deleted Staff' }}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 font-semibold text-slate-700 dark:text-slate-350">{{ $a->clock_in ? date('h:i A', strtotime($a->clock_in)) : '-' }}</td>
                                    <td class="px-6 py-4 font-semibold text-slate-700 dark:text-slate-350">{{ $a->clock_out ? date('h:i A', strtotime($a->clock_out)) : '-' }}</td>
                                    <td class="px-6 py-4">
                                        @if($a->clock_in && $a->clock_out)
                                            @php
                                                $t1 = strtotime($a->clock_in);
                                                $t2 = strtotime($a->clock_out);
                                                $hrs = round(($t2 - $t1) / 3600, 1);
                                            @endphp
                                            <span class="font-bold">{{ $hrs }} hrs</span>
                                        @elseif($a->clock_in)
                                            <span class="text-indigo-600 dark:text-indigo-400 font-semibold italic">On Shift</span>
                                        @else
                                            -
                                        @endif
                                    </td>
                                    <td class="px-6 py-4">
                                        <span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full {{ $a->clock_out ? 'bg-slate-100 text-slate-500 dark:bg-slate-800' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' }}">
                                            <span class="w-1.5 h-1.5 rounded-full {{ $a->clock_out ? 'bg-slate-400' : 'bg-emerald-500' }}"></span>
                                            {{ $a->clock_out ? 'Completed' : 'On Shift' }}
                                        </span>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="5" class="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                                        <div class="flex flex-col items-center gap-2">
                                            <x-icon name="users" size="24" />
                                            <p class="font-medium text-sm">No attendance logs logged today</p>
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

{{-- Toast Container --}}
<div id="staff-toast" class="hidden fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
    <x-icon name="check" size="16" class="text-emerald-500 dark:text-emerald-400" />
    <span id="staff-toast-text"></span>
</div>
@endsection

@section('scripts')
<script>
    let toastTimer;
    function showToast(message) {
        const toast = document.getElementById('staff-toast');
        const text = document.getElementById('staff-toast-text');
        text.textContent = message;
        toast.classList.remove('hidden');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    function clockStaff(userId, action) {
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        
        fetch('/pos/staff/clock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify({ user_id: userId, action })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showToast(action === 'in' ? 'Clocked in successfully' : 'Clocked out successfully');
                setTimeout(() => window.location.reload(), 1200);
            } else {
                alert('Action failed: ' + data.message);
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error clocking staff member.');
        });
    }
</script>
@endsection
