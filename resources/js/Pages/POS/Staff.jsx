import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
    UserCheck,
    Plus,
    Search,
    Shield,
    Users,
    Activity,
    Clock,
    X,
    Filter,
    Check,
    Lock,
    Key,
    Phone,
    Mail,
    AlertTriangle,
    Eye,
    Edit2,
    Trash2,
    Calendar,
    Settings
} from 'lucide-react';
import POSLayout from '@/Layouts/POSLayout';

// Mock Data
const INITIAL_STAFF = [
    { id: 1, name: 'Amali Perera', role: 'Cashier', email: 'amali@sagaki.lk', phone: '077-111-2222', status: 'On Duty', checkIn: '08:00 AM', checkOut: '--', hours: '6.5 hrs' },
    { id: 2, name: 'Kamali Silva', role: 'Cashier', email: 'kamali@sagaki.lk', phone: '077-333-4444', status: 'Off Duty', checkIn: '08:00 AM', checkOut: '04:00 PM', hours: '8.0 hrs' },
    { id: 3, name: 'Ravi Fernando', role: 'Waiter', email: 'ravi@sagaki.lk', phone: '076-555-6666', status: 'On Duty', checkIn: '11:30 AM', checkOut: '--', hours: '3.0 hrs' },
    { id: 4, name: 'Nimal Jayawardena', role: 'Kitchen Staff', email: 'nimal@sagaki.lk', phone: '071-888-9999', status: 'On Duty', checkIn: '07:30 AM', checkOut: '--', hours: '7.0 hrs' },
    { id: 5, name: 'Sahan Alwis', role: 'Branch Manager', email: 'sahan@sagaki.lk', phone: '077-444-5555', status: 'On Duty', checkIn: '07:45 AM', checkOut: '--', hours: '6.75 hrs' },
    { id: 6, name: 'Pathum Bandara', role: 'Store Keeper', email: 'pathum@sagaki.lk', phone: '072-888-1111', status: 'Off Duty', checkIn: '--', checkOut: '--', hours: '0.0 hrs' },
];

const INITIAL_PERMISSIONS = {
    'Super Admin': { pos: true, menu: true, inventory: true, purchases: true, reports: true, settings: true },
    'Branch Manager': { pos: true, menu: true, inventory: true, purchases: true, reports: true, settings: false },
    'Cashier': { pos: true, menu: false, inventory: false, purchases: false, reports: false, settings: false },
    'Waiter': { pos: true, menu: false, inventory: false, purchases: false, reports: false, settings: false },
    'Kitchen Staff': { pos: false, menu: false, inventory: true, purchases: false, reports: false, settings: false },
    'Store Keeper': { pos: false, menu: false, inventory: true, purchases: true, reports: false, settings: false },
};

const INITIAL_LOGS = [
    { id: 101, time: '2026-08-08 09:12 PM', staff: 'Amali Perera', role: 'Cashier', action: 'Settled Order ORD-142 (LKR 4,200)', ip: '192.168.1.52', severity: 'low' },
    { id: 102, time: '2026-08-08 08:34 PM', staff: 'Sahan Alwis', role: 'Branch Manager', action: 'Approved Purchase Order PO-2026-002', ip: '192.168.1.10', severity: 'medium' },
    { id: 103, time: '2026-08-08 07:15 PM', staff: 'Nimal Jayawardena', role: 'Kitchen Staff', action: 'Updated status of KDS order #141 to Preparing', ip: '192.168.1.40', severity: 'low' },
    { id: 104, time: '2026-08-08 05:42 PM', staff: 'Sahan Alwis', role: 'Branch Manager', action: 'Unauthorized settings modification attempt blocked', ip: '192.168.1.10', severity: 'high' },
    { id: 105, time: '2026-08-08 04:00 PM', staff: 'Kamali Silva', role: 'Cashier', action: 'Clocked Out of Station 2', ip: '192.168.1.51', severity: 'low' },
];

