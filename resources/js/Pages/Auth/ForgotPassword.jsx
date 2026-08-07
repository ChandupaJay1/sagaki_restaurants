import { useEffect, useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import {
    UtensilsCrossed,
    Mail,
    Loader2,
    AlertCircle,
    ArrowLeft,
    Star,
    ChefHat,
    Coffee,
} from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 60);
        return () => clearTimeout(t);
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <style>{`
                @keyframes fg-slide-up {
                    from { opacity: 0; transform: translateY(32px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fg-slide-right {
                    from { opacity: 0; transform: translateX(-32px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes fg-fade-in {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes fg-drift {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33%       { transform: translate(16px, -20px) rotate(2deg); }
                    66%       { transform: translate(-12px, 14px) rotate(-1deg); }
                }
                @keyframes fg-shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes fg-pulse-glow {
                    0%, 100% { opacity: .3; }
                    50%       { opacity: .65; }
                }
                @keyframes fg-float-tag {
                    0%, 100% { transform: translateY(0); }
                    50%       { transform: translateY(-5px); }
                }
                .fg-card        { animation: fg-slide-up .7s cubic-bezier(.22,1,.36,1) .15s both; }
                .fg-brand       { animation: fg-fade-in   .9s cubic-bezier(.22,1,.36,1) both; }
                .fg-slide-r     { animation: fg-slide-right .7s cubic-bezier(.22,1,.36,1) both; }
                .fg-drift       { animation: fg-drift     14s ease-in-out infinite; }
                .fg-drift-slow  { animation: fg-drift     18s ease-in-out infinite reverse; }
                .fg-pulse       { animation: fg-pulse-glow 4s ease-in-out infinite; }
                .fg-float       { animation: fg-float-tag 5s ease-in-out infinite; }
                .fg-shimmer-btn {
                    background: linear-gradient(
                        110deg,
                        transparent 30%,
                        rgba(255,255,255,.18) 50%,
                        transparent 70%
                    );
                    background-size: 200% 100%;
                    animation: fg-shimmer 3.5s linear infinite;
                }
                .fg-panel-sep {
                    background: linear-gradient(to bottom, transparent, rgb(99 102 241 / .15), transparent);
                }
            `}</style>

            <div className="h-screen w-screen flex bg-slate-950 overflow-hidden">
                {/* ═══════════════════════════════════════════════════════════
                    LEFT PANEL — Brand Showcase
                ═══════════════════════════════════════════════════════════ */}
                <div className="hidden lg:flex lg:w-3/5 xl:w-[65%] relative overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage:
                                'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&auto=format&fit=crop)',
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-transparent to-slate-950/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-indigo-500/5" />

                    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
                        <div className="absolute top-24 left-16 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl fg-pulse" />
                        <div className="absolute bottom-40 right-16 w-56 h-56 bg-violet-600/15 rounded-full blur-3xl fg-drift" />
                        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl fg-drift-slow" />
                    </div>

                    <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16 fg-brand">
                        <div className="fg-slide-r" style={{ animationDelay: '.1s' }}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-indigo-500/50 rounded-xl blur-md" />
                                    <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-500/40">
                                        <UtensilsCrossed size={20} className="text-white" />
                                    </div>
                                </div>
                                <span className="text-white font-semibold text-lg tracking-wide">Sagaki</span>
                            </div>
                            <div className="h-px w-14 bg-gradient-to-r from-indigo-400 to-transparent mt-4" />
                        </div>

                        <div className="max-w-md fg-slide-r" style={{ animationDelay: '.25s' }}>
                            <p className="text-indigo-300/70 text-xs font-semibold tracking-[.2em] uppercase mb-4">
                                Restaurant POS System
                            </p>
                            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1] mb-6">
                                Elevate Your
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-violet-200 to-indigo-300">
                                    Dining Service
                                </span>
                            </h1>
                            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                                Streamline orders, manage tables, and deliver exceptional
                                guest experiences — all from one powerful platform.
                            </p>

                            <div className="flex flex-wrap gap-3 mt-10">
                                {[
                                    { icon: ChefHat, label: 'Kitchen Display' },
                                    { icon: Coffee, label: 'Table Management' },
                                    { icon: Star, label: 'Real-time Reports' },
                                ].map(({ icon: Icon, label }, i) => (
                                    <div
                                        key={label}
                                        className="fg-float flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-slate-200 text-sm"
                                        style={{ animationDelay: `${1.2 + i * 0.12}s` }}
                                    >
                                        <Icon size={14} className="text-indigo-300" />
                                        {label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-600 fg-slide-r" style={{ animationDelay: '.4s' }}>
                            <span>© {new Date().getFullYear()} Sagaki Restaurant POS</span>
                            <span className="flex items-center gap-1.5 text-slate-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 fg-pulse" />
                                System Online
                            </span>
                        </div>
                    </div>

                    <div className="absolute right-0 top-0 bottom-0 w-px fg-panel-sep" />
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
                </div>

                {/* ═══════════════════════════════════════════════════════════
                    RIGHT PANEL — Forgot Password Form
                ═══════════════════════════════════════════════════════════ */}
                <div className="w-full lg:w-2/5 xl:w-[35%] flex items-center justify-center px-6 py-8 bg-slate-950 relative overflow-hidden">
                    <div
                        className="absolute inset-0 pointer-events-none"
                        aria-hidden
                        style={{
                            backgroundImage:
                                'radial-gradient(ellipse 60% 50% at 60% 40%, rgba(79,70,229,.07), transparent 60%)',
                        }}
                    />
                    <div
                        className="absolute w-80 h-80 rounded-full pointer-events-none"
                        style={{
                            bottom: '-10%',
                            right: '-5%',
                            background: 'radial-gradient(circle, rgba(139,92,246,.06) 0%, transparent 65%)',
                            filter: 'blur(50px)',
                        }}
                        aria-hidden
                    />
                    <div
                        className="absolute w-64 h-64 rounded-full pointer-events-none"
                        style={{
                            top: '10%',
                            left: '-5%',
                            background: 'radial-gradient(circle, rgba(79,70,229,.05) 0%, transparent 65%)',
                            filter: 'blur(40px)',
                        }}
                        aria-hidden
                    />
                    <div
                        className="absolute inset-0 opacity-[.02] pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.4) 1px, transparent 1px)',
                            backgroundSize: '24px 24px',
                        }}
                        aria-hidden
                    />

                    <div className={`relative w-full max-w-sm fg-card ${mounted ? '' : 'opacity-0'}`}>
                        <div className="flex items-center gap-3 mb-6 lg:hidden">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <UtensilsCrossed size={18} className="text-white" />
                            </div>
                            <span className="text-white font-semibold text-base">Sagaki Restaurant POS</span>
                        </div>

                        <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl shadow-black/60">
                            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                            <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-medium px-3 py-1.5 rounded-full text-xs mb-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 fg-pulse" />
                                Password reset
                            </div>

                            <h2 className="text-xl font-bold text-white tracking-tight mb-1">
                                Forgot your password?
                            </h2>
                            <p className="text-sm text-slate-400 mb-6">
                                No worries — enter your email and we'll send you a reset link.
                            </p>

                            {status && (
                                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                                    <span>{status}</span>
                                </div>
                            )}

                            {errors.email && (
                                <div className="mb-4 flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                    <AlertCircle size={16} className="shrink-0" />
                                    <span>{errors.email}</span>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                            <Mail size={16} />
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="
                                                w-full bg-slate-950/60 border border-slate-800
                                                rounded-xl pl-11 pr-4 py-3
                                                text-white text-sm
                                                placeholder-slate-500
                                                focus:outline-none
                                                focus:border-indigo-500
                                                focus:ring-2 focus:ring-indigo-500/20
                                                hover:border-slate-700
                                                transition-all duration-200
                                            "
                                            placeholder="you@example.com"
                                            autoComplete="username"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.email && (
                                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                                            <AlertCircle size={12} />
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="
                                        relative w-full
                                        bg-gradient-to-r from-indigo-600 to-violet-600
                                        hover:from-indigo-500 hover:to-violet-500
                                        disabled:from-slate-700 disabled:to-slate-700
                                        text-white font-medium text-sm
                                        py-3 rounded-xl
                                        transition-all duration-200
                                        shadow-lg shadow-indigo-500/25
                                        hover:shadow-indigo-500/40
                                        active:scale-[.98]
                                        disabled:cursor-not-allowed
                                        overflow-hidden
                                        flex items-center justify-center gap-2
                                    "
                                >
                                    <span className="fg-shimmer-btn absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                                    <span className="relative flex items-center gap-2">
                                        {processing ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                Sending…
                                            </>
                                        ) : (
                                            <>
                                                <Mail size={16} />
                                                Send Reset Link
                                            </>
                                        )}
                                    </span>
                                </button>
                            </form>

                            <div className="mt-5 text-center">
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-300 transition-colors duration-200"
                                >
                                    <ArrowLeft size={14} />
                                    Back to login
                                </Link>
                            </div>

                            <div className="mt-5 border-t border-slate-800/60" />
                            <p className="mt-3 text-xs text-slate-600 text-center">
                                2026 © NerdTech Labs. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
