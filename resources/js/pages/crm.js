// CRM page module — search, tier filters, customer detail modal, toast.

const CUSTOMERS = [
    { id: 1,  name: 'Nuwan Perera',         phone: '077-123-4567', email: 'nuwan@email.com',      visits: 48, totalSpend: 18500, avgOrder: 385, tier: 'gold',   joined: '2023-06-15', notes: 'Prefers window seat, allergic to peanuts', favorite: 'Chicken Kottu' },
    { id: 2,  name: 'Samantha de Silva',    phone: '071-987-6543', email: 'sam.de@email.com',     visits: 32, totalSpend: 12400, avgOrder: 388, tier: 'gold',   joined: '2023-08-20', notes: 'Regular Friday diner', favorite: 'Lamprais' },
    { id: 3,  name: 'Rajitha Fernando',     phone: '076-555-1234', email: 'rajitha@email.com',    visits: 24, totalSpend: 8200,  avgOrder: 342, tier: 'silver', joined: '2023-10-01', notes: 'Large group on weekends', favorite: 'Mutton Kottu' },
    { id: 4,  name: 'Michelle Jayawardena', phone: '072-333-7890', email: 'michelle@email.com',   visits: 18, totalSpend: 6750,  avgOrder: 375, tier: 'silver', joined: '2023-11-05', notes: 'Loves desserts', favorite: 'Watalappan' },
    { id: 5,  name: 'Kasun Bandara',        phone: '075-222-4567', email: 'kasun@email.com',      visits: 12, totalSpend: 3600,  avgOrder: 300, tier: 'bronze', joined: '2023-12-10', notes: '', favorite: 'Hoppers' },
    { id: 6,  name: 'Dilan Rathnayake',     phone: '077-444-8901', email: 'dilan@email.com',      visits: 8,  totalSpend: 2100,  avgOrder: 263, tier: 'bronze', joined: '2024-01-02', notes: 'First-time visitor, left 5-star review', favorite: 'Fish Ambul Thiyal' },
    { id: 7,  name: 'Priyanka Wijeyaratne', phone: '071-666-2345', email: 'priya@email.com',      visits: 41, totalSpend: 16800, avgOrder: 410, tier: 'gold',   joined: '2023-05-20', notes: 'VIP - always tips well', favorite: 'Coconut Rice' },
    { id: 8,  name: 'Tharindu Gunaratne',  phone: '076-888-6789', email: 'tharindu@email.com',   visits: 6,  totalSpend: 1500,  avgOrder: 250, tier: 'bronze', joined: '2024-01-05', notes: '', favorite: 'Cutlet' },
];

const TIER_BADGE = {
    gold: 'text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/30',
    silver: 'text-slate-500 dark:text-slate-300 bg-slate-400/15 border-slate-400/30',
    bronze: 'text-orange-600 dark:text-orange-400 bg-orange-500/15 border-orange-500/30',
};

const fmt = (n) => new Intl.NumberFormat('en-US').format(n);
const initialsOf = (name) =>
    String(name || '').split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || 'U';

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('crm-grid');
    const empty = document.getElementById('crm-empty');
    const search = document.getElementById('crm-search');
    const modal = document.getElementById('crm-modal');
    let activeTier = 'all';

    const showToast = (msg) => {
        document.getElementById('crm-toast-text').textContent = msg;
        const toastEl = document.getElementById('crm-toast');
        toastEl.classList.remove('hidden');
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => toastEl.classList.add('hidden'), 3000);
    };

    const render = () => {
        const q = (search ? search.value : '').toLowerCase().trim();
        let visible = 0;
        if (grid) {
            grid.querySelectorAll('.crm-card').forEach((card) => {
                const name = (card.getAttribute('data-name') || '').toLowerCase();
                const email = (card.getAttribute('data-email') || '').toLowerCase();
                const tier = card.getAttribute('data-tier') || '';
                const matchQ = !q || name.includes(q) || email.includes(q);
                const matchT = activeTier === 'all' || tier === activeTier;
                card.classList.toggle('hidden', !(matchQ && matchT));
                if (matchQ && matchT) visible += 1;
            });
        }
        if (empty) empty.classList.toggle('hidden', visible > 0);
    };

    if (search) search.addEventListener('input', render);

    document.querySelectorAll('[data-tier-filter]').forEach((btn) => {
        btn.addEventListener('click', () => {
            activeTier = btn.getAttribute('data-tier-filter') || 'all';
            document.querySelectorAll('[data-tier-filter]').forEach((b) => {
                const on = b === btn;
                b.classList.toggle('bg-indigo-600', on);
                b.classList.toggle('text-white', on);
                b.classList.toggle('bg-slate-100', !on);
                b.classList.toggle('dark:bg-slate-700/60', !on);
                b.classList.toggle('text-slate-600', !on);
                b.classList.toggle('dark:text-slate-400', !on);
            });
            render();
        });
    });

    document.querySelectorAll('[data-customer-id]').forEach((card) => {
        card.addEventListener('click', () => {
            const id = Number(card.getAttribute('data-customer-id'));
            const customer = CUSTOMERS.find((c) => c.id === id);
            if (!customer || !modal) return;

            document.getElementById('modal-avatar').textContent = initialsOf(customer.name);
            document.getElementById('modal-name').textContent = customer.name;
            const tierBadge = document.getElementById('modal-tier');
            tierBadge.textContent = customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1);
            tierBadge.className = 'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ' + TIER_BADGE[customer.tier];
            document.getElementById('modal-visits').textContent = customer.visits;
            document.getElementById('modal-spend').textContent = 'LKR ' + fmt(customer.totalSpend);
            document.getElementById('modal-avg').textContent = 'LKR ' + fmt(customer.avgOrder);
            document.getElementById('modal-joined').textContent = customer.joined;
            document.getElementById('modal-favorite').textContent = customer.favorite;
            document.getElementById('modal-notes').textContent = customer.notes || 'No notes recorded.';
            document.getElementById('modal-call').href = 'tel:' + customer.phone;
            document.getElementById('modal-mail').href = 'mailto:' + customer.email;
            modal.classList.remove('hidden');
        });
    });

    document.querySelectorAll('[data-modal-close]').forEach((el) => {
        el.addEventListener('click', () => modal && modal.classList.add('hidden'));
    });

    document.querySelectorAll('[data-modal-tab]').forEach((tab) => {
        tab.addEventListener('click', () => {
            const name = tab.getAttribute('data-modal-tab');
            document.querySelectorAll('[data-modal-tab]').forEach((t) => {
                t.classList.remove('border-indigo-500', 'text-indigo-600', 'dark:text-indigo-400');
                t.classList.add('border-transparent', 'text-slate-500', 'dark:text-slate-400', 'hover:text-slate-900', 'dark:hover:text-white');
            });
            tab.classList.add('border-indigo-500', 'text-indigo-600', 'dark:text-indigo-400');
            tab.classList.remove('border-transparent', 'text-slate-500', 'dark:text-slate-400', 'hover:text-slate-900', 'dark:hover:text-white');
            ['details', 'history', 'notes'].forEach((id) => {
                document.getElementById('modal-tab-' + id).classList.toggle('hidden', id !== name);
            });
        });
    });

    const addBtn = document.querySelector('[data-add-customer]');
    if (addBtn) addBtn.addEventListener('click', () => showToast('Add customer form coming soon'));
});