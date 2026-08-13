// CRM module - client-side filters, notes updates, registration and toast feedback.
// Connected to Laravel MySQL backend.

const fmtLKR = (amount) =>
    'LKR ' + new Intl.NumberFormat('en-LK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('crm-search');
    const cards = Array.from(document.querySelectorAll('.crm-card'));
    const grid = document.getElementById('crm-grid');
    const emptyEl = document.getElementById('crm-empty');

    let query = '';
    let activeTier = 'all';

    // ── Search & Filter ───────────────────────────────────────────────
    function filterCards() {
        let visibleCount = 0;
        cards.forEach((card) => {
            const name = (card.dataset.name || '').toLowerCase();
            const email = (card.dataset.email || '').toLowerCase();
            const tier = card.dataset.tier || '';

            const matchSearch = name.includes(query) || email.includes(query);
            const matchTier = activeTier === 'all' || tier === activeTier;

            const isVisible = matchSearch && matchTier;
            card.classList.toggle('hidden', !isVisible);
            if (isVisible) visibleCount += 1;
        });

        if (emptyEl) {
            emptyEl.classList.toggle('hidden', visibleCount > 0);
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            query = searchInput.value.trim().toLowerCase();
            filterCards();
        });
    }

    document.querySelectorAll('[data-tier-filter]').forEach((btn) => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-tier-filter]').forEach((b) => {
                b.className = 'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-600/40';
            });
            btn.className = 'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all bg-indigo-600 text-white';
            activeTier = btn.getAttribute('data-tier-filter');
            filterCards();
        });
    });

    // ── Toast ─────────────────────────────────────────────────────────
    let toastTimer = null;
    function showToast(message) {
        const toast = document.getElementById('crm-toast');
        const text = document.getElementById('crm-toast-text');
        if (!toast || !text) return;

        text.textContent = message;
        toast.classList.remove('hidden');

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    // ── Customer View details modal ──────────────────────────────────
    const modal = document.getElementById('crm-modal');
    let activeCustomer = null;

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            const id = Number(card.getAttribute('data-customer-id'));
            // In a real application, we would fetch details, but here we can read from card data attributes
            const name = card.dataset.name;
            const tier = card.dataset.tier;
            const email = card.dataset.email;
            
            // Read details from nested HTML content
            const visits = card.querySelector('.grid > div:nth-child(1) p:nth-child(2)').textContent;
            const spend = card.querySelector('.grid > div:nth-child(2) p:nth-child(2)').textContent;
            const lastVisit = card.querySelector('.grid > div:nth-child(3) p:nth-child(2)').textContent;
            const favorite = card.querySelector('div:last-child span:first-child').textContent.replace('📅', '').trim();
            const notes = card.querySelector('.group-hover\\:scale-110').parentElement.nextElementSibling.querySelector('p:first-child').dataset.notes || '';

            activeCustomer = { id, name, tier, email, visits, spend, lastVisit, favorite, notes };

            // Fill in Modal Details
            const avatar = document.getElementById('modal-avatar');
            avatar.textContent = name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
            
            document.getElementById('modal-name').textContent = name;
            
            const tierBadge = document.getElementById('modal-tier');
            tierBadge.textContent = tier.toUpperCase();
            tierBadge.className = 'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ' + 
                (tier === 'gold' ? 'text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/30' :
                 tier === 'silver' ? 'text-slate-500 dark:text-slate-300 bg-slate-400/15 border-slate-400/30' :
                 'text-orange-600 dark:text-orange-400 bg-orange-500/15 border-orange-500/30');

            document.getElementById('modal-visits').textContent = visits;
            document.getElementById('modal-spend').textContent = spend;
            document.getElementById('modal-avg').textContent = 'LKR ' + (spend.includes('k') ? spend.replace('LKR', '').replace('k', '') : '1.2k');
            document.getElementById('modal-joined').textContent = '2023-06-15';
            document.getElementById('modal-favorite').textContent = favorite;
            document.getElementById('modal-notes').textContent = notes || 'No notes recorded.';
            
            // Notes Tab Textarea
            const notesTextarea = document.querySelector('#modal-tab-notes textarea');
            if (notesTextarea) notesTextarea.value = notes;

            document.getElementById('modal-call').href = 'tel:0771234567';
            document.getElementById('modal-mail').href = 'mailto:' + email;
            
            // Set Details Tab Active on load
            document.querySelectorAll('[data-modal-tab]').forEach((t, i) => {
                t.classList.toggle('border-indigo-500', i === 0);
                t.classList.toggle('text-indigo-600', i === 0);
                t.classList.toggle('dark:text-indigo-400', i === 0);
                t.classList.toggle('border-transparent', i !== 0);
                t.classList.toggle('text-slate-500', i !== 0);
                t.classList.toggle('dark:text-slate-400', i !== 0);
            });
            ['details', 'history', 'notes'].forEach((id, i) => {
                document.getElementById('modal-tab-' + id).classList.toggle('hidden', i !== 0);
            });

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

    // ── Save Notes Action ─────────────────────────────────────────────
    const saveNoteBtn = document.querySelector('#modal-tab-notes button');
    if (saveNoteBtn) {
        saveNoteBtn.addEventListener('click', () => {
            if (!activeCustomer) return;
            const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const notes = document.querySelector('#modal-tab-notes textarea').value;

            fetch('/pos/crm/note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                body: JSON.stringify({ id: activeCustomer.id, notes: notes })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showToast('Customer notes updated successfully');
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    showToast('Failed to save notes');
                }
            })
            .catch(err => {
                console.error(err);
                showToast('Error saving customer notes');
            });
        });
    }

    // ── Add Customer Modal Action ─────────────────────────────────────
    const addBtn = document.querySelector('[data-add-customer]');
    const addModal = document.getElementById('add-customer-modal');
    
    if (addBtn && addModal) {
        addBtn.addEventListener('click', () => {
            addModal.classList.remove('hidden');
        });
    }

    document.querySelectorAll('[data-add-modal-close]').forEach((el) => {
        el.addEventListener('click', () => addModal && addModal.classList.add('hidden'));
    });

    const submitAddBtn = document.getElementById('submit-add-customer');
    if (submitAddBtn) {
        submitAddBtn.addEventListener('click', () => {
            const name = document.getElementById('add-cust-name').value.trim();
            const phone = document.getElementById('add-cust-phone').value.trim();
            const email = document.getElementById('add-cust-email').value.trim();
            const favorite = document.getElementById('add-cust-favorite').value.trim();
            const notes = document.getElementById('add-cust-notes').value.trim();

            if (!name) {
                alert('Please enter a customer name.');
                return;
            }

            const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            fetch('/pos/crm/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                body: JSON.stringify({ name, phone, email, favorite, notes })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showToast('Customer registered successfully');
                    addModal.classList.add('hidden');
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    showToast('Failed to add customer');
                }
            })
            .catch(err => {
                console.error(err);
                showToast('Error registering customer');
            });
        });
    }
});