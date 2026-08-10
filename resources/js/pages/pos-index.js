// POS Billing checkout page — vanilla JS (no React/Inertia).
// Category tabs filter the menu; clicking an item adds it to the cart
// (qty, price); +/- and remove in cart; live subtotal, 10% service
// charge, total; Print KOT / Checkout are placeholders (no backend).

const CATEGORIES = [
    { id: 'all', label: 'All Items', icon: 'utensils' },
    { id: 'kottu', label: 'Kottu', icon: 'flame' },
    { id: 'rice', label: 'Rice & Curry', icon: 'chef-hat' },
    { id: 'shortEats', label: 'Short Eats', icon: 'tag' },
    { id: 'beverages', label: 'Beverages', icon: 'coffee' },
    { id: 'drinks', label: 'Drinks', icon: 'wine' },
    { id: 'desserts', label: 'Desserts', icon: 'ice-cream' },
];

const MENU_ITEMS = [
    // Kottu
    { id: 1, name: 'Chicken Kottu', category: 'kottu', price: 850, emoji: '🍛', tags: ['spicy'] },
    { id: 2, name: 'Egg Kottu', category: 'kottu', price: 700, emoji: '🍳', tags: [] },
    { id: 3, name: 'Fish Kottu', category: 'kottu', price: 950, emoji: '🐟', tags: ['spicy'] },
    { id: 4, name: 'Veg Kottu', category: 'kottu', price: 600, emoji: '🥬', tags: ['vegan'] },
    { id: 5, name: 'Mutton Kottu', category: 'kottu', price: 1200, emoji: '🍖', tags: ['spicy'] },
    { id: 6, name: 'Cheese Kottu', category: 'kottu', price: 900, emoji: '🧀', tags: [] },
    // Rice & Curry
    { id: 7, name: 'Chicken Curry Rice', category: 'rice', price: 850, emoji: '🍛', tags: ['spicy'] },
    { id: 8, name: 'Lamprais', category: 'rice', price: 950, emoji: '📦', tags: [] },
    { id: 9, name: 'Fish Ambul Thiyal', category: 'rice', price: 1100, emoji: '🐟', tags: ['spicy'] },
    { id: 10, name: 'Red Rice & Curry', category: 'rice', price: 750, emoji: '🍚', tags: ['spicy'] },
    { id: 11, name: 'Jaffna Crab Curry', category: 'rice', price: 1500, emoji: '🦀', tags: ['spicy'] },
    { id: 12, name: 'Coconut Rice', category: 'rice', price: 600, emoji: '🥥', tags: [] },
    { id: 13, name: 'Prawn Curry Rice', category: 'rice', price: 1300, emoji: '🦐', tags: ['spicy'] },
    { id: 14, name: 'Hoppers (3 pcs)', category: 'rice', price: 450, emoji: '🥞', tags: [] },
    { id: 15, name: 'String Hoppers (4 pcs)', category: 'rice', price: 500, emoji: '🍜', tags: [] },
    // Short Eats
    { id: 16, name: 'Roti with Curry', category: 'shortEats', price: 350, emoji: '🫓', tags: [] },
    { id: 17, name: 'Cutlet (3 pcs)', category: 'shortEats', price: 450, emoji: '🥟', tags: ['spicy'] },
    { id: 18, name: 'Prawn Rolls (4 pcs)', category: 'shortEats', price: 650, emoji: '🦐', tags: [] },
    { id: 19, name: 'Fish Bankura', category: 'shortEats', price: 550, emoji: '🐟', tags: ['spicy'] },
    { id: 20, name: 'Chicken 65', category: 'shortEats', price: 600, emoji: '🍗', tags: ['spicy'] },
    { id: 21, name: 'Momo (6 pcs)', category: 'shortEats', price: 750, emoji: '🥟', tags: [] },
    { id: 22, name: 'Veg Spring Roll (3 pcs)', category: 'shortEats', price: 400, emoji: '🌯', tags: ['vegan'] },
    { id: 23, name: 'Samosa (2 pcs)', category: 'shortEats', price: 300, emoji: '🥟', tags: ['vegan'] },
    // Beverages
    { id: 24, name: 'Ceylon Tea', category: 'beverages', price: 150, emoji: '🍵', tags: [] },
    { id: 25, name: 'Iced Tea', category: 'beverages', price: 250, emoji: '🧊', tags: [] },
    { id: 26, name: 'Fresh Lime Soda', category: 'beverages', price: 300, emoji: '🍋', tags: [] },
    { id: 27, name: 'Coconut Water', category: 'beverages', price: 200, emoji: '🥥', tags: ['vegan'] },
    { id: 28, name: 'Milk Shake', category: 'beverages', price: 450, emoji: '🥤', tags: [] },
    { id: 29, name: 'Fresh Juice', category: 'beverages', price: 350, emoji: '🧃', tags: ['vegan'] },
    { id: 30, name: 'Espresso', category: 'beverages', price: 280, emoji: '☕', tags: [] },
    // Drinks
    { id: 31, name: 'Coca-Cola', category: 'drinks', price: 200, emoji: '🥤', tags: [] },
    { id: 32, name: 'Fanta', category: 'drinks', price: 200, emoji: '🍊', tags: [] },
    { id: 33, name: 'Sprite', category: 'drinks', price: 200, emoji: '🧃', tags: [] },
    { id: 34, name: 'Red Bull', category: 'drinks', price: 450, emoji: '⚡', tags: [] },
    { id: 35, name: 'Heineken', category: 'drinks', price: 700, emoji: '🍺', tags: [] },
    { id: 36, name: 'King Lager', category: 'drinks', price: 550, emoji: '🍺', tags: [] },
    // Desserts
    { id: 37, name: 'Watalappan', category: 'desserts', price: 350, emoji: '🍮', tags: [] },
    { id: 38, name: 'Halawa', category: 'desserts', price: 250, emoji: '🍮', tags: [] },
    { id: 39, name: 'Ice Cream (2 scoops)', category: 'desserts', price: 400, emoji: '🍨', tags: [] },
    { id: 40, name: 'Chocolate Lava Cake', category: 'desserts', price: 550, emoji: '🍫', tags: [] },
    { id: 41, name: 'Pineapple Torte', category: 'desserts', price: 450, emoji: '🍍', tags: [] },
    { id: 42, name: 'Sticky Toffee Pudding', category: 'desserts', price: 500, emoji: '🍰', tags: [] },
];

