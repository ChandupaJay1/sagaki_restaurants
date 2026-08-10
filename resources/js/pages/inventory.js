// Inventory page module — client-side search/filter, category + status
// filters, stock (+/-) adjustment, add / delete items and toast feedback.

const init = () => {
    const source = window.POS_INVENTORY || {};
    const items = (source.items || []).map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        qty: item.qty,
        unit: item.unit,
        minQty: item.minQty,
        price: item.price,
        supplier: item.supplier,
        lastOrder: item.lastOrder,
        status: item.status,
    }));
    const categoryIcons = source.categories || {};

    // ── SVG icon lookup (paths kept in lock-step with the icon component) ──
    const ICONS = {
        package: ['M14.8 9.39 7.2 4.6a1.2 1.2 0 0 0-1.2 0l-2 1.1 6 3.5 4.8-1.6Z', 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z', 'M2 8.18 12 15l10-6.82', 'M12 22V12'],
        beef: ['M16.4 13.7A6.5 6.5 0 1 0 6.28 6.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.6 11.4-4.3', 'm18.5 6 2.19 4.5a6.48 6.48 0 0 1-2.29 7.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5'],
        apple: ['M12 6.528V3a1 1 0 0 1 1-1h.01', 'M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10 3 3 0 0 0 3.648.648 5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21'],
        beaker: ['M4.5 3h15', 'M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3', 'M6 14h12'],
        wheat: ['M2 22 16 8', 'M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z', 'M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z', 'M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z', 'M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z', 'M15 11.47 17 13l-1.53 1.53a5.5 5.5 0 0 1-4.94 0L11 13l1.53-1.53a5.5 5.5 0 0 1 4.94 0Z', 'M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z'],
        coffee: ['M17 8h1a4 4 0 1 1 0 8h-1', 'M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z', 'M6 2v2', 'M10 2v2', 'M14 2v2'],
        fish: ['M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z', 'M18 12v.5', 'M16 17.93a9.77 9.77 0 0 1 0-11.86'],
        edit: ['M13 21h8', 'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.41 4.7a.5.5 0 0 0 .62.62l4.7-1.41a2 2 0 0 0 .83-.5z'],
        trash: ['M3 6h18', 'M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', 'M10 11v6', 'M14 11v6'],
        minus: ['M5 12h14'],
        plus: ['M5 12h14', 'M12 5v14'],
    };

    const icon = (name, size, cls) => {
        const paths = (ICONS[name] || []).map((d) => `<path d="${d}"></path>`).join('');
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${cls || ''}">${paths}</svg>`;
    };

    const esc = (value) => {
        const node = document.createElement('div');
        node.textContent = value == null ? '' : String(value);
        return node.innerHTML;
    };
    const fmt = (value) => new Intl.NumberFormat('en-US').format(value);

    const STATUS_STYLES = {
        ok: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        low: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
        critical: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30 animate-pulse',
    };
    const STATUS_LABELS = { ok: 'In Stock', low: 'Low', critical: 'Critical' };

    // ── DOM refs ──────────────────────────────────────────────────────────
    const tbody = document.getElementById('inv-tbody');
    const summary = document.getElementById('inv-summary');
    const searchEl = document.getElementById('inv-search');
    const statusEl = document.getElementById('inv-status');
    const catsWrap = document.querySelector('[data-inv-cats]');
    const emptyEl = document.getElementById('inv-empty');
    const openBtn = document.querySelector('[data-inv-open]');
    const modal = document.getElementById('inv-add-modal');
    const toastEl = document.getElementById('inv-toast');
    const toastMsg = document.getElementById('inv-toast-message');
    let toastTimer = null;

    let activeCat = 'all';

    const statValue = (key) => document.querySelector(`[data-inv-stat="${key}"]`);
    const currentSearch = () => (searchEl ? searchEl.value.trim().toLowerCase() : '');
    const cats = () => Array.from(catsWrap ? catsWrap.querySelectorAll('[data-inv-cat]') : []);

    // ── Rendering ─────────────────────────────────────────────────────────
    const stockBar = (item) => {
        const pct = Math.min(100, Math.round((item.qty / Math.max(item.minQty, 1)) * 100));
        const barClass = pct >= 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500';
        return `
            <div class="flex items-center gap-2">
                <div class="flex-1 bg-slate-200 dark:bg-slate-700/60 rounded-full h-1.5">
                    <div class="${barClass} h-1.5 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                </div>
                <span class="text-xs text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">${item.qty}/${item.minQty}</span>
            </div>
            <div class="flex items-center gap-1.5 mt-1.5">
                <button type="button" data-action="dec" data-id="${item.id}" title="Reduce stock by 1"
                    class="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-700/60 dark:text-slate-300 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white transition-colors">${icon('minus', 13)}</button>
                <span class="flex-1 text-center text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">${item.qty} ${esc(item.unit)}</span>
                <button type="button" data-action="inc" data-id="${item.id}" title="Increase stock by 1"
                    class="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-700/60 dark:text-slate-300 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-colors">${icon('plus', 13)}</button>
            </div>`;
    };

    const rowTemplate = (item) => `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
            <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-slate-100 dark:bg-slate-700/60 rounded-lg flex items-center justify-center flex-shrink-0">
                        ${icon(categoryIcons[item.category] || 'package', 14, 'text-slate-500 dark:text-slate-400')}
                    </div>
                    <div class="min-w-0">
                        <p class="text-slate-900 dark:text-white font-medium text-sm truncate max-w-[160px]">${esc(item.name)}</p>
                        <p class="text-slate-500 dark:text-slate-400 text-xs">${esc(item.lastOrder)}</p>
                    </div>
                </div>
            </td>
            <td class="px-5 py-3.5">
                <span class="text-slate-500 dark:text-slate-400 text-xs capitalize">${esc(item.category)}</span>
            </td>
            <td class="px-5 py-3.5 w-44">
                ${stockBar(item)}
            </td>
            <td class="px-5 py-3.5">
                <span class="text-slate-900 dark:text-white font-semibold tabular-nums">LKR ${fmt(item.price)}</span>
                <p class="text-slate-500 dark:text-slate-400 text-xs">per ${esc(item.unit)}</p>
            </td>
            <td class="px-5 py-3.5">
                <span class="inline-flex text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${STATUS_STYLES[item.status] || STATUS_STYLES.ok}">${STATUS_LABELS[item.status] || 'In Stock'}</span>
            </td>
            <td class="px-5 py-3.5">
                <span class="text-slate-500 dark:text-slate-400 text-xs">${esc(item.supplier)}</span>
            </td>
            <td class="px-5 py-3.5">
                <div class="flex items-center justify-end gap-1">
                    <button type="button" data-action="edit" data-id="${item.id}" title="Edit ${esc(item.name)}"
                        class="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1.5 rounded-lg hover:bg-indigo-500/10">${icon('edit', 14)}</button>
                    <button type="button" data-action="delete" data-id="${item.id}" title="Delete ${esc(item.name)}"
                        class="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">${icon('trash', 14)}</button>
                </div>
            </td>
        </tr>`;

    const render = () => {
        const query = currentSearch();
        const selectedStatus = statusEl ? statusEl.value : 'all';
        const filtered = items.filter((item) =>
            (!query || item.name.toLowerCase().includes(query)) &&
            (activeCat === 'all' || item.category === activeCat) &&
            (selectedStatus === 'all' || item.status === selectedStatus)
        );

        if (tbody) tbody.innerHTML = filtered.map(rowTemplate).join('');
        if (emptyEl) emptyEl.classList.toggle('hidden', filtered.length > 0);

        // Header summary + stat cards
        const totalValue = items.reduce((sum, item) => sum + item.price * item.qty, 0);
        const lowCount = items.filter((item) => item.status !== 'ok').length;
        const critCount = items.filter((item) => item.status === 'critical').length;

        if (summary) summary.textContent = `${items.length} items · LKR ${fmt(totalValue)} total value`;
        const statTotal = statValue('total');
        if (statTotal) statTotal.textContent = items.length;
        const statValueEl = statValue('value');
        if (statValueEl) statValueEl.textContent = `LKR ${Math.round(totalValue / 1000)}k`;
        const statLow = statValue('low');
        if (statLow) statLow.textContent = lowCount;
        const statCrit = statValue('critical');
        if (statCrit) statCrit.textContent = critCount;
    };

    // ── Category chip states ──────────────────────────────────────────────
    const CAT_ACTIVE = ['bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-500/30'];
    const CAT_IDLE = ['bg-slate-100', 'text-slate-600', 'dark:bg-slate-800/80', 'dark:text-slate-300', 'border', 'border-slate-200', 'dark:border-slate-700/60', 'hover:text-slate-900', 'dark:hover:text-white', 'hover:border-indigo-300'];

    const setActiveChips = () => {
        cats.forEach((chip) => {
            const isActive = chip.getAttribute('data-inv-cat') === activeCat;
            chip.classList.remove(...CAT_ACTIVE, ...CAT_IDLE);
            chip.classList.add(...(isActive ? CAT_ACTIVE : CAT_IDLE));
        });
    };

    // ── Toast ─────────────────────────────────────────────────────────────
    const showToast = (message) => {
        if (!toastEl) return;
        if (toastMsg) toastMsg.textContent = message;
        toastEl.classList.remove('hidden');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.add('hidden'), 3000);
    };

    const openAddModal = () => {
        if (!modal) return;
        modal.classList.remove('hidden');
    };
    const closeAddModal = () => {
        if (modal) modal.classList.add('hidden');
    };

    // ── Events ────────────────────────────────────────────────────────────
    if (searchEl) searchEl.addEventListener('input', render);
    if (statusEl) statusEl.addEventListener('change', render);

    if (catsWrap) {
        catsWrap.addEventListener('click', (event) => {
            const chip = event.target.closest('[data-inv-cat]');
            if (!chip) return;
            activeCat = chip.getAttribute('data-inv-cat');
            setActiveChips();
            render();
        });
    }

    if (tbody) {
        tbody.addEventListener('click', (event) => {
            const button = event.target.closest('[data-action]');
            if (!button) return;
            const id = Number(button.getAttribute('data-id'));
            const item = items.find((entry) => entry.id === id);
            if (!item) return;

            switch (button.getAttribute('data-action')) {
                case 'inc':
                    item.qty += 1;
                    render();
                    break;
                case 'dec':
                    item.qty = Math.max(0, item.qty - 1);
                    render();
                    break;
                case 'edit':
                    showToast(`Editing ${item.name}`);
                    break;
                case 'delete':
                    items.splice(items.indexOf(item), 1);
                    render();
                    showToast('Item removed');
                    break;
            }
        });
    }

    if (openBtn) openBtn.addEventListener('click', openAddModal);
    document.querySelectorAll('[data-inv-close]').forEach((el) => el.addEventListener('click', closeAddModal));

    const addSubmit = document.querySelector('[data-inv-add-submit]');
    if (addSubmit) {
        addSubmit.addEventListener('click', () => {
            const nameEl = document.getElementById('inv-add-name');
            const categoryEl = document.getElementById('inv-add-category');
            const unitEl = document.getElementById('inv-add-unit');
            const qtyEl = document.getElementById('inv-add-qty');
            const minQtyEl = document.getElementById('inv-add-minqty');
            const priceEl = document.getElementById('inv-add-price');
            const supplierEl = document.getElementById('inv-add-supplier');

            const name = nameEl ? nameEl.value.trim() : '';
            const supplier = supplierEl ? supplierEl.value.trim() : '';
            const qty = Number(qtyEl ? qtyEl.value : 0) || 0;
            const minQty = Number(minQtyEl ? minQtyEl.value : 0) || 0;
            const price = Number(priceEl ? priceEl.value : 0) || 0;

            if (!name) {
                showToast('Please enter an item name');
                if (nameEl) nameEl.focus();
                return;
            }

            const today = new Date().toISOString().split('T')[0];
            items.unshift({
                id: Date.now(),
                name,
                category: categoryEl ? categoryEl.value : 'proteins',
                qty,
                unit: unitEl ? unitEl.value : 'kg',
                minQty,
                price,
                supplier,
                lastOrder: today,
                status: 'ok',
            });

            closeAddModal();
            activeCat = 'all';
            setActiveChips();
            render();
            showToast('Item added successfully');
        });
    }

    // ── Render on load ────────────────────────────────────────────────────
    setActiveChips();
    render();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}