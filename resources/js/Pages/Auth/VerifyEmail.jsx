import { Link, useForm } from '@inertiajs/react';
import { UtensilsCrossed, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
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
                    <h1 className="text-2xl font-bold text-white">Verify Email</h1>
                    <p className="text-slate-400 text-sm mt-1 text-center">
                        Thanks for signing up! Before getting started, could you verify
                        your email address by clicking on the link we just emailed you?
                    </p>
                </div>

                <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-8 shadow-2xl">
                    {status === 'verification-link-sent' && (
                        <div className="mb-6 flex items-center gap-2 text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
                            <CheckCircle2 size={16} />
                            A new verification link has been sent to your email address.
                        </div>
                    )}

                    <div className="flex items-center gap-3 mb-6 p-4 bg-slate-900/60 rounded-xl border border-slate-700/40">
                        <div className="w-10 h-10 bg-indigo-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Mail size={18} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium">Check your inbox</p>
                            <p className="text-slate-400 text-xs mt-0.5">
                                We sent a verification link to your email
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
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
                            {processing ? 'Sending...' : 'Resend Verification Email'}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-between">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            Log Out
                        </Link>
                    </div>
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    Restaurant POS System &copy; {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
