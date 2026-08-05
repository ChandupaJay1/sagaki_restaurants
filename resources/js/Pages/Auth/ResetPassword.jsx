import { Link, useForm } from '@inertiajs/react';
import { UtensilsCrossed, AlertCircle } from 'lucide-react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.update'));
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-4">
                        <UtensilsCrossed size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Reset Password</h1>
                    <p className="text-slate-400 text-sm mt-1">Create a new password</p>
                </div>

                <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={submit} className="space-y-5">
                        <input type="hidden" name="token" value={token} />

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
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
                            />
                            {errors.email && (
                                <div className="mt-2 flex items-center gap-1.5 text-sm text-red-400">
                                    <AlertCircle size={14} />
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="
                                    w-full bg-slate-900/60 border border-slate-600/60
                                    rounded-xl px-4 py-3 text-white text-sm
                                    placeholder-slate-500
                                    focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50
                                    transition-colors
                                "
                                placeholder="Min. 8 characters"
                            />
                            {errors.password && (
                                <div className="mt-2 flex items-center gap-1.5 text-sm text-red-400">
                                    <AlertCircle size={14} />
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="
                                    w-full bg-slate-900/60 border border-slate-600/60
                                    rounded-xl px-4 py-3 text-white text-sm
                                    placeholder-slate-500
                                    focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50
                                    transition-colors
                                "
                                placeholder="Re-enter your password"
                            />
                            {errors.password_confirmation && (
                                <div className="mt-2 flex items-center gap-1.5 text-sm text-red-400">
                                    <AlertCircle size={14} />
                                    {errors.password_confirmation}
                                </div>
                            )}
                        </div>

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
                            {processing ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    Restaurant POS System &copy; {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