const SERVICE_CHARGE_RATE = 0.10;

const fmtLKR = (amount) =>
    'LKR ' + new Intl.NumberFormat('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

// Small inline SVG icons for the JS-built cart rows (path data mirrors
// resources/views/components/icon.blade.php).
const ICON_PATHS = {
    minus: ['M5 12h14'],
    plus: ['M5 12h14', 'M12 5v14'],
    trash: ['M3 6h18', 'M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', 'M10 11v6', 'M14 11v6'],
};
const svgIcon = (name, size) =>
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
    '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    ICON_PATHS[name].map((d) => '<path d="' + d + '"></path>').join('') +
    '</svg>';

// ── State-dependent class tokens (fully spelled out literal classes) ──
const TAB_ACTIVE = ['bg-indigo-600', 'text-white', 'shadow-lg', 'shadow-indigo-500/30', 'ring-1', 'ring-indigo-400/50', 'border-transparent'];
const TAB_INACTIVE = ['bg-slate-200/50', 'dark:bg-slate-700/50', 'text-slate-700', 'dark:text-slate-300', 'hover:bg-slate-200', 'dark:hover:bg-slate-700', 'hover:text-slate-900', 'dark:hover:text-white', 'border-slate-200', 'dark:border-slate-600/40'];

const OT_ACTIVE = ['bg-indigo-600', 'text-white', 'shadow-md'];
const OT_INACTIVE = ['text-slate-500', 'dark:text-slate-400', 'hover:text-slate-900', 'dark:hover:text-white'];

const KOT_EMPTY = ['bg-slate-100', 'dark:bg-slate-800/40', 'text-slate-400', 'dark:text-slate-500', 'border-slate-200', 'dark:border-transparent', 'cursor-not-allowed'];
const KOT_READY = ['bg-amber-500/10', 'border-amber-500/40', 'text-amber-600', 'dark:text-amber-400', 'hover:bg-amber-500/20', 'active:scale-[.98]'];
const KOT_PRINTED = ['bg-emerald-600/20', 'border-emerald-500/50', 'text-emerald-500', 'dark:text-emerald-400', 'hover:bg-emerald-600/30'];
const KOT_ALL = [...KOT_EMPTY, ...KOT_READY, ...KOT_PRINTED];

const CHECKOUT_EMPTY = ['bg-slate-100', 'dark:bg-slate-800/40', 'text-slate-400', 'dark:text-slate-500', 'cursor-not-allowed'];
const CHECKOUT_ACTIVE = ['bg-indigo-600', 'hover:bg-indigo-500', 'text-white', 'shadow-lg', 'shadow-indigo-500/30', 'active:scale-[.98]'];
const CHECKOUT_ALL = [...CHECKOUT_EMPTY, ...CHECKOUT_ACTIVE];

document.addEventListener('DOMContentLoaded', () => {
    const $ = (id) => document.getElementById(id);

    const tabs = document.querySelectorAll('#category-tabs [data-category]');
    const orderButtons = document.querySelectorAll('[data-order-type]');
    const menuGrid = $('menu-grid');
    const menuEmpty = $('menu-empty');
    const searchInput = $('search-input');
    const searchClear = $('search-clear');
    const tableWrap = $('table-wrap');
    const tableNumberInput = $('table-number');
    const cartSubtitle = $('cart-subtitle');
    const cartItemsEl = $('cart-items');
    const cartEmptyEl = $('cart-empty');
    const cartCountEl = $('cart-count');
    const clearBtn = $('clear-cart');
    const orderNoteWrap = $('order-note-wrap');
    const orderNoteEl = $('order-note');
    const cartSubtotalEl = $('cart-subtotal');
    const serviceRow = $('service-row');
    const cartServiceEl = $('cart-service');
    const cartTotalEl = $('cart-total');
    const printBtn = $('print-kot');
    const kotLabel = $('kot-label');
    const checkoutBtn = $('checkout-btn');
    const checkoutLabel = $('checkout-label');

    const menuCards = Array.from(document.querySelectorAll('#menu-grid [data-menu-id]'));

    let activeCategory = 'all';
    let searchQuery = '';
    let orderType = 'dine-in';
    let tableNumber = '';
    let orderNote = '';
    let kotPrinted = false;
    let cart = []; // [{ item, qty }]

    // ── Cart actions ──────────────────────────────────────────────────
    function addToCartById(id) {
        const item = MENU_ITEMS.find((i) => i.id === id);
        if (!item) return;
        const existing = cart.find((c) => c.item.id === id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ item, qty: 1 });
        }
        kotPrinted = false;
        renderCart();
    }

    function increaseQty(id) {
        const line = cart.find((c) => c.item.id === id);
        if (line) line.qty += 1;
        renderCart();
    }

    function decreaseQty(id) {
        const line = cart.find((c) => c.item.id === id);
        if (!line) return;
        if (line.qty <= 1) {
            cart = cart.filter((c) => c.item.id !== id);
        } else {
            line.qty -= 1;
        }
        renderCart();
    }

    function removeFromCart(id) {
        cart = cart.filter((c) => c.item.id !== id);
        renderCart();
    }

    function resetOrder() {
        cart = [];
        tableNumber = '';
        orderNote = '';
        kotPrinted = false;
        tableNumberInput.value = '';
        orderNoteEl.value = '';
        renderCart();
        renderCartSubtitle();
    }

    // ── Rendering ─────────────────────────────────────────────────────
    function renderCartSubtitle() {
        if (orderType === 'dine-in') {
            cartSubtitle.textContent = tableNumber ? 'Table ' + tableNumber : 'No table set';
        } else {
            cartSubtitle.textContent = 'Take Away';
        }
    }

    function setKotState(state) {
        printBtn.classList.remove(...KOT_ALL);
        if (state === 'ready') {
            printBtn.classList.add(...KOT_READY);
        } else if (state === 'printed') {
            printBtn.classList.add(...KOT_PRINTED);
        } else {
            printBtn.classList.add(...KOT_EMPTY);
        }
        kotLabel.textContent = state === 'printed' ? 'KOT Sent ✓' : 'Print KOT';
    }

    function setCheckoutState(state) {
        checkoutBtn.classList.remove(...CHECKOUT_ALL);
        checkoutBtn.classList.add(...(state === 'active' ? CHECKOUT_ACTIVE : CHECKOUT_EMPTY));
    }

    function renderCart() {
        const subtotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
        const serviceCharge = subtotal * SERVICE_CHARGE_RATE;
        const total = subtotal + serviceCharge;
        const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);
        const hasItems = cart.length > 0;

        cartItemsEl.innerHTML = cart
            .map(
                (c) =>
                    '<div class="flex items-center gap-3 py-3 border-b border-slate-200/80 dark:border-slate-800/40 last:border-0 hover:bg-slate-100 dark:hover:bg-slate-800/40 rounded-lg px-2 -mx-2 transition-colors">' +
                    '  <span class="text-2xl flex-shrink-0">' + c.item.emoji + '</span>' +
                    '  <div class="flex-1 min-w-0">' +
                    '    <p class="text-slate-800 dark:text-white text-sm font-medium leading-tight truncate">' + c.item.name + '</p>' +
                    '    <p class="text-indigo-600 dark:text-indigo-400 text-sm font-semibold mt-0.5">' + fmtLKR(c.item.price * c.qty) + '</p>' +
                    '  </div>' +
                    '  <div class="flex items-center gap-1.5 flex-shrink-0">' +
                    '    <button type="button" data-action="dec" data-id="' + c.item.id + '" class="w-7 h-7 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors text-slate-600 dark:text-slate-300">' + svgIcon('minus', 12) + '</button>' +
                    '    <span class="w-6 text-center text-slate-800 dark:text-white font-bold text-sm tabular-nums">' + c.qty + '</span>' +
                    '    <button type="button" data-action="inc" data-id="' + c.item.id + '" class="w-7 h-7 bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center justify-center transition-colors text-white">' + svgIcon('plus', 12) + '</button>' +
                    '    <button type="button" data-action="remove" data-id="' + c.item.id + '" class="w-7 h-7 bg-red-500/20 hover:bg-red-500/40 rounded-lg flex items-center justify-center transition-colors ml-1 text-red-400">' + svgIcon('trash', 12) + '</button>' +
                    '  </div>' +
                    '</div>'
            )
            .join('');

        cartEmptyEl.classList.toggle('hidden', hasItems);
        cartItemsEl.classList.toggle('hidden', !hasItems);
        orderNoteWrap.classList.toggle('hidden', !hasItems);
        clearBtn.classList.toggle('hidden', !hasItems);
        cartCountEl.classList.toggle('hidden', totalItems === 0);
        cartCountEl.textContent = String(totalItems);
        serviceRow.classList.toggle('hidden', serviceCharge <= 0);

        cartSubtotalEl.textContent = fmtLKR(subtotal);
        cartServiceEl.textContent = fmtLKR(serviceCharge);
        cartTotalEl.textContent = fmtLKR(total);
        checkoutLabel.textContent = 'Checkout — ' + fmtLKR(total);

        printBtn.disabled = !hasItems;
        checkoutBtn.disabled = !hasItems;
        setKotState(hasItems ? (kotPrinted ? 'printed' : 'ready') : 'empty');
        setCheckoutState(hasItems ? 'active' : 'empty');
    }

    function renderMenu() {
        const q = searchQuery.trim().toLowerCase();
        let visible = 0;
        menuCards.forEach((card) => {
            const matchCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
            const matchSearch = (card.dataset.name || '').toLowerCase().includes(q);
            const show = matchCategory && matchSearch;
            card.classList.toggle('hidden', !show);
            if (show) visible += 1;
        });
        menuEmpty.classList.toggle('hidden', visible !== 0);
    }

    // ── Category tabs ─────────────────────────────────────────────────
    function setCategory(category) {
        activeCategory = category;
        tabs.forEach((tab) => {
            if (tab.dataset.category === category) {
                tab.classList.add(...TAB_ACTIVE);
                tab.classList.remove(...TAB_INACTIVE);
            } else {
                tab.classList.add(...TAB_INACTIVE);
                tab.classList.remove(...TAB_ACTIVE);
            }
        });
        renderMenu();
    }

    tabs.forEach((tab) => tab.addEventListener('click', () => setCategory(tab.dataset.category)));

    // ── Order type toggle ─────────────────────────────────────────────
    function setOrderType(type) {
        orderType = type;
        orderButtons.forEach((btn) => {
            if (btn.dataset.orderType === type) {
                btn.classList.add(...OT_ACTIVE);
                btn.classList.remove(...OT_INACTIVE);
            } else {
                btn.classList.add(...OT_INACTIVE);
                btn.classList.remove(...OT_ACTIVE);
            }
        });
        tableWrap.classList.toggle('hidden', type !== 'dine-in');
        renderCartSubtitle();
    }

    orderButtons.forEach((btn) => btn.addEventListener('click', () => setOrderType(btn.dataset.orderType)));

    // ── Menu click ────────────────────────────────────────────────────
    menuGrid.addEventListener('click', (e) => {
        const card = e.target.closest('[data-menu-id]');
        if (!card) return;
        addToCartById(Number(card.dataset.menuId));
    });

    // ── Cart row actions (delegated) ──────────────────────────────────
    cartItemsEl.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const id = Number(btn.dataset.id);
        const action = btn.dataset.action;
        if (action === 'inc') increaseQty(id);
        else if (action === 'dec') decreaseQty(id);
        else if (action === 'remove') removeFromCart(id);
    });

    // ── Search ────────────────────────────────────────────────────────
    searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value;
        searchClear.classList.toggle('hidden', searchQuery === '');
        renderMenu();
    });

    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClear.classList.add('hidden');
        renderMenu();
    });

    // ── Table / note inputs ───────────────────────────────────────────
    tableNumberInput.addEventListener('input', () => {
        tableNumber = tableNumberInput.value;
        renderCartSubtitle();
    });

    orderNoteEl.addEventListener('input', () => {
        orderNote = orderNoteEl.value;
    });

    // ── Clear cart ────────────────────────────────────────────────────
    clearBtn.addEventListener('click', resetOrder);

    // ── Placeholder actions (no backend) ──────────────────────────────
    printBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        kotPrinted = true;
        renderCart();
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        resetOrder();
    });

    // ── Init ──────────────────────────────────────────────────────────
    setOrderType(orderType);
    setCategory(activeCategory);
    renderCart();
});
