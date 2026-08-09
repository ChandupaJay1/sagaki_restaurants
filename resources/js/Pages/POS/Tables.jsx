import { useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import {
    Table2,
    Users,
    ArrowRightLeft,
    Merge,
    Plus,
    X,
    RefreshCw,
    Clock,
    CreditCard,
    Utensils,
    CheckCircle2,
    AlertCircle,
    ChefHat,
} from 'lucide-react';
import POSLayout from '@/Layouts/POSLayout';

// ─── Mock table data ──────────────────────────────────────────────────────────
const INITIAL_TABLES = [
    { id: 1,  name: 'T1',  type: '2-top',     seats: 2,  status: 'occupied',  customer: 'Perera',   bill: 2450,  startedAt: '18:30' },
    { id: 2,  name: 'T2',  type: '2-top',     seats: 2,  status: 'occupied',  customer: 'Silva',    bill: 1800,  startedAt: '18:45' },
    { id: 3,  name: 'T3',  type: '4-top',     seats: 4,  status: 'reserved',  customer: 'Fernando', bill: 0,     startedAt: '19:30' },
    { id: 4,  name: 'T4',  type: '4-top',     seats: 4,  status: 'available',  customer: null,     bill: 0,     startedAt: null  },
    { id: 5,  name: 'T5',  type: '6-top',     seats: 6,  status: 'occupied',  customer: 'Jayawardena', bill: 4200, startedAt: '18:00' },
    { id: 6,  name: 'T6',  type: '8-top',     seats: 8,  status: 'available',  customer: null,     bill: 0,     startedAt: null  },
    { id: 7,  name: 'T7',  type: '4-top',     seats: 4,  status: 'occupied',  customer: 'Kumar',    bill: 3100,  startedAt: '19:00' },
    { id: 8,  name: 'T8',  type: '2-top',     seats: 2,  status: 'reserved',  customer: 'De Zoysa', bill: 0,     startedAt: '20:00' },
    { id: 9,  name: 'T9',  type: '6-top',     seats: 6,  status: 'occupied',  customer: 'Ranasinghe', bill: 2900, startedAt: '18:15' },
    { id: 10, name: 'T10', type: 'bar',       seats: 4,  status: 'available',  customer: null,     bill: 0,     startedAt: null  },
    { id: 11, name: 'T11', type: 'patio-4',   seats: 4,  status: 'available',  customer: null,     bill: 0,     startedAt: null  },
    { id: 12, name: 'T12', type: 'patio-6',   seats: 6,  status: 'occupied',  customer: 'Wijeyeratne', bill: 5600, startedAt: '17:45' },
    { id: 13, name: 'T13', type: 'private',   seats: 8,  status: 'reserved',  customer: 'Bandara',  bill: 0,     startedAt: '20:30' },
    { id: 14, name: 'T14', type: '2-top',     seats: 2,  status: 'available',  customer: null,     bill: 0,     startedAt: null  },
    { id: 15, name: 'T15', type: 'bar',       seats: 4,  status: 'occupied',  customer: 'Gunaratne', bill: 1200, startedAt: '19:30' },
    { id: 16, name: 'T16', type: '4-top',     seats: 4,  status: 'available',  customer: null,     bill: 0,     startedAt: null  },
];

const STATUS_CONFIG = {
    available: {
        label: 'Available',
        dot: 'bg-emerald-400',
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/40',
        text: 'text-emerald-650 dark:text-emerald-400',
        ring: 'ring-emerald-500/30',
        hover: 'hover:border-emerald-500/60 hover:bg-emerald-500/20',
        icon: CheckCircle2,
    },
    occupied: {
        label: 'Occupied',
        dot: 'bg-red-400',
        bg: 'bg-red-500/15',
        border: 'border-red-500/40',
        text: 'text-red-650 dark:text-red-400',
        ring: 'ring-red-500/30',
        hover: 'hover:border-red-500/60 hover:bg-red-500/20',
        icon: Users,
    },
    reserved: {
        label: 'Reserved',
        dot: 'bg-amber-400',
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/40',
        text: 'text-amber-600 dark:text-amber-400',
        ring: 'ring-amber-500/30',
        hover: 'hover:border-amber-500/60 hover:bg-amber-500/20',
        icon: Clock,
    },
};

const TABLE_LAYOUT = [
    // Row 1: Bar & 2-tops
    [14, 1, 2, 10, 15],
    // Row 2: 4-tops & 6-top
    [4,  3, 7, 5, 9],
    // Row 3: Patio & Private
    [11, 12, 13, 6, 16],
];

function TableCard({ table, onClick }) {
    const config = STATUS_CONFIG[table.status];
    const StatusIcon = config.icon;

    return (
        <button
            onClick={() => onClick(table)}
            className={`
                relative group
                ${config.bg} ${config.border} ${config.hover}
                border-2 rounded-2xl p-4 text-left
                transition-all duration-200
                hover:shadow-lg hover:scale-105
                active:scale-95
                flex flex-col gap-2
                w-full
            `}
        >
            {/* Status indicator dot */}
            <div className="absolute top-3 right-3">
                <span className={`
                    inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
                    ${config.bg} ${config.text} border ${config.border}
                `}>
                    <StatusIcon size={11} />
                    {config.label}
                </span>
            </div>

            {/* Table icon */}
            <div className="flex items-start justify-between pt-1">
                <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center
                    ${table.status === 'occupied' ? 'bg-red-500/20' : table.status === 'reserved' ? 'bg-amber-500/20' : 'bg-emerald-500/20'}
                `}>
                    <Table2
                        size={20}
                        className={
                            table.status === 'occupied' ? 'text-red-655 dark:text-red-400' :
                            table.status === 'reserved' ? 'text-amber-655 dark:text-amber-400' :
                            'text-emerald-650 dark:text-emerald-400'
                        }
                    />
                </div>
            </div>

            {/* Table info */}
            <div>
                <p className="text-slate-850 dark:text-white font-bold text-lg leading-none">{table.name}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                    {table.seats} seats · {table.type.replace('-', ' ')}
                </p>
            </div>

            {/* Occupied info */}
            {table.status === 'occupied' && (
                <div className="pt-2 border-t border-slate-200 dark:border-white/10 mt-1 w-full">
                    <p className="text-slate-850 dark:text-white text-sm font-medium">{table.customer}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                        Started {table.startedAt}
                    </p>
                    <p className="text-indigo-650 dark:text-indigo-400 font-bold text-sm mt-1">
                        LKR {table.bill.toLocaleString()}
                    </p>
                </div>
            )}

            {table.status === 'reserved' && (
                <div className="pt-2 border-t border-slate-200 dark:border-white/10 mt-1 w-full">
                    <p className="text-amber-600 dark:text-amber-400 text-sm font-medium">{table.customer}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                        Reserved for {table.startedAt}
                    </p>
                </div>
            )}

            {/* Hover actions */}
            <div className="
                absolute inset-0 rounded-2xl
                bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm
                flex items-center justify-center gap-3
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
            ">
                {table.status === 'available' && (
                    <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-1">
                        <Plus size={14} />
                        Take Order
                    </span>
                )}
                {table.status === 'occupied' && (
                    <span className="text-slate-850 dark:text-white text-sm font-medium flex items-center gap-1">
                        <Utensils size={14} />
                        View Order
                    </span>
                )}
                {table.status === 'reserved' && (
                    <span className="text-amber-655 dark:text-amber-400 text-sm font-medium flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        Seat Guest
                    </span>
                )}
            </div>
        </button>
    );
}

function ActionModal({ table, onClose, onAction }) {
    const [activeTab, setActiveTab] = useState('details');
    const [transferTarget, setTransferTarget] = useState('');
    const [notes, setNotes] = useState('');

    const availableTables = INITIAL_TABLES.filter(
        (t) => t.status === 'available' && t.id !== table.id
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="
                relative w-full max-w-lg
                bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60
                rounded-2xl shadow-2xl
                overflow-hidden
            ">
                {/* Header */}
                <div className="
                    px-6 py-4 border-b border-slate-200 dark:border-slate-700/60
                    flex items-center justify-between
                    bg-white dark:bg-slate-800
                ">
                    <div className="flex items-center gap-3">
                        <div className={`
                            w-10 h-10 rounded-xl
                            ${table.status === 'occupied' ? 'bg-red-500/10 dark:bg-red-500/20' : table.status === 'reserved' ? 'bg-amber-500/10 dark:bg-amber-500/20' : 'bg-emerald-500/10 dark:bg-emerald-500/20'}
                            flex items-center justify-center
                        `}>
                            <Table2
                                size={20}
                                className={
                                    table.status === 'occupied' ? 'text-red-650 dark:text-red-400' :
                                    table.status === 'reserved' ? 'text-amber-600 dark:text-amber-400' :
                                    'text-emerald-650 dark:text-emerald-400'
                                }
                            />
                        </div>
                        <div>
                            <h2 className="text-slate-850 dark:text-white font-bold text-base">
                                {table.name} — {table.type.replace('-', ' ')}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">{table.seats} seats</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="
                            text-slate-400 hover:text-slate-900 dark:hover:text-white
                            w-8 h-8 rounded-lg flex items-center justify-center
                            hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors
                        "
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="
                    flex border-b border-slate-200 dark:border-slate-700/60 px-6
                ">
                    {[
                        { id: 'details', label: 'Details' },
                        { id: 'transfer', label: 'Transfer' },
                        { id: 'merge', label: 'Merge' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                px-4 py-3 text-sm font-medium
                                border-b-2 transition-all duration-200
                                ${activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-650 dark:text-indigo-400'
                                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                                }
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="px-6 py-5 min-h-64">
                    {activeTab === 'details' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-200/60 dark:border-transparent">
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Status</p>
                                    <p className={`font-semibold ${STATUS_CONFIG[table.status].text}`}>
                                        {STATUS_CONFIG[table.status].label}
                                    </p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-200/60 dark:border-transparent">
                                    <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Seats</p>
                                    <p className="text-slate-855 dark:text-white font-semibold">{table.seats}</p>
                                </div>
                                {table.status === 'occupied' && (
                                    <>
                                        <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-200/60 dark:border-transparent">
                                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Customer</p>
                                            <p className="text-slate-855 dark:text-white font-semibold">{table.customer}</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-200/60 dark:border-transparent">
                                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Bill Total</p>
                                            <p className="text-indigo-650 dark:text-indigo-400 font-bold">LKR {table.bill.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-200/60 dark:border-transparent">
                                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Started At</p>
                                            <p className="text-slate-855 dark:text-white font-semibold">{table.startedAt}</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-200/60 dark:border-transparent">
                                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Table Type</p>
                                            <p className="text-slate-855 dark:text-white font-semibold">{table.type.replace('-', ' ')}</p>
                                        </div>
                                    </>
                                )}
                                {table.status === 'reserved' && (
                                    <>
                                        <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-200/60 dark:border-transparent">
                                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Guest Name</p>
                                            <p className="text-slate-855 dark:text-white font-semibold">{table.customer}</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-200/60 dark:border-transparent">
                                            <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Reservation</p>
                                            <p className="text-slate-855 dark:text-white font-semibold">{table.startedAt}</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Quick actions */}
                            <div className="flex gap-2 pt-2">
                                {table.status === 'available' && (
                                    <button
                                        onClick={() => onAction('take-order', table)}
                                        className="
                                            flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500
                                            text-white text-sm font-semibold rounded-xl
                                            transition-colors flex items-center justify-center gap-2
                                        "
                                    >
                                        <Plus size={14} />
                                        Take Order
                                    </button>
                                )}
                                {table.status === 'occupied' && (
                                    <>
                                        <button
                                            onClick={() => onAction('add-bill', table)}
                                            className="
                                                flex-1 py-2.5 bg-emerald-500/10 dark:bg-emerald-600/20 border border-emerald-500/40
                                                text-emerald-600 dark:text-emerald-400 text-sm font-semibold rounded-xl
                                                transition-colors flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white
                                            "
                                        >
                                            <CreditCard size={14} />
                                            Add Bill
                                        </button>
                                        <button
                                            onClick={() => onAction('close-table', table)}
                                            className="
                                                flex-1 py-2.5 bg-red-500/10 dark:bg-red-500/20 border border-red-500/40
                                                text-red-655 dark:text-red-400 text-sm font-semibold rounded-xl
                                                transition-colors flex items-center justify-center gap-2 hover:bg-red-550 hover:text-white
                                            "
                                        >
                                            <CheckCircle2 size={14} />
                                            Close
                                        </button>
                                    </>
                                )}
                                {table.status === 'reserved' && (
                                    <button
                                        onClick={() => onAction('seat-guest', table)}
                                        className="
                                            flex-1 py-2.5 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/40
                                            text-amber-655 dark:text-amber-400 text-sm font-semibold rounded-xl
                                            transition-colors flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-white
                                        "
                                    >
                                        <Users size={14} />
                                        Seat Guest
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'transfer' && (
                        <div className="space-y-4">
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Transfer <span className="text-slate-850 dark:text-white font-semibold">{table.name}</span> to another table:
                            </p>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {availableTables.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => { onAction('transfer', { ...table, transferTo: t.name }); }}
                                        className="
                                            w-full flex items-center gap-3 p-3
                                            bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/40 dark:hover:bg-slate-700
                                            border border-slate-200 dark:border-slate-600/40 hover:border-indigo-500/40
                                            rounded-xl transition-colors text-left
                                        "
                                    >
                                        <Table2 size={16} className="text-indigo-650 dark:text-indigo-400 flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-slate-855 dark:text-white text-sm font-medium">{t.name}</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs">{t.seats} seats · {t.type.replace('-', ' ')}</p>
                                        </div>
                                        <ArrowRightLeft size={14} className="text-slate-400" />
                                    </button>
                                ))}
                            </div>
                            {availableTables.length === 0 && (
                                <p className="text-slate-500 text-sm text-center py-8">No available tables</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'merge' && (
                        <div className="space-y-4">
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                Merge <span className="text-slate-855 dark:text-white font-semibold">{table.name}</span> with another table:
                            </p>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {INITIAL_TABLES.filter((t) => t.status === 'occupied' && t.id !== table.id)
                                    .map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => { onAction('merge', { ...table, mergeWith: t.name }); }}
                                            className="
                                                w-full flex items-center gap-3 p-3
                                                bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/40 dark:hover:bg-slate-700
                                                border border-slate-200 dark:border-slate-600/40 hover:border-violet-500/40
                                                rounded-xl transition-colors text-left
                                            "
                                        >
                                            <div className="
                                                w-8 h-8 bg-red-500/10 dark:bg-red-500/20 rounded-lg
                                                flex items-center justify-center flex-shrink-0
                                            ">
                                                <span className="text-red-655 dark:text-red-400 text-xs font-bold">{t.name}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-slate-855 dark:text-white text-sm font-medium">{t.name} — {t.customer}</p>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs">{t.seats} seats</p>
                                            </div>
                                            <Merge size={14} className="text-slate-400" />
                                        </button>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="
                    px-6 py-4 border-t border-slate-200 dark:border-slate-700/60
                    flex items-center justify-end gap-2
                    bg-white dark:bg-slate-800
                ">
                    <button
                        onClick={onClose}
                        className="
                            px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white
                            text-sm font-medium rounded-xl
                            transition-colors
                        "
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Tables Component ───────────────────────────────────────────────────

export default function Tables() {
    const [selectedTable, setSelectedTable] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const handleAction = useCallback((action, data) => {
        setSelectedTable(null);
        switch (action) {
            case 'take-order':
                showToast(`Order started at ${data.name}`);
                break;
            case 'add-bill':
                showToast(`Payment added to ${data.name}`);
                break;
            case 'close-table':
                showToast(`${data.name} has been closed`);
                break;
            case 'seat-guest':
                showToast(`${data.customer} seated at ${data.name}`);
                break;
            case 'transfer':
                showToast(`${data.name} → ${data.transferTarget}`);
                break;
            case 'merge':
                showToast(`${data.name} merged with ${data.mergeWith}`);
                break;
            default:
                break;
        }
    }, [showToast]);

    const stats = {
        available: INITIAL_TABLES.filter((t) => t.status === 'available').length,
        occupied: INITIAL_TABLES.filter((t) => t.status === 'occupied').length,
        reserved: INITIAL_TABLES.filter((t) => t.status === 'reserved').length,
        total: INITIAL_TABLES.length,
    };

    return (
        <POSLayout>
            <Head title="Table Management" />

            <div className="flex flex-col h-full">
                {/* Header */}
                <header className="
                    px-6 py-4 bg-white/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/60
                    flex items-center justify-between flex-shrink-0
                    backdrop-blur-sm
                ">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-violet-650 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <Table2 size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-855 dark:text-white">Table Management</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Floor plan & reservations</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4">
                        {[
                            { label: 'Available', count: stats.available, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
                            { label: 'Occupied', count: stats.occupied, color: 'text-red-655 dark:text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
                            { label: 'Reserved', count: stats.reserved, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${stat.bg} ${stat.border}`}
                            >
                                <span className={`text-xs font-semibold ${stat.color}`}>{stat.label}</span>
                                <span className={`text-sm font-bold ${stat.color}`}>{stat.count}</span>
                            </div>
                        ))}
                        <button
                            onClick={() => showToast('Floor plan refreshed')}
                            className="
                                text-slate-450 hover:text-slate-900 dark:hover:text-white
                                w-8 h-8 rounded-lg flex items-center justify-center
                                hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors
                            "
                        >
                            <RefreshCw size={16} />
                        </button>
                    </div>
                </header>

                {/* Floor plan */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {/* Legend */}
                    <div className="flex items-center gap-6 mb-6">
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                            const Icon = config.icon;
                            return (
                                <div key={key} className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${config.dot}`} />
                                    <span className="text-slate-500 dark:text-slate-400 text-xs">{config.label}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Floor layout */}
                    <div className="bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/40 rounded-2xl p-6 shadow-sm">
                        {/* Kitchen label */}
                        <div className="
                            mb-4 px-4 py-2 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600/40
                            rounded-xl text-center
                        ">
                            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                                <ChefHat size={12} className="inline mr-1 -mt-0.5" />
                                Kitchen
                            </span>
                        </div>

                        <div className="space-y-3">
                            {TABLE_LAYOUT.map((row, rowIdx) => (
                                <div key={rowIdx} className="flex gap-3 justify-center">
                                    {row.map((tableId) => {
                                        const table = INITIAL_TABLES.find((t) => t.id === tableId);
                                        if (!table) return <div key={tableId} className="w-36" />;
                                        return (
                                            <div key={tableId} className="w-36 flex justify-center">
                                                <TableCard table={table} onClick={setSelectedTable} />
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Entrance */}
                        <div className="
                            mt-4 px-4 py-2 bg-slate-50 dark:bg-slate-700/20 border border-dashed border-slate-200 dark:border-slate-600/30
                            rounded-xl text-center
                        ">
                            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                                Entrance
                            </span>
                        </div>
                    </div>

                    {/* Legend for table types */}
                    <div className="mt-6 flex flex-wrap gap-4 justify-center">
                        {[
                            { label: '2-Top', color: 'bg-slate-400 dark:bg-slate-600' },
                            { label: '4-Top', color: 'bg-slate-500' },
                            { label: '6-Top', color: 'bg-slate-600 dark:bg-slate-400' },
                            { label: '8-Top', color: 'bg-slate-700 dark:bg-slate-300' },
                            { label: 'Bar', color: 'bg-violet-650' },
                            { label: 'Patio', color: 'bg-emerald-600' },
                            { label: 'Private', color: 'bg-amber-600' },
                        ].map((type) => (
                            <div key={type.label} className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded ${type.color}`} />
                                <span className="text-slate-500 dark:text-slate-400 text-xs">{type.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedTable && (
                <ActionModal
                    table={selectedTable}
                    onClose={() => setSelectedTable(null)}
                    onAction={handleAction}
                />
            )}

            {/* Toast */}
            {toast && (
                <div className="
                    fixed bottom-6 right-6 z-50
                    bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800
                    text-slate-855 dark:text-white text-sm font-medium
                    px-4 py-3 rounded-xl
                    shadow-2xl
                    flex items-center gap-2
                ">
                    {toast.type === 'success' ? (
                        <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" />
                    ) : (
                        <AlertCircle size={16} className="text-amber-500 dark:text-amber-400" />
                    )}
                    {toast.message}
                </div>
            )}
        </POSLayout>
    );
}
