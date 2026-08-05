import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import {
    UtensilsCrossed,
    Eye,
    EyeOff,
    AlertCircle,
} from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-4">
                        <UtensilsCrossed size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Restaurant POS</h1>
                    <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
                </div>

                {/* Card */}
                <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-8 shadow-2xl">
                    {status && (
                        <div className="mb-6 flex items-center gap-2 text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
                            <span>{status}</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="
                                    w-full bg-slate-900/60 border border-slate-600/60
                                    rounded-xl px-4 py-3 text-white text-sm
                                    placeholder-slate-500
                                    focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50
                                    transition-colors
                                "
                                placeholder="cashier@restaurant.com"
                                autoComplete="username"
                                autoFocus
                            />
                            {errors.email && (
                                <div className="mt-2 flex items-center gap-1.5 text-sm text-red-400">
                                    <AlertCircle size={14} />
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="
                                        w-full bg-slate-900/60 border border-slate-600/60
                                        rounded-xl px-4 py-3 pr-12 text-white text-sm
                                        placeholder-slate-500
                                        focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50
                                        transition-colors
                                    "
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="
                                        absolute right-3 top-1/2 -translate-y-1/2
                                        text-slate-500 hover:text-slate-300
                                        transition-colors
                                    "
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="mt-2 flex items-center gap-1.5 text-sm text-red-400">
                                    <AlertCircle size={14} />
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="
                                        w-4 h-4 rounded border-slate-600 bg-slate-900/60
                                        text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0
                                        cursor-pointer
                                    "
                                />
                                <span className="text-sm text-slate-400">Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="
                                w-full bg-indigo-600 hover:bg-indigo-500
                                disabled:bg-slate-700 disabled:text-slate-500
                                text-white font-semibold text-sm
                                py-3 rounded-xl
                                transition-all duration-200
                                shadow-lg shadow-indigo-500/25
                                hover:shadow-indigo-500/40
                                active:scale-[.98]
                            "
                        >
                            {processing ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {canResetPassword && (
                        <div className="mt-6 text-center">
                            <Link
                                href={route('register')}
                                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                Don&apos;t have an account? <span className="text-indigo-400">Sign up</span>
                            </Link>
                        </div>
                    )}
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    Restaurant POS System &copy; {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
