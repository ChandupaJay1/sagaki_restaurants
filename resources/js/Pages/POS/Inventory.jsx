import { useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    Package,
    Search,
    Plus,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Filter,
    Download,
    Edit3,
    Trash2,
    CheckCircle2,
    X,
    Tag,
    Beaker,
    Wheat,
    Beef,
    Coffee,
    Apple,
    Fish,
} from 'lucide-react';
import POSLayout from '@/Layouts/POSLayout';

const CATEGORIES = [
    { id: 'all',       label: 'All Items',    icon: Package },
    { id: 'proteins',  label: 'Proteins',     icon: Beef    },
    { id: 'produce',   label: 'Produce',      icon: Apple   },
    { id: 'dairy',     label: 'Dairy',        icon: Beaker  },
    { id: 'spices',    label: 'Spices',       icon: Wheat   },
    { id: 'beverages', label: 'Beverages',    icon: Coffee  },
    { id: 'seafood',   label: 'Seafood',      icon: Fish    },
];

const INVENTORY_DATA = [
    { id: 1,  name: 'Rice (5kg)',         category: 'proteins', qty: 4,  unit: 'bags',    minQty: 10, price: 1850,  supplier: 'Sathosa', lastOrder: '2024-01-10', status: 'low' },
    { id: 2,  name: 'Coconut Milk',       category: 'dairy',   qty: 6,  unit: 'tins',    minQty: 12, price: 280,   supplier: 'Nona Foods', lastOrder: '2024-01-08', status: 'low' },
    { id: 3,  name: 'Chicken (whole)',    category: 'proteins', qty: 28, unit: 'kg',      minQty: 20, price: 950,   supplier: 'Local Farm', lastOrder: '2024-01-12', status: 'ok' },
    { id: 4,  name: 'Chilli Powder',      category: 'spices',  qty: 1,  unit: 'kg',      minQty: 5,  price: 650,   supplier: 'Spice Garden', lastOrder: '2023-12-20', status: 'critical' },
    { id: 5,  name: 'Lemon',              category: 'produce', qty: 8,  unit: 'pcs',     minQty: 15, price: 45,    supplier: 'Local Market', lastOrder: '2024-01-11', status: 'low' },
    { id: 6,  name: 'Prawn (king)',       category: 'seafood', qty: 12, unit: 'kg',      minQty: 10, price: 2200,  supplier: 'SeaPort', lastOrder: '2024-01-09', status: 'ok' },
    { id: 7,  name: 'Mutton',             category: 'proteins', qty: 15, unit: 'kg',      minQty: 10, price: 1800,  supplier: 'Local Farm', lastOrder: '2024-01-12', status: 'ok' },
    { id: 8,  name: 'All-Purpose Flour', category: 'spices',  qty: 8,  unit: 'bags',    minQty: 10, price: 520,   supplier: 'Sathosa', lastOrder: '2024-01-05', status: 'low' },
    { id: 9,  name: 'Salt (fine)',        category: 'spices',  qty: 25, unit: 'kg',      minQty: 10, price: 120,   supplier: 'Sathosa', lastOrder: '2024-01-01', status: 'ok' },
    { id: 10, name: 'Curry Leaves',       category: 'produce', qty: 3,  unit: 'bundles', minQty: 5,  price: 80,    supplier: 'Local Market', lastOrder: '2024-01-10', status: 'low' },
    { id: 11, name: 'Fish (mackerel)',    category: 'seafood', qty: 18, unit: 'kg',      minQty: 10, price: 850,   supplier: 'SeaPort', lastOrder: '2024-01-12', status: 'ok' },
    { id: 12, name: 'Eggs',               category: 'dairy',   qty: 60, unit: 'pcs',     minQty: 30, price: 22,    supplier: 'Farm Fresh', lastOrder: '2024-01-11', status: 'ok' },
    { id: 13, name: 'Onion (red)',        category: 'produce', qty: 20, unit: 'kg',      minQty: 10, price: 180,   supplier: 'Local Market', lastOrder: '2024-01-09', status: 'ok' },
    { id: 14, name: 'Garlic',             category: 'produce', qty: 4,  unit: 'kg',      minQty: 5,  price: 450,   supplier: 'Local Market', lastOrder: '2024-01-07', status: 'low' },
    { id: 15, name: 'Coca-Cola Syrup',    category: 'beverages', qty: 3, unit: 'liters',  minQty: 5,  price: 1200,  supplier: 'Coke Lanka', lastOrder: '2023-12-28', status: 'critical' },
    { id: 16, name: 'Ceylon Tea Leaves',  category: 'beverages', qty: 5, unit: 'kg',      minQty: 3,  price: 1500,  supplier: 'Taproana', lastOrder: '2024-01-06', status: 'ok' },
    { id: 17, name: 'Vanilla Ice Cream',  category: 'dairy',   qty: 8,  unit: 'liters',  minQty: 5,  price: 950,   supplier: 'Ice Cream Co', lastOrder: '2024-01-08', status: 'ok' },
    { id: 18, name: 'Coconut (whole)',    category: 'produce', qty: 2,  unit: 'pcs',     minQty: 10, price: 85,    supplier: 'Local Market', lastOrder: '2024-01-04', status: 'critical' },
];

