import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeProvider';
import {
    TrendingDown,
    ShoppingCart,
    Users,
    DollarSign,
    UtensilsCrossed,
    AlertTriangle,
    ArrowUpRight,
    Flame,
    Star,
    Clock,
    ChefHat,
    Package,
    Zap,
    BarChart3,
    Percent,
    Sun,
    Moon,
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
    { name: 'Amali Perera',         role: 'Cashier',        avatar: 'AP' },
    { name: 'Kamali Silva',         role: 'Cashier',        avatar: 'KS' },
    { name: 'Ravi Fernando',        role: 'Floor Attendant', avatar: 'RF' },
    { name: 'Nimal Jayawardena',    role: 'Chef',           avatar: 'NJ' },
];

const PERIOD_STATS = {
    today:  { sales: 142580, orders: 184, avgOrder: 775, guests: 523 },
    week:   { sales: 892340, orders: 1102, avgOrder: 810, guests: 3890 },
    month:  { sales: 3745200, orders: 4680, avgOrder: 800, guests: 16480 },
};

const cardColors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
const cardLabels = ['Food', 'Drinks', 'Takeaway', 'Events'];
const cardValues = [85, 62, 45, 28];
const cardSubs = ['LKR 121k', 'LKR 21k', 'LKR 6k', 'LKR 4k'];

