import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeProvider';
import {
    Coins,
    Plus,
    Search,
    DollarSign,
    TrendingUp,
    TrendingDown,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    X,
    Filter,
    FileText,
    Calculator,
    AlertCircle,
    CheckCircle,
    Info,
    ChevronDown
} from 'lucide-react';
import POSLayout from '@/Layouts/POSLayout';

// Mock Data
const INITIAL_EXPENSES = [
    { id: 1, desc: 'Fresh Vegetables Supply', category: 'Ingredients', amount: 15400, date: '2026-08-08', staff: 'Pathum Bandara' },
    { id: 2, desc: 'Monthly Electricity Bill', category: 'Utilities', amount: 32000, date: '2026-08-05', staff: 'Sahan Alwis' },
    { id: 3, desc: 'Paper Box & Packaging Pack', category: 'Takeaway Supplies', amount: 8500, date: '2026-08-06', staff: 'Amali Perera' },
    { id: 4, desc: 'Cylinder Gas Refill x4', category: 'Utilities', amount: 18000, date: '2026-08-07', staff: 'Pathum Bandara' },
];

const INITIAL_RECONCILIATIONS = [
    { id: 501, date: '2026-08-07', openingFloat: 10000, expected: 154200, actual: 154200, variance: 0, status: 'Balanced', resolvedBy: 'Amali Perera' },
    { id: 502, date: '2026-08-06', openingFloat: 10000, expected: 124500, actual: 124250, variance: -250, status: 'Discrepancy', resolvedBy: 'Kamali Silva' },
];

const CASH_FLOW_DATA = [
    { month: 'Mar', inflow: 1850000, outflow: 1450000 },
    { month: 'Apr', inflow: 1980000, outflow: 1580000 },
    { month: 'May', inflow: 2200000, outflow: 1690000 },
    { month: 'Jun', inflow: 2450000, outflow: 1820000 },
    { month: 'Jul', inflow: 2950000, outflow: 2100000 },
    { month: 'Aug', inflow: 3100000, outflow: 2200000 }
];

export default function FinancialManagement() {
    const { isDarkMode } = useTheme();
    const gridStroke = isDarkMode ? '#1e293b' : '#e2e8f0';
    const axisStroke = isDarkMode ? '#475569' : '#cbd5e1';
    const labelColor = isDarkMode ? '#94a3b8' : '#64748b';

    const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
    const [reconciliations, setReconciliations] = useState(INITIAL_RECONCILIATIONS);
    const [activeTab, setActiveTab] = useState('reconciliation');
    const [toast, setToast] = useState(null);

    // Modal control
    const [showExpenseModal, setShowExpenseModal] = useState(false);

    // Form states
    const [expenseForm, setExpenseForm] = useState({ desc: '', category: 'Ingredients', amount: '', date: new Date().toISOString().split('T')[0] });
    
    // Reconciliation active input state
    const [reconInput, setReconInput] = useState({
        openingFloat: '10000',
        cashSales: '98450',
        cardSales: '44130',
        actualCash: ''
    });

    const triggerToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // Computations
    const reconComputed = useMemo(() => {
        const float = Number(reconInput.openingFloat) || 0;
        const cash = Number(reconInput.cashSales) || 0;
        const card = Number(reconInput.cardSales) || 0;
        const expectedTotal = float + cash;
        const actual = Number(reconInput.actualCash) || 0;
        const variance = actual - expectedTotal;

        return {
            expectedTotal,
            variance,
            status: variance === 0 ? 'Balanced' : 'Discrepancy'
        };
    }, [reconInput]);

    // Financial calculations
    const finances = useMemo(() => {
        const totalSales = 3745200; // Mock current month sales
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
        const costOfGoodsSold = totalSales * 0.35; // Mock COGS as 35% of sales
        const grossProfit = totalSales - costOfGoodsSold;
        const netProfit = grossProfit - totalExpenses;

        return {
            totalSales,
            totalExpenses,
            costOfGoodsSold,
            grossProfit,
            netProfit
        };
    }, [expenses]);

    // Handlers
    const handleSaveExpense = (e) => {
        e.preventDefault();
        if (!expenseForm.desc || !expenseForm.amount) {
            triggerToast('Description and Amount are required');
            return;
        }

        const newExpense = {
            id: expenses.length + 1,
            desc: expenseForm.desc,
            category: expenseForm.category,
            amount: Number(expenseForm.amount),
            date: expenseForm.date,
            staff: 'Sahan Alwis'
        };

        setExpenses(prev => [newExpense, ...prev]);
        setShowExpenseModal(false);
        setExpenseForm({ desc: '', category: 'Ingredients', amount: '', date: new Date().toISOString().split('T')[0] });
        triggerToast(`Recorded Expense: LKR ${newExpense.amount.toLocaleString()}`);
    };

    const handleSaveReconciliation = (e) => {
        e.preventDefault();
        if (!reconInput.actualCash) {
            triggerToast('Please input actual physical cash counted in drawer');
            return;
        }

        const newRecon = {
            id: reconciliations.length + 501,
            date: new Date().toISOString().split('T')[0],
            openingFloat: Number(reconInput.openingFloat),
            expected: reconComputed.expectedTotal,
            actual: Number(reconInput.actualCash),
            variance: reconComputed.variance,
            status: reconComputed.status,
            resolvedBy: 'Amali Perera'
        };

        setReconciliations(prev => [newRecon, ...prev]);
        setReconInput(prev => ({ ...prev, actualCash: '' }));
        triggerToast(`Drawer Reconciliation Submitted. Status: ${newRecon.status}`);
    };

    return (
        <POSLayout>
            <Head title="Financial Management" />
            <div className="flex flex-col h-full relative transition-colors duration-300">
                {/* Background glow */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 -right-24 w-[480px] h-[480px] bg-indigo-600/10 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
                </div>

                {/* Header */}
                <header className="relative z-10 px-6 py-4 bg-white dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
                            <Coins size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold leading-tight text-slate-900 dark:text-white">Financial Management</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Track daily cash drawer balances, register operational expenses, and view live P&L reporting</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowExpenseModal(true)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all self-start md:self-auto"
                        >
                            <Plus size={14} /> Record Expense
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {/* KPI Stats cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        {[
                            { label: 'Total Revenue (Month)', val: `LKR ${finances.totalSales.toLocaleString()}`, change: '+12.3%', up: true, glow: 'text-indigo-400' },
                            { label: 'Gross Profit (65%)', val: `LKR ${finances.grossProfit.toLocaleString()}`, change: '+8.4%', up: true, glow: 'text-emerald-400' },
                            { label: 'Total Expenses Logged', val: `LKR ${finances.totalExpenses.toLocaleString()}`, change: '+4.1%', up: false, glow: 'text-rose-400' },
                            { label: 'Estimated Net Income', val: `LKR ${finances.netProfit.toLocaleString()}`, change: '+14.2%', up: true, glow: 'text-teal-400' }
                        ].map((card, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between">
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">{card.label}</span>
                                    <p className={`text-lg font-extrabold ${card.glow} mt-1.5`}>{card.val}</p>
                                </div>
                                <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-850">
                                    {card.up ? (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 flex items-center gap-0.5">
                                            <ArrowUpRight size={10} /> {card.change}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/10 flex items-center gap-0.5">
                                            <ArrowDownRight size={10} /> {card.change}
                                        </span>
                                    )}
                                    <span className="text-[10px] text-slate-400">vs last month</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex rounded-xl p-0.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 w-max">
                        {[
                            { id: 'reconciliation', label: 'Cash Drawer Reconciliation' },
                            { id: 'expenses', label: 'Expense Log' },
                            { id: 'analytics', label: 'Statements & P&L' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Panels */}
                    {activeTab === 'reconciliation' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Reconciliation Form */}
                            <div className="lg:col-span-5 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl h-fit">
                                <div className="flex items-center gap-2 mb-4">
                                    <Calculator className="text-indigo-400" size={16} />
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Active Shift Cash Out Form</h3>
                                </div>
                                <form onSubmit={handleSaveReconciliation} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Opening Float (LKR)</label>
                                            <input
                                                type="number"
                                                value={reconInput.openingFloat}
                                                onChange={e => setReconInput(prev => ({ ...prev, openingFloat: e.target.value }))}
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Cash Inflow (Sales)</label>
                                            <input
                                                type="number"
                                                value={reconInput.cashSales}
                                                onChange={e => setReconInput(prev => ({ ...prev, cashSales: e.target.value }))}
                                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Non-Cash Card/QR Sales (Expected)</label>
                                        <input
                                            type="number"
                                            value={reconInput.cardSales}
                                            disabled
                                            className="w-full bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-400 cursor-not-allowed focus:outline-none"
                                        />
                                    </div>

                                    <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-850 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center justify-between font-medium">
                                            <span>Expected Drawer Cash:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">
                                                LKR {reconComputed.expectedTotal.toLocaleString()}
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-slate-400 italic block leading-snug">Expected Cash = Opening Float (LKR {Number(reconInput.openingFloat).toLocaleString()}) + Cash Sales (LKR {Number(reconInput.cashSales).toLocaleString()})</span>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Actual Physical Cash Counted (LKR)</label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="Count total banknotes in register drawer"
                                            value={reconInput.actualCash}
                                            onChange={e => setReconInput(prev => ({ ...prev, actualCash: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-bold"
                                        />
                                    </div>

                                    {reconInput.actualCash && (
                                        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                                            reconComputed.variance === 0
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                        }`}>
                                            <div className="flex items-center gap-1.5">
                                                {reconComputed.variance === 0 ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                                <span>Variance Detected:</span>
                                            </div>
                                            <span className="font-bold tabular-nums">
                                                LKR {reconComputed.variance > 0 ? '+' : ''}{reconComputed.variance.toLocaleString()}
                                            </span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/15"
                                    >
                                        Submit Reconciliation Log
                                    </button>
                                </form>
                            </div>

                            {/* Reconciliation Log History */}
                            <div className="lg:col-span-7 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl h-fit">
                                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
                                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Reconciliation Audits</h3>
                                    <span className="text-[10px] text-slate-500">Historical Shift Logs</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-850 text-slate-400 uppercase font-semibold">
                                            <tr>
                                                <th className="px-5 py-3">Date</th>
                                                <th className="px-5 py-3">Float</th>
                                                <th className="px-5 py-3">Expected</th>
                                                <th className="px-5 py-3">Actual Cash</th>
                                                <th className="px-5 py-3">Variance</th>
                                                <th className="px-5 py-3 text-right">Cashier</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-400">
                                            {reconciliations.map(r => (
                                                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                                                    <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">{r.date}</td>
                                                    <td className="px-5 py-3.5 font-mono">LKR {r.openingFloat.toLocaleString()}</td>
                                                    <td className="px-5 py-3.5 font-mono">LKR {r.expected.toLocaleString()}</td>
                                                    <td className="px-5 py-3.5 font-mono">LKR {r.actual.toLocaleString()}</td>
                                                    <td className="px-5 py-3.5 font-mono">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                                            r.variance === 0 
                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                        }`}>
                                                            {r.variance > 0 ? '+' : ''}{r.variance.toLocaleString()}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-right font-semibold font-sans">{r.resolvedBy}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'expenses' && (
                        <div className="bg-white dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between bg-slate-50 dark:bg-slate-950/40">
                                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Expense History Ledger</h3>
                                <span className="text-[10px] text-slate-500">Shift & Utilities Expenditure</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Expense ID</th>
                                            <th className="px-6 py-4">Description</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4">Date Recorded</th>
                                            <th className="px-6 py-4 text-right">Logged By</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                                        {expenses.map(e => (
                                            <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-mono text-slate-500">EXP-{String(e.id).padStart(3, '0')}</td>
                                                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{e.desc}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                                                        {e.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-extrabold text-rose-500 dark:text-rose-400 tabular-nums">LKR {e.amount.toLocaleString()}</td>
                                                <td className="px-6 py-4 font-mono">{e.date}</td>
                                                <td className="px-6 py-4 text-right font-sans font-semibold">{e.staff}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* SVG Cash Flow Inflow vs Outflow Chart */}
                            <div className="lg:col-span-8 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Cash Flow Analysis</h3>
                                        <p className="text-[11px] text-slate-400">Total inflows vs logged outflows (Last 6 Months)</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
                                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Inflow</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Outflow</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom SVG Bar Chart */}
                                <div className="relative h-64 w-full">
                                    <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
                                        {/* Chart Grid Lines */}
                                        <line x1="40" y1="20" x2="480" y2="20" stroke={gridStroke} strokeWidth="1" strokeDasharray="4" />
                                        <line x1="40" y1="70" x2="480" y2="70" stroke={gridStroke} strokeWidth="1" strokeDasharray="4" />
                                        <line x1="40" y1="120" x2="480" y2="120" stroke={gridStroke} strokeWidth="1" strokeDasharray="4" />
                                        <line x1="40" y1="170" x2="480" y2="170" stroke={gridStroke} strokeWidth="1" strokeDasharray="4" />
                                        <line x1="40" y1="170" x2="480" y2="170" stroke={axisStroke} strokeWidth="1.5" />

                                        {/* Bars Rendering */}
                                        {CASH_FLOW_DATA.map((d, index) => {
                                            const x = 50 + (index * 72);
                                            // Max value represents 3.5 Million (3,500,000)
                                            const maxLimit = 3500000;
                                            const inHeight = (d.inflow / maxLimit) * 150;
                                            const outHeight = (d.outflow / maxLimit) * 150;

                                            return (
                                                <g key={d.month}>
                                                    {/* Inflow Bar */}
                                                    <rect
                                                        x={x}
                                                        y={170 - inHeight}
                                                        width="18"
                                                        height={inHeight}
                                                        fill="#6366f1"
                                                        rx="3"
                                                        className="transition-all duration-500 hover:fill-indigo-400"
                                                    />
                                                    {/* Outflow Bar */}
                                                    <rect
                                                        x={x + 22}
                                                        y={170 - outHeight}
                                                        width="18"
                                                        height={outHeight}
                                                        fill="#ef4444"
                                                        rx="3"
                                                        className="transition-all duration-500 hover:fill-rose-400"
                                                    />
                                                    {/* Month labels */}
                                                    <text x={x + 20} y="192" fill={labelColor} fontSize="10" textAnchor="middle" fontWeight="bold">
                                                        {d.month}
                                                    </text>
                                                    {/* Hover tooltips (mock text above bars) */}
                                                    <text x={x + 20} y={160 - inHeight} fill="#818cf8" fontSize="8" textAnchor="middle" fontWeight="semibold">
                                                        {(d.inflow / 1000000).toFixed(1)}M
                                                    </text>
                                                </g>
                                            );
                                        })}
                                    </svg>
                                </div>
                            </div>

                            {/* Monthly Profit & Loss Statement Summary */}
                            <div className="lg:col-span-4 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl h-fit">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText className="text-indigo-400" size={16} />
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">P&L Account Statement</h3>
                                </div>
                                <div className="space-y-3.5 text-xs">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-850">
                                        <span className="text-slate-400">Total Operating Revenue</span>
                                        <span className="font-bold text-slate-900 dark:text-white">LKR {finances.totalSales.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-850">
                                        <span className="text-slate-400">(-) Cost of Goods Sold (35% COGS)</span>
                                        <span className="font-bold text-slate-900 dark:text-white">LKR {finances.costOfGoodsSold.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold">
                                        <span className="text-slate-900 dark:text-white">Gross Trading Profit</span>
                                        <span className="text-indigo-500 dark:text-indigo-400">LKR {finances.grossProfit.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-850">
                                        <span className="text-slate-400">(-) Operating Expenses Logged</span>
                                        <span className="font-bold text-slate-900 dark:text-white">LKR {finances.totalExpenses.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-850">
                                        <span className="text-slate-400">(-) Depreciation & Tax (Est. 5%)</span>
                                        <span className="font-bold text-slate-900 dark:text-white">LKR {(finances.totalSales * 0.05).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/20 font-bold text-sm">
                                        <span>Net Account Profit</span>
                                        <span className="tabular-nums">LKR {(finances.netProfit - (finances.totalSales * 0.05)).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Toast Notification */}
                {toast && (
                    <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white rounded-xl px-4 py-3 shadow-2xl flex items-center gap-2 animate-bounce">
                        <CheckCircle size={16} className="text-indigo-650 dark:text-indigo-400" />
                        <span className="text-xs font-semibold">{toast}</span>
                    </div>
                )}

                {/* MODAL: Record Expense */}
                {showExpenseModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowExpenseModal(false)} />
                        <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-slate-850 dark:text-white font-bold text-base">Record Operational Expense</h2>
                                <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={18} /></button>
                            </div>
                            <form onSubmit={handleSaveExpense} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase mb-1">Expense Description</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Purchased Fresh Seafood"
                                        value={expenseForm.desc}
                                        onChange={e => setExpenseForm(prev => ({ ...prev, desc: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase mb-1">Category</label>
                                        <select
                                            value={expenseForm.category}
                                            onChange={e => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
                                        >
                                            <option value="Ingredients">Food Ingredients</option>
                                            <option value="Utilities">Utilities (Water/Elec/Gas)</option>
                                            <option value="Takeaway Supplies">Packaging Supplies</option>
                                            <option value="Salaries">Staff Wages</option>
                                            <option value="Rent">Rent & Leasing</option>
                                            <option value="Misc">Miscellaneous</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase mb-1">Date Paid</label>
                                        <input
                                            type="date"
                                            required
                                            value={expenseForm.date}
                                            onChange={e => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase mb-1">Amount Paid (LKR)</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="e.g. 12500"
                                        value={expenseForm.amount}
                                        onChange={e => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-bold"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/10"
                                >
                                    Log Operating Expense
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </POSLayout>
    );
}