const CATEGORY_ICONS = {
    proteins: Beef,
    produce: Apple,
    dairy: Beaker,
    spices: Wheat,
    beverages: Coffee,
    seafood: Fish,
};

function StatusChip({ status }) {
    const styles = {
        ok: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        low: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
        critical: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 animate-pulse',
    };
    const labels = { ok: 'In Stock', low: 'Low', critical: 'Critical' };
    return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${styles[status]}`}>
            {labels[status]}
        </span>
    );
}

function StockBar({ qty, minQty }) {
    const pct = Math.min(100, (qty / minQty) * 100);
    const color = pct >= 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-200 dark:bg-slate-700/60 rounded-full h-1.5">
                <div className={`${color} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-450 tabular-nums whitespace-nowrap">{qty}/{minQty}</span>
        </div>
    );
}

function AddItemModal({ onClose, onAdd }) {
    const [form, setForm] = useState({ name: '', category: 'proteins', qty: '', unit: 'kg', minQty: '', price: '', supplier: '' });
    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-205 dark:border-slate-700/60 flex items-center justify-between">
                    <h2 className="text-slate-850 dark:text-white font-bold text-sm">Add New Item</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={18} /></button>
                </div>
                <div className="px-6 py-5 space-y-4">
                    {[
                        { key: 'name', label: 'Item Name', type: 'text' },
                        { key: 'supplier', label: 'Supplier', type: 'text' },
                        { key: 'price', label: 'Unit Price (LKR)', type: 'number' },
                        { key: 'qty', label: 'Current Quantity', type: 'number' },
                        { key: 'minQty', label: 'Minimum Qty', type: 'number' },
                    ].map(({ key, label, type }) => (
                        <div key={key}>
                            <label className="block text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">{label}</label>
                            <input
                                type={type}
                                value={form[key]}
                                onChange={e => set(key, type === 'number' ? e.target.value : e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-600/60 rounded-xl px-3 py-2.5 text-slate-855 dark:text-white text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-colors"
                                placeholder={label}
                            />
                        </div>
                    ))}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">Category</label>
                            <select
                                value={form.category}
                                onChange={e => set('category', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-600/60 rounded-xl px-3 py-2.5 text-slate-855 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                            >
                                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                                    <option key={c.id} value={c.id}>{c.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-500 dark:text-slate-400 text-xs font-medium mb-1.5">Unit</label>
                            <select
                                value={form.unit}
                                onChange={e => set('unit', e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-600/60 rounded-xl px-3 py-2.5 text-slate-855 dark:text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none"
                            >
                                {['kg', 'pcs', 'bags', 'tins', 'liters', 'bundles'].map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-205 dark:border-slate-700/60 flex items-center justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors">Cancel</button>
                    <button
                        onClick={() => { onAdd({ ...form, qty: Number(form.qty), minQty: Number(form.minQty), price: Number(form.price), status: 'ok', lastOrder: new Date().toISOString().split('T')[0] }); onClose(); }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                        Add Item
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Inventory() {
    const [items, setItems] = useState(INVENTORY_DATA);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAdd, setShowAdd] = useState(false);
    const [toast, setToast] = useState(null);

    const filtered = items.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === 'all' || item.category === category;
        const matchStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchSearch && matchCat && matchStatus;
    });

    const totalValue = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const lowStockCount = items.filter(i => i.status !== 'ok').length;
    const criticalCount = items.filter(i => i.status === 'critical').length;

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    const handleAdd = (newItem) => {
        setItems(prev => [...prev, { ...newItem, id: Date.now() }]);
        showToast('Item added successfully');
    };

    const handleDelete = (id) => {
        setItems(prev => prev.filter(i => i.id !== id));
        showToast('Item removed');
    };

    const CatIcon = category !== 'all' ? (CATEGORIES.find(c => c.id === category)?.icon || Package) : Package;

    return (
        <POSLayout>
            <Head title="Inventory" />
            <div className="flex flex-col h-full">
                {/* Header */}
                <header className="px-6 py-4 bg-white/85 dark:bg-slate-800/80 border-b border-slate-205 dark:border-slate-700/60 flex items-center justify-between flex-shrink-0 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-violet-650 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <Package size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-855 dark:text-white">Inventory Management</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{items.length} items · LKR {totalValue.toLocaleString()} total value</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/25"
                    >
                        <Plus size={15} />
                        Add Item
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                        {[
                            { label: 'Total Items', value: items.length, icon: Package, color: 'text-indigo-650 dark:text-indigo-400', bg: 'bg-indigo-500/10' },
                            { label: 'Total Value', value: `LKR ${(totalValue / 1000).toFixed(0)}k`, icon: TrendingUp, color: 'text-emerald-650 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
                            { label: 'Low Stock', value: lowStockCount, icon: AlertTriangle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
                            { label: 'Critical', value: criticalCount, icon: TrendingDown, color: 'text-red-655 dark:text-red-400', bg: 'bg-red-500/10' },
                        ].map(({ label, value, icon: Icon, color, bg }) => (
                            <div key={label} className="bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700/60 rounded-xl p-4 flex items-center gap-3">
                                <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                    <Icon size={16} className={color} />
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-xs">{label}</p>
                                    <p className={`font-bold text-base ${color}`}>{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700/60 rounded-2xl p-4 mb-5 shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search items..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-600/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-855 dark:text-white placeholder-slate-450 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>

                            {/* Category tabs */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                <Filter size={14} className="text-slate-400 flex-shrink-0" />
                                {CATEGORIES.map(cat => {
                                    const Icon = cat.icon;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setCategory(cat.id)}
                                            className={`
                                                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                                whitespace-nowrap transition-all duration-200
                                                ${category === cat.id
                                                    ? 'bg-indigo-650 text-white'
                                                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-600/40'
                                                }
                                            `}
                                        >
                                            <Icon size={12} />
                                            {cat.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Status filter */}
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600/40 rounded-xl px-3 py-2.5 text-sm text-slate-855 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none flex-shrink-0"
                            >
                                <option value="all">All Status</option>
                                <option value="ok">In Stock</option>
                                <option value="low">Low</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700/40 text-left">
                                        {['Item', 'Category', 'Stock Level', 'Price', 'Status', 'Supplier', '', ''].map((h, i) => (
                                            <th key={i} className="px-5 py-3 text-slate-450 dark:text-slate-500 text-xs font-semibold G tracking-wider whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/40">
                                    {filtered.map((item) => {
                                        const CatIcon = CATEGORY_ICONS[item.category] || Package;
                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors group">
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700/60 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <CatIcon size={14} className="text-slate-500 dark:text-slate-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-slate-855 dark:text-white font-medium text-sm truncate max-w-[160px]">{item.name}</p>
                                                            <p className="text-slate-500 dark:text-slate-400 text-xs">{item.lastOrder}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="text-slate-500 dark:text-slate-400 text-xs capitalize">{item.category}</span>
                                                </td>
                                                <td className="px-5 py-3.5 w-40">
                                                    <StockBar qty={item.qty} minQty={item.minQty} />
                                                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{item.qty} {item.unit}</p>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="text-slate-855 dark:text-white font-semibold tabular-nums">LKR {item.price.toLocaleString()}</span>
                                                    <p className="text-slate-500 dark:text-slate-400 text-xs">per {item.unit}</p>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <StatusChip status={item.status} />
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="text-slate-500 dark:text-slate-400 text-xs">{item.supplier}</span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <button
                                                        onClick={() => showToast(`Editing ${item.name}`)}
                                                        className="text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors p-1"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-slate-400 hover:text-red-655 dark:hover:text-red-400 transition-colors p-1"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {filtered.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-550 gap-3">
                                <Package size={32} strokeWidth={1.5} />
                                <p className="text-sm font-medium">No items found</p>
                                <p className="text-xs">Try adjusting your filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showAdd && <AddItemModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}

            {toast && (
                <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 text-slate-855 dark:text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" />
                    {toast}
                </div>
            )}
        </POSLayout>
    );
}
