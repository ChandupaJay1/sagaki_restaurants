import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
    ShoppingBag,
    Plus,
    Search,
    Truck,
    CheckCircle2,
    DollarSign,
    Clock,
    X,
    Filter,
    PlusCircle,
    Info,
    ChevronRight,
    Users,
    FileText,
    TrendingUp,
    Check,
    CreditCard
} from 'lucide-react';
import POSLayout from '@/Layouts/POSLayout';

// Mock Data
const INITIAL_SUPPLIERS = [
    { id: 1, name: 'Keells Food Products', code: 'SUP-KFP', contact: 'Rohan Silva', phone: '011-234-5678', email: 'rohan@keells.com', address: 'Colombo 02', balance: 45000 },
    { id: 2, name: 'Cargills Agri Foods', code: 'SUP-CAF', contact: 'Dilini Perera', phone: '011-987-6543', email: 'dilini@cargills.com', address: 'Mattakkuliya', balance: 12000 },
    { id: 3, name: 'Ceylon Cold Stores', code: 'SUP-CCS', contact: 'Shanaka Fernando', phone: '011-555-1234', email: 'shanaka@ccs.lk', address: 'Ranala', balance: 0 },
    { id: 4, name: 'Sri Lankan Poultry Farms', code: 'SUP-SLP', contact: 'Mahesh Bandara', phone: '077-333-7890', email: 'mahesh@slpoultry.lk', address: 'Kurunegala', balance: 85000 },
];

const INITIAL_PURCHASE_ORDERS = [
    { id: 'PO-2026-001', supplier: 'Keells Food Products', itemsCount: 4, total: 32000, date: '2026-08-01', status: 'Received', grnRef: 'GRN-2026-001' },
    { id: 'PO-2026-002', supplier: 'Sri Lankan Poultry Farms', itemsCount: 2, total: 45000, date: '2026-08-05', status: 'Approved', grnRef: null },
    { id: 'PO-2026-003', supplier: 'Cargills Agri Foods', itemsCount: 5, total: 18500, date: '2026-08-07', status: 'Pending', grnRef: null },
];

const INITIAL_GRNS = [
    { id: 'GRN-2026-001', poRef: 'PO-2026-001', supplier: 'Keells Food Products', receivedDate: '2026-08-03', receivedBy: 'Nimal Jayawardena', status: 'Matched' },
];

const INVENTORY_ITEMS_FOR_PO = [
    { name: 'Boneless Chicken (1kg)', unit: 'kg', price: 1200 },
    { name: 'Fresh Milk (1L)', unit: 'litres', price: 420 },
    { name: 'White Rice (5kg)', unit: 'bags', price: 1100 },
    { name: 'Chilli Powder (1kg)', unit: 'kg', price: 950 },
    { name: 'Coconut Milk (1L)', unit: 'tins', price: 380 },
];

