import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
    Truck,
    MapPin,
    Users,
    DollarSign,
    CheckCircle,
    Navigation,
    User,
    Phone,
    MessageSquare,
    Clock,
    Plus,
    X,
    Compass,
    Bell,
    Check,
    AlertCircle,
    Activity
} from 'lucide-react';
import POSLayout from '@/Layouts/POSLayout';
import { useTheme } from '@/Components/ThemeProvider';

// Mock Data
const INITIAL_RIDERS = [
    { id: 1, name: 'Sunil Shantha', phone: '077-111-2222', status: 'Idle', completed: 8, rating: 4.8 },
    { id: 2, name: 'Rayan Gomez', phone: '077-333-4444', status: 'Out for Delivery', completed: 5, rating: 4.9 },
    { id: 3, name: 'Arshad Khan', phone: '076-555-6666', status: 'Out for Delivery', completed: 4, rating: 4.6 },
    { id: 4, name: 'Pradeep Silva', phone: '071-888-9999', status: 'Offline', completed: 0, rating: 4.2 },
];

const INITIAL_DELIVERIES = [
    {
        id: 'DEL-809',
        customer: 'Anura Kumara',
        address: 'No 45, Flower Road, Colombo 03',
        distance: 2.8, // in km
        charge: 150,
        total: 2450,
        status: 'Dispatched',
        rider: 'Rayan Gomez',
        timeElapsed: '12 min ago',
        phone: '077-123-4567',
        coordinates: { x: 180, y: 150 }
    },
    {
        id: 'DEL-810',
        customer: 'Fathima Rushda',
        address: '12/1, Galle Road, Bambalapitiya',
        distance: 4.5,
        charge: 250,
        total: 1850,
        status: 'Out for Delivery',
        rider: 'Arshad Khan',
        timeElapsed: '25 min ago',
        phone: '071-987-6543',
        coordinates: { x: 120, y: 220 }
    },
    {
        id: 'DEL-811',
        customer: 'Priyantha Mendis',
        address: 'No 108, Baseline Road, Borella',
        distance: 5.2,
        charge: 300,
        total: 3600,
        status: 'Pending Assignment',
        rider: null,
        timeElapsed: '3 min ago',
        phone: '076-222-3333',
        coordinates: { x: 300, y: 100 }
    },
    {
        id: 'DEL-808',
        customer: 'Dilshan Perera',
        address: 'No 3A, Inner Circular Rd, Colombo 07',
        distance: 1.5,
        charge: 100,
        total: 4200,
        status: 'Delivered',
        rider: 'Sunil Shantha',
        timeElapsed: '52 min ago',
        phone: '072-444-5555',
        coordinates: { x: 220, y: 80 }
    }
];

