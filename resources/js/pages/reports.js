// Reports page module — period switching for the analytics dashboard.

const SALES_DATA = {
    today: [
        { label: '10AM', orders: 12, revenue: 8400 },
        { label: '11AM', orders: 24, revenue: 18200 },
        { label: '12PM', orders: 38, revenue: 31500 },
        { label: '1PM', orders: 42, revenue: 35600 },
        { label: '2PM', orders: 28, revenue: 22400 },
        { label: '3PM', orders: 15, revenue: 11200 },
        { label: '4PM', orders: 8, revenue: 5600 },
        { label: '5PM', orders: 18, revenue: 14400 },
        { label: '6PM', orders: 35, revenue: 29800 },
        { label: '7PM', orders: 45, revenue: 38200 },
        { label: '8PM', orders: 40, revenue: 34000 },
        { label: '9PM', orders: 22, revenue: 17600 },
    ],
    week: [
        { label: 'Mon', orders: 124, revenue: 98000, cost: 42000 },
        { label: 'Tue', orders: 138, revenue: 112000, cost: 48000 },
        { label: 'Wed', orders: 109, revenue: 89000, cost: 38000 },
        { label: 'Thu', orders: 167, revenue: 134000, cost: 56000 },
        { label: 'Fri', orders: 219, revenue: 178000, cost: 72000 },
        { label: 'Sat', orders: 268, revenue: 215000, cost: 89000 },
        { label: 'Sun', orders: 245, revenue: 198000, cost: 82000 },
    ],
    month: [
        { label: 'W1', orders: 580, revenue: 468000, cost: 195000 },
        { label: 'W2', orders: 620, revenue: 502000, cost: 208000 },
        { label: 'W3', orders: 595, revenue: 481000, cost: 199000 },
        { label: 'W4', orders: 640, revenue: 528000, cost: 218000 },
    ],
};

const fmt = (n) => new Intl.NumberFormat('en-US').format(n);

function computeTotals(data, period) {
    let totalRevenue = 0;
    let totalOrders = 0;
    let totalCost = 0;
    let peak = data[0];
    data.forEach((d) => {
        totalRevenue += d.revenue;
        totalOrders += d.orders;
        totalCost += d.cost || 0;
        if (d.revenue > peak.revenue) peak = d;
    });
    if (period === 'today') totalCost = Math.round(totalRevenue * 0.38);
    const profit = totalRevenue - totalCost;
    const profitMargin = ((profit / totalRevenue) * 100).toFixed(1);
    const avgOrder = Math.round(totalRevenue / totalOrders);
    return { totalRevenue, totalOrders, totalCost, profit, profitMargin, avgOrder, peak };
}

function barsHtml(data, maxRevenue) {
    return data
        .map((d, i) => {
            const height = ((d.revenue / maxRevenue) * 100).toFixed(1);
            const isPeak = d.revenue === maxRevenue;
            const bar = isPeak
                ? 'w-full max-w-[44px] rounded-t-md bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-lg shadow-indigo-500/30'
                : 'w-full max-w-[44px] rounded-t-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600';
            const label = isPeak ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500';
            return (
                '<div class="flex-1 flex flex-col items-center gap-1">' +
                '<div class="w-full flex justify-center" style="height:160px">' +
                '<div class="' + bar + ' fg-bar-anim" style="height:' + height + '%;animation-delay:' + i * 0.05 + 's"></div>' +
                '</div>' +
                '<span class="text-xs font-semibold whitespace-nowrap ' + label + '">' + d.label + '</span>' +
                '</div>'
            );
        })
        .join('');
}

function costHtml(data, totals) {
    return data
        .map((d) => {
            const costPct = d.cost ? Math.round((d.cost / d.revenue) * 100) : 38;
            return (
                '<div class="flex items-center gap-3">' +
                '<span class="text-slate-500 dark:text-slate-400 text-xs w-12 flex-shrink-0">' + d.label + '</span>' +
                '<div class="flex-1 flex gap-1 items-center">' +
                '<div class="h-3 rounded-l-sm bg-red-500/50 dark:bg-red-500/60" style="width:' + costPct + '%"></div>' +
                '<div class="h-3 rounded-r-sm bg-emerald-500/50 dark:bg-emerald-500/60 flex-1" style="width:' + (100 - costPct) + '%"></div>' +
                '</div>' +
                '<span class="text-slate-500 dark:text-slate-400 text-xs w-16 text-right tabular-nums">' + costPct + '%</span>' +
                '</div>'
            );
        })
        .join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const rangeLabel = document.getElementById('reports-range');
    const bars = document.querySelector('[data-report-bars]');
    const costBox = document.querySelector('[data-cost-rows]') || document.querySelector('[data-report-bars]');
    const cards = document.querySelectorAll('[data-report-card]');
    const payTotal = document.querySelector('.data-payment-total');

    const ranges = {
        today: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        week: 'Jan 6 – Jan 12, 2024',
        month: 'January 2024',
    };

    const render = (period) => {
        const data = SALES_DATA[period];
        const t = computeTotals(data, period);
        const maxRevenue = Math.max(...data.map((d) => d.revenue));

        const labels = { revenue: 'LKR ' + fmt(t.totalRevenue), orders: fmt(t.totalOrders), profit: 'LKR ' + fmt(t.profit), avg: 'LKR ' + fmt(t.avgOrder) };
        cards.forEach((card) => {
            const key = card.getAttribute('data-report-card');
            card.querySelector('.data-report-value').textContent = labels[key];
            const change = card.querySelector('.data-report-change');
            if (change) {
                change.lastChild.textContent = ' ' + (key === 'profit' ? t.profitMargin + '% margin' : key === 'avg' ? '-2.1%' : key === 'revenue' ? '+12.5%' : '+8.2%');
            }
        });

        if (rangeLabel) rangeLabel.textContent = ranges[period] || '';
        if (bars) bars.innerHTML = barsHtml(data, maxRevenue);
        const costRows = document.querySelector('[data-cost-rows]');
        if (costRows) costRows.innerHTML = costHtml(data, t);
        if (payTotal) payTotal.textContent = 'LKR ' + fmt(t.totalRevenue);
    };

    document.querySelectorAll('[data-period]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const period = btn.getAttribute('data-period');
            document.querySelectorAll('[data-period]').forEach((b) => {
                const on = b === btn;
                b.classList.toggle('bg-indigo-600', on);
                b.classList.toggle('text-white', on);
                b.classList.toggle('shadow-md', on);
                b.classList.toggle('text-slate-500', !on);
                b.classList.toggle('dark:text-slate-400', !on);
            });
            render(period);
        });
    });

    const exportBtn = document.querySelector('[data-export]');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            window.print();
        });
    }
});