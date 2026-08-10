// KDS page module — kanban advance (new→preparing→ready→served), per-minute ticking, column counts.
// Pure vanilla JS over the Blade-rendered card DOM.

const STATUS_FLOW = { new: 'preparing', preparing: 'ready', ready: 'served', served: 'served' };

// Per-status action button styling (fully spelled-out classes).
const ACTION_STYLE = {
    new: {
        text: ['text-blue-600', 'dark:text-blue-400', 'hover:bg-blue-500/20', 'border-blue-500/30', 'bg-blue-500/10'],
    },
    preparing: {
        text: ['text-amber-600', 'dark:text-amber-400', 'hover:bg-amber-500/20', 'border-amber-500/30', 'bg-amber-500/10'],
    },
    ready: {
        text: ['text-emerald-600', 'dark:text-emerald-400', 'hover:bg-emerald-500/20', 'border-emerald-500/30', 'bg-emerald-500/10'],
    },
};

const ALL_ACTION = ['text-blue-600', 'dark:text-blue-400', 'hover:bg-blue-500/20', 'border-blue-500/30', 'bg-blue-500/10', 'text-amber-600', 'dark:text-amber-400', 'hover:bg-amber-500/20', 'border-amber-500/30', 'bg-amber-500/10', 'text-emerald-600', 'dark:text-emerald-400', 'hover:bg-emerald-500/20', 'border-emerald-500/30', 'bg-emerald-500/10'];

const OVERDUE_BORDER = ['border-red-500/50', 'shadow-red-500/10'];
const CARD_BORDERS = ['border-red-500/50', 'shadow-red-500/10', 'border-blue-500/30', 'shadow-lg', 'border-slate-200', 'dark:border-slate-700/60'];

document.addEventListener('DOMContentLoaded', () => {
    // Build lookup of column containers.
    const columns = {};
    document.querySelectorAll('[data-kds-column]').forEach((el) => (columns[el.getAttribute('data-kds-column')] = el));

    function countIn(status) {
        return columns[status] ? columns[status].querySelectorAll('.kds-card').length : 0;
    }

    // ── Column count badges (header chip + column header) ────────────
    function refreshCounts() {
        const total = document.querySelectorAll('.kds-card').length;
        const footerTotal = document.querySelector('footer span.text-slate-900');
        if (footerTotal) footerTotal.textContent = String(total);

        ['new', 'preparing', 'ready', 'served'].forEach((st) => {
            const n = countIn(st);

            const chip = document.querySelector('[data-kds-count="' + st + '"]');
            if (chip) chip.textContent = String(n);

            const header = columns[st] && columns[st].previousElementSibling;
            if (header) {
                const badge = header.querySelector('span.text-xs');
                if (badge) badge.textContent = String(n);
            }
        });
    }

    // ── Per-card styling when a card's status changes ────────────────
    function paintBorder(card, status) {
        const time = parseInt(card.getAttribute('data-time') || '0', 10);
        const overdue = time > 10 && status !== 'served';

        CARD_BORDERS.forEach((c) => card.classList.remove(c));
        if (overdue) {
            OVERDUE_BORDER.forEach((c) => card.classList.add(c));
        } else if (status === 'new') {
            card.classList.add('border-blue-500/30', 'shadow-lg');
        } else {
            card.classList.add('border-slate-200', 'dark:border-slate-700/60');
        }
    }

    function paintAction(card, status) {
        const btn = card.querySelector('.kds-advance');
        const served = card.querySelector('.kds-served');
        const zaps = btn && btn.querySelector('.zaps');
        const checks = btn && btn.querySelector('.checks');
        if (btn) {
            btn.classList.remove(...ALL_ACTION);
            const style = ACTION_STYLE[status] || ACTION_STYLE.new;
            style.text.forEach((c) => btn.classList.add(c));

            if (zaps) zaps.classList.toggle('hidden', status !== 'new');
            if (checks) checks.classList.toggle('hidden', status === 'new');

            const label = btn.querySelector('.kds-advance-label');
            if (label) {
                if (status === 'new') label.textContent = 'Mark as Preparing';
                else if (status === 'preparing') label.textContent = 'Mark as Ready';
                else if (status === 'ready') label.textContent = 'Mark as Served';
            }

            btn.classList.toggle('hidden', status === 'served');
        }
        if (served) served.classList.toggle('hidden', status !== 'served');
    }

    // ── Advance: move card to next column + restyle ───────────────────
    function advance(card) {
        const current = card.getAttribute('data-status');
        const next = STATUS_FLOW[current] || current;

        card.setAttribute('data-status', next);

        const from = columns[current];
        const to = columns[next];
        if (to) {
            (from || document.body).removeChild(card);
            to.appendChild(card);
        }

        paintStatus(card, next);
        refreshCounts();

        // Flash overlay pulse to signal the move.
        const flash = document.getElementById('kds-flash');
        if (flash) {
            flash.classList.remove('hidden');
            setTimeout(() => flash.classList.add('hidden'), 300);
        }
    }

    function paintStatus(card, status) {
        paintBorder(card, status);
        paintAction(card, status);
    }

    // ── Tick: another minute elapses for non-served cards ─────────────
    function tick() {
        document.querySelectorAll('.kds-card').forEach((card) => {
            const status = card.getAttribute('data-status');
            if (status === 'served') return;

            const time = parseInt(card.getAttribute('data-time') || '0', 10) + 1;
            card.setAttribute('data-time', String(time));

            const label = card.querySelector('.kds-time');
            if (label) label.textContent = time + 'm';

            const overdueBadge = card.querySelector('.kds-overdue');
            const isOverdue = time > 10;
            if (overdueBadge) overdueBadge.classList.toggle('hidden', !isOverdue);

            paintBorder(card, status);
        });
        refreshCounts();
    }

    // ── Bindings ──────────────────────────────────────────────────────
    document.querySelectorAll('.kds-card').forEach((card) => {
        const btn = card.querySelector('.kds-advance');
        if (btn) btn.addEventListener('click', () => advance(card));
    });

    // Ticking simulates the source's per-minute refresh.
    setInterval(tick, 60000);
    // Kick one tick soon after load so live feel is visible.
    setTimeout(tick, 1500);

    refreshCounts();
});