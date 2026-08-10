// Dashboard page module — live clock + period metric switching.

const PERIOD_STATS = {
    today: { sales: 142580, orders: 184, avgOrder: 775, guests: 523, change: '+12.5%' },
    week: { sales: 892340, orders: 1102, avgOrder: 810, guests: 3890, change: '+9.4%' },
    month: { sales: 3745200, orders: 4680, avgOrder: 800, guests: 16480, change: '+15.2%' },
};

const fmt = (n) => new Intl.NumberFormat('en-US').format(n);

// ── Live clock ─────────────────────────────────────────────────────
function renderClock() {
    const el = document.getElementById('dashboard-clock');
    if (!el) return;
    const now = new Date();
    el.textContent =
        now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) +
        ' · ' +
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
renderClock();
setInterval(renderClock, 60000);

// ── Period switcher ─────────────────────────────────────────────────────────
const periodSelector = document.getElementById('period-selector');
const metricSales = document.querySelector('[data-metric="sales"]');
const metricOrders = document.querySelector('[data-metric="orders"]');
const metricSalesSub = document.querySelector('[data-metric-sub="sales"]');
const metricOrdersSub = document.querySelector('[data-metric-sub="orders"]');
const totalSalesEls = document.querySelectorAll('[data-total="sales"]');
const avgOrderEls = document.querySelectorAll('[data-total="avg"]');

if (periodSelector) {
    periodSelector.querySelectorAll('[data-period]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const period = btn.getAttribute('data-period');
            const stats = PERIOD_STATS[period] || PERIOD_STATS.today;

            periodSelector.querySelectorAll('[data-period]').forEach((b) => {
                b.classList.remove('bg-indigo-600', 'text-white', 'shadow-md');
                b.classList.add('text-slate-500', 'hover:text-slate-700', 'dark:text-slate-400', 'dark:hover:text-white');
            });
            btn.classList.add('bg-indigo-600', 'text-white', 'shadow-md');
            btn.classList.remove('text-slate-500', 'hover:text-slate-700', 'dark:text-slate-400', 'dark:hover:text-white');

            if (metricSales) metricSales.textContent = 'LKR ' + fmt(stats.sales);
            if (metricSalesSub) metricSalesSub.textContent = 'vs ' + (period === 'today' ? 'yesterday' : 'last period');
            if (metricOrders) metricOrders.textContent = fmt(stats.orders);
            if (metricOrdersSub) metricOrdersSub.textContent = fmt(stats.guests) + ' guests served';

            const change = document.querySelector('[data-metric-change="sales"]');
            if (change) {
                change.lastChild.textContent = ' ' + stats.change;
            }

            totalSalesEls.forEach((el) => (el.textContent = 'LKR ' + fmt(stats.sales)));
            avgOrderEls.forEach((el) => (el.textContent = 'LKR ' + fmt(stats.avgOrder)));
        });
    });
}