export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            {children}
        </div>
    );
}