// ─── CSS keyframes ────────────────────────────────────────────────────────────
const DASHBOARD_STYLES = `
    @keyframes fg-kpi-in {
        from { opacity: 0; transform: translateY(16px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }
    @keyframes fg-chart-in {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fg-row-in {
        from { opacity: 0; transform: translateX(-8px); }
        to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes fg-pulse-soft {
        0%, 100% { opacity: .4; }
        50%       { opacity: .8; }
    }
    @keyframes fg-bar-grow {
        from { transform: scaleY(0); }
        to   { transform: scaleY(1); }
    }
    .fg-kpi-1 { animation: fg-kpi-in .55s cubic-bezier(.22,1,.36,1) .05s both; }
    .fg-kpi-2 { animation: fg-kpi-in .55s cubic-bezier(.22,1,.36,1) .10s both; }
    .fg-kpi-3 { animation: fg-kpi-in .55s cubic-bezier(.22,1,.36,1) .15s both; }
    .fg-kpi-4 { animation: fg-kpi-in .55s cubic-bezier(.22,1,.36,1) .20s both; }
    .fg-chart { animation: fg-chart-in .6s cubic-bezier(.22,1,.36,1) .25s both; }
    .fg-row   { animation: fg-row-in   .4s cubic-bezier(.22,1,.36,1) both; }
    .fg-row-1 { animation-delay: .35s; }
    .fg-row-2 { animation-delay: .40s; }
    .fg-row-3 { animation-delay: .45s; }
    .fg-row-4 { animation-delay: .50s; }
    .fg-row-5 { animation-delay: .55s; }
    .fg-row-6 { animation-delay: .60s; }
    .fg-row-7 { animation-delay: .65s; }
    .fg-pulse-soft { animation: fg-pulse-soft 3s ease-in-out infinite; }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({ stat, delay, dark }) {
    const Icon = stat.icon;
    const base = dark
        ? 'bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 hover:border-indigo-500/40 shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-indigo-500/10'
        : 'bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10';
    const textLabel = dark ? 'text-slate-400' : 'text-slate-500';
    const textValue = dark ? 'text-white' : 'text-slate-900';
    const textSub = dark ? 'text-slate-500' : 'text-slate-400';
    const accentLine = dark
        ? 'bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent'
        : 'bg-gradient-to-r from-transparent via-indigo-300 to-transparent';
    const trendBadge = stat.up
        ? dark
            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_14px_-4px] shadow-emerald-500/40'
            : 'text-emerald-600 bg-emerald-50 border-emerald-200'
        : dark
            ? 'text-red-400 bg-red-500/10 border-red-500/20 shadow-[0_0_14px_-4px] shadow-red-500/40'
            : 'text-red-600 bg-red-50 border-red-200';

    return (
        <div
            className={[
                `fg-kpi-${delay + 1}`,
                'relative overflow-hidden rounded-2xl p-6',
                'transition-all duration-300 hover:-translate-y-0.5',
                base,
            ].join(' ')}
        >
            <div className={`absolute inset-x-4 top-0 h-px ${accentLine}`} />
            <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20 ${stat.glowColor}`} />

            <div className="flex items-center justify-between mb-3 relative">
                <div className={`
                    w-11 h-11 rounded-xl bg-gradient-to-br ${stat.color}
                    flex items-center justify-center shadow-lg shadow-black/20
                    transition-transform duration-300 hover:scale-110
                    flex-shrink-0
                `}>
                    <Icon size={18} className="text-white" />
                </div>
                <span className={`
                    flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0
                    ${trendBadge}
                `}>
                    {stat.up ? <ArrowUpRight size={12} /> : <TrendingDown size={12} />}
                    {stat.change}
                </span>
            </div>
            <p className={`${textLabel} text-xs mb-1 truncate relative`}>{stat.label}</p>
            <p className={`${textValue} font-bold text-2xl leading-tight truncate relative`}>{stat.value}</p>
            <p className={`${textSub} text-xs mt-1 truncate relative`}>{stat.sub}</p>
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
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap bg-clip-padding ${styles[status] || styles.paid}`}>
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

// ─── Card wrapper (theme-aware glass) ────────────────────────────────────────
function Card({ children, className = '', dark }) {
    return (
        <div
            className={[
                'rounded-2xl p-6 transition-all duration-300',
                dark
                    ? 'bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 hover:border-indigo-500/40 shadow-xl shadow-black/40'
                    : 'bg-white border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10',
                className,
            ].join(' ')}
        >
            {children}
        </div>
    );
}

// ─── Weekly Sales Bar Chart ───────────────────────────────────────────────────
function WeeklySalesChart({ dark }) {
    const maxSales = Math.max(...WEEKLY_SALES.map(d => d.sales));
    const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    const valueColor = dark ? 'text-slate-500' : 'text-slate-400';
    const dayColor = dark ? 'text-slate-500' : 'text-slate-400';
    const todayDayColor = 'text-indigo-500';
    const barBase = dark ? 'bg-slate-700/60 hover:bg-indigo-600/60' : 'bg-slate-200 hover:bg-indigo-400';

    return (
        <div className="w-full">
            <div className="flex items-end justify-between gap-1 mb-2">
                {WEEKLY_SALES.map((day, i) => (
                    <div key={day.day} className="flex-1 flex justify-center">
                        <span className={`text-[10px] font-medium tabular-nums ${i === todayIdx ? todayDayColor : valueColor}`}>
                            {(day.sales / 1000).toFixed(0)}k
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex items-end justify-between gap-1 h-40">
                {WEEKLY_SALES.map((day, i) => {
                    const height = (day.sales / maxSales) * 100;
                    const isToday = i === todayIdx;
                    return (
                        <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full flex justify-center" style={{ height: '160px' }}>
                                <div
                                    className={`
                                        w-full max-w-[36px] rounded-t-md
                                        transition-all duration-500 ease-out
                                        ${isToday
                                            ? dark
                                                ? 'bg-gradient-to-t from-indigo-600 via-violet-600 to-violet-400 shadow-lg shadow-indigo-500/40'
                                                : 'bg-gradient-to-t from-indigo-600 via-violet-600 to-violet-400 shadow-md shadow-indigo-300/50'
                                            : `${barBase} transition-colors`
                                        }
                                    `}
                                    style={{
                                        height: `${height}%`,
                                        transformOrigin: 'bottom',
                                        animation: `fg-bar-grow .6s cubic-bezier(.22,1,.36,1) ${i * 0.06}s both`,
                                    }}
                                />
                            </div>
                            <span className={`text-xs font-semibold whitespace-nowrap ${isToday ? todayDayColor : dayColor}`}>
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
function PeakHoursChart({ dark }) {
    const maxTraffic = Math.max(...PEAK_HOURS.map(d => d.traffic));
    const valueColor = dark ? 'text-slate-600' : 'text-slate-400';
    const hourColor = dark ? 'text-slate-600' : 'text-slate-400';
    const barBase = dark ? 'bg-slate-700/60 hover:bg-amber-500/60' : 'bg-slate-200 hover:bg-amber-400';

    return (
        <div className="w-full">
            <div className="flex items-end justify-between gap-0.5 mb-1.5">
                {PEAK_HOURS.map((h) => (
                    <div key={h.hour} className="flex-1 flex justify-center">
                        <span className={`text-[9px] tabular-nums ${valueColor}`}>{h.traffic}</span>
                    </div>
                ))}
            </div>
            <div className="flex items-end justify-between gap-0.5 h-36">
                {PEAK_HOURS.map((hour, i) => {
                    const height = (hour.traffic / maxTraffic) * 100;
                    const isPeak = hour.traffic >= 80;
                    return (
                        <div key={hour.hour} className="flex-1 flex flex-col items-center gap-1.5">
                            <div className="w-full flex justify-center" style={{ height: '140px' }}>
                                <div
                                    className={`
                                        w-full max-w-[28px] rounded-t-sm
                                        transition-all duration-300
                                        ${isPeak
                                            ? dark
                                                ? 'bg-gradient-to-t from-amber-600 via-amber-500 to-amber-300 shadow-lg shadow-amber-500/30'
                                                : 'bg-gradient-to-t from-amber-500 via-amber-400 to-amber-300 shadow-md shadow-amber-300/40'
                                            : `${barBase} transition-colors`
                                        }
                                    `}
                                    style={{
                                        height: `${height}%`,
                                        transformOrigin: 'bottom',
                                        animation: `fg-bar-grow .6s cubic-bezier(.22,1,.36,1) ${(i + 7) * 0.05}s both`,
                                    }}
                                />
                            </div>
                            <span className={`text-[9px] whitespace-nowrap ${hourColor}`}>{hour.hour}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Revenue Donut ────────────────────────────────────────────────────────────
function RevenueDonut({ value, max, color, label, sub, dark }) {
    const pct = (value / max) * 100;
    const circumference = 2 * Math.PI * 38;
    const offset = circumference - (pct / 100) * circumference;
    const trackColor = dark ? 'rgb(51,65,85)' : 'rgb(226,232,240)';
    const textColor = dark ? 'text-white' : 'text-slate-900';
    const subColor = dark ? 'text-slate-500' : 'text-slate-400';

    return (
        <div className="flex flex-col items-center gap-1.5">
            <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" stroke={trackColor} strokeWidth="10" fill="none" />
                    <circle
                        cx="50" cy="50" r="38"
                        stroke={color}
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`${textColor} font-bold text-xs`}>{pct.toFixed(0)}%</span>
                </div>
            </div>
            <p className={`${textColor} text-xs font-semibold text-center leading-tight`}>{label}</p>
            <p className={`${subColor} text-[10px] text-center leading-tight`}>{sub}</p>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
    const [period, setPeriod] = useState('today');
    const [currentTime, setCurrentTime] = useState(new Date());
    const { isDarkMode: dark, toggleTheme } = useTheme();

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
            glowColor: 'bg-indigo-500',
            sub: `vs ${period === 'today' ? 'yesterday' : 'last period'}`,
        },
        {
            label: 'Total Orders',
            value: stats.orders.toString(),
            change: '+8.2%',
            up: true,
            icon: ShoppingCart,
            color: 'from-emerald-500 to-teal-500',
            glowColor: 'bg-emerald-500',
            sub: `${stats.guests.toLocaleString()} guests served`,
        },
        {
            label: 'Open Tables',
            value: '8 / 16',
            change: '50% occ.',
            up: true,
            icon: UtensilsCrossed,
            color: 'from-amber-500 to-orange-500',
            glowColor: 'bg-amber-500',
            sub: '4 tables occupied',
        },
        {
            label: 'Low Stock Alerts',
            value: STOCK_ALERTS.length.toString(),
            change: 'Needs reorder',
            up: false,
            icon: AlertTriangle,
            color: 'from-red-500 to-rose-500',
            glowColor: 'bg-red-500',
            sub: `${STOCK_ALERTS.filter(s => s.urgency === 'high').length} critical`,
        },
    ];

    const borderColor = dark ? 'border-slate-800/60' : 'border-slate-200';
    const divideColor = dark ? 'divide-slate-800/40' : 'divide-slate-100';
    const headerBg = dark ? 'bg-slate-900/80 border-slate-800/80' : 'bg-white/80 border-slate-200/80';
    const textPrimary = dark ? 'text-white' : 'text-slate-900';
    const textSecondary = dark ? 'text-slate-400' : 'text-slate-500';
    const textMuted = dark ? 'text-slate-500' : 'text-slate-400';
    const periodBg = dark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-slate-100 border-slate-200';
    const periodActiveBg = 'bg-indigo-600 text-white shadow-md';
    const periodInactiveText = dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700';
    const inputBg = dark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200';
    const rankBadge1 = dark ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-amber-100 text-amber-700 border border-amber-200';
    const rankBadge2 = dark ? 'bg-slate-400/20 text-slate-300 border border-slate-400/30' : 'bg-slate-200 text-slate-600 border border-slate-300';
    const rankBadge3 = dark ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-orange-100 text-orange-700 border border-orange-200';
    const rankBadgeOther = dark ? 'bg-slate-800/80 text-slate-500 border border-slate-700/60' : 'bg-slate-100 text-slate-500 border border-slate-200';
    const productAvatar = dark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-slate-100 border-slate-200';
    const progressBarBg = dark ? 'bg-slate-800/80' : 'bg-slate-100';
    const tableBg = dark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50';
    const tableBorder = dark ? 'border-slate-800/60' : 'border-slate-200';
    const tableRowBorder = dark ? 'divide-slate-800/40' : 'divide-slate-100';
    const tableHeaderBg = dark ? 'bg-slate-900/80' : 'bg-slate-50';
    const themeIconBg = dark ? 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-amber-400' : 'bg-white border-slate-200 text-slate-500 hover:text-indigo-600';
    const staffAvatarRing = dark ? 'ring-emerald-400/30' : 'ring-emerald-400/40';

    return (
        <>
            <style>{DASHBOARD_STYLES}</style>
            <POSLayout>
                <Head title="Dashboard" />

                <div className="flex flex-col h-full relative transition-colors duration-300">
                    {/* ── Ambient background glow ─────────────────────── */}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-32 -right-24 w-[480px] h-[480px] bg-indigo-600/10 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
                        <div className="absolute -bottom-24 -left-24 w-[420px] h-[420px] bg-violet-600/10 dark:bg-violet-500/10 rounded-full blur-[120px]" />
                        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-fuchsia-600/5 dark:bg-fuchsia-500/5 rounded-full blur-[100px]" />
                    </div>

                    {/* ── Header ──────────────────────────────────────── */}
                    <header className={`
                        relative z-10
                        px-6 py-3.5 ${headerBg} border-b flex items-center justify-between flex-shrink-0
                        backdrop-blur-2xl transition-colors duration-300
                    `}>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
                                <BarChart3 size={18} className="text-white" />
                            </div>
                            <div className="min-w-0">
                                <h1 className={`text-base font-semibold leading-tight ${textPrimary}`}>Dashboard</h1>
                                <p className={`text-xs leading-tight ${textMuted}`}>
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
                            {/* Theme toggle */}
                            <button
                                onClick={toggleTheme}
                                className={`
                                    flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium
                                    border transition-all duration-300
                                    ${themeIconBg}
                                `}
                                aria-label="Toggle theme"
                            >
                                {dark ? <Sun size={14} /> : <Moon size={14} />}
                                <span className="hidden sm:inline">{dark ? 'Light' : 'Dark'}</span>
                            </button>

                            {/* Period selector */}
                            <div className={`flex rounded-xl p-0.5 border ${periodBg} transition-colors duration-300`}>
                                {['today', 'week', 'month'].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPeriod(p)}
                                        className={`
                                            px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                                            ${period === p ? periodActiveBg : periodInactiveText}
                                        `}
                                    >
                                        {p.charAt(0).toUpperCase() + p.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <span className="
                                hidden sm:flex items-center gap-1.5 text-emerald-400 text-xs font-medium
                                bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30
                            ">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full fg-pulse-soft" />
                                Open
                            </span>
                        </div>
                    </header>

                    {/* ── Scrollable content ──────────────────────────── */}
                    <div className="flex-1 overflow-y-auto relative px-6 py-6 transition-colors duration-300">

                        {/* ── Metric Cards ──────────────────────────────── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
                            {metricCards.map((stat, i) => (
                                <MetricCard key={stat.label} stat={stat} delay={i} dark={dark} />
                            ))}
                        </div>

                        {/* ── Charts Row 1: Weekly Sales + Peak Hours ───── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                            {/* Weekly Sales Chart */}
                            <Card dark={dark} className="fg-chart">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className={`w-8 h-8 bg-indigo-500/15 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                            <BarChart3 size={15} className="text-indigo-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <h2 className={`${textPrimary} font-semibold text-sm leading-tight`}>Weekly Sales</h2>
                                            <p className={`${textMuted} text-xs leading-tight truncate`}>
                                                LKR {(maxSales / 1000).toFixed(0)}k peak (Sat)
                                            </p>
                                        </div>
                                    </div>
                                    <span className="flex items-center gap-1 text-emerald-400 text-sm font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex-shrink-0 shadow-[0_0_12px_-4px] shadow-emerald-500/40">
                                        <ArrowUpRight size={14} /> +18.3%
                                    </span>
                                </div>
                                <WeeklySalesChart dark={dark} />
                                <div className={`flex items-center justify-between mt-4 pt-3 border-t ${borderColor}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500 shadow-[0_0_8px_-1px] shadow-indigo-500" />
                                            <span className={textMuted}>This Week</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className={`w-2.5 h-2.5 rounded-sm ${dark ? 'bg-slate-700' : 'bg-slate-300'}`} />
                                            <span className={textMuted}>Prev</span>
                                        </div>
                                    </div>
                                    <span className={`${textPrimary} text-sm font-bold tabular-nums`}>
                                        LKR {stats.sales.toLocaleString()}
                                    </span>
                                </div>
                            </Card>

                            {/* Peak Hours Chart */}
                            <Card dark={dark} className="fg-chart">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Zap size={15} className="text-amber-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <h2 className={`${textPrimary} font-semibold text-sm leading-tight`}>Peak Hours</h2>
                                            <p className={`${textMuted} text-xs leading-tight truncate`}>
                                                1–2 PM & 7–8 PM busiest
                                            </p>
                                        </div>
                                    </div>
                                    <span className="flex items-center gap-1 text-amber-400 text-sm font-semibold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex-shrink-0 shadow-[0_0_12px_-4px] shadow-amber-500/30">
                                        <Zap size={12} /> 100% cap.
                                    </span>
                                </div>
                                <PeakHoursChart dark={dark} />
                                <div className={`flex items-center gap-4 mt-4 pt-3 border-t ${borderColor}`}>
                                    {[
                                        { label: 'Lunch Peak', time: '12–2 PM', pct: '85%' },
                                        { label: 'Dinner Peak', time: '7–9 PM', pct: '95%' },
                                    ].map((peak) => (
                                        <div key={peak.label} className="flex items-center gap-2 flex-1 min-w-0">
                                            <span className={`${textMuted} text-xs flex-shrink-0`}>{peak.time}</span>
                                            <div className={`flex-1 min-w-0 ${progressBarBg} rounded-full h-1.5`}>
                                                <div
                                                    className="bg-gradient-to-r from-amber-500 to-orange-400 h-1.5 rounded-full transition-all duration-700 shadow-[0_0_8px_-2px] shadow-amber-500"
                                                    style={{ width: peak.pct }}
                                                />
                                            </div>
                                            <span className="text-amber-400 text-xs font-semibold flex-shrink-0">{peak.pct}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* ── Charts Row 2: Revenue Breakdown + Top Products ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
                            {/* Revenue Breakdown */}
                            <Card dark={dark} className="fg-chart">
                                <div className="flex items-center gap-2.5 mb-5">
                                    <div className="w-8 h-8 bg-violet-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Percent size={15} className="text-violet-400" />
                                    </div>
                                    <h2 className={`${textPrimary} font-semibold text-sm`}>Revenue Breakdown</h2>
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
                                            dark={dark}
                                        />
                                    ))}
                                </div>
                                <div className={`pt-3 border-t ${borderColor} grid grid-cols-2 gap-3`}>
                                    <div>
                                        <p className={textMuted}>Total Revenue</p>
                                        <p className={`${textPrimary} font-bold text-sm tabular-nums`}>
                                            LKR {stats.sales.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={textMuted}>Avg. Order</p>
                                        <p className={`${textPrimary} font-bold text-sm tabular-nums`}>
                                            LKR {stats.avgOrder.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            {/* Top Selling Products */}
                            <Card dark={dark} className="lg:col-span-2 fg-chart">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Flame size={15} className="text-amber-400" />
                                        </div>
                                        <h2 className={`${textPrimary} font-semibold text-sm`}>Top Selling Products</h2>
                                    </div>
                                    <span className={textMuted}>Today</span>
                                </div>
                                <div className="space-y-3">
                                    {TOP_PRODUCTS.map((product, i) => (
                                        <div key={product.rank} className={`fg-row fg-row-${i + 1} flex items-center gap-3 group`}>
                                            {/* Rank badge */}
                                            <span className={`
                                                w-6 h-6 rounded-lg flex items-center justify-center
                                                text-xs font-bold flex-shrink-0
                                                ${product.rank === 1 ? rankBadge1 :
                                                  product.rank === 2 ? rankBadge2 :
                                                  product.rank === 3 ? rankBadge3 :
                                                  rankBadgeOther}
                                            `}>
                                                {product.rank}
                                            </span>

                                            {/* Product avatar */}
                                            <div className={`w-9 h-9 rounded-xl ${productAvatar} border flex items-center justify-center text-xl flex-shrink-0 group-hover:border-indigo-500/30 transition-colors duration-200`}>
                                                {product.emoji}
                                            </div>

                                            {/* Name + bar */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <p className={`${textPrimary} text-sm font-medium truncate`}>
                                                        {product.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                                        <span className="text-indigo-400 text-sm font-semibold tabular-nums whitespace-nowrap shadow-[0_0_10px_-2px] shadow-indigo-500/40">
                                                            LKR {product.revenue.toLocaleString()}
                                                        </span>
                                                        <span className={`text-xs font-medium whitespace-nowrap px-1.5 py-0.5 rounded ${product.trend.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                                                            {product.trend}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex-1 min-w-0 ${progressBarBg} rounded-full h-1.5`}>
                                                        <div
                                                            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full transition-all duration-700 shadow-[0_0_8px_-1px] shadow-indigo-500"
                                                            style={{ width: `${product.pct}%` }}
                                                        />
                                                    </div>
                                                    <span className={textMuted}>{product.qty} sold</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* ── Bottom Row: Recent Orders + Kitchen + Staff ─── */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {/* Recent Orders */}
                            <Card dark={dark} className="lg:col-span-2 fg-chart overflow-hidden">
                                <div className={`-mx-6 px-6 py-3.5 border-b ${borderColor} flex items-center justify-between`}>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 bg-blue-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Clock size={15} className="text-blue-400" />
                                        </div>
                                        <h2 className={`${textPrimary} font-semibold text-sm`}>Recent Orders</h2>
                                    </div>
                                    <span className={textMuted}>Last 30 min</span>
                                </div>
                                <div className="-mx-6 overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className={`border-b ${borderColor} text-left`}>
                                                {['Order ID', 'Table', 'Items', 'Total', 'Method', 'Status', 'Time'].map((h) => (
                                                    <th key={h} className={`px-6 py-2.5 ${textMuted} text-xs font-semibold uppercase tracking-wider whitespace-nowrap`}>
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className={`${divideColor}`}>
                                            {RECENT_ORDERS.map((order, i) => (
                                                <tr key={order.id} className={`${tableBg} transition-colors fg-row fg-row-${i + 1}`}>
                                                    <td className={`px-6 py-3 ${dark ? 'text-slate-400' : 'text-slate-500'} text-xs font-mono whitespace-nowrap`}>{order.id}</td>
                                                    <td className="px-6 py-3 whitespace-nowrap">
                                                        <span className="inline-flex items-center gap-1 bg-indigo-500/15 text-indigo-400 text-xs font-semibold px-2 py-0.5 rounded-full shadow-[0_0_10px_-3px] shadow-indigo-500/50">
                                                            <UtensilsCrossed size={10} />
                                                            {order.table}
                                                        </span>
                                                    </td>
                                                    <td className={`px-6 py-3 ${dark ? 'text-slate-300' : 'text-slate-600'} whitespace-nowrap`}>{order.items}</td>
                                                    <td className={`px-6 py-3 ${textPrimary} font-semibold tabular-nums whitespace-nowrap`}>
                                                        LKR {order.total.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-3 whitespace-nowrap"><MethodBadge method={order.method} /></td>
                                                    <td className="px-6 py-3 whitespace-nowrap"><StatusBadge status={order.status} /></td>
                                                    <td className={`px-6 py-3 ${textMuted} text-xs whitespace-nowrap`}>{order.time}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>

                            {/* Right Column */}
                            <div className="space-y-5">
                                {/* Kitchen Load */}
                                <Card dark={dark} className="fg-chart">
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <div className="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <ChefHat size={15} className="text-amber-400" />
                                        </div>
                                        <h2 className={`${textPrimary} font-semibold text-sm`}>Kitchen Load</h2>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'New Orders', value: 3, max: 10, color: 'bg-blue-500' },
                                            { label: 'Preparing', value: 4, max: 10, color: 'bg-amber-500' },
                                            { label: 'Ready', value: 2, max: 10, color: 'bg-emerald-500' },
                                            { label: 'Served', value: 12, max: 15, color: dark ? 'bg-slate-500' : 'bg-slate-400' },
                                        ].map((item) => (
                                            <div key={item.label}>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className={textMuted}>{item.label}</span>
                                                    <span className={textPrimary}>{item.value}/{item.max}</span>
                                                </div>
                                                <div className={`w-full ${progressBarBg} rounded-full h-2`}>
                                                    <div
                                                        className={`${item.color} h-2 rounded-full transition-all duration-700`}
                                                        style={{ width: `${(item.value / item.max) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Customer Rating */}
                                    <div className={`mt-4 pt-4 border-t ${borderColor}`}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className={textMuted}>Customer Rating</span>
                                            <span className={`${textPrimary} font-bold flex items-center gap-1 text-sm`}>
                                                <Star size={13} className="text-amber-400 fill-amber-400" />
                                                4.8
                                            </span>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    size={13}
                                                    className={s <= 4 ? 'text-amber-400 fill-amber-400' : dark ? 'text-slate-600' : 'text-slate-300'}
                                                />
                                            ))}
                                        </div>
                                        <p className={textMuted}>142 reviews</p>
                                    </div>
                                </Card>

                                {/* Staff on Duty */}
                                <Card dark={dark} className="fg-chart">
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <div className="w-8 h-8 bg-emerald-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Users size={15} className="text-emerald-400" />
                                        </div>
                                        <h2 className={`${textPrimary} font-semibold text-sm`}>Staff on Duty</h2>
                                        <span className="ml-auto text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex-shrink-0">
                                            {STAFF_ON_DUTY.length} active
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {STAFF_ON_DUTY.map((member) => (
                                            <div key={member.name} className="flex items-center gap-3 group">
                                                <div className="
                                                    w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600
                                                    flex items-center justify-center text-xs font-bold flex-shrink-0
                                                    group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-shadow duration-300
                                                ">
                                                    {member.avatar}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`${textPrimary} text-sm font-medium`}>{member.name}</p>
                                                    <p className={textMuted}>{member.role}</p>
                                                </div>
                                                <span className={`w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0 ring-2 ${staffAvatarRing} fg-pulse-soft`} />
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                {/* Stock Alerts */}
                                <Card dark={dark} className="fg-chart">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 bg-red-500/15 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Package size={15} className="text-red-400" />
                                            </div>
                                            <h2 className={`${textPrimary} font-semibold text-sm`}>Stock Alerts</h2>
                                        </div>
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 flex-shrink-0">
                                            {STOCK_ALERTS.length} items
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {STOCK_ALERTS.map((alert, idx) => (
                                            <div key={idx} className="flex items-center gap-3 group">
                                                <span className={`
                                                    w-2 h-2 rounded-full flex-shrink-0
                                                    ${alert.urgency === 'high' ? 'bg-red-500 fg-pulse-soft' : 'bg-amber-500'}
                                                `} />
                                                <div className="flex-1 min-w-0">
                                                    <p className={`${textPrimary} text-sm font-medium truncate`}>{alert.item}</p>
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <div className={`flex-1 min-w-0 ${progressBarBg} rounded-full h-1.5`}>
                                                            <div
                                                                className={`h-1.5 rounded-full transition-all duration-700 ${alert.urgency === 'high' ? 'bg-red-500' : 'bg-amber-500'}`}
                                                                style={{ width: `${Math.min(100, (alert.stock / alert.min) * 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className={textMuted}>{alert.stock}/{alert.min}</span>
                                                    </div>
                                                </div>
                                                <span className={`
                                                    text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0
                                                    ${alert.urgency === 'high'
                                                        ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                                                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                                    }
                                                `}>
                                                    {alert.urgency === 'high' ? 'URGENT' : 'LOW'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </POSLayout>
        </>
    );
}