export default function PurchaseManagement() {
    const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
    const [purchaseOrders, setPurchaseOrders] = useState(INITIAL_PURCHASE_ORDERS);
    const [grns, setGrns] = useState(INITIAL_GRNS);
    const [activeTab, setActiveTab] = useState('suppliers');
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState(null);

    // Modal control states
    const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
    const [showCreatePOModal, setShowCreatePOModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);

    // Form states
    const [supplierForm, setSupplierForm] = useState({ name: '', contact: '', phone: '', email: '', address: '' });
    const [selectedSupplierForPO, setSelectedSupplierForPO] = useState(INITIAL_SUPPLIERS[0]?.name || '');
    const [poItems, setPoItems] = useState([{ itemName: INVENTORY_ITEMS_FOR_PO[0].name, qty: 1, unitPrice: INVENTORY_ITEMS_FOR_PO[0].price }]);
    
    // Pay state
    const [selectedSupplierForPay, setSelectedSupplierForPay] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    const triggerToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // Calculate total spend & outstanding balances
    const stats = useMemo(() => {
        return {
            totalOwed: suppliers.reduce((sum, s) => sum + s.balance, 0),
            activeOrders: purchaseOrders.filter(p => p.status === 'Pending' || p.status === 'Approved').length,
            completedPurchases: purchaseOrders.filter(p => p.status === 'Received').length,
            totalSpendThisMonth: purchaseOrders.reduce((sum, po) => sum + po.total, 0)
        };
    }, [suppliers, purchaseOrders]);

    // Filtering logic
    const filteredSuppliers = useMemo(() => {
        return suppliers.filter(s => 
            s.name.toLowerCase().includes(search.toLowerCase()) || 
            s.contact.toLowerCase().includes(search.toLowerCase()) ||
            s.code.toLowerCase().includes(search.toLowerCase())
        );
    }, [suppliers, search]);

    const filteredPO = useMemo(() => {
        return purchaseOrders.filter(po => 
            po.supplier.toLowerCase().includes(search.toLowerCase()) || 
            po.id.toLowerCase().includes(search.toLowerCase())
        );
    }, [purchaseOrders, search]);

    // Handlers
    const handleSaveSupplier = (e) => {
        e.preventDefault();
        if (!supplierForm.name || !supplierForm.contact) {
            triggerToast('Please fill out the supplier name and contact person');
            return;
        }

        const newSupplier = {
            id: suppliers.length + 1,
            name: supplierForm.name,
            code: `SUP-${supplierForm.name.split(' ').map(w => w[0]).join('').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
            contact: supplierForm.contact,
            phone: supplierForm.phone,
            email: supplierForm.email,
            address: supplierForm.address,
            balance: 0
        };

        setSuppliers(prev => [...prev, newSupplier]);
        setShowAddSupplierModal(false);
        setSupplierForm({ name: '', contact: '', phone: '', email: '', address: '' });
        triggerToast(`Added Supplier: ${newSupplier.name}`);
    };

    // PO Item Handlers
    const addPoItemField = () => {
        setPoItems(prev => [...prev, { itemName: INVENTORY_ITEMS_FOR_PO[0].name, qty: 1, unitPrice: INVENTORY_ITEMS_FOR_PO[0].price }]);
    };

    const removePoItemField = (index) => {
        if (poItems.length === 1) return;
        setPoItems(prev => prev.filter((_, i) => i !== index));
    };

    const updatePoItem = (index, field, value) => {
        setPoItems(prev => prev.map((item, i) => {
            if (i === index) {
                const updated = { ...item, [field]: value };
                if (field === 'itemName') {
                    const preset = INVENTORY_ITEMS_FOR_PO.find(p => p.name === value);
                    if (preset) {
                        updated.unitPrice = preset.price;
                    }
                }
                return updated;
            }
            return item;
        }));
    };

    const handleCreatePO = (e) => {
        e.preventDefault();
        const total = poItems.reduce((sum, item) => sum + (Number(item.qty) * Number(item.unitPrice)), 0);
        
        const newPO = {
            id: `PO-2026-${String(purchaseOrders.length + 1).padStart(3, '0')}`,
            supplier: selectedSupplierForPO,
            itemsCount: poItems.length,
            total: total,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            grnRef: null
        };

        setPurchaseOrders(prev => [newPO, ...prev]);
        setShowCreatePOModal(false);
        setPoItems([{ itemName: INVENTORY_ITEMS_FOR_PO[0].name, qty: 1, unitPrice: INVENTORY_ITEMS_FOR_PO[0].price }]);
        triggerToast(`Purchase Order ${newPO.id} Created`);
    };

    // Approve PO & Trigger GRN
    const approvePO = (poId) => {
        setPurchaseOrders(prev => prev.map(po => {
            if (po.id === poId) {
                triggerToast(`Purchase Order ${poId} Approved`);
                return { ...po, status: 'Approved' };
            }
            return po;
        }));
    };

    // Confirm GRN Receipt (PO -> GRN matching)
    const receiveGoods = (po) => {
        const grnId = `GRN-2026-${String(grns.length + 1).padStart(3, '0')}`;
        
        // Add GRN record
        const newGrn = {
            id: grnId,
            poRef: po.id,
            supplier: po.supplier,
            receivedDate: new Date().toISOString().split('T')[0],
            receivedBy: 'Amali Perera',
            status: 'Matched'
        };

        setGrns(prev => [newGrn, ...prev]);

        // Update PO state to Received and reference GRN
        setPurchaseOrders(prev => prev.map(o => {
            if (o.id === po.id) {
                return { ...o, status: 'Received', grnRef: grnId };
            }
            return o;
        }));

        // Add to supplier balance (unpaid purchase invoice)
        setSuppliers(prev => prev.map(s => {
            if (s.name === po.supplier) {
                return { ...s, balance: s.balance + po.total };
            }
            return s;
        }));

        triggerToast(`Goods Received. Invoice of LKR ${po.total.toLocaleString()} added to ${po.supplier} balance.`);
    };

    // Recording Payments
    const handlePaySupplier = (e) => {
        e.preventDefault();
        const amt = Number(paymentAmount);
        if (!amt || amt <= 0) return;

        setSuppliers(prev => prev.map(s => {
            if (s.id === selectedSupplierForPay.id) {
                const nextBal = Math.max(0, s.balance - amt);
                triggerToast(`Payment of LKR ${amt.toLocaleString()} recorded for ${s.name}`);
                return { ...s, balance: nextBal };
            }
            return s;
        }));

        setShowPayModal(false);
        setPaymentAmount('');
    };

    return (
        <POSLayout>
            <Head title="Purchase Management" />
            <div className="flex flex-col h-full relative transition-colors duration-300">
                {/* Background glow */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-32 -right-24 w-[480px] h-[480px] bg-indigo-600/10 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
                </div>

                {/* Header */}
                <header className="relative z-10 px-6 py-4 bg-white dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
                            <ShoppingBag size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold leading-tight text-slate-900 dark:text-white">Purchase Management</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Manage supplier profiles, purchase orders (PO), Goods Received Notes (GRN), and invoices</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowAddSupplierModal(true)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all shadow-sm"
                        >
                            <Users size={14} /> Add Supplier
                        </button>
                        <button
                            onClick={() => setShowCreatePOModal(true)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all"
                        >
                            <Plus size={14} /> Create PO
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {/* KPI Stats cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        {[
                            { label: 'Outstanding Balance', val: `LKR ${stats.totalOwed.toLocaleString()}`, color: 'from-rose-500/25 text-rose-400 border-rose-500/30', icon: DollarSign },
                            { label: 'Pending POs', val: stats.activeOrders, color: 'from-amber-500/25 text-amber-400 border-amber-500/30', icon: Clock },
                            { label: 'GRNs Matched', val: stats.completedPurchases, color: 'from-emerald-500/25 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 },
                            { label: 'Total Purchases (Month)', val: `LKR ${stats.totalSpendThisMonth.toLocaleString()}`, color: 'from-indigo-500/25 text-indigo-400 border-indigo-500/30', icon: TrendingUp }
                        ].map((card, i) => {
                            const Icon = card.icon;
                            return (
                                <div key={i} className={`bg-gradient-to-br ${card.color} bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md flex items-center justify-between`}>
                                    <div>
                                        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">{card.label}</p>
                                        <p className="text-xl font-bold text-slate-800 dark:text-white mt-1">{card.val}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center border border-slate-200/40 dark:border-slate-800">
                                        <Icon size={16} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation Tabs & Search */}
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl">
                        {/* Tabs */}
                        <div className="flex rounded-xl p-0.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                            {[
                                { id: 'suppliers', label: 'Suppliers List', count: suppliers.length },
                                { id: 'pos', label: 'Purchase Orders (PO)', count: purchaseOrders.length },
                                { id: 'grns', label: 'Received Stock (GRN)', count: grns.length }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id); setSearch(''); }}
                                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                        activeTab === tab.id
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                    <span className="px-1.5 py-0.5 rounded-full bg-slate-950/20 dark:bg-white/10 text-[10px]">{tab.count}</span>
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full xl:w-72">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab}...`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Tab Panels */}
                    {activeTab === 'suppliers' && (
                        <div className="bg-white dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Code</th>
                                            <th className="px-6 py-4">Supplier Name</th>
                                            <th className="px-6 py-4">Contact Person</th>
                                            <th className="px-6 py-4">Phone / Email</th>
                                            <th className="px-6 py-4">Address</th>
                                            <th className="px-6 py-4 text-right">Balance Due</th>
                                            <th className="px-6 py-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                                        {filteredSuppliers.map(s => (
                                            <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-mono font-bold text-indigo-500 dark:text-indigo-400">{s.code}</td>
                                                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{s.name}</td>
                                                <td className="px-6 py-4">{s.contact}</td>
                                                <td className="px-6 py-4">
                                                    <div>{s.phone}</div>
                                                    <div className="text-[10px] text-slate-500">{s.email}</div>
                                                </td>
                                                <td className="px-6 py-4">{s.address}</td>
                                                <td className="px-6 py-4 text-right font-bold tabular-nums text-slate-900 dark:text-white">
                                                    LKR {s.balance.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {s.balance > 0 ? (
                                                        <button
                                                            onClick={() => { setSelectedSupplierForPay(s); setShowPayModal(true); }}
                                                            className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 hover:border-transparent rounded-lg transition-all text-[11px]"
                                                        >
                                                            Record Payment
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">Cleared</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pos' && (
                        <div className="bg-white dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">PO Ref</th>
                                            <th className="px-6 py-4">Supplier</th>
                                            <th className="px-6 py-4">Items Count</th>
                                            <th className="px-6 py-4">Order Value</th>
                                            <th className="px-6 py-4">Order Date</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                                        {filteredPO.map(po => (
                                            <tr key={po.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{po.id}</td>
                                                <td className="px-6 py-4 font-semibold">{po.supplier}</td>
                                                <td className="px-6 py-4">{po.itemsCount} lines</td>
                                                <td className="px-6 py-4 font-bold tabular-nums text-slate-900 dark:text-white">LKR {po.total.toLocaleString()}</td>
                                                <td className="px-6 py-4">{po.date}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                                        po.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        po.status === 'Approved' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    }`}>
                                                        {po.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {po.status === 'Pending' && (
                                                        <button
                                                            onClick={() => approvePO(po.id)}
                                                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-[11px] font-medium"
                                                        >
                                                            Approve PO
                                                        </button>
                                                    )}
                                                    {po.status === 'Approved' && (
                                                        <button
                                                            onClick={() => receiveGoods(po)}
                                                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-[11px] font-medium flex items-center gap-1.5 ml-auto"
                                                        >
                                                            <Truck size={12} /> Confirm Receipt
                                                        </button>
                                                    )}
                                                    {po.status === 'Received' && (
                                                        <span className="text-[10px] text-slate-500 italic">Matched {po.grnRef}</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'grns' && (
                        <div className="bg-white dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">GRN Ref</th>
                                            <th className="px-6 py-4">PO Ref</th>
                                            <th className="px-6 py-4">Supplier</th>
                                            <th className="px-6 py-4">Received Date</th>
                                            <th className="px-6 py-4">Storekeeper</th>
                                            <th className="px-6 py-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                                        {grns.map(g => (
                                            <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{g.id}</td>
                                                <td className="px-6 py-4 font-mono">{g.poRef}</td>
                                                <td className="px-6 py-4 font-semibold">{g.supplier}</td>
                                                <td className="px-6 py-4">{g.receivedDate}</td>
                                                <td className="px-6 py-4">{g.receivedBy}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-max">
                                                        <Check size={10} /> {g.status}
                                                    </span>
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
                        <Info size={16} className="text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-semibold">{toast}</span>
                    </div>
                )}

                {/* MODAL: Add Supplier */}
                {showAddSupplierModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddSupplierModal(false)} />
                        <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-slate-850 dark:text-white font-bold text-base">Add New Supplier</h2>
                                <button onClick={() => setShowAddSupplierModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={18} /></button>
                            </div>
                            <form onSubmit={handleSaveSupplier} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Company Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={supplierForm.name}
                                        onChange={e => setSupplierForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Contact Person</label>
                                        <input
                                            type="text"
                                            required
                                            value={supplierForm.contact}
                                            onChange={e => setSupplierForm(prev => ({ ...prev, contact: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Phone Number</label>
                                        <input
                                            type="text"
                                            required
                                            value={supplierForm.phone}
                                            onChange={e => setSupplierForm(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={supplierForm.email}
                                        onChange={e => setSupplierForm(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Office Address</label>
                                    <textarea
                                        rows={2}
                                        value={supplierForm.address}
                                        onChange={e => setSupplierForm(prev => ({ ...prev, address: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg"
                                >
                                    Save Supplier
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL: Create PO */}
                {showCreatePOModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreatePOModal(false)} />
                        <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-slate-850 dark:text-white font-bold text-base">Create Purchase Order</h2>
                                <button onClick={() => setShowCreatePOModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={18} /></button>
                            </div>
                            <form onSubmit={handleCreatePO} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Target Supplier</label>
                                    <select
                                        value={selectedSupplierForPO}
                                        onChange={e => setSelectedSupplierForPO(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
                                    >
                                        {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Items List</label>
                                        <button
                                            type="button"
                                            onClick={addPoItemField}
                                            className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1"
                                        >
                                            <PlusCircle size={12} /> Add Item
                                        </button>
                                    </div>
                                    <div className="space-y-2.5">
                                        {poItems.map((item, idx) => (
                                            <div key={idx} className="flex gap-2 items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-1 duration-150">
                                                <div className="flex-1">
                                                    <select
                                                        value={item.itemName}
                                                        onChange={e => updatePoItem(idx, 'itemName', e.target.value)}
                                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-850 dark:text-white"
                                                    >
                                                        {INVENTORY_ITEMS_FOR_PO.map(itm => <option key={itm.name} value={itm.name}>{itm.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="w-16">
                                                    <input
                                                        type="number"
                                                        required
                                                        placeholder="Qty"
                                                        value={item.qty}
                                                        onChange={e => updatePoItem(idx, 'qty', e.target.value)}
                                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-850 dark:text-white text-center"
                                                    />
                                                </div>
                                                <div className="w-20">
                                                    <input
                                                        type="number"
                                                        required
                                                        placeholder="Cost"
                                                        value={item.unitPrice}
                                                        onChange={e => updatePoItem(idx, 'unitPrice', e.target.value)}
                                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-850 dark:text-white text-right"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removePoItemField(idx)}
                                                    className="text-slate-500 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex items-center justify-between">
                                    <div className="text-left">
                                        <span className="text-[10px] text-slate-500 block uppercase">Total Estimated Value</span>
                                        <span className="text-base font-bold text-indigo-650 dark:text-indigo-400 tabular-nums">
                                            LKR {poItems.reduce((sum, item) => sum + (Number(item.qty) * Number(item.unitPrice)), 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/10"
                                    >
                                        Create PO Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL: Record Payment */}
                {showPayModal && selectedSupplierForPay && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPayModal(false)} />
                        <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-slate-850 dark:text-white font-bold text-base">Record Supplier Payment</h2>
                                <button onClick={() => setShowPayModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={18} /></button>
                            </div>
                            <form onSubmit={handlePaySupplier} className="p-6 space-y-4">
                                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <span className="text-[10px] text-slate-500 block uppercase">Supplier</span>
                                    <span className="text-xs font-bold text-slate-850 dark:text-white">{selectedSupplierForPay.name}</span>
                                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-850">
                                        <span className="text-[10px] text-slate-500 uppercase">Outstanding Balance</span>
                                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400">LKR {selectedSupplierForPay.balance.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Payment Amount (LKR)</label>
                                    <input
                                        type="number"
                                        required
                                        max={selectedSupplierForPay.balance}
                                        value={paymentAmount}
                                        onChange={e => setPaymentAmount(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Payment Method</label>
                                    <select
                                        value={paymentMethod}
                                        onChange={e => setPaymentMethod(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
                                    >
                                        <option value="Cash">Cash Drawer</option>
                                        <option value="Cheque">Bank Cheque</option>
                                        <option value="Bank Transfer">Direct Bank Transfer</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg"
                                >
                                    Confirm Payment
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </POSLayout>
    );
}
