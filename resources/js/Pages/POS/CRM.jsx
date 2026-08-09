import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
    Users,
    Search,
    Phone,
    Mail,
    Star,
    TrendingUp,
    MessageCircle,
    Heart,
    Filter,
    Plus,
    X,
    MapPin,
    Calendar,
    CreditCard,
    Crown,
    Gift,
    UserCircle,
    CheckCircle2,
} from 'lucide-react';
import POSLayout from '@/Layouts/POSLayout';

const CUSTOMERS = [
    { id: 1, name: 'Nuwan Perera', phone: '077-123-4567', email: 'nuwan@email.com', visits: 48, totalSpend: 18500, avgOrder: 385, tier: 'gold', joined: '2023-06-15', lastVisit: '2024-01-12', notes: 'Prefers window seat, allergic to peanuts', favorite: 'Chicken Kottu' },
    { id: 2, name: 'Samantha de Silva', phone: '071-987-6543', email: 'sam.de@email.com', visits: 32, totalSpend: 12400, avgOrder: 388, tier: 'gold', joined: '2023-08-20', lastVisit: '2024-01-11', notes: 'Regular Friday diner', favorite: 'Lamprais' },
    { id: 3, name: 'Rajitha Fernando', phone: '076-555-1234', email: 'rajitha@email.com', visits: 24, totalSpend: 8200, avgOrder: 342, tier: 'silver', joined: '2023-10-01', lastVisit: '2024-01-10', notes: 'Large group on weekends', favorite: 'Mutton Kottu' },
    { id: 4, name: 'Michelle Jayawardena', phone: '072-333-7890', email: 'michelle@email.com', visits: 18, totalSpend: 6750, avgOrder: 375, tier: 'silver', joined: '2023-11-05', lastVisit: '2024-01-09', notes: 'Loves desserts', favorite: 'Watalappan' },
    { id: 5, name: 'Kasun Bandara', phone: '075-222-4567', email: 'kasun@email.com', visits: 12, totalSpend: 3600, avgOrder: 300, tier: 'bronze', joined: '2023-12-10', lastVisit: '2024-01-08', notes: '', favorite: 'Hoppers' },
    { id: 6, name: 'Dilan Rathnayake', phone: '077-444-8901', email: 'dilan@email.com', visits: 8, totalSpend: 2100, avgOrder: 263, tier: 'bronze', joined: '2024-01-02', lastVisit: '2024-01-07', notes: 'First-time visitor, left 5-star review', favorite: 'Fish Ambul Thiyal' },
    { id: 7, name: 'Priyanka Wijeyaratne', phone: '071-666-2345', email: 'priya@email.com', visits: 41, totalSpend: 16800, avgOrder: 410, tier: 'gold', joined: '2023-05-20', lastVisit: '2024-01-12', notes: 'VIP - always tips well', favorite: 'Coconut Rice' },
    { id: 8, name: 'Tharindu Gunaratne', phone: '076-888-6789', email: 'tharindu@email.com', visits: 6, totalSpend: 1500, avgOrder: 250, tier: 'bronze', joined: '2024-01-05', lastVisit: '2024-01-06', notes: '', favorite: 'Cutlet' },
];