export default function StaffManagement() {
    const [staff, setStaff] = useState(INITIAL_STAFF);
    const [permissions, setPermissions] = useState(INITIAL_PERMISSIONS);
    const [logs, setLogs] = useState(INITIAL_LOGS);
    const [activeTab, setActiveTab] = useState('directory');
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState(null);

    // Modal control
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);

    // Form control
    const [staffForm, setStaffForm] = useState({ name: '', role: 'Waiter', email: '', phone: '' });

    const triggerToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
    };

    const rolesList = Object.keys(permissions);

    // Calculate staff summary stats
    const stats = useMemo(() => {
        return {
            total: staff.length,
            onDuty: staff.filter(s => s.status === 'On Duty').length,
            offDuty: staff.filter(s => s.status === 'Off Duty').length,
            criticalLogs: logs.filter(l => l.severity === 'high').length
        };
    }, [staff, logs]);

    // Filtering logic
    const filteredStaff = useMemo(() => {
        return staff.filter(s => 
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.role.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase())
        );
    }, [staff, search]);

    const filteredLogs = useMemo(() => {
        return logs.filter(l => 
            l.staff.toLowerCase().includes(search.toLowerCase()) ||
            l.action.toLowerCase().includes(search.toLowerCase())
        );
    }, [logs, search]);

    // Handlers
    const handleSaveStaff = (e) => {
        e.preventDefault();
        if (!staffForm.name || !staffForm.email) {
            triggerToast('Name and Email are required');
            return;
        }

        if (editingStaff) {
            setStaff(prev => prev.map(s => s.id === editingStaff.id ? {
                ...s,
                name: staffForm.name,
                role: staffForm.role,
                email: staffForm.email,
                phone: staffForm.phone
            } : s));
            triggerToast(`Staff member "${staffForm.name}" updated`);
        } else {
            const newMember = {
                id: staff.length + 1,
                name: staffForm.name,
                role: staffForm.role,
                email: staffForm.email,
                phone: staffForm.phone,
                status: 'Off Duty',
                checkIn: '--',
                checkOut: '--',
                hours: '0.0 hrs'
            };
            setStaff(prev => [...prev, newMember]);
            triggerToast(`Added Staff Member: ${newMember.name}`);
        }

        setShowStaffModal(false);
        setEditingStaff(null);
    };

    const togglePermission = (role, permKey) => {
        setPermissions(prev => {
            const updated = {
                ...prev,
                [role]: {
                    ...prev[role],
                    [permKey]: !prev[role][permKey]
                }
            };
            triggerToast(`Permission matrix updated for role: ${role}`);
            return updated;
        });
    };

    const toggleDutyStatus = (id) => {
        setStaff(prev => prev.map(s => {
            if (s.id === id) {
                const nextStatus = s.status === 'On Duty' ? 'Off Duty' : 'On Duty';
                const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                
                // Add an audit log automatically
                const newLog = {
                    id: logs.length + 101,
                    time: new Date().toLocaleString(),
                    staff: s.name,
                    role: s.role,
                    action: `${nextStatus === 'On Duty' ? 'Clocked In' : 'Clocked Out'} (Manual Admin Toggle)`,
                    ip: '192.168.1.100',
                    severity: 'low'
                };
                setLogs(lPrev => [newLog, ...lPrev]);

                triggerToast(`"${s.name}" is now ${nextStatus}`);
                return {
                    ...s,
                    status: nextStatus,
                    checkIn: nextStatus === 'On Duty' ? time : s.checkIn,
                    checkOut: nextStatus === 'Off Duty' ? time : '--',
                    hours: nextStatus === 'Off Duty' ? '8.0 hrs' : s.hours
                };
            }
            return s;
        }));
    };

    const handleEditClick = (member) => {
        setEditingStaff(member);
        setStaffForm({
            name: member.name,
            role: member.role,
            email: member.email,
            phone: member.phone
        });
        setShowStaffModal(true);
    };

    const handleDeleteStaff = (id, name) => {
        if (confirm(`Remove ${name} from system directory?`)) {
            setStaff(prev => prev.filter(s => s.id !== id));
            triggerToast(`Removed ${name} from directory`);
        }
    };

    const openAddModal = () => {
        setEditingStaff(null);
        setStaffForm({ name: '', role: 'Waiter', email: '', phone: '' });
        setShowStaffModal(true);
    };

    return (
        <POSLayout>
            <Head title="Staff Management" />
            <div className="flex flex-col h-full relative transition-colors duration-300">
                {/* Background glow */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/3 -right-24 w-[480px] h-[480px] bg-indigo-600/10 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
                </div>

                {/* Header */}
                <header className="relative z-10 px-6 py-4 bg-white dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
                            <UserCheck size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-semibold leading-tight text-slate-900 dark:text-white">Staff Management</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Manage employee accounts, set functional access control limits, and track shifts</p>
                        </div>
                    </div>

                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all self-start md:self-auto"
                    >
                        <Plus size={14} /> Add Employee
                    </button>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {/* KPI metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        {[
                            { label: 'Total Staff', val: stats.total, color: 'from-indigo-500/25 text-indigo-400 border-indigo-500/30', icon: Users },
                            { label: 'Active (On Duty)', val: stats.onDuty, color: 'from-emerald-500/25 text-emerald-400 border-emerald-500/30', icon: Clock },
                            { label: 'Off Duty', val: stats.offDuty, color: 'from-slate-500/25 text-slate-400 border-slate-500/30', icon: Calendar },
                            { label: 'Security Alerts', val: stats.criticalLogs, color: 'from-rose-500/25 text-rose-400 border-rose-500/30', icon: AlertTriangle }
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

                    {/* Nav Tabs & Controls */}
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl">
                        {/* Tabs */}
                        <div className="flex rounded-xl p-0.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                            {[
                                { id: 'directory', label: 'Staff Directory', count: staff.length },
                                { id: 'permissions', label: 'Roles & Permissions', count: rolesList.length },
                                { id: 'logs', label: 'Audit Activity Logs', count: logs.length }
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
                        {activeTab !== 'permissions' && (
                            <div className="relative w-full xl:w-72">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={`Search in ${activeTab}...`}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        )}
                    </div>

                    {/* Tab Panels */}
                    {activeTab === 'directory' && (
                        <div className="bg-white dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Employee</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Contact Detail</th>
                                            <th className="px-6 py-4 text-center">Duty Status</th>
                                            <th className="px-6 py-4">Clock-In (Shift)</th>
                                            <th className="px-6 py-4">Today Hours</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                                        {filteredStaff.map(member => (
                                            <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-[11px]">
                                                            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                        </div>
                                                        <div className="font-semibold text-slate-900 dark:text-white">{member.name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                                                        {member.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-slate-500">
                                                        <Mail size={11} /> {member.email}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                                                        <Phone size={11} /> {member.phone}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => toggleDutyStatus(member.id)}
                                                        className={`px-3 py-1 rounded-lg font-semibold text-[10px] border transition-all ${
                                                            member.status === 'On Duty'
                                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                                : 'bg-slate-100 dark:bg-slate-950 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
                                                        }`}
                                                    >
                                                        {member.status}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 font-mono">{member.checkIn}</td>
                                                <td className="px-6 py-4 font-mono">{member.hours}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => handleEditClick(member)}
                                                            className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white text-indigo-400 rounded-lg border border-indigo-500/10 transition-all"
                                                        >
                                                            <Edit2 size={12} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteStaff(member.id, member.name)}
                                                            className="p-1.5 bg-red-500/10 hover:bg-red-50 hover:text-red-500 text-red-400 rounded-lg border border-red-500/10 transition-all"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'permissions' && (
                        <div className="bg-white dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="text-indigo-400" size={18} />
                                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Role-Based Access Control matrix (RBAC)</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">User Roles</th>
                                            <th className="px-6 py-4 text-center">Billing & Sales</th>
                                            <th className="px-6 py-4 text-center">Menu Config</th>
                                            <th className="px-6 py-4 text-center">Inventory Stock</th>
                                            <th className="px-6 py-4 text-center">Purchases</th>
                                            <th className="px-6 py-4 text-center">Financial Reports</th>
                                            <th className="px-6 py-4 text-center">System Settings</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                                        {rolesList.map(role => (
                                            <tr key={role} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{role}</td>
                                                {[
                                                    { key: 'pos', label: 'Billing' },
                                                    { key: 'menu', label: 'Menu' },
                                                    { key: 'inventory', label: 'Inventory' },
                                                    { key: 'purchases', label: 'Purchases' },
                                                    { key: 'reports', label: 'Reports' },
                                                    { key: 'settings', label: 'Settings' }
                                                ].map(perm => (
                                                    <td key={perm.key} className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => togglePermission(role, perm.key)}
                                                            className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center border transition-all ${
                                                                permissions[role][perm.key]
                                                                    ? 'bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/25 shadow-inner'
                                                                    : 'bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-850'
                                                            }`}
                                                            title={`Toggle ${perm.label} for ${role}`}
                                                        >
                                                            {permissions[role][perm.key] ? <Check size={14} /> : <Lock size={12} />}
                                                        </button>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'logs' && (
                        <div className="bg-white dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Timestamp</th>
                                            <th className="px-6 py-4">Employee</th>
                                            <th className="px-6 py-4">Security Level</th>
                                            <th className="px-6 py-4">Activity Description</th>
                                            <th className="px-6 py-4">Terminal IP</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300 font-mono">
                                        {filteredLogs.map(log => (
                                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 text-slate-400">{log.time}</td>
                                                <td className="px-6 py-4 font-sans font-semibold text-slate-900 dark:text-white">
                                                    {log.staff} <span className="text-[10px] font-normal text-slate-500">({log.role})</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                        log.severity === 'high' ? 'bg-red-500/15 text-red-400 border border-red-500/25' :
                                                        log.severity === 'medium' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' :
                                                        'bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                                                    }`}>
                                                        {log.severity}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-sans text-slate-800 dark:text-slate-200">{log.action}</td>
                                                <td className="px-6 py-4 text-slate-500">{log.ip}</td>
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
                        <UserCheck size={16} className="text-indigo-650 dark:text-indigo-400" />
                        <span className="text-xs font-semibold">{toast}</span>
                    </div>
                )}

                {/* MODAL: Add / Edit Employee */}
                {showStaffModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowStaffModal(false)} />
                        <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-slate-850 dark:text-white font-bold text-base">{editingStaff ? 'Edit Staff Profile' : 'Add Employee Account'}</h2>
                                <button onClick={() => setShowStaffModal(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><X size={18} /></button>
                            </div>
                            <form onSubmit={handleSaveStaff} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={staffForm.name}
                                        onChange={e => setStaffForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Assigned Role</label>
                                        <select
                                            value={staffForm.role}
                                            onChange={e => setStaffForm(prev => ({ ...prev, role: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white focus:outline-none focus:border-indigo-500"
                                        >
                                            {rolesList.map(role => <option key={role} value={role}>{role}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Phone Number</label>
                                        <input
                                            type="text"
                                            required
                                            value={staffForm.phone}
                                            onChange={e => setStaffForm(prev => ({ ...prev, phone: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={staffForm.email}
                                        onChange={e => setStaffForm(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/10"
                                >
                                    {editingStaff ? 'Save Changes' : 'Create Account'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </POSLayout>
    );
}
