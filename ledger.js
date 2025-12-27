/**
 * SOFT ROYAL LEDGER SYSTEM
 * Role: Render purchased artifacts on the Identity Page
 */

const Ledger = {
    
    init() {
        // Only run if we are on the Identity page and the list exists
        const listContainer = document.getElementById('artifact-list');
        if (!listContainer) return;

        this.renderPurchases(listContainer);
    },

    getPurchases() {
        // In V6.0, we are reading from LocalStorage (set by checkout.js)
        // In V7.0, you would fetch this from Firebase Firestore (users/{uid}/purchases)
        return JSON.parse(localStorage.getItem('kynar_library') || '[]');
    },

    renderPurchases(container) {
        const items = this.getPurchases();

        if (items.length === 0) {
            // EMPTY STATE
            container.innerHTML = `
                <div class="stream-card" style="width: 100%; height: auto; padding: 3rem 1rem; flex-direction: column; align-items: center; text-align: center; opacity: 0.8; gap: 1rem;">
                    <div style="font-size: 2.5rem; opacity: 0.5;">📓</div>
                    <div>
                        <div class="stream-title">Ledger Empty</div>
                        <div class="stream-meta">You have not acquired any artifacts yet.</div>
                    </div>
                    <a href="archive.html" class="dock-btn" style="margin-top: 1rem; font-size: 0.8rem; height: 36px;">Visit Archive</a>
                </div>
            `;
            return;
        }

        // POPULATED STATE (Glass Tickets)
        container.innerHTML = items.map(item => `
            <div class="stream-card" style="height: auto; align-items: center; gap: 1rem; padding: 1rem;">
                
                <div class="stream-visual" style="width: 50px; height: 50px; border-radius: 12px; background: var(--grad-emerald); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">
                    ${item.icon || '✦'}
                </div>

                <div style="flex: 1;">
                    <div class="stream-title" style="font-size: 1rem;">${item.title}</div>
                    <div class="stream-meta">Acquired: ${item.acquiredDate || 'Recently'}</div>
                </div>

                <a href="${item.downloadLink || '#'}" download class="dock-btn" style="height: 32px; padding: 0 1rem; font-size: 0.75rem; background: transparent; border: 1px solid rgba(0,0,0,0.1);">
                    Download
                </a>

            </div>
        `).join('');
    }
};

// Init on Load
document.addEventListener('DOMContentLoaded', () => Ledger.init());
