import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
    BarChart3,
    Calendar,
    Download,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    FileText,
    Percent,
    Clock,
} from 'lucide-react';
import POSLayout from '@/Layouts/POSLayout';

const SALES_DATA = {
    today: [
        { hour: '10AM', orders: 12, revenue: 8400 },
        { hour: '11AM', orders: 24, revenue: 18200 },
        { hour: '12PM', orders: 38, revenue: 31500 },
        { hour: '1PM',  orders: 42, revenue: 35600 },
        { hour: '2PM',  orders: 28, revenue: 22400 },
        { hour: '3PM',  orders: 15, revenue: 11200 },
        { hour: '4PM',  orders: 8,  revenue: 5600 },
        { hour: '5PM',  orders: 18, revenue: 14400 },
        { hour: '6PM',  orders: 35, revenue: 29800 },
        { hour: '7PM',  orders: 45, revenue: 38200 },
        { hour: '8PM',  orders: 40, revenue: 34000 },
        { hour: '9PM',  orders: 22, revenue: 17600 },
    ],
    week: [
        { day: 'Mon', orders: 124, revenue: 98000, cost: 42000 },
        { day: 'Tue', orders: 138, revenue: 112000, cost: 48000 },
        { day: 'Wed', orders: 109, revenue: 89000, cost: 38000 },
        { day: 'Thu', orders: 167, revenue: 134000, cost: 56000 },
        { day: 'Fri', orders: 219, revenue: 178000, cost: 72000 },
        { day: 'Sat', orders: 268, revenue: 215000, cost: 89000 },
        { day: 'Sun', orders: 245, revenue: 198000, cost: 82000 },
    ],
    month: [
        { week: 'W1', orders: 580, revenue: 468000, cost: 195000 },
        { week: 'W2', orders: 620, revenue: 502000, cost: 208000 },
        { week: 'W3', orders: 595, revenue: 481000, cost: 199000 },
        { week: 'W4', orders: 640, revenue: 528000, cost: 218000 },
    ],
};

const PAYMENT_BREAKDOWN = [
    { method: 'Card', amount: 85400, pct: 60 },
    { method: 'Cash', amount: 42700, pct: 30 },
    { method: 'QR Code', amount: 14200, pct: 10 },
];

