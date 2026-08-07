import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
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

const NAV_BY_SPECIFICITY = [...NAV_ITEMS].sort((a, b) => b.href.split('/').length - a.href.split('/').length);

function isActiveRoute(pathname, href) {
    return pathname === href || pathname.startsWith(href + '/');
}

function initials(name) {
    return String(name || '')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase() || 'U';
}

export default function POSLayout({ children }) {
    const user = usePage().props.auth?.user ?? null;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'), {}, {
            replace: true,
            preserveState: false,
            preserveScroll: false,
        });
    };

    return (
        <div className="flex h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white overflow-hidden transition-colors duration-300">
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
                    w-64
                    bg-white dark:bg-slate-900/90
                    border-r border-slate-200 dark:border-slate-800/80
                    backdrop-blur-xl
                    flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="px-5 py-5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                    <Link href="/pos" className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <UtensilsCrossed size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-slate-900 dark:text-white font-bold text-sm leading-none">Restaurant</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">POS System</p>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
                                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border border-indigo-400/30 shadow-lg shadow-indigo-500/30'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                                    }
                                `}
                            >
                                <Icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800/80">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/20">
                            {initials(user?.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">{user?.name || 'User'}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-xs truncate">{user?.email || ''}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors w-full rounded-lg hover:bg-red-500/10 dark:hover:bg-red-500/10"
                    >
                        <LogOut size={16} />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* ── Main Content ────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile header */}
                <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 flex-shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <Menu size={22} />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <UtensilsCrossed size={14} className="text-white" />
                        </div>
                        <span className="text-slate-900 dark:text-white font-bold text-sm">Restaurant POS</span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
                    {children}
                </main>

                <footer className="flex-shrink-0 px-6 py-3 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        2026 © NerdTech Labs. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    );
}