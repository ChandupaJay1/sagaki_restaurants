// POS Billing checkout page — vanilla JS (no React/Inertia).
// Dynamically connected to Laravel backend database endpoints.

const CATEGORIES = window.POS_CATEGORIES || [
    { id: 'all', label: 'All Items', icon: 'utensils' },
    { id: 'kottu', label: 'Kottu', icon: 'flame' },
    { id: 'rice', label: 'Rice & Curry', icon: 'chef-hat' },
    { id: 'shortEats', label: 'Short Eats', icon: 'tag' },
    { id: 'beverages', label: 'Beverages', icon: 'coffee' },
    { id: 'drinks', label: 'Drinks', icon: 'wine' },
    { id: 'desserts', label: 'Desserts', icon: 'ice-cream' },
];

const MENU_ITEMS = window.POS_MENU_ITEMS || [
    { id: 1, name: 'Chicken Kottu', category: 'kottu', price: 850, emoji: '🍛', tags: ['spicy'] },
    { id: 2, name: 'Egg Kottu', category: 'kottu', price: 700, emoji: '🍳', tags: [] },
];

const SERVICE_CHARGE_RATE = 0.10;

const fmtLKR = (amount) =>
    'LKR ' + new Intl.NumberFormat('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

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

    let selectedPayment = 'Cash';
    const paymentButtons = document.querySelectorAll('[data-payment-method]');
    paymentButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedPayment = btn.dataset.paymentMethod;
            paymentButtons.forEach(b => {
                b.classList.remove('border-indigo-650', 'bg-indigo-600/10', 'text-indigo-600', 'dark:text-indigo-400');
                b.classList.add('border-slate-200', 'dark:border-slate-700', 'text-slate-500');
            });
            btn.classList.add('border-indigo-650', 'bg-indigo-600/10', 'text-indigo-600', 'dark:text-indigo-400');
            btn.classList.remove('border-slate-200', 'dark:border-slate-700', 'text-slate-500');
        });
    });

    const discountInput = $('discount-pct');
    if (discountInput) {
        discountInput.addEventListener('input', renderCart);
    }

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
        if (discountInput) discountInput.value = '';
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
        const isDineIn = orderType === 'dine-in';
        const serviceCharge = isDineIn ? (subtotal * SERVICE_CHARGE_RATE) : 0;
        const discountPct = Number(discountInput ? discountInput.value : 0);
        const discount = subtotal * (discountPct / 100);
        const total = Math.max(0, subtotal + serviceCharge - discount);
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

        // Show/hide CRM & Discount inputs
        $('customer-select-wrap').classList.toggle('hidden', !hasItems);
        $('discount-wrap').classList.toggle('hidden', !hasItems);
        $('payment-wrap').classList.toggle('hidden', !hasItems);

        const splitBillBtn = $('split-bill-btn');
        const printInvoiceBtn = $('print-invoice-btn');
        if (splitBillBtn) {
            splitBillBtn.disabled = !hasItems;
            splitBillBtn.classList.toggle('opacity-50', !hasItems);
            splitBillBtn.classList.toggle('cursor-not-allowed', !hasItems);
        }
        if (printInvoiceBtn) {
            printInvoiceBtn.disabled = !hasItems;
            printInvoiceBtn.classList.toggle('opacity-50', !hasItems);
            printInvoiceBtn.classList.toggle('cursor-not-allowed', !hasItems);
        }

        const discountRow = $('discount-row');
        if (discountRow) {
            discountRow.classList.toggle('hidden', discount <= 0);
            $('cart-discount').textContent = '-' + fmtLKR(discount);
        }

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
        renderCart();
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

    // ── Split Billing ─────────────────────────────────────────────────
    const splitBillBtn = $('split-bill-btn');
    if (splitBillBtn) {
        splitBillBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            const count = prompt('How many people to split the bill between?', '2');
            if (count && !isNaN(count) && count > 0) {
                const subtotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
                const isDineIn = orderType === 'dine-in';
                const serviceCharge = isDineIn ? (subtotal * SERVICE_CHARGE_RATE) : 0;
                const discountPct = Number(discountInput ? discountInput.value : 0);
                const discount = subtotal * (discountPct / 100);
                const total = Math.max(0, subtotal + serviceCharge - discount);
                const splitAmt = total / count;
                alert(`Split Bill Summary:\nNumber of people: ${count}\nEach person pays: ${fmtLKR(splitAmt)}`);
            }
        });
    }

    // ── Bill PDF Invoice Generator ────────────────────────────────────
    const printInvoiceBtn = $('print-invoice-btn');
    if (printInvoiceBtn) {
        printInvoiceBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            const subtotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
            const isDineIn = orderType === 'dine-in';
            const serviceCharge = isDineIn ? (subtotal * SERVICE_CHARGE_RATE) : 0;
            const discountPct = Number(discountInput ? discountInput.value : 0);
            const discount = subtotal * (discountPct / 100);
            const total = Math.max(0, subtotal + serviceCharge - discount);
            
            let receiptText = `=== SAGAKI RESTAURANT ===\n`;
            receiptText += `Date: ${new Date().toLocaleString()}\n`;
            receiptText += `Order Type: ${orderType.toUpperCase()}\n`;
            if (orderType === 'dine-in' && tableNumber) receiptText += `Table: ${tableNumber}\n`;
            receiptText += `------------------------------\n`;
            cart.forEach(c => {
                receiptText += `${c.item.name.padEnd(20)} x${c.qty} : ${fmtLKR(c.item.price * c.qty)}\n`;
            });
            receiptText += `------------------------------\n`;
            receiptText += `Subtotal: ${fmtLKR(subtotal)}\n`;
            if (serviceCharge > 0) receiptText += `Service Charge (10%): ${fmtLKR(serviceCharge)}\n`;
            if (discount > 0) receiptText += `Discount (${discountPct}%): -${fmtLKR(discount)}\n`;
            receiptText += `==============================\n`;
            receiptText += `Grand Total: ${fmtLKR(total)}\n`;
            receiptText += `Payment Mode: ${selectedPayment}\n`;
            receiptText += `==============================\n`;
            receiptText += `Thank you! Please come again!`;
            
            const win = window.open("", "Receipt", "width=400,height=600");
            win.document.write(`<pre style="font-family:monospace; font-size:14px; padding:20px; line-height: 1.5;">${receiptText}</pre>`);
            win.document.close();
            win.print();
        });
    }

    // ── KOT / Checkout AJAX Actions ──────────────────────────────────
    function submitOrder(action) {
        const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const discountPct = Number(discountInput ? discountInput.value : 0);
        const subtotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);
        const discount = subtotal * (discountPct / 100);

        const payload = {
            order_type: orderType,
            table_number: tableNumber,
            note: orderNote,
            items: cart.map(c => ({ id: c.item.id, qty: c.qty })),
            payment_method: selectedPayment,
            discount: discount,
            customer_id: $('customer-select').value || null,
            action: action
        };

        printBtn.disabled = true;
        checkoutBtn.disabled = true;

        fetch('/pos/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert(`${action === 'checkout' ? 'Checkout' : 'KOT'} successful!\nOrder ID: ${data.order_id}`);
                resetOrder();
            } else {
                alert('Order failed: ' + data.message);
                printBtn.disabled = false;
                checkoutBtn.disabled = false;
            }
        })
        .catch(err => {
            console.error(err);
            alert('An error occurred during submission.');
            printBtn.disabled = false;
            checkoutBtn.disabled = false;
        });
    }

    printBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        submitOrder('kot');
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        submitOrder('checkout');
    });

    // ── Init ──────────────────────────────────────────────────────────
    setOrderType(orderType);
    setCategory(activeCategory);
    renderCart();

    const urlParams = new URLSearchParams(window.location.search);
    const urlTable = urlParams.get('table');
    if (urlTable) {
        tableNumber = urlTable;
        tableNumberInput.value = urlTable;
        renderCartSubtitle();
    }
});
