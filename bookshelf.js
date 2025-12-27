/**
 * QUIET FORGE BOOKSHELF
 * Role: Render acquired artifacts on the Identity page
 */

const Bookshelf = {
    
    init() {
        const container = document.getElementById('artifact-list');
        if (!container) return;

        const library = JSON.parse(localStorage.getItem('kynar_library') || '[]');
        
        // If empty
        if (library.length === 0) {
            container.innerHTML = `
                <div class="stone-block" style="opacity: 0.6;">
                    <span class="stone-meta">Ledger Empty</span>
                    <h3 class="text-heading">No artifacts acquired yet.</h3>
                    <a href="archive.html" class="ink-link" style="margin-top: auto;">Visit Archive</a>
                </div>
            `;
            return;
        }

        // Render Items
        container.innerHTML = library.map(item => `
            <article class="stone-block" style="position: relative;">
                <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: flex-start;">
                    <span class="stone-meta">Acquired: ${item.acquiredDate || 'Unknown'}</span>
                    <span class="stone-meta" style="color: var(--ink-primary);">OWND</span>
                </div>
                
                <h3 class="text-heading" style="font-size: 1.25rem; margin-bottom: 0.5rem;">${item.title}</h3>
                <span class="text-body" style="font-size: 0.9rem; display: block; margin-bottom: 2rem;">${item.collection}</span>
                
                <div style="margin-top: auto; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 1rem;">
                    <a href="${item.downloadLink || '#'}" class="ink-link" download style="margin-right: 1.5rem;">Download</a>
                    <a href="library-entry.html" class="ink-link" style="color: var(--ink-secondary);">View Guide</a>
                </div>
            </article>
        `).join('');
    }
};

// Run when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait slightly for Auth check in access-ui.js to finish
    setTimeout(Bookshelf.init, 100);
});