export default function DeliveryManagement() {
    const { isDarkMode } = useTheme();
    const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
    const [riders, setRiders] = useState(INITIAL_RIDERS);
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState(null);

    // Modal / Dialog control states
    const [assigningDelivery, setAssigningDelivery] = useState(null);
    const [notifyingDelivery, setNotifyingDelivery] = useState(null);
    const [showNewDeliveryModal, setShowNewDeliveryModal] = useState(false);

    // Form states
    const [newDeliveryForm, setNewDeliveryForm] = useState({
        customer: '',
        address: '',
        distance: '',
        charge: '',
        total: '',
        phone: ''
    });

    const triggerToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    // Calculate delivery metrics
    const stats = useMemo(() => {
        return {
            active: deliveries.filter(d => d.status !== 'Delivered').length,
            pending: deliveries.filter(d => d.status === 'Pending Assignment').length,
            idleRiders: riders.filter(r => r.status === 'Idle').length,
            totalRevenue: deliveries.filter(d => d.status === 'Delivered').reduce((sum, d) => sum + d.charge, 0)
        };
    }, [deliveries, riders]);

    // Calculate delivery charge automatically based on distance input
    const calculateDeliveryCharge = (dist) => {
        const kms = parseFloat(dist);
        if (isNaN(kms) || kms <= 0) return 0;
        if (kms <= 2) return 100;
        if (kms <= 4) return 180;
        if (kms <= 6) return 250;
        return 350; // Flat for >6km
    };

    const handleDistanceChange = (val) => {
        const charge = calculateDeliveryCharge(val);
        setNewDeliveryForm(prev => ({
            ...prev,
            distance: val,
            charge: charge.toString()
        }));
    };

    // Filtered deliveries list
    const filteredDeliveries = useMemo(() => {
        return deliveries.filter(d => 
            d.customer.toLowerCase().includes(search.toLowerCase()) ||
            d.id.toLowerCase().includes(search.toLowerCase()) ||
            d.address.toLowerCase().includes(search.toLowerCase())
        );
    }, [deliveries, search]);

    // Handlers
    const handleAssignRider = (riderName) => {
        setDeliveries(prev => prev.map(d => {
            if (d.id === assigningDelivery.id) {
                return { ...d, rider: riderName, status: 'Dispatched' };
            }
            return d;
        }));

        setRiders(prev => prev.map(r => {
            if (r.name === riderName) {
                return { ...r, status: 'Out for Delivery' };
            }
            return r;
        }));

        triggerToast(`Assigned ${riderName} to order ${assigningDelivery.id}`);
        setAssigningDelivery(null);
    };

    const handleUpdateStatus = (id, nextStatus) => {
        setDeliveries(prev => prev.map(d => {
            if (d.id === id) {
                // If moving to delivered, free the rider
                if (nextStatus === 'Delivered') {
                    setRiders(rPrev => rPrev.map(r => {
                        if (r.name === d.rider) {
                            return { ...r, status: 'Idle', completed: r.completed + 1 };
                        }
                        return r;
                    }));
                }
                triggerToast(`Order ${id} is now ${nextStatus}`);
                return { ...d, status: nextStatus };
            }
            return d;
        }));
    };

    const handleCreateDelivery = (e) => {
        e.preventDefault();
        const f = newDeliveryForm;
        if (!f.customer || !f.address || !f.total || !f.phone) {
            triggerToast('Please complete all required fields');
            return;
        }

        const newDel = {
            id: `DEL-${Math.floor(800 + Math.random() * 200)}`,
            customer: f.customer,
            address: f.address,
            distance: Number(f.distance || 2),
            charge: Number(f.charge || 150),
            total: Number(f.total),
            status: 'Pending Assignment',
            rider: null,
            timeElapsed: 'Just now',
            phone: f.phone,
            coordinates: {
                x: 100 + Math.floor(Math.random() * 250),
                y: 50 + Math.floor(Math.random() * 200)
            }
        };

        setDeliveries(prev => [newDel, ...prev]);
        setShowNewDeliveryModal(false);
        setNewDeliveryForm({ customer: '', address: '', distance: '', charge: '', total: '', phone: '' });
        triggerToast(`Delivery order created for ${f.customer}`);
    };

    const handleSendNotification = (delivery) => {
        setNotifyingDelivery(delivery);
    };

    const triggerNotificationSend = (channel) => {
        triggerToast(`Notification sent to ${notifyingDelivery.customer} via ${channel}`);
        setNotifyingDelivery(null);
    };

    return (
        <POSLayout>
            <Head title="Delivery Management" />
            <div className="flex flex-col h-full relative transition-colors duration-300">
                {/* Background glow */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 -left-24 w-[480px] h-[480px] bg-indigo-600/10 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
                </div>

                {/* Header */}
                <header className="relative z-10 px-6 py-4 bg-white dark:bg-slate-900/80 border-b border-slate-205 dark:border-slate-800/80 backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
                            <Truck size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold leading-tight text-slate-855 dark:text-white">Delivery Management</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Dispatch active orders, monitor delivery status, assign riders, and contact customers</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowNewDeliveryModal(true)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all self-start md:self-auto"
                    >
                        <Plus size={14} /> New Delivery
                    </button>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {/* KPI metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        {[
                            { label: 'Active Deliveries', val: stats.active, color: 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border-indigo-500/30', icon: Activity },
                            { label: 'Unassigned Orders', val: stats.pending, color: 'bg-amber-500/10 text-amber-650 dark:text-amber-400 border-amber-500/30', icon: AlertCircle },
                            { label: 'Available Riders', val: stats.idleRiders, color: 'bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border-emerald-500/30', icon: Users },
                            { label: 'Charges Revenue', val: `LKR ${stats.totalRevenue.toLocaleString()}`, color: 'bg-teal-500/10 text-teal-650 dark:text-teal-400 border-teal-500/30', icon: DollarSign }
                        ].map((card, idx) => {
                            const Icon = card.icon;
                            return (
                                <div key={idx} className={`${card.color} bg-white dark:bg-slate-900/80 border border-slate-205 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between`}>
                                    <div>
                                        <span className="text-slate-500 dark:text-slate-450 text-[10px] font-bold uppercase tracking-wider">{card.label}</span>
                                        <p className="text-xl font-bold mt-1">{card.val}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center border border-slate-200/40 dark:border-slate-800 flex-shrink-0">
                                        <Icon size={16} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Split Pane: Deliveries list + Map visualizer */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Deliveries List Pane */}
                        <div className="lg:col-span-7 space-y-4">
                            <div className="flex items-center gap-3 bg-white dark:bg-slate-900/80 border border-slate-205 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                                <Search className="text-slate-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search active delivery orders..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-transparent text-xs text-slate-855 dark:text-slate-200 placeholder-slate-400 focus:outline-none"
                                />
                            </div>

                            <div className="space-y-3.5">
                                {filteredDeliveries.map(d => (
                                    <div
                                        key={d.id}
                                        className={`rounded-2xl border bg-white dark:bg-slate-900/80 p-5 shadow-sm transition-all duration-300 ${
                                            d.status === 'Pending Assignment' ? 'border-amber-500/30 bg-amber-500/[0.02]' :
                                            d.status === 'Delivered' ? 'border-emerald-500/20 opacity-70' :
                                            'border-slate-205 dark:border-slate-800'
                                        }`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3.5">
                                            {/* Order ID & Customer Info */}
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-mono text-xs font-bold text-slate-905 dark:text-white bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">{d.id}</span>
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                                                        d.status === 'Pending Assignment' ? 'bg-amber-500/10 text-amber-655 border-amber-500/25' :
                                                        d.status === 'Dispatched' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25' :
                                                        d.status === 'Out for Delivery' ? 'bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border-indigo-500/25' :
                                                        'bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border-emerald-500/25'
                                                    }`}>
                                                        {d.status}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-semibold text-slate-855 dark:text-white leading-snug">{d.customer}</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 mt-1 leading-normal">
                                                    <MapPin size={11} className="text-indigo-650 dark:text-indigo-400 flex-shrink-0" />
                                                    {d.address}
                                                </p>
                                            </div>

                                            {/* Pricing & Distance */}
                                            <div className="text-left sm:text-right flex-shrink-0">
                                                <div className="text-sm font-bold text-indigo-650 dark:text-indigo-400">LKR {d.total.toLocaleString()}</div>
                                                <div className="text-[10px] text-slate-500 mt-0.5">Dist: {d.distance} km (Charge: LKR {d.charge})</div>
                                                <div className="text-[10px] text-slate-500 flex items-center justify-start sm:justify-end gap-1 mt-1">
                                                    <Clock size={10} /> {d.timeElapsed}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rider Detail Section */}
                                        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800 flex-shrink-0">
                                                    <User size={13} className="text-slate-400" />
                                                </div>
                                                <div>
                                                    <span className="text-[9px] uppercase font-bold text-slate-500 block">Rider Assigned</span>
                                                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-300">
                                                        {d.rider || <span className="text-amber-600 dark:text-amber-500 font-medium italic">Unassigned</span>}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action triggers */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <button
                                                    onClick={() => handleSendNotification(d)}
                                                    className="p-2 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                                                    title="Send Customer Notification"
                                                >
                                                    <Bell size={13} />
                                                </button>
                                                <a
                                                    href={`tel:${d.phone}`}
                                                    className="p-2 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
                                                    title="Call Customer"
                                                >
                                                    <Phone size={13} />
                                                </a>

                                                {d.status === 'Pending Assignment' && (
                                                    <button
                                                        onClick={() => setAssigningDelivery(d)}
                                                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                                                    >
                                                        Assign Rider
                                                    </button>
                                                )}
                                                {d.status === 'Dispatched' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(d.id, 'Out for Delivery')}
                                                        className="px-3.5 py-1.5 bg-indigo-600/10 hover:bg-indigo-500 text-indigo-650 hover:text-white border border-indigo-500/20 hover:border-transparent rounded-xl text-xs font-semibold transition-all"
                                                    >
                                                        Out for Delivery
                                                    </button>
                                                )}
                                                {d.status === 'Out for Delivery' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(d.id, 'Delivered')}
                                                        className="px-3.5 py-1.5 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-650 hover:text-white border border-emerald-500/20 hover:border-transparent rounded-xl text-xs font-semibold transition-all"
                                                    >
                                                        Mark Delivered
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Dark Map visualizer + Riders Pane */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* SVG mockup Map */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl overflow-hidden relative shadow-sm h-80">
                                <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                                    <Compass className="animate-spin text-indigo-650 dark:text-indigo-400 h-3.5 w-3.5" />
                                    Live Dispatch Board Map (Mock)
                                </div>

                                {/* Custom SVG Map Graphic */}
                                <svg className={`w-full h-full ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`} viewBox="0 0 400 300">
                                    {/* Streets Grid */}
                                    <path d="M 0,50 L 400,50 M 0,130 L 400,130 M 0,220 L 400,220" stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} strokeWidth="6" strokeLinecap="round" />
                                    <path d="M 100,0 L 100,300 M 230,0 L 230,300 M 350,0 L 350,300" stroke={isDarkMode ? '#1e293b' : '#e2e8f0'} strokeWidth="6" strokeLinecap="round" />
                                    <path d="M 0,0 L 400,300" stroke={isDarkMode ? '#0f172a' : '#cbd5e1'} strokeWidth="2" strokeDasharray="5" />

                                    {/* Main Outlet Center Pin */}
                                    <circle cx="200" cy="120" r="14" fill="#6366f1" fillOpacity="0.2" />
                                    <circle cx="200" cy="120" r="8" fill="#4f46e5" />
                                    <circle cx="200" cy="120" r="3" fill="#ffffff" />
                                    <text x="200" y="102" textAnchor="middle" fill="#6366f1" fontSize="8" fontWeight="bold">SAGAKI POS OUTLET</text>

                                    {/* active delivery pins */}
                                    {deliveries.filter(d => d.status !== 'Delivered').map(d => (
                                        <g key={d.id} className="cursor-pointer" onClick={() => triggerToast(`Customer: ${d.customer}`)}>
                                            {/* Pulse ring */}
                                            <circle cx={d.coordinates.x} cy={d.coordinates.y} r="10" fill={d.status === 'Pending Assignment' ? '#f59e0b' : '#3b82f6'} fillOpacity="0.2" className="animate-ping" />
                                            {/* Pin dot */}
                                            <circle cx={d.coordinates.x} cy={d.coordinates.y} r="5" fill={d.status === 'Pending Assignment' ? '#d97706' : '#2563eb'} />
                                            {/* Label tag */}
                                            <rect x={d.coordinates.x - 20} y={d.coordinates.y - 18} width="40" height="10" rx="3" fill={isDarkMode ? '#0f172a' : '#ffffff'} stroke={d.status === 'Pending Assignment' ? '#f59e0b' : '#3b82f6'} strokeWidth="1" />
                                            <text x={d.coordinates.x} y={d.coordinates.y - 10} textAnchor="middle" fill={isDarkMode ? '#ffffff' : '#334155'} fontSize="7" fontFamily="monospace">{d.id}</text>
                                        </g>
                                    ))}
                                </svg>
                            </div>

                            {/* Riders status list */}
                            <div className="bg-white dark:bg-slate-900/80 border border-slate-205 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                                <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-wider">Riders Status</h3>
                                <div className="space-y-3">
                                    {riders.map(r => (
                                        <div key={r.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-650 dark:text-indigo-400 font-semibold text-xs border border-indigo-500/10">
                                                    {r.name.split(' ').map(w => w[0]).join('')}
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-semibold text-slate-855 dark:text-white leading-normal">{r.name}</h4>
                                                    <span className="text-[10px] text-slate-500">{r.phone} · ★ {r.rating}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                                                    r.status === 'Idle' ? 'bg-emerald-400' :
                                                    r.status === 'Offline' ? 'bg-slate-500' : 'bg-blue-400'
                                                }`} />
                                                <span className={`text-[10px] font-medium uppercase ${
                                                    r.status === 'Idle' ? 'text-emerald-600 dark:text-emerald-400' :
                                                    r.status === 'Offline' ? 'text-slate-500' : 'text-blue-650 dark:text-blue-400'
                                                }`}>
                                                    {r.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Toast Notification */}
                {toast && (
                    <div className="fixed bottom-6 right-6 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-855 dark:text-white rounded-xl px-4 py-3 shadow-2xl flex items-center gap-2 animate-bounce">
                        <CheckCircle size={16} className="text-indigo-650 dark:text-indigo-400" />
                        <span className="text-xs font-semibold">{toast}</span>
                    </div>
                )}

                {/* MODAL: Assign Rider */}
                {assigningDelivery && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAssigningDelivery(null)} />
                        <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-slate-855 dark:text-white font-bold text-base font-sans">Assign Active Rider</h2>
                                <button onClick={() => setAssigningDelivery(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={18} /></button>
                            </div>
                            <div className="p-6 space-y-4 bg-white dark:bg-slate-900">
                                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                                    <div className="text-slate-500 uppercase text-[9px] font-bold">Delivery Destination</div>
                                    <div className="font-semibold text-slate-855 dark:text-white mt-0.5">{assigningDelivery.customer}</div>
                                    <div className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5 leading-normal">{assigningDelivery.address}</div>
                                </div>

                                <div className="space-y-2">
                                    <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Available Riders</span>
                                    <div className="space-y-2">
                                        {riders.filter(r => r.status === 'Idle').map(r => (
                                            <button
                                                key={r.id}
                                                onClick={() => handleAssignRider(r.name)}
                                                className="w-full text-left bg-slate-55 dark:bg-slate-950 hover:bg-indigo-600/5 dark:hover:bg-indigo-600/10 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/30 flex items-center justify-between transition-colors group"
                                            >
                                                <div>
                                                    <span className="text-xs font-semibold text-slate-855 dark:text-white block group-hover:text-indigo-650 dark:group-hover:text-indigo-400">{r.name}</span>
                                                    <span className="text-[10px] text-slate-500">★ {r.rating} · {r.completed} trips today</span>
                                                </div>
                                                <Check size={14} className="text-transparent group-hover:text-indigo-650 dark:group-hover:text-indigo-400" />
                                            </button>
                                        ))}
                                        {riders.filter(r => r.status === 'Idle').length === 0 && (
                                            <div className="text-center p-4 bg-slate-50 dark:bg-slate-950 border border-slate-202 dark:border-slate-800 text-slate-500 text-xs italic rounded-xl">
                                                No idle riders available right now.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: Customer Notification Dialog */}
                {notifyingDelivery && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNotifyingDelivery(null)} />
                        <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-slate-202 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-slate-855 dark:text-white font-bold text-base">Send Dispatch SMS / WhatsApp</h2>
                                <button onClick={() => setNotifyingDelivery(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={18} /></button>
                            </div>
                            <div className="p-6 space-y-4 bg-white dark:bg-slate-900">
                                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                                    <div className="text-slate-500 dark:text-slate-450 font-bold uppercase text-[9px] mb-2 flex items-center gap-1"><MessageSquare size={10} /> Message Template Preview</div>
                                    <p className="leading-relaxed">
                                        "Dear <strong>{notifyingDelivery.customer}</strong>, your order <strong>{notifyingDelivery.id}</strong> has been dispatched via rider <strong>{notifyingDelivery.rider || 'Delivery Partner'}</strong>. Live tracking link: https://sagaki.lk/t/{notifyingDelivery.id.toLowerCase()}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => triggerNotificationSend('SMS')}
                                        className="py-2.5 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-855 dark:text-white rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-850 transition-colors"
                                    >
                                        SMS Channel
                                    </button>
                                    <button
                                        onClick={() => triggerNotificationSend('WhatsApp')}
                                        className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors"
                                    >
                                        WhatsApp API
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: New Delivery Order Form */}
                {showNewDeliveryModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewDeliveryModal(false)} />
                        <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-slate-855 dark:text-white font-bold text-base">New Delivery Order</h2>
                                <button onClick={() => setShowNewDeliveryModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={18} /></button>
                            </div>
                            <form onSubmit={handleCreateDelivery} className="p-6 space-y-4 bg-white dark:bg-slate-900">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Customer Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={newDeliveryForm.customer}
                                            onChange={e => setNewDeliveryForm(prev => ({ ...prev, customer: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-855 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Phone Number</label>
                                        <input
                                            type="text"
                                            required
                                            value={newDeliveryForm.phone}
                                            onChange={e => setNewDeliveryForm(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-855 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Delivery Address</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="No, Street, City"
                                        value={newDeliveryForm.address}
                                        onChange={e => setNewDeliveryForm(prev => ({ ...prev, address: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-855 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Distance (km)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            placeholder="2.5"
                                            value={newDeliveryForm.distance}
                                            onChange={e => handleDistanceChange(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-855 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Charge (LKR)</label>
                                        <input
                                            type="number"
                                            required
                                            value={newDeliveryForm.charge}
                                            onChange={e => setNewDeliveryForm(prev => ({ ...prev, charge: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-855 dark:text-white focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Order Total (LKR)</label>
                                        <input
                                            type="number"
                                            required
                                            placeholder="1500"
                                            value={newDeliveryForm.total}
                                            onChange={e => setNewDeliveryForm(prev => ({ ...prev, total: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-855 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg"
                                >
                                    Add Order to Pending
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </POSLayout>
    );
}
