import { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
    ChefHat,
    Clock,
    CheckCircle2,
    AlertCircle,
    Timer,
    Flame,
    Utensils,
    Zap,
} from 'lucide-react';
import POSLayout from '@/Layouts/POSLayout';

// ─── Mock KDS data ────────────────────────────────────────────────────────────
const STATUS_COLUMNS = [
    { id: 'new',       label: 'New',         color: 'blue',   bg: 'bg-blue-500/10',  border: 'border-blue-500/30',  dot: 'bg-blue-500' },
    { id: 'preparing', label: 'Preparing',   color: 'amber',  bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-500' },
    { id: 'ready',     label: 'Ready',       color: 'emerald',bg: 'bg-emerald-500/10',border: 'border-emerald-500/30',dot: 'bg-emerald-500' },
    { id: 'served',    label: 'Served',      color: 'slate',  bg: 'bg-slate-500/10', border: 'border-slate-500/30', dot: 'bg-slate-500' },
];

const INITIAL_ORDERS = [
    {
        id: 'KDS-001',
        table: 'T3',
        status: 'new',
        time: 3,
        items: [
            { name: 'Chicken Kottu', qty: 2, options: ['Extra spicy'] },
            { name: 'Coca-Cola', qty: 2, options: [] },
        ],
        priority: 'normal',
    },
    {
        id: 'KDS-002',
        table: 'T7',
        status: 'new',
        time: 1,
        items: [
            { name: 'Fish Ambul Thiyal', qty: 1, options: [] },
            { name: 'Red Rice & Curry', qty: 2, options: ['Less spicy'] },
            { name: 'Coconut Rice', qty: 1, options: [] },
        ],
        priority: 'high',
    },
    {
        id: 'KDS-003',
        table: 'T1',
        status: 'preparing',
        time: 8,
        items: [
            { name: 'Lamprais', qty: 2, options: [] },
            { name: 'Cutlet (3 pcs)', qty: 1, options: [] },
        ],
        priority: 'normal',
    },
    {
        id: 'KDS-004',
        table: 'T5',
        status: 'preparing',
        time: 5,
        items: [
            { name: 'Chicken Curry Rice', qty: 1, options: [] },
            { name: 'Hoppers (3 pcs)', qty: 2, options: ['Extra egg'] },
        ],
        priority: 'normal',
    },
    {
        id: 'KDS-005',
        table: 'T2',
        status: 'ready',
        time: 12,
        items: [
            { name: 'Mutton Kottu', qty: 1, options: [] },
            { name: 'Fresh Lime Soda', qty: 1, options: [] },
        ],
        priority: 'normal',
    },
    {
        id: 'KDS-006',
        table: 'T9',
        status: 'new',
        time: 0,
        items: [
            { name: 'Prawn Curry Rice', qty: 1, options: ['Extra prawn'] },
            { name: 'Momo (6 pcs)', qty: 1, options: [] },
            { name: 'Ceylon Tea', qty: 2, options: [] },
        ],
        priority: 'high',
    },
    {
        id: 'KDS-007',
        table: 'T4',
        status: 'served',
        time: 18,
        items: [
            { name: 'Veg Kottu', qty: 1, options: [] },
            { name: 'Coconut Water', qty: 1, options: [] },
        ],
        priority: 'normal',
    },
    {
        id: 'KDS-008',
        table: 'T6',
        status: 'preparing',
        time: 6,
        items: [
            { name: 'Jaffna Crab Curry', qty: 1, options: [] },
            { name: 'Red Rice & Curry', qty: 1, options: [] },
            { name: 'Watalappan', qty: 2, options: [] },
        ],
        priority: 'normal',
    },
];

const STATUS_FLOW = { new: 'preparing', preparing: 'ready', ready: 'served', served: 'served' };

function formatTime(minutes) {
    return `${minutes}m`;
}

function getPriorityColor(priority) {
    return priority === 'high' ? 'text-red-400' : 'text-slate-500';
}

function getPriorityIcon(priority) {
    return priority === 'high' ? <AlertCircle size={14} className="text-red-400" /> : null;
}

function OrderCard({ order, onAdvance }) {
    const statusConfig = STATUS_COLUMNS.find((s) => s.id === order.status);
    const isOverdue = order.time > 10 && order.status !== 'served';

    return (
        <div className={`
            bg-slate-800 border rounded-xl p-4
            transition-all duration-200 hover:shadow-lg
            ${isOverdue
                ? 'border-red-500/50 shadow-red-500/10'
                : order.status === 'new'
                ? `${statusConfig?.border || 'border-slate-700'} shadow-lg`
                : 'border-slate-700/60'
            }
        `}>
            {/* Card header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">{order.id}</span>
                    {order.priority === 'high' && (
                        <span className="flex items-center gap-1 text-red-400 text-xs font-medium bg-red-500/10 px-2 py-0.5 rounded-full">
                            <AlertCircle size={12} />
                            HIGH
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-slate-400 text-xs bg-slate-700/60 px-2 py-1 rounded-lg">
                        <Clock size={12} />
                        {formatTime(order.time)}
                    </span>
                    {isOverdue && (
                        <span className="flex items-center gap-1 text-red-400 text-xs bg-red-500/10 px-2 py-1 rounded-lg animate-pulse">
                            <Timer size={12} />
                            OVERDUE
                        </span>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="mb-3">
                <span className="
                    inline-flex items-center gap-1.5
                    bg-indigo-500/15 text-indigo-400
                    text-xs font-semibold px-2.5 py-1 rounded-lg
                ">
                    <Utensils size={12} />
                    Table {order.table}
                </span>
            </div>

            {/* Items */}
            <div className="space-y-1.5 mb-4">
                {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                        <span className="bg-slate-700/60 text-slate-300 text-xs font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                            {item.qty}
                        </span>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{item.name}</p>
                            {item.options.length > 0 && (
                                <p className="text-slate-500 text-xs truncate">
                                    {item.options.map((o) => `• ${o}`).join(' ')}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Action button */}
            {order.status !== 'served' && (
                <button
                    onClick={() => onAdvance(order.id)}
                    className={`
                        w-full py-2.5 rounded-xl text-sm font-semibold
                        transition-all duration-200 active:scale-[.97]
                        ${statusConfig?.bg}
                        ${statusConfig?.color === 'blue' ? 'text-blue-400 hover:bg-blue-500/20 border border-blue-500/30' : ''}
                        ${statusConfig?.color === 'amber' ? 'text-amber-400 hover:bg-amber-500/20 border border-amber-500/30' : ''}
                        ${statusConfig?.color === 'emerald' ? 'text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30' : ''}
                    `}
                >
                    <span className="flex items-center justify-center gap-2">
                        <CheckCircle2 size={14} />
                        Mark as {STATUS_COLUMNS[STATUS_COLUMNS.indexOf(statusConfig) + 1]?.label || 'Complete'}
                    </span>
                </button>
            )}

            {order.status === 'served' && (
                <div className="flex items-center justify-center gap-2 text-slate-500 text-sm py-2.5">
                    <CheckCircle2 size={14} />
                    Served
                </div>
            )}
        </div>
    );
}

function KanbanColumn({ column, orders, onAdvance, totalOrders }) {
    const count = orders.filter((o) => o.status === column.id).length;

    return (
        <div className="flex flex-col min-w-0">
            {/* Column header */}
            <div className={`
                flex items-center gap-2.5 px-4 py-3 mb-3
                ${column.bg} border ${column.border}
                rounded-xl
            `}>
                <span className={`w-2 h-2 rounded-full ${column.dot}`} />
                <span className="text-white font-bold text-sm flex-1">{column.label}</span>
                <span className={`
                    text-xs font-bold px-2 py-0.5 rounded-full
                    ${column.id === 'new' ? 'bg-blue-500/20 text-blue-400' : ''}
                    ${column.id === 'preparing' ? 'bg-amber-500/20 text-amber-400' : ''}
                    ${column.id === 'ready' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                    ${column.id === 'served' ? 'bg-slate-500/20 text-slate-400' : ''}
                `}>
                    {count}
                </span>
            </div>

            {/* Orders */}
            <div className="flex-1 space-y-3 overflow-y-auto">
                {orders.filter((o) => o.status === column.id).length === 0 ? (
                    <div className="
                        flex flex-col items-center justify-center py-12
                        text-slate-600 border border-dashed border-slate-700/60
                        rounded-xl
                    ">
                        <ChefHat size={28} strokeWidth={1.5} />
                        <p className="text-xs mt-2">No orders</p>
                    </div>
                ) : (
                    orders
                        .filter((o) => o.status === column.id)
                        .map((order) => (
                            <OrderCard key={order.id} order={order} onAdvance={onAdvance} />
                        ))
                )}
            </div>
        </div>
    );
}

// ─── Main KDS Component ──────────────────────────────────────────────────────

export default function KDS() {
    const [orders, setOrders] = useState(INITIAL_ORDERS);
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    // Simulate timer ticking
    useEffect(() => {
        const interval = setInterval(() => {
            setOrders((prev) =>
                prev.map((o) =>
                    o.status !== 'served' ? { ...o, time: o.time + 1 } : o
                )
            );
            setLastUpdate(Date.now());
        }, 60000); // every minute
        return () => clearInterval(interval);
    }, []);

    const advanceOrder = (orderId) => {
        setOrders((prev) =>
            prev.map((o) => {
                if (o.id !== orderId) return o;
                const nextStatus = STATUS_FLOW[o.status];
                return nextStatus ? { ...o, status: nextStatus } : o;
            })
        );
        setLastUpdate(Date.now());
    };

    const newOrders = orders.filter((o) => o.status === 'new').length;
    const preparingOrders = orders.filter((o) => o.status === 'preparing').length;
    const readyOrders = orders.filter((o) => o.status === 'ready').length;
    const servedOrders = orders.filter((o) => o.status === 'served').length;

    return (
        <POSLayout>
            <Head title="Kitchen Display (KDS)" />

            <div className="flex flex-col h-full">
                {/* Header */}
                <header className="
                    px-6 py-4 bg-slate-800/80 border-b border-slate-700/60
                    flex items-center justify-between flex-shrink-0
                    backdrop-blur-sm
                ">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <ChefHat size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">Kitchen Display System</h1>
                            <p className="text-slate-400 text-xs mt-0.5">Real-time order tracking</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3">
                        {[
                            { label: 'New', count: newOrders, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
                            { label: 'Preparing', count: preparingOrders, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
                            { label: 'Ready', count: readyOrders, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
                            { label: 'Served', count: servedOrders, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium ${stat.color}`}
                            >
                                <span>{stat.label}</span>
                                <span className="font-bold">{stat.count}</span>
                            </div>
                        ))}
                    </div>
                </header>

                {/* Kanban Board */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden">
                    <div className="
                        flex gap-4 p-6 h-full
                        min-w-max
                    ">
                        {STATUS_COLUMNS.map((column) => (
                            <div key={column.id} className="flex flex-col w-72">
                                <KanbanColumn
                                    column={column}
                                    orders={orders}
                                    onAdvance={advanceOrder}
                                    totalOrders={orders.length}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer className="
                    px-6 py-2 bg-slate-800/60 border-t border-slate-700/40
                    flex items-center justify-between text-xs text-slate-500
                    flex-shrink-0
                ">
                    <span>
                        Total Orders: <span className="text-white font-semibold">{orders.length}</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <Zap size={12} className="text-indigo-400" />
                        Auto-refreshing every minute
                    </span>
                </footer>
            </div>
        </POSLayout>
    );
}