export default function Reports() {
    const [period, setPeriod] = useState('today');

    const data = SALES_DATA[period];

    const totals = useMemo(() => {
        const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);
        const totalOrders = data.reduce((s, d) => s + d.orders, 0);
        const totalCost = period !== 'today' ? data.reduce((s, d) => s + (d.cost || 0), 0) : Math.round(totalRevenue * 0.38);
        const profit = totalRevenue - totalCost;
        const profitMargin = ((profit / totalRevenue) * 100).toFixed(1);
        const avgOrder = Math.round(totalRevenue / totalOrders);
        const peak = data.reduce((a, b) => a.revenue > b.revenue ? a : b);
        return { totalRevenue, totalOrders, totalCost, profit, profitMargin, avgOrder, peak };
    }, [data, period]);

    const maxRevenue = Math.max(...data.map(d => d.revenue));

    return (
        <POSLayout>
            <Head title="Reports" />
            <div className="flex flex-col h-full">
                {/* Header */}
                <header className="px-6 py-4 bg-white/80 dark:bg-slate-800/80 border-b border-slate-205 dark:border-slate-700/60 flex items-center justify-between flex-shrink-0 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-violet-650 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <BarChart3 size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-855 dark:text-white">Reports</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Financial & sales analytics</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/25">
                        <Download size={15} />
                        Export
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {/* Period Selector */}
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl p-0.5 shadow-sm">
                            {['today', 'week', 'month'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`
                                        px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                                        ${period === p
                                            ? 'bg-indigo-650 text-white shadow-md'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }
                                    `}
                                >
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <Calendar size={14} />
                            {period === 'today' && new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {period === 'week' && 'Jan 6 – Jan 12, 2024'}
                            {period === 'month' && 'January 2024'}
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                        {[
                            { label: 'Total Revenue', value: `LKR ${totals.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-indigo-650 dark:text-indigo-400', bg: 'bg-indigo-500/10', change: '+12.5%', up: true },
                            { label: 'Total Orders', value: totals.totalOrders.toString(), icon: ShoppingCart, color: 'text-emerald-650 dark:text-emerald-400', bg: 'bg-emerald-500/10', change: '+8.2%', up: true },
                            { label: 'Profit', value: `LKR ${totals.profit.toLocaleString()}`, icon: TrendingUp, color: 'text-violet-650 dark:text-violet-400', bg: 'bg-violet-500/10', change: `${totals.profitMargin}% margin`, up: true },
                            { label: 'Avg. Order', value: `LKR ${totals.avgOrder}`, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', change: '-2.1%', up: false },
                        ].map(({ label, value, icon: Icon, color, bg, change, up }) => (
                            <div key={label} className="bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700/60 rounded-xl p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
                                        <Icon size={16} className={color} />
                                    </div>
                                    <span className={`flex items-center gap-1 text-xs font-semibold ${up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-655 dark:text-red-400'}`}>
                                        {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                        {change}
                                    </span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">{label}</p>
                                <p className="text-slate-855 dark:text-white font-bold text-lg">{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                        {/* Revenue Chart */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 bg-indigo-500/15 rounded-lg flex items-center justify-center">
                                        <BarChart3 size={15} className="text-indigo-650 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-slate-855 dark:text-white font-bold text-sm">Revenue Trend</h2>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs">
                                            Peak: {totals.peak.hour || totals.peak.day || totals.peak.week} — LKR {totals.peak.revenue.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full">
                                {/* Value labels */}
                                <div className="flex items-end justify-between gap-1 mb-1">
                                    {data.map((d, i) => (
                                        <div key={i} className="flex-1 flex justify-center">
                                            <span className="text-[10px] text-slate-400 dark:text-slate-600 tabular-nums">
                                                {(d.revenue / 1000).toFixed(0)}k
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {/* Bars */}
                                <div className="flex items-end justify-between gap-1 h-40">
                                    {data.map((d, i) => {
                                        const height = (d.revenue / maxRevenue) * 100;
                                        const isPeak = d.revenue === totals.peak.revenue;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                <div className="w-full flex justify-center" style={{ height: '160px' }}>
                                                    <div
                                                        className={`
                                                            w-full max-w-[44px] rounded-t-md transition-all duration-500
                                                            ${isPeak
                                                                ? 'bg-gradient-to-t from-indigo-600 to-indigo-455 shadow-lg shadow-indigo-500/30'
                                                                : 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600'
                                                            }
                                                        `}
                                                        style={{ height: `${height}%` }}
                                                    />
                                                </div>
                                                <span className={`text-xs font-semibold whitespace-nowrap ${isPeak ? 'text-indigo-650 dark:text-indigo-400' : 'text-slate-450 dark:text-slate-500'}`}>
                                                    {d.hour || d.day || d.week}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Payment Breakdown */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-8 h-8 bg-emerald-500/15 rounded-lg flex items-center justify-center">
                                    <DollarSign size={15} className="text-emerald-650 dark:text-emerald-400" />
                                </div>
                                <h2 className="text-slate-855 dark:text-white font-bold text-sm">Payment Methods</h2>
                            </div>
                            <div className="space-y-4">
                                {PAYMENT_BREAKDOWN.map((pm) => (
                                    <div key={pm.method}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{pm.method}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-855 dark:text-white font-semibold text-sm tabular-nums">
                                                    LKR {pm.amount.toLocaleString()}
                                                </span>
                                                <span className="text-slate-500 dark:text-slate-450 text-xs w-8 text-right">{pm.pct}%</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-700/60 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-700"
                                                style={{ width: `${pm.pct}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700/40">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-slate-400 text-xs">Total Processed</span>
                                    <span className="text-slate-855 dark:text-white font-bold text-sm tabular-nums">
                                        LKR {totals.totalRevenue.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Cost Analysis + Top Items */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Cost vs Revenue */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center">
                                    <Percent size={15} className="text-amber-600 dark:text-amber-400" />
                                </div>
                                <h2 className="text-slate-855 dark:text-white font-bold text-sm">Cost vs Revenue</h2>
                            </div>
                            <div className="space-y-3">
                                {data.map((d, i) => {
                                    const costPct = d.cost ? ((d.cost / d.revenue) * 100).toFixed(0) : 38;
                                    return (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="text-slate-500 dark:text-slate-400 text-xs w-12 flex-shrink-0">{d.hour || d.day || d.week}</span>
                                            <div className="flex-1 flex gap-1 items-center">
                                                {d.cost && (
                                                    <div className="h-3 rounded-l-sm bg-red-500/50 dark:bg-red-500/60" style={{ width: `${costPct}%` }} />
                                                )}
                                                <div
                                                    className="h-3 rounded-r-sm bg-emerald-500/50 dark:bg-emerald-500/60 flex-1"
                                                    style={{ width: d.cost ? `${100 - costPct}%` : '100%' }}
                                                />
                                            </div>
                                            <span className="text-slate-500 dark:text-slate-405 text-xs w-16 text-right tabular-nums">
                                                {d.cost ? `${costPct}%` : '—'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/40">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-sm bg-red-500/60" />
                                    <span className="text-slate-550 dark:text-slate-400 text-xs">Cost ({(totals.totalCost / totals.totalRevenue * 100).toFixed(0)}%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-sm bg-emerald-500/60" />
                                    <span className="text-slate-550 dark:text-slate-400 text-xs">Profit ({totals.profitMargin}%)</span>
                                </div>
                            </div>
                        </div>

                        {/* Top Items by Revenue */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-8 h-8 bg-violet-500/15 rounded-lg flex items-center justify-center">
                                    <FileText size={15} className="text-violet-650 dark:text-violet-400" />
                                </div>
                                <h2 className="text-slate-855 dark:text-white font-bold text-sm">Top Items by Revenue</h2>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { name: 'Chicken Kottu', qty: 48, revenue: 40800, pct: 100 },
                                    { name: 'Lamprais', qty: 36, revenue: 34200, pct: 84 },
                                    { name: 'Fish Ambul Thiyal', qty: 29, revenue: 31900, pct: 78 },
                                    { name: 'Mutton Kottu', qty: 18, revenue: 21600, pct: 53 },
                                    { name: 'Hoppers (3 pcs)', qty: 24, revenue: 10800, pct: 26 },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-slate-400 dark:text-slate-650 text-xs font-mono w-4">{i + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-slate-855 dark:text-white text-sm font-medium truncate">{item.name}</p>
                                                <span className="text-indigo-650 dark:text-indigo-400 text-sm font-semibold tabular-nums ml-2">
                                                    LKR {item.revenue.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-700/60 rounded-full h-1.5">
                                                <div
                                                    className="bg-gradient-to-r from-violet-500 to-indigo-400 h-1.5 rounded-full"
                                                    style={{ width: `${item.pct}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-slate-500 dark:text-slate-450 text-xs w-12 text-right flex-shrink-0">{item.qty} sold</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </POSLayout>
    );
}
