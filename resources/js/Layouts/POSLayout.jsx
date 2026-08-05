import { useState } from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import {
    LayoutDashboard,
    ShoppingCart,
    Table2,
    ChefHat,
    Package,
    Users,
    BarChart3,
    Menu,
    X,
    UtensilsCrossed,
    LogOut,
} from 'lucide-react';

const NAV_ITEMS = [
    { href: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
    { href: '/pos',         label: 'POS Billing', icon: ShoppingCart    },
    { href: '/pos/tables',  label: 'Tables',      icon: Table2         },
    { href: '/pos/kds',     label: 'Kitchen (KDS)', icon: ChefHat       },
    { href: '/pos/inventory', label: 'Inventory', icon: Package        },
    { href: '/pos/crm',     label: 'CRM',         icon: Users          },
    { href: '/pos/reports', label: 'Reports',     icon: BarChart3      },
];

// Routes sorted by specificity (longest path first) so the most specific match wins
const NAV_BY_SPECIFICITY = [...NAV_ITEMS].sort((a, b) => b.href.split('/').length - a.href.split('/').length);

function isActiveRoute(pathname, href) {
    return pathname === href || pathname.startsWith(href + '/');
}

export default function POSLayout({ children }) {
    const user = usePage().props.auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { router } = useForm();

    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ─────────────────────────────────────────────── */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    w-64 bg-slate-800 border-r border-slate-700/60
                    flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="px-5 py-5 border-b border-slate-700/60 flex items-center justify-between">
                    <Link href="/pos" className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <UtensilsCrossed size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-sm leading-none">Restaurant</h1>
                            <p className="text-slate-400 text-xs mt-0.5">POS System</p>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = NAV_BY_SPECIFICITY.findIndex(
                            (candidate) => isActiveRoute(window.location.pathname, candidate.href)
                        ) === NAV_BY_SPECIFICITY.findIndex(
                            (candidate) => candidate.href === item.href
                        );
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                                    transition-all duration-200
                                    ${isActive
                                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                                        : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'
                                    }
                                `}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-3 py-4 border-t border-slate-700/60">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-xs font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{user?.name || 'Cashier'}</p>
                            <p className="text-slate-500 text-xs truncate">{user?.email || 'cashier@pos.lk'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.post(route('logout'))}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-400 transition-colors w-full rounded-lg hover:bg-slate-700/40"
                    >
                        <LogOut size={16} />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* ── Main Content ────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-slate-800 border-b border-slate-700/60 flex-shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <Menu size={22} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <UtensilsCrossed size={14} className="text-white" />
                        </div>
                        <span className="text-white font-bold text-sm">Restaurant POS</span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-slate-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
