/**
 * QUIET FORGE UTILITIES V2.0
 * Role: System Core, Component Loader & State Management
 */

const ForgeUtils = {
    
    async loadComponents() {
        const elements = document.querySelectorAll('[data-include]');
        
        // We use Promise.all to load everything efficiently in parallel
        // preventing the "pop-in" effect where parts of the page load one by one.
        const promises = Array.from(elements).map(async (el) => {
            const file = el.dataset.include;
            try {
                const response = await fetch(file);
                if (response.ok) {
                    const html = await response.text();
                    el.innerHTML = html;
                    this.executeScripts(el);
                    
                    // If this was the header, trigger the system setup
                    if (file.includes('header')) {
                        this.updateSatchelCount();
                        // DISPATCH EVENT: "Header is Ready"
                        document.dispatchEvent(new Event('ForgeHeaderLoaded'));
                    }
                }
            } catch (err) {
                console.error('Forge Load Error:', err);
            }
        });

        await Promise.all(promises);
    },

    executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    },

    updateSatchelCount() {
        const countEl = document.getElementById('satchel-count');
        if (!countEl) return;
        
        const satchel = JSON.parse(localStorage.getItem('kynar_cart') || '[]');
        const count = satchel.length;
        
        if (count > 0) {
            countEl.textContent = `(${count})`;
            countEl.style.opacity = '1';
            countEl.style.transform = 'scale(1)';
        } else {
            countEl.textContent = '';
            countEl.style.opacity = '0';
            countEl.style.transform = 'scale(0.8)';
        }
    }
};

/**
 * NAV & DRAWER CONTROLLER
 * Role: Logic for Mobile Menu & Satchel interactions
 */
const Navigation = {
    init() {
        console.log("Forge System: Initializing Navigation...");

        // --- 1. MOBILE NAV DRAWER ---
        this.bindDrawer('nav-toggle', 'nav-drawer', 'nav-backdrop', 'close-nav');

        // --- 2. SATCHEL DRAWER ---
        // We bind the trigger to open the Satchel Object's drawer
        const satchelTrigger = document.getElementById('satchel-trigger');
        if (satchelTrigger) {
            satchelTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.Satchel && window.Satchel.openDrawer) {
                    window.Satchel.openDrawer();
                } else {
                    console.warn("Satchel System not loaded yet.");
                    // Fallback: Redirect if JS fails
                    window.location.href = 'exchange.html';
                }
            });
        }
    },

    // Helper to keep code clean (DRY Principle)
    bindDrawer(triggerId, drawerId, backdropId, closeId) {
        const trigger = document.getElementById(triggerId);
        const drawer = document.getElementById(drawerId);
        const backdrop = document.getElementById(backdropId);
        const closeBtn = document.getElementById(closeId);

        if (!trigger || !drawer) return; // Safety check

        const open = () => {
            drawer.classList.add('is-open');
            if (backdrop) backdrop.classList.add('is-visible');
            document.body.style.overflow = 'hidden'; // Lock scroll
        };

        const close = () => {
            drawer.classList.remove('is-open');
            if (backdrop) backdrop.classList.remove('is-visible');
            document.body.style.overflow = ''; // Unlock scroll
        };

        trigger.addEventListener('click', open);
        if (closeBtn) closeBtn.addEventListener('click', close);
        if (backdrop) backdrop.addEventListener('click', close);
    }
};

// --- SYSTEM BOOT SEQUENCE ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Start loading components
    ForgeUtils.loadComponents();

    // 2. Wait strictly for the "HeaderLoaded" signal before attaching Nav listeners
    // This eliminates the race condition completely.
    document.addEventListener('ForgeHeaderLoaded', () => {
        Navigation.init();
    });
});

// Expose Utils globally so other scripts can talk to it
window.ForgeUtils = ForgeUtils;
