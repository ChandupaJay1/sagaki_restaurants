// Tables page module — floor plan cards, action modal (Details/Transfer/Merge), refresh toast.
// Pure vanilla JS over data-* attributes + state embedded from the Blade template.

const STATUS_META = {
    available: { label: 'Available', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', hover: 'hover:border-emerald-500/60', tileBg: 'bg-emerald-500/20', tileText: 'text-emerald-600 dark:text-emerald-400' },
    occupied:  { label: 'Occupied',  text: 'text-red-600 dark:text-red-400',          bg: 'bg-red-500/15',     border: 'border-red-500/40',     hover: 'hover:border-red-500/60',     tileBg: 'bg-red-500/20',     tileText: 'text-red-600 dark:text-red-400' },
    reserved:  { label: 'Reserved',  text: 'text-amber-600 dark:text-amber-400',      bg: 'bg-amber-500/15',   border: 'border-amber-500/40',   hover: 'hover:border-amber-500/60',   tileBg: 'bg-amber-500/20',   tileText: 'text-amber-600 dark:text-amber-400' },
};

const fmt = (n) => new Intl.NumberFormat('en-US').format(n);

document.addEventListener('DOMContentLoaded', () => {
    const tables = Array.from(window.TABLES_DATA || []);
    const cards = Array.from(document.querySelectorAll('[data-table-card]'));

    const modal = document.getElementById('action-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalSub = document.getElementById('modal-sub');
    const modalTile = document.getElementById('modal-tile');
    const transferName = document.getElementById('transfer-name');
    const mergeName = document.getElementById('merge-name');

    let activeTable = null;
    let toastTimer = null;

    function showToast(message, type) {
        const toast = document.getElementById('toast');
        const msg = document.getElementById('toast-msg');
        const icon = toast.querySelector('svg');

        toast.classList.remove('hidden');
        msg.textContent = message;

        const isSuccess = type !== 'error';
        icon.setAttribute('data-lucide', '');
        icon.outerHTML = svgIcon(isSuccess ? 'circle-check' : 'alert-circle', isSuccess ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400');

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    function svgIcon(name, cls) {
        const icons = {
            'circle-check': '<path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path>',
            'alert-circle': '<path d="M12 9v4"></path><path d="M12 17h.01"></path><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"></path>',
            'plus': '<path d="M5 12h14"></path><path d="M12 5v14"></path>',
            'utensils': '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><path d="M7 2v20"></path><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>',
            'credit-card': '<path d="M22 9H2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"></path><path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2"></path>',
            'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
            'table-2': '<path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2v-4m6 6h6"></path><path d="M3 13v-2m6 2v4m6-6v6"></path>',
            'arrow-right-left': '<path d="m16 3 4 4-4 4"></path><path d="M20 7H4"></path><path d="m8 21-4-4 4-4"></path><path d="M4 17h16"></path>',
            'merge': '<path d="M8 6v4a4 4 0 0 0 4 4h4"></path><path d="M9 23v-7"></path><path d="M8 6l3-3 3 3"></path><path d="M20 17l3 3-3 3"></path>',
        };
        const stroke = cls ? 'class="' + cls + '" ' : '';
        return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' + stroke + '>' + (icons[name] || icons['circle-check']) + '</svg>';
    }

    // ── Tab switching ────────────────────────────────────────────────
    document.querySelectorAll('[data-modal-tab]').forEach((tab) => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-modal-tab');

            document.querySelectorAll('[data-modal-tab]').forEach((t) => {
                t.classList.remove('border-indigo-500', 'text-indigo-600', 'dark:text-indigo-400');
                t.classList.add('border-transparent', 'text-slate-500', 'dark:text-slate-400', 'hover:text-slate-900', 'dark:hover:text-white');
            });
            tab.classList.add('border-indigo-500', 'text-indigo-600', 'dark:text-indigo-400');
            tab.classList.remove('border-transparent', 'text-slate-500', 'dark:text-slate-400', 'hover:text-slate-900', 'dark:hover:text-white');

            document.querySelectorAll('[data-modal-panel]').forEach((p) => p.classList.add('hidden'));
            const activePanel = modal.querySelector('[data-modal-panel="' + target + '"]');
            if (activePanel) activePanel.classList.remove('hidden');
        });
    });

    // ── Open modal ───────────────────────────────────────────────────
    function openModal(table) {
        activeTable = table;
        const meta = STATUS_META[table.status] || STATUS_META.available;

        modalTitle.textContent = table.name + ' — ' + table.type.replace('-', ' ');
        modalSub.textContent = table.seats + ' seats';
        transferName.textContent = table.name;
        mergeName.textContent = table.name;

        const tileText = { available: 'text-emerald-600 dark:text-emerald-400', occupied: 'text-red-600 dark:text-red-400', reserved: 'text-amber-600 dark:text-amber-400' }[table.status] || 'text-emerald-600 dark:text-emerald-400';
        modalTile.className = 'w-10 h-10 rounded-xl flex items-center justify-center ' + meta.tileBg;
        modalTile.querySelector('svg').className = tileText;

        renderDetails(table);
        renderActions(table);
        renderTransferList(table);
        renderMergeList(table);

        // first tab active on open
        document.querySelectorAll('[data-modal-tab]').forEach((t, i) => {
            t.classList.toggle('border-indigo-500', i === 0);
            t.classList.toggle('text-indigo-600', i === 0);
            t.classList.toggle('dark:text-indigo-400', i === 0);
            t.classList.toggle('border-transparent', i !== 0);
            t.classList.toggle('text-slate-500', i !== 0);
            t.classList.toggle('dark:text-slate-400', i !== 0);
            t.classList.toggle('hover:text-slate-900', i !== 0);
            t.classList.toggle('dark:hover:text-white', i !== 0);
        });

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        if (toastTimer) clearTimeout(toastTimer);
    }

    function infoBox(label, value, extra = '') {
        const box = document.createElement('div');
        box.className = 'bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-200/60 dark:border-transparent';
        const p = document.createElement('p');
        p.className = 'text-slate-500 dark:text-slate-400 text-xs mb-1';
        p.textContent = label;
        const v = document.createElement('p');
        v.className = (extra || 'text-slate-900 dark:text-white') + ' font-semibold';
        v.textContent = value;
        box.appendChild(p);
        box.appendChild(v);
        return box;
    }

    function renderDetails(table) {
        const grid = document.getElementById('modal-details-grid');
        grid.innerHTML = '';

        grid.appendChild(infoBox('Status', STATUS_META[table.status].label, STATUS_META[table.status].text));
        grid.appendChild(infoBox('Seats', String(table.seats)));

        if (table.status === 'occupied') {
            grid.appendChild(infoBox('Customer', table.customer));
            grid.appendChild(infoBox('Bill Total', 'LKR ' + fmt(table.bill), 'text-indigo-600 dark:text-indigo-400 font-bold'));
            grid.appendChild(infoBox('Started At', table.startedAt));
            grid.appendChild(infoBox('Table Type', table.type.replace('-', ' ')));
        }

        if (table.status === 'reserved') {
            grid.appendChild(infoBox('Guest Name', table.customer));
            grid.appendChild(infoBox('Reservation', table.startedAt));
        }
    }

    function renderActions(table) {
        const box = document.getElementById('modal-actions');
        box.innerHTML = '';

        const mk = (label, icon, classes, action) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'flex-1 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ' + classes;
            btn.innerHTML = svgIcon(icon) + '<span>' + label + '</span>';
            btn.addEventListener('click', () => handleAction(action, table));
            return btn;
        };

        if (table.status === 'available') {
            box.appendChild(mk('Take Order', 'plus', 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25', 'take-order'));
        } else if (table.status === 'occupied') {
            box.appendChild(mk('Add Bill', 'credit-card', 'bg-emerald-500/10 dark:bg-emerald-600/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white', 'add-bill'));
            box.appendChild(mk('Close', 'circle-check', 'bg-red-500/10 dark:bg-red-500/20 border border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white', 'close-table'));
        } else if (table.status === 'reserved') {
            box.appendChild(mk('Seat Guest', 'users', 'bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white', 'seat-guest'));
        }
    }

    // ── Transfer / Merge lists ───────────────────────────────────────
    function renderTransferList(table) {
        const list = document.getElementById('transfer-list');
        list.innerHTML = '';

        const targets = tables.filter((t) => t.id !== table.id && t.status === 'available');
        targets.forEach((t) => {
            const row = document.createElement('button');
            row.type = 'button';
            row.className = 'w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/40 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600/40 hover:border-indigo-500/40 rounded-xl transition-colors text-left';
            row.innerHTML =
                svgIcon('table-2', 'text-indigo-600 dark:text-indigo-400 flex-shrink-0') +
                '<div class="flex-1">' +
                '<p class="text-slate-900 dark:text-white text-sm font-medium">' + t.name + '</p>' +
                '<p class="text-slate-500 dark:text-slate-400 text-xs">' + t.seats + ' seats · ' + t.type.replace('-', ' ') + '</p>' +
                '</div>' +
                svgIcon('arrow-right-left', 'text-slate-400');
            row.addEventListener('click', () => handleAction('transfer', { ...table, transferTo: t.name }));
            list.appendChild(row);
        });

        if (targets.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'text-slate-500 text-sm text-center py-8';
            empty.textContent = 'No available tables';
            list.appendChild(empty);
        }
    }

    function renderMergeList(table) {
        const list = document.getElementById('merge-list');
        list.innerHTML = '';

        const targets = tables.filter((t) => t.id !== table.id && t.status === 'occupied');
        targets.forEach((t) => {
            const row = document.createElement('button');
            row.type = 'button';
            row.className = 'w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/40 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600/40 hover:border-violet-500/40 rounded-xl transition-colors text-left';
            row.innerHTML =
                '<div class="w-8 h-8 bg-red-500/10 dark:bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">' +
                '<span class="text-red-600 dark:text-red-400 text-xs font-bold">' + t.name + '</span>' +
                '</div>' +
                '<div class="flex-1">' +
                '<p class="text-slate-900 dark:text-white text-sm font-medium">' + t.name + ' — ' + t.customer + '</p>' +
                '<p class="text-slate-500 dark:text-slate-400 text-xs">' + t.seats + ' seats</p>' +
                '</div>' +
                svgIcon('merge', 'text-slate-400');
            row.addEventListener('click', () => handleAction('merge', { ...table, target: t.name }));
            list.appendChild(row);
        });
    }

    // ── Actions ──────────────────────────────────────────────────────
    function handleAction(action, data) {
        closeModal();

        if (action === 'take-order') {
            window.location.href = `/pos?table=${data.name}`;
            return;
        }
        
        if (action === 'add-bill') {
            window.location.href = `/pos?table=${data.name}`;
            return;
        }

        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        let payload = {
            action: action,
            table_id: data.id
        };

        if (action === 'seat-guest') {
            const guestName = prompt('Enter guest name:', data.customer || 'Guest');
            if (guestName === null) return;
            payload.customer_name = guestName;
        } else if (action === 'transfer') {
            payload.target_table_name = data.transferTo;
        } else if (action === 'merge') {
            payload.target_table_name = data.target;
        }

        fetch('/pos/tables/action', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(resData => {
            if (resData.success) {
                showToast(resData.message);
                setTimeout(() => window.location.reload(), 1000);
            } else {
                showToast(resData.message, 'error');
            }
        })
        .catch(err => {
            console.error(err);
            showToast('Action failed', 'error');
        });
    }

    // ── Card click ───────────────────────────────────────────────────
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            const id = parseInt(card.getAttribute('data-id'), 10);
            const table = tables.find((t) => t.id === id);
            if (table) openModal(table);
        });
    });

    document.querySelectorAll('[data-close-modal]').forEach((el) => {
        el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });

    // ── Refresh ──────────────────────────────────────────────────────
    document.getElementById('refresh-floor').addEventListener('click', () => {
        showToast('Floor plan refreshed');
    });
});