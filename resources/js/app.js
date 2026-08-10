// ─── Theme (dark/light) ────────────────────────────────────────────
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(dark) {
    root.classList.toggle('dark', dark);
    localStorage.setItem('pos-theme', dark ? 'dark' : 'light');
    const label = document.querySelector('.theme-label');
    if (label) {
        label.textContent = dark ? 'Light Mode' : 'Dark Mode';
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        applyTheme(!root.classList.contains('dark'));
    });
}

// ── Mobile sidebar ─────────────────────────────────────────────────
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');

function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
    if (overlay) overlay.classList.remove('hidden');
}

function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('-translate-x-full');
    sidebar.classList.remove('translate-x-0');
    if (overlay) overlay.classList.add('hidden');
}

document.querySelectorAll('[data-sidebar-open]').forEach((el) => {
    el.addEventListener('click', openSidebar);
});
document.querySelectorAll('[data-sidebar-close]').forEach((el) => {
    el.addEventListener('click', closeSidebar);
});

// `data-sidebar-close` is used both on overlay and nav links. The overlay
// is shared between pages; nav links also get it from the layout markup.

// ── Page-restore guard (prevent showing cached logged-out content) ──
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.location.reload();
    }
});