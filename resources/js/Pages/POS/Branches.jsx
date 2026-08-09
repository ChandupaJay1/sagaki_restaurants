import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
    Store,
    Plus,
    Search,
    MapPin,
    DollarSign,
    CheckCircle2,
    Clock,
    X,
    Filter,
    ArrowLeftRight,
    TrendingUp,
    Check,
    AlertTriangle,
    Package,
    Activity,
    Grid,
    Truck
} from 'lucide-react';
import POSLayout from '@/Layouts/POSLayout';

// Mock Data
const INITIAL_BRANCHES = [
    { id: 1, name: 'Colombo 03 (HQ)', code: 'BR-COL', status: 'Open', manager: 'Sahan Alwis', phone: '077-111-2222', sales: 142580, orders: 184, occupancy: '50%', riders: 4, targetPct: 92 },
    { id: 2, name: 'Kandy City Center', code: 'BR-KDY', status: 'Open', manager: 'Duminda Silva', phone: '077-333-4444', sales: 98450, orders: 112, occupancy: '60%', riders: 2, targetPct: 84 },
    { id: 3, name: 'Galle Fort Outlet', code: 'BR-GAL', status: 'Open', manager: 'Nilupul Perera', phone: '076-555-6666', sales: 74200, orders: 85, occupancy: '35%', riders: 1, targetPct: 71 },
    { id: 4, name: 'Negombo Beach Road', code: 'BR-NEG', status: 'Closed', manager: 'Rex Fernando', phone: '071-888-9999', sales: 0, orders: 0, occupancy: '0%', riders: 0, targetPct: 0 },
];

const INITIAL_TRANSFERS = [
    { id: 'TRF-101', date: '2026-08-07', item: 'Boneless Chicken (1kg)', qty: 50, fromBranch: 'Colombo 03 (HQ)', toBranch: 'Kandy City Center', status: 'In Transit', requestedBy: 'Duminda Silva' },
    { id: 'TRF-102', date: '2026-08-06', item: 'Basmati Rice (5kg)', qty: 20, fromBranch: 'Colombo 03 (HQ)', toBranch: 'Galle Fort Outlet', status: 'Received', requestedBy: 'Nilupul Perera' },
    { id: 'TRF-103', date: '2026-08-08', item: 'Chilli Powder (1kg)', qty: 10, fromBranch: 'Galle Fort Outlet', toBranch: 'Kandy City Center', status: 'Pending Approval', requestedBy: 'Duminda Silva' },
];

const MULTI_BRANCH_INVENTORY = [
    { item: 'Boneless Chicken (1kg)', colombo: 180, kandy: 12, galle: 45, negombo: 60, minStock: 25 },
    { item: 'Basmati Rice (5kg)', colombo: 95, kandy: 32, galle: 15, negombo: 40, minStock: 15 },
    { item: 'Chilli Powder (1kg)', colombo: 48, kandy: 4, galle: 18, negombo: 22, minStock: 10 },
    { item: 'Coconut Milk (1L)', colombo: 120, kandy: 68, galle: 85, negombo: 90, minStock: 30 },
    { item: 'White Sugar (1kg)', colombo: 150, kandy: 90, galle: 105, negombo: 110, minStock: 20 },
];

export default function MultiBranchManagement() {
    const [branches, setBranches] = useState(INITIAL_BRANCHES);
    const [transfers, setTransfers] = useState(INITIAL_TRANSFERS);
    const [activeTab, setActiveTab] = useState('central');
    const [toast, setToast] = useState(null);

    // Modal control
    const [showTransferModal, setShowTransferModal] = useState(false);

    // Form states
    const [transferForm, setTransferForm] = useState({
        item: MULTI_BRANCH_INVENTORY[0].item,
        qty: '',
        fromBranch: INITIAL_BRANCHES[0].name,
        toBranch: INITIAL_BRANCHES[1].name
    });

    const triggerToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // Calculate aggregated metrics
    const aggregate = useMemo(() => {
        const activeBranches = branches.filter(b => b.status === 'Open');
        return {
            totalSales: branches.reduce((sum, b) => sum + b.sales, 0),
            totalOrders: branches.reduce((sum, b) => sum + b.orders, 0),
            openCount: activeBranches.length,
            closedCount: branches.length - activeBranches.length
        };
    }, [branches]);

    // Handlers
    const handleSaveTransfer = (e) => {
        e.preventDefault();
        if (transferForm.fromBranch === transferForm.toBranch) {
            triggerToast('Source and Destination branches cannot be the same');
            return;
        }
        if (!transferForm.qty || Number(transferForm.qty) <= 0) {
            triggerToast('Please enter a valid stock quantity');
            return;
        }

        const newTransfer = {
            id: `TRF-${Math.floor(104 + Math.random() * 900)}`,
            date: new Date().toISOString().split('T')[0],
            item: transferForm.item,
            qty: Number(transferForm.qty),
            fromBranch: transferForm.fromBranch,
            toBranch: transferForm.toBranch,
            status: 'Pending Approval',
            requestedBy: 'System Admin'
        };

        setTransfers(prev => [newTransfer, ...prev]);
        setShowTransferModal(false);
        setTransferForm({
            item: MULTI_BRANCH_INVENTORY[0].item,
            qty: '',
            fromBranch: INITIAL_BRANCHES[0].name,
            toBranch: INITIAL_BRANCHES[1].name
        });
        triggerToast(`Requested transfer ${newTransfer.id} from ${newTransfer.fromBranch}`);
    };

    const handleUpdateTransferStatus = (id, nextStatus) => {
        setTransfers(prev => prev.map(t => {
            if (t.id === id) {
                triggerToast(`Transfer ${id} updated to: ${nextStatus}`);
                return { ...t, status: nextStatus };
            }
            return t;
        }));
    };

    const toggleBranchStatus = (id) => {
        setBranches(prev => prev.map(b => {
            if (b.id === id) {
                const nextStatus = b.status === 'Open' ? 'Closed' : 'Open';
                triggerToast(`Branch "${b.name}" is now ${nextStatus}`);
                return {
                    ...b,
                    status: nextStatus,
                    sales: nextStatus === 'Closed' ? 0 : b.sales,
                    orders: nextStatus === 'Closed' ? 0 : b.orders,
                    riders: nextStatus === 'Closed' ? 0 : b.riders,
                    occupancy: nextStatus === 'Closed' ? '0%' : b.occupancy,
                    targetPct: nextStatus === 'Closed' ? 0 : b.targetPct
                };
            }
            return b;
        }));
    };

    return (
        <POSLayout>
            <Head title="Multi-Branch Management" />
            <div className="flex flex-col h-full relative transition-colors duration-300">
                {/* Background glow */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 -right-24 w-[480px] h-[480px] bg-indigo-600/10 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
                </div>

                {/* Header */}
                <header className="relative z-10 px-6 py-4 bg-white dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
                            <Store size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold leading-tight text-slate-900 dark:text-white">Multi-Branch Management</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Monitor multi-location sales benchmarks, check stock levels side-by-side, and initiate transfers</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowTransferModal(true)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all self-start md:self-auto"
                        >
                            <ArrowLeftRight size={14} /> Request Stock Transfer
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {/* Centralized KPI aggregates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        {[
                            { label: 'Aggregated Sales', val: `LKR ${aggregate.totalSales.toLocaleString()}`, color: 'from-indigo-500/25 text-indigo-400 border-indigo-500/30', icon: DollarSign },
                            { label: 'Total Placed Orders', val: aggregate.totalOrders, color: 'from-teal-500/25 text-teal-400 border-teal-500/30', icon: Activity },
                            { label: 'Active Branches', val: `${aggregate.openCount} / ${branches.length} Open`, color: 'from-emerald-500/25 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
                            { label: 'Pending Transfers', val: transfers.filter(t => t.status !== 'Received').length, color: 'from-amber-500/25 text-amber-400 border-amber-500/30', icon: Truck }
                        ].map((card, i) => {
                            const Icon = card.icon;
                            return (
                                <div key={i} className={`bg-gradient-to-br ${card.color} bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md flex items-center justify-between`}>
                                    <div>
                                        <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">{card.label}</span>
                                        <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">{card.val}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center border border-slate-200/40 dark:border-slate-800">
                                        <Icon size={16} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex rounded-xl p-0.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 w-max">
                        {[
                            { id: 'central', label: 'Centralized Dashboard' },
                            { id: 'inventory', label: 'Branch Inventory lookup' },
                            { id: 'transfers', label: 'Inter-Branch Stock Transfers' }
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
                    {activeTab === 'central' && (
                        <div className="space-y-6 animate-in fade-in duration-200">
                            {/* Branch Performance Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                                {branches.map(b => (
                                    <div
                                        key={b.id}
                                        className={`rounded-2xl border bg-white dark:bg-slate-900/85 p-5 shadow-lg flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                                            b.status === 'Closed' ? 'border-dashed border-slate-200 dark:border-slate-850 opacity-60' : 'border-slate-200 dark:border-slate-800'
                                        }`}
                                    >
                                        <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                                        
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{b.name}</h3>
                                                <span className="text-[10px] text-slate-400">Mgr: {b.manager}</span>
                                            </div>
                                            <button
                                                onClick={() => toggleBranchStatus(b.id)}
                                                className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase border transition-all ${
                                                    b.status === 'Open'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-white'
                                                }`}
                                            >
                                                {b.status}
                                            </button>
                                        </div>

                                        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-850 space-y-2 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Today Sales:</span>
                                                <span className="font-extrabold text-indigo-500 dark:text-indigo-400">LKR {b.sales.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Order Count:</span>
                                                <span className="font-bold text-slate-800 dark:text-white">{b.orders} orders</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Table Occupancy:</span>
                                                <span className="font-bold text-slate-800 dark:text-white">{b.occupancy}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-slate-400">Active Riders:</span>
                                                <span className="font-bold text-slate-800 dark:text-white">{b.riders} active</span>
                                            </div>
                                        </div>

                                        {/* Branch Target Progress */}
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                                                <span>Target Benchmark</span>
                                                <span className="font-bold text-indigo-400">{b.targetPct}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full transition-all duration-700"
                                                    style={{ width: `${b.targetPct}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Branch comparison SVG sales chart */}
                            <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl">
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Branch Wise Sales Comparison</h3>
                                <div className="h-44 w-full flex items-end justify-between px-6 pt-6">
                                    {branches.map(b => {
                                        // Max sales limit represents 200,000 for visualization
                                        const maxLimit = 200000;
                                        const h = b.status === 'Open' ? (b.sales / maxLimit) * 120 : 0;
                                        return (
                                            <div key={b.id} className="flex-1 flex flex-col items-center gap-2">
                                                <div className="w-full flex justify-center items-end h-28">
                                                    {b.status === 'Open' ? (
                                                        <div
                                                            className="w-14 rounded-t-xl bg-gradient-to-t from-indigo-600 via-indigo-500 to-violet-500 hover:to-indigo-300 transition-all duration-500 shadow-lg shadow-indigo-500/10 flex flex-col items-center justify-end pb-2"
                                                            style={{ height: `${h}px` }}
                                                        >
                                                            <span className="text-[9px] font-bold text-white leading-none">{(b.sales / 1000).toFixed(0)}k</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-500 italic pb-2">Closed</span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-semibold text-slate-400">{b.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'inventory' && (
                        <div className="bg-white dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-in fade-in duration-200">
                            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Package size={16} className="text-indigo-400" />
                                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Multi-Branch Inventory Grid</h3>
                                </div>
                                <span className="text-[10px] text-slate-500">Real-Time Stock Counts</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Raw Ingredient</th>
                                            <th className="px-6 py-4 text-center">Colombo (HQ)</th>
                                            <th className="px-6 py-4 text-center">Kandy</th>
                                            <th className="px-6 py-4 text-center">Galle</th>
                                            <th className="px-6 py-4 text-center">Negombo (Closed)</th>
                                            <th className="px-6 py-4 text-center">Min Safety Limit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 font-mono">
                                        {MULTI_BRANCH_INVENTORY.map(itm => (
                                            <tr key={itm.item} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors font-semibold">
                                                <td className="px-6 py-4 font-sans font-bold text-slate-900 dark:text-white">{itm.item}</td>
                                                <td className="px-6 py-4 text-center text-slate-800 dark:text-white font-mono">{itm.colombo} units</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1 font-mono ${itm.kandy < itm.minStock ? 'text-amber-500 font-bold' : ''}`}>
                                                        {itm.kandy < itm.minStock && <AlertTriangle size={11} />}
                                                        {itm.kandy} units
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1 font-mono ${itm.galle < itm.minStock ? 'text-amber-500 font-bold' : ''}`}>
                                                        {itm.galle < itm.minStock && <AlertTriangle size={11} />}
                                                        {itm.galle} units
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-slate-500 font-mono">{itm.negombo} units</td>
                                                <td className="px-6 py-4 text-center font-bold text-slate-400">{itm.minStock} units</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'transfers' && (
                        <div className="bg-white dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-in fade-in duration-200">
                            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active Stock Transfers Queue</h3>
                                <span className="text-[10px] text-slate-500">Logistical Movements</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Transfer ID</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Ingredient</th>
                                            <th className="px-6 py-4 text-center">Transfer Qty</th>
                                            <th className="px-6 py-4">From Branch</th>
                                            <th className="px-6 py-4">To Branch</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                                        {transfers.map(t => (
                                            <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{t.id}</td>
                                                <td className="px-6 py-4 font-mono">{t.date}</td>
                                                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{t.item}</td>
                                                <td className="px-6 py-4 text-center font-mono font-bold text-indigo-500 dark:text-indigo-400">{t.qty}</td>
                                                <td className="px-6 py-4">{t.fromBranch}</td>
                                                <td className="px-6 py-4 font-semibold">{t.toBranch}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-semibold border ${
                                                        t.status === 'Pending Approval' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        t.status === 'In Transit' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    }`}>
                                                        {t.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {t.status === 'Pending Approval' && (
                                                            <button
                                                                onClick={() => handleUpdateTransferStatus(t.id, 'In Transit')}
                                                                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-[10px] font-medium"
                                                            >
                                                                Approve & Dispatch
                                                            </button>
                                                        )}
                                                        {t.status === 'In Transit' && (
                                                            <button
                                                                onClick={() => handleUpdateTransferStatus(t.id, 'Received')}
                                                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-[10px] font-medium flex items-center gap-1"
                                                            >
                                                                <Check size={11} /> Confirm Receive
                                                            </button>
                                                        )}
                                                        {t.status === 'Received' && (
                                                            <span className="text-[10px] text-slate-500 italic">Completed</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Toast Notification */}
                {toast && (
                    <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-white rounded-xl px-4 py-3 shadow-2xl flex items-center gap-2 animate-bounce">
                        <CheckCircle2 size={16} className="text-indigo-650 dark:text-indigo-400" />
                        <span className="text-xs font-semibold">{toast}</span>
                    </div>
                )}

                {/* MODAL: Request Stock Transfer */}
                {showTransferModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTransferModal(false)} />
                        <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-slate-850 dark:text-white font-bold text-base">Request Stock Transfer</h2>
                                <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={18} /></button>
                            </div>
                            <form onSubmit={handleSaveTransfer} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase mb-1">Select Ingredient / Item</label>
                                    <select
                                        value={transferForm.item}
                                        onChange={e => setTransferForm(prev => ({ ...prev, item: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
                                    >
                                        {MULTI_BRANCH_INVENTORY.map(itm => <option key={itm.item} value={itm.item}>{itm.item}</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase mb-1">From Source Branch</label>
                                        <select
                                            value={transferForm.fromBranch}
                                            onChange={e => setTransferForm(prev => ({ ...prev, fromBranch: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
                                        >
                                            {branches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase mb-1">To Dest Branch</label>
                                        <select
                                            value={transferForm.toBranch}
                                            onChange={e => setTransferForm(prev => ({ ...prev, toBranch: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
                                        >
                                            {branches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase mb-1">Transfer Qty (Units)</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="Enter number of units"
                                        value={transferForm.qty}
                                        onChange={e => setTransferForm(prev => ({ ...prev, qty: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-bold"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/10"
                                >
                                    Submit Transfer Request
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </POSLayout>
    );
}
