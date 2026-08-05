import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import {
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    Users,
    DollarSign,
    UtensilsCrossed,
    AlertTriangle,
    ArrowUpRight,
    Flame,
    Star,
    Activity,
    Clock,
    ChefHat,
    Package,
    Zap,
    BarChart3,
    Percent,
} from 'lucide-react';
import POSLayout from '@/Layouts/POSLayout';

// ─── Data ─────────────────────────────────────────────────────────────────────

const WEEKLY_SALES = [
    { day: 'Mon', sales: 98000, orders: 124 },
    { day: 'Tue', sales: 112000, orders: 138 },
    { day: 'Wed', sales: 89000,  orders: 109 },
    { day: 'Thu', sales: 134000, orders: 167 },
    { day: 'Fri', sales: 178000, orders: 219 },
    { day: 'Sat', sales: 215000, orders: 268 },
    { day: 'Sun', sales: 198000, orders: 245 },
];

const PEAK_HOURS = [
    { hour: '10AM', traffic: 20 },
    { hour: '11AM', traffic: 45 },
    { hour: '12PM', traffic: 85 },
    { hour: '1PM',  traffic: 100 },
    { hour: '2PM',  traffic: 72 },
    { hour: '3PM',  traffic: 38 },
    { hour: '4PM',  traffic: 25 },
    { hour: '5PM',  traffic: 40 },
    { hour: '6PM',  traffic: 78 },
    { hour: '7PM',  traffic: 95 },
    { hour: '8PM',  traffic: 88 },
    { hour: '9PM',  traffic: 55 },
    { hour: '10PM', traffic: 30 },
];

const TOP_PRODUCTS = [
    { rank: 1, name: 'Chicken Kottu',          emoji: '🍛', qty: 48, revenue: 40800, pct: 92, trend: '+5.2%' },
    { rank: 2, name: 'Lamprais',                emoji: '📦', qty: 36, revenue: 34200, pct: 82, trend: '+2.1%' },
    { rank: 3, name: 'Fish Ambul Thiyal',       emoji: '🐠', qty: 29, revenue: 31900, pct: 71, trend: '+8.4%' },
    { rank: 4, name: 'Hoppers (3 pcs)',         emoji: '🥞', qty: 24, revenue: 10800, pct: 58, trend: '-1.3%' },
    { rank: 5, name: 'Mutton Kottu',            emoji: '🍖', qty: 18, revenue: 21600, pct: 44, trend: '+3.7%' },
    { rank: 6, name: 'Coconut Rice',            emoji: '🥥', qty: 15, revenue: 9000,  pct: 36, trend: '+1.1%' },
    { rank: 7, name: 'Cutlet (3 pcs)',          emoji: '🥟', qty: 12, revenue: 5400,  pct: 29, trend: '-0.5%' },
];

const RECENT_ORDERS = [
    { id: 'ORD-142', table: 'T5',  items: 6, total: 4200, status: 'paid',     method: 'Card', time: '2 min ago' },
    { id: 'ORD-141', table: 'T3',  items: 4, total: 2850, status: 'preparing', method: 'Cash', time: '5 min ago' },
    { id: 'ORD-140', table: 'T12', items: 8, total: 5600, status: 'paid',     method: 'Card', time: '12 min ago' },
    { id: 'ORD-139', table: 'T7',  items: 3, total: 3100, status: 'served',   method: 'Cash', time: '18 min ago' },
    { id: 'ORD-138', table: 'T1',  items: 2, total: 1700, status: 'paid',     method: 'Card', time: '25 min ago' },
    { id: 'ORD-137', table: 'T9',  items: 5, total: 3800, status: 'paid',     method: 'QR',   time: '32 min ago' },
    { id: 'ORD-136', table: 'T4',  items: 1, total: 850,  status: 'served',   method: 'Cash', time: '41 min ago' },
];

const STOCK_ALERTS = [
    { item: 'Rice (5kg)',      stock: 4, unit: 'bags', min: 10, urgency: 'medium' },
    { item: 'Coconut Milk',    stock: 6, unit: 'tins', min: 12, urgency: 'medium' },
    { item: 'Chilli Powder',   stock: 1, unit: 'kg',   min: 5,  urgency: 'high'   },
    { item: 'Lemon',           stock: 8, unit: 'pcs',  min: 15, urgency: 'medium' },
];

const STAFF_ON_DUTY = [
    { name: 'Amali Perera',         role: 'Cashier',     avatar: 'AP' },
    { name: 'Kamali Silva',         role: 'Cashier',     avatar: 'KS' },
    { name: 'Ravi Fernando',        role: 'Floor Attendant', avatar: 'RF' },
    { name: 'Nimal Jayawardena',    role: 'Chef',        avatar: 'NJ' },
];

const PERIOD_STATS = {
    today:  { sales: 142580, orders: 184, avgOrder: 775, guests: 523 },
    week:   { sales: 892340, orders: 1102, avgOrder: 810, guests: 3890 },
    month:  { sales: 3745200, orders: 4680, avgOrder: 800, guests: 16480 },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ stat }) {
    const Icon = stat.icon;
    return (
        <div className="
            bg-slate-800 border border-slate-700/60
            rounded-2xl p-4
            hover:border-slate-600/80 transition-all duration-200
            group hover:shadow-lg hover:shadow-indigo-500/5
            min-w-0
        ">
            <div className="flex items-center justify-between mb-3">
                <div className={`
                    w-10 h-10 rounded-xl
                    bg-gradient-to-br ${stat.color}
                    flex items-center justify-center shadow-lg
                    group-hover:scale-110 transition-transform duration-200
                    flex-shrink-0
                `}>
                    <Icon size={18} className="text-white" />
                </div>
                <span className={`
                    flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0
                    ${stat.up
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                        : 'text-red-400 bg-red-500/10 border border-red-500/20'
                    }
                `}>
                    {stat.up ? <ArrowUpRight size={12} /> : <TrendingDown size={12} />}
                    {stat.change}
                </span>
            </div>
            <p className="text-slate-400 text-xs mb-1 truncate">{stat.label}</p>
            <p className="text-white font-bold text-xl leading-tight truncate">{stat.value}</p>
            <p className="text-slate-500 text-xs mt-1 truncate">{stat.sub}</p>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        paid: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        preparing: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        served: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        pending: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    };
    return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${styles[status] || styles.paid}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

function MethodBadge({ method }) {
    const styles = {
        Card: 'bg-indigo-500/15 text-indigo-400',
        Cash: 'bg-emerald-500/15 text-emerald-400',
        QR: 'bg-violet-500/15 text-violet-400',
    };
    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap ${styles[method] || 'bg-slate-700 text-slate-400'}`}>
            {method}
        </span>
    );
}

// ─── Weekly Sales Bar Chart ───────────────────────────────────────────────────
function WeeklySalesChart() {
    const maxSales = Math.max(...WEEKLY_SALES.map(d => d.sales));
    const todayIdx = new Date().getDay() - 1;

    return (
        <div className="w-full">
            {/* Value labels row */}
            <div className="flex items-end justify-between gap-1 mb-1">
                {WEEKLY_SALES.map((day, i) => (
                    <div key={day.day} className="flex-1 flex justify-center">
                        <span className="text-[10px] text-slate-500 font-medium tabular-nums">
                            {(day.sales / 1000).toFixed(0)}k
                        </span>
                    </div>
                ))}
            </div>

            {/* Bars */}
            <div className="flex items-end justify-between gap-1 h-40">
                {WEEKLY_SALES.map((day, i) => {
                    const height = (day.sales / maxSales) * 100;
                    const isToday = i === todayIdx;
                    return (
                        <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full flex justify-center" style={{ height: '160px' }}>
                                <div
                                    className={`
                                        w-full max-w-[36px] rounded-t-md
                                        transition-all duration-500 ease-out
                                        ${isToday
                                            ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-lg shadow-indigo-500/30'
                                            : 'bg-slate-700 hover:bg-slate-600'
                                        }
                                    `}
                                    style={{ height: `${height}%` }}
                                />
                            </div>
                            <span className={`text-xs font-semibold whitespace-nowrap ${isToday ? 'text-indigo-400' : 'text-slate-500'}`}>
                                {day.day}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Peak Hours Chart ─────────────────────────────────────────────────────────
function PeakHoursChart() {
    const maxTraffic = Math.max(...PEAK_HOURS.map(d => d.traffic));

    return (
        <div className="w-full">
            {/* Value labels row */}
            <div className="flex items-end justify-between gap-0.5 mb-1">
                {PEAK_HOURS.map((h) => (
                    <div key={h.hour} className="flex-1 flex justify-center">
                        <span className="text-[10px] text-slate-600 tabular-nums">{h.traffic}</span>
                    </div>
                ))}
            </div>

            {/* Bars */}
            <div className="flex items-end justify-between gap-0.5 h-36">
                {PEAK_HOURS.map((hour) => {
                    const height = (hour.traffic / maxTraffic) * 100;
                    const isPeak = hour.traffic >= 80;
                    return (
                        <div key={hour.hour} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full flex justify-center" style={{ height: '140px' }}>
                                <div
                                    className={`
                                        w-full max-w-[28px] rounded-t-sm
                                        transition-all duration-300
                                        ${isPeak
                                            ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-lg shadow-amber-500/20'
                                            : 'bg-slate-700/80 hover:bg-indigo-600/60'
                                        }
                                    `}
                                    style={{ height: `${height}%` }}
                                />
                            </div>
                            <span className="text-[9px] text-slate-600 whitespace-nowrap">{hour.hour}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Revenue Donut ────────────────────────────────────────────────────────────
function RevenueDonut({ value, max, color, label, sub }) {
    const pct = (value / max) * 100;
    const circumference = 2 * Math.PI * 38;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-1.5">
            <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke="rgb(51,65,85)" strokeWidth="10" fill="none" />
                    <circle
                        cx="50" cy="50" r="38"
                        stroke={color}
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{pct.toFixed(0)}%</span>
                </div>
            </div>
            <p className="text-white text-xs font-semibold text-center leading-tight">{label}</p>
            <p className="text-slate-500 text-[10px] text-center leading-tight">{sub}</p>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
    const [period, setPeriod] = useState('today');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const t = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(t);
    }, []);

    const stats = PERIOD_STATS[period];
    const maxSales = Math.max(...WEEKLY_SALES.map(d => d.sales));

    const metricCards = [
        {
            label: "Today's Sales",
            value: `LKR ${stats.sales.toLocaleString()}`,
            change: '+12.5%',
            up: true,
            icon: DollarSign,
            color: 'from-indigo-500 to-violet-500',
            sub: `vs ${period === 'today' ? 'yesterday' : 'last period'}`,
        },
        {
            label: 'Total Orders',
            value: stats.orders.toString(),
            change: '+8.2%',
            up: true,
            icon: ShoppingCart,
            color: 'from-emerald-500 to-teal-500',
            sub: `${stats.guests.toLocaleString()} guests served`,
        },
        {
            label: 'Open Tables',
            value: '8 / 16',
            change: '50% occ.',
            up: true,
            icon: UtensilsCrossed,
            color: 'from-amber-500 to-orange-500',
            sub: '4 tables occupied',
        },
        {
            label: 'Low Stock Alerts',
            value: STOCK_ALERTS.length.toString(),
            change: 'Needs reorder',
            up: false,
            icon: AlertTriangle,
            color: 'from-red-500 to-rose-500',
            sub: `${STOCK_ALERTS.filter(s => s.urgency === 'high').length} critical`,
        },
    ];

    const cardColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
    const cardLabels = ['Food', 'Drinks', 'Takeaway', 'Events'];
    const cardValues = [85, 62, 45, 28];
    const cardSubs = ['LKR 121k', 'LKR 21k', 'LKR 6k', 'LKR 4k'];

    return (
        <POSLayout>
            <Head title="Dashboard" />

            <div className="flex flex-col h-full">
                {/* ── Header ──────────────────────────────────────── */}
                <header className="
                    px-6 py-3 bg-slate-800/80 border-b border-slate-700/60
                    flex items-center justify-between flex-shrink-0
                    backdrop-blur-sm
                ">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
                            <BarChart3 size={18} className="text-white" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-base font-bold text-white leading-tight">Dashboard</h1>
                            <p className="text-slate-400 text-xs leading-tight">
                                {currentTime.toLocaleDateString('en-US', {
                                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
                                })}
                                {' · '}
                                {currentTime.toLocaleTimeString('en-US', {
                                    hour: '2-digit', minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Period selector */}
                        <div className="flex bg-slate-700/60 rounded-lg p-0.5 border border-slate-600/40">
                            {['today', 'week', 'month'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`
                                        px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200
                                        ${period === p
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'text-slate-400 hover:text-white'
                                        }
                                    `}
                                >
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </button>
                            ))}
                        </div>

                        <span className="
                            hidden sm:flex items-center gap-1.5 text-emerald-400 text-xs font-medium
                            bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30
                        ">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            Open
                        </span>
                    </div>
                </header>

                {/* ── Scrollable content ──────────────────────────── */}
                <div className="flex-1 overflow-y-auto px-6 py-5">

                    {/* ── Metric Cards ──────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
                        {metricCards.map((stat) => (
                            <MetricCard key={stat.label} stat={stat} />
                        ))}
                    </div>

                    {/* ── Charts Row 1: Weekly Sales + Peak Hours ───── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                        {/* Weekly Sales Chart */}
                        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8 h-8 bg-indigo-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <BarChart3 size={15} className="text-indigo-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-white font-bold text-sm leading-tight">Weekly Sales</h2>
                                        <p className="text-slate-500 text-xs leading-tight truncate">
                                            LKR {(maxSales / 1000).toFixed(0)}k peak (Sat)
                                        </p>
                                    </div>
                                </div>
                                <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1 flex-shrink-0">
                                    <ArrowUpRight size={14} /> +18.3%
                                </span>
                            </div>
                            <WeeklySalesChart />
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-700/40">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
                                        <span className="text-slate-400 text-xs">This Week</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-sm bg-slate-700" />
                                        <span className="text-slate-400 text-xs">Prev</span>
                                    </div>
                                </div>
                                <span className="text-white text-sm font-bold tabular-nums">
                                    LKR {stats.sales.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Peak Hours Chart */}
                        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Zap size={15} className="text-amber-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-white font-bold text-sm leading-tight">Peak Hours</h2>
                                        <p className="text-slate-500 text-xs leading-tight truncate">
                                            1–2 PM & 7–8 PM busiest
                                        </p>
                                    </div>
                                </div>
                                <span className="text-amber-400 text-sm font-semibold flex-shrink-0">
                                    100% cap.
                                </span>
                            </div>
                            <PeakHoursChart />
                            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-700/40">
                                {[
                                    { label: 'Lunch Peak', time: '12–2 PM', pct: '85%' },
                                    { label: 'Dinner Peak', time: '7–9 PM', pct: '95%' },
                                ].map((peak) => (
                                    <div key={peak.label} className="flex items-center gap-2 flex-1 min-w-0">
                                        <span className="text-slate-400 text-xs flex-shrink-0">{peak.time}</span>
                                        <div className="flex-1 min-w-0 bg-slate-700/60 rounded-full h-1.5">
                                            <div
                                                className="bg-amber-500 h-1.5 rounded-full"
                                                style={{ width: peak.pct }}
                                            />
                                        </div>
                                        <span className="text-amber-400 text-xs font-semibold flex-shrink-0">{peak.pct}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Charts Row 2: Revenue Breakdown + Top Products ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                        {/* Revenue Breakdown */}
                        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5">
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-8 h-8 bg-violet-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Percent size={15} className="text-violet-400" />
                                </div>
                                <h2 className="text-white font-bold text-sm">Revenue Breakdown</h2>
                            </div>
                            <div className="flex flex-wrap justify-center gap-3 mb-5">
                                {cardLabels.map((label, i) => (
                                    <RevenueDonut
                                        key={label}
                                        value={cardValues[i]}
                                        max={100}
                                        color={cardColors[i]}
                                        label={label}
                                        sub={cardSubs[i]}
                                    />
                                ))}
                            </div>
                            <div className="pt-3 border-t border-slate-700/40 grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-slate-500 text-xs">Total Revenue</p>
                                    <p className="text-white font-bold text-sm tabular-nums">
                                        LKR {stats.sales.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs">Avg. Order</p>
                                    <p className="text-white font-bold text-sm tabular-nums">
                                        LKR {stats.avgOrder.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Top Selling Products */}
                        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/60 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Flame size={15} className="text-amber-400" />
                                    </div>
                                    <h2 className="text-white font-bold text-sm">Top Selling Products</h2>
                                </div>
                                <span className="text-slate-500 text-xs flex-shrink-0">Today</span>
                            </div>
                            <div className="space-y-3">
                                {TOP_PRODUCTS.map((product) => (
                                    <div key={product.rank} className="flex items-center gap-3 group">
                                        {/* Rank badge */}
                                        <span className={`
                                            w-6 h-6 rounded-lg flex items-center justify-center
                                            text-xs font-bold flex-shrink-0
                                            ${product.rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                                              product.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                                              product.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                                              'bg-slate-700/60 text-slate-500'}
                                        `}>
                                            {product.rank}
                                        </span>

                                        {/* Emoji */}
                                        <span className="text-lg flex-shrink-0">{product.emoji}</span>

                                        {/* Name + bar */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-white text-sm font-medium truncate">
                                                    {product.name}
                                                </p>
                                                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                                    <span className="text-indigo-400 text-sm font-semibold tabular-nums whitespace-nowrap">
                                                        LKR {product.revenue.toLocaleString()}
                                                    </span>
                                                    <span className={`text-xs font-medium whitespace-nowrap ${product.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        {product.trend}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 min-w-0 bg-slate-700/60 rounded-full h-1.5">
                                                    <div
                                                        className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full transition-all duration-700"
                                                        style={{ width: `${product.pct}%` }}
                                                    />
                                                </div>
                                                <span className="text-slate-500 text-xs tabular-nums whitespace-nowrap w-12 text-right">
                                                    {product.qty} sold
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Bottom Row: Recent Orders + Kitchen + Staff ─── */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/60 rounded-2xl overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-slate-700/60 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 bg-blue-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock size={15} className="text-blue-400" />
                                    </div>
                                    <h2 className="text-white font-bold text-sm">Recent Orders</h2>
                                </div>
                                <span className="text-slate-500 text-xs flex-shrink-0">Last 30 min</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-700/40 text-left">
                                            {['Order ID', 'Table', 'Items', 'Total', 'Method', 'Status', 'Time'].map((h) => (
                                                <th key={h} className="px-5 py-2.5 text-slate-500 text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/40">
                                        {RECENT_ORDERS.map((order) => (
                                            <tr key={order.id} className="hover:bg-slate-700/20 transition-colors">
                                                <td className="px-5 py-3 text-slate-400 text-xs font-mono whitespace-nowrap">{order.id}</td>
                                                <td className="px-5 py-3 whitespace-nowrap">
                                                    <span className="
                                                        inline-flex items-center gap-1
                                                        bg-indigo-500/15 text-indigo-400
                                                        text-xs font-semibold px-2 py-0.5 rounded-full
                                                    ">
                                                        <UtensilsCrossed size={10} />
                                                        {order.table}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-slate-300 whitespace-nowrap">{order.items}</td>
                                                <td className="px-5 py-3 text-white font-semibold tabular-nums whitespace-nowrap">
                                                    LKR {order.total.toLocaleString()}
                                                </td>
                                                <td className="px-5 py-3 whitespace-nowrap"><MethodBadge method={order.method} /></td>
                                                <td className="px-5 py-3 whitespace-nowrap"><StatusBadge status={order.status} /></td>
                                                <td className="px-5 py-3 text-slate-500 text-xs whitespace-nowrap">{order.time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-5">
                            {/* Kitchen Load */}
                            <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5">
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <ChefHat size={15} className="text-amber-400" />
                                    </div>
                                    <h2 className="text-white font-bold text-sm">Kitchen Load</h2>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { label: 'New Orders', value: 3, max: 10, color: 'bg-blue-500' },
                                        { label: 'Preparing', value: 4, max: 10, color: 'bg-amber-500' },
                                        { label: 'Ready', value: 2, max: 10, color: 'bg-emerald-500' },
                                        { label: 'Served', value: 12, max: 15, color: 'bg-slate-500' },
                                    ].map((item) => (
                                        <div key={item.label}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-400 font-medium">{item.label}</span>
                                                <span className="text-white font-semibold">{item.value}/{item.max}</span>
                                            </div>
                                            <div className="w-full bg-slate-700/60 rounded-full h-2">
                                                <div
                                                    className={`${item.color} h-2 rounded-full transition-all duration-700`}
                                                    style={{ width: `${(item.value / item.max) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Customer Rating */}
                                <div className="mt-4 pt-4 border-t border-slate-700/40">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-slate-400 text-xs font-medium">Customer Rating</span>
                                        <span className="text-white font-bold flex items-center gap-1 text-sm">
                                            <Star size={13} className="text-amber-400 fill-amber-400" />
                                            4.8
                                        </span>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                size={13}
                                                className={s <= 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-slate-500 text-xs mt-1">142 reviews</p>
                                </div>
                            </div>

                            {/* Staff on Duty */}
                            <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5">
                                <div className="flex items-center gap-2.5 mb-4">
                                    <div className="w-8 h-8 bg-emerald-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Users size={15} className="text-emerald-400" />
                                    </div>
                                    <h2 className="text-white font-bold text-sm">Staff on Duty</h2>
                                    <span className="ml-auto text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex-shrink-0">
                                        {STAFF_ON_DUTY.length} active
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {STAFF_ON_DUTY.map((member) => (
                                        <div key={member.name} className="flex items-center gap-3">
                                            <div className="
                                                w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600
                                                flex items-center justify-center text-xs font-bold flex-shrink-0
                                            ">
                                                {member.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{member.name}</p>
                                                <p className="text-slate-500 text-xs truncate">{member.role}</p>
                                            </div>
                                            <span className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0 ring-2 ring-emerald-400/30" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Stock Alerts */}
                            <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 bg-red-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Package size={15} className="text-red-400" />
                                        </div>
                                        <h2 className="text-white font-bold text-sm">Stock Alerts</h2>
                                    </div>
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 flex-shrink-0">
                                        {STOCK_ALERTS.length} items
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {STOCK_ALERTS.map((alert, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <span className={`
                                                w-2 h-2 rounded-full flex-shrink-0
                                                ${alert.urgency === 'high' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}
                                            `} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{alert.item}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex-1 min-w-0 bg-slate-700/60 rounded-full h-1">
                                                        <div
                                                            className={`h-1 rounded-full ${alert.urgency === 'high' ? 'bg-red-500' : 'bg-amber-500'}`}
                                                            style={{ width: `${Math.min(100, (alert.stock / alert.min) * 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-slate-500 text-xs tabular-nums flex-shrink-0">{alert.stock}/{alert.min}</span>
                                                </div>
                                            </div>
                                            <span className={`
                                                text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0
                                                ${alert.urgency === 'high'
                                                    ? 'bg-red-500/15 text-red-400'
                                                    : 'bg-amber-500/15 text-amber-400'
                                                }
                                            `}>
                                                {alert.urgency === 'high' ? 'URGENT' : 'LOW'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </POSLayout>
    );
}