const TIER_CONFIG = {
    gold: { label: 'Gold', icon: Crown, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
    silver: { label: 'Silver', icon: Star, color: 'text-slate-500 dark:text-slate-300', bg: 'bg-slate-400/15', border: 'border-slate-400/30' },
    bronze: { label: 'Bronze', icon: Heart, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
};

function TierBadge({ tier }) {
    const config = TIER_CONFIG[tier];
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${config.bg} ${config.color} ${config.border}`}>
            <Icon size={12} />
            {config.label}
        </span>
    );
}

function CustomerModal({ customer, onClose }) {
    const [activeTab, setActiveTab] = useState('details');
    const [noteText, setNoteText] = useState('');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-205 dark:border-slate-700/60 flex items-center justify-between bg-white dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                            <h2 className="text-slate-855 dark:text-white font-bold text-base">{customer.name}</h2>
                            <TierBadge tier={customer.tier} />
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={18} /></button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-205 dark:border-slate-700/60 px-6 bg-white dark:bg-slate-800">
                    {['details', 'history', 'notes'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                                activeTab === tab
                                    ? 'border-indigo-500 text-indigo-650 dark:text-indigo-400'
                                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="px-6 py-5 min-h-56 bg-white dark:bg-slate-800">
                    {activeTab === 'details' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Total Visits', value: customer.visits, icon: Calendar },
                                    { label: 'Total Spend', value: `LKR ${customer.totalSpend.toLocaleString()}`, icon: CreditCard },
                                    { label: 'Avg. Order', value: `LKR ${customer.avgOrder}`, icon: TrendingUp },
                                    { label: 'Member Since', value: customer.joined, icon: UserCircle },
                                ].map(({ label, value, icon: Icon }) => (
                                    <div key={label} className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-100 dark:border-transparent">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon size={13} className="text-indigo-600 dark:text-indigo-400" />
                                            <span className="text-slate-500 dark:text-slate-400 text-xs">{label}</span>
                                        </div>
                                        <p className="text-slate-855 dark:text-white font-semibold text-sm">{value}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-100 dark:border-transparent">
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPin size={13} className="text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-slate-500 dark:text-slate-400 text-xs">Favorite Dish</span>
                                </div>
                                <p className="text-slate-855 dark:text-white font-medium text-sm">{customer.favorite}</p>
                            </div>
                            {customer.notes && (
                                <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-100 dark:border-transparent">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MessageCircle size={13} className="text-indigo-600 dark:text-indigo-400" />
                                        <span className="text-slate-500 dark:text-slate-400 text-xs">Notes</span>
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-350 text-sm">{customer.notes}</p>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <a href={`tel:${customer.phone}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-xl transition-colors hover:bg-emerald-600 hover:text-white">
                                    <Phone size={14} /> Call
                                </a>
                                <a href={`mailto:${customer.email}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-650 dark:text-indigo-400 text-sm font-medium rounded-xl transition-colors hover:bg-indigo-600 hover:text-white">
                                    <Mail size={14} /> Email
                                </a>
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-3">
                            {[
                                { date: '2024-01-12', items: 4, total: 1850, table: 'T3', status: 'paid' },
                                { date: '2024-01-08', items: 2, total: 900, table: 'T7', status: 'paid' },
                                { date: '2024-01-03', items: 5, total: 2200, table: 'T1', status: 'paid' },
                            ].map((order, i) => (
                                <div key={i} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-transparent rounded-xl p-3">
                                    <span className="text-slate-500 dark:text-slate-400 text-xs w-20">{order.date}</span>
                                    <span className="bg-indigo-500/15 text-indigo-650 dark:text-indigo-400 text-xs font-semibold px-2 py-0.5 rounded-full">{order.table}</span>
                                    <span className="text-slate-500 dark:text-slate-400 text-xs">{order.items} items</span>
                                    <span className="text-slate-855 dark:text-white font-semibold text-sm ml-auto">LKR {order.total.toLocaleString()}</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">Paid</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="space-y-3">
                            <textarea
                                value={noteText}
                                onChange={e => setNoteText(e.target.value)}
                                placeholder="Add a note about this customer..."
                                rows={4}
                                className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 rounded-xl px-3 py-2.5 text-sm text-slate-855 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none transition-colors"
                            />
                            <button
                                onClick={() => { setNoteText(''); onClose(); }}
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
                            >
                                Save Note
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CRM() {
    const [search, setSearch] = useState('');
    const [tierFilter, setTierFilter] = useState('all');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [toast, setToast] = useState(null);

    const filtered = useMemo(() => {
        return CUSTOMERS.filter(c => {
            const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                                c.email.toLowerCase().includes(search.toLowerCase());
            const matchTier = tierFilter === 'all' || c.tier === tierFilter;
            return matchSearch && matchTier;
        });
    }, [search, tierFilter]);

    const stats = {
        total: CUSTOMERS.length,
        gold: CUSTOMERS.filter(c => c.tier === 'gold').length,
        totalSpend: CUSTOMERS.reduce((s, c) => s + c.totalSpend, 0),
        avgSpend: Math.round(CUSTOMERS.reduce((s, c) => s + c.totalSpend, 0) / CUSTOMERS.length),
    };

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

    return (
        <POSLayout>
            <Head title="CRM" />
            <div className="flex flex-col h-full">
                {/* Header */}
                <header className="px-6 py-4 bg-white/80 dark:bg-slate-800/80 border-b border-slate-205 dark:border-slate-700/60 flex items-center justify-between flex-shrink-0 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-violet-650 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <Users size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-855 dark:text-white">Customer Relations</h1>
                            <p className="text-slate-550 dark:text-slate-400 text-xs mt-0.5">{stats.total} customers · LKR {stats.totalSpend.toLocaleString()} total spend</p>
                        </div>
                    </div>
                    <button
                        onClick={() => showToast('Add customer form coming soon')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/25"
                    >
                        <Plus size={15} />
                        Add Customer
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
                        {[
                            { label: 'Total Customers', value: stats.total, icon: Users, color: 'text-indigo-650 dark:text-indigo-400', bg: 'bg-indigo-500/10' },
                            { label: 'Gold Members', value: stats.gold, icon: Crown, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
                            { label: 'Total Revenue', value: `LKR ${(stats.totalSpend / 1000).toFixed(0)}k`, icon: TrendingUp, color: 'text-emerald-650 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
                            { label: 'Avg. Spend', value: `LKR ${stats.avgSpend}`, icon: Gift, color: 'text-violet-650 dark:text-violet-400', bg: 'bg-violet-500/10' },
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
                            <div className="relative flex-1">
                                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-600/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-855 dark:text-white placeholder-slate-405 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter size={14} className="text-slate-400 flex-shrink-0" />
                                {['all', 'gold', 'silver', 'bronze'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTierFilter(t)}
                                        className={`
                                            px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all
                                            ${tierFilter === t
                                                ? 'bg-indigo-650 text-white'
                                                : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-600/40'
                                            }
                                        `}
                                    >
                                        {t === 'all' ? 'All Tiers' : t.charAt(0).toUpperCase() + t.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Customer Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filtered.map(customer => {
                            const TierIcon = TIER_CONFIG[customer.tier].icon;
                            return (
                                <button
                                    key={customer.id}
                                    onClick={() => setSelectedCustomer(customer)}
                                    className="
                                        bg-white dark:bg-slate-800 border border-slate-205 dark:border-slate-700/60 rounded-2xl p-5 text-left
                                        hover:border-slate-300 dark:hover:border-slate-600/80 hover:bg-slate-50 dark:hover:bg-slate-750
                                        transition-all duration-200 group shadow-sm
                                    "
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="
                                            w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600
                                            flex items-center justify-center text-white font-bold text-sm
                                            flex-shrink-0 group-hover:scale-110 transition-transform duration-200
                                        ">
                                            {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-slate-855 dark:text-white font-semibold text-sm truncate">{customer.name}</p>
                                                <TierIcon size={14} className={TIER_CONFIG[customer.tier].color} />
                                            </div>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{customer.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs">Visits</p>
                                            <p className="text-slate-855 dark:text-white font-bold text-sm">{customer.visits}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs">Spend</p>
                                            <p className="text-indigo-650 dark:text-indigo-400 font-bold text-sm">LKR {(customer.totalSpend / 1000).toFixed(1)}k</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs">Last</p>
                                            <p className="text-slate-855 dark:text-white font-bold text-sm">{customer.lastVisit.slice(5)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700/40">
                                        <span className="text-slate-500 dark:text-slate-400 text-xs truncate">🍽️ {customer.favorite}</span>
                                        <TierBadge tier={customer.tier} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-550 gap-3">
                            <Users size={32} strokeWidth={1.5} />
                            <p className="text-sm font-medium">No customers found</p>
                            <p className="text-xs">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedCustomer && (
                <CustomerModal
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                />
            )}

            {toast && (
                <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 text-slate-855 dark:text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" />
                    {toast}
                </div>
            )}
        </POSLayout>
    );
}
