/**
 * QUIET FORGE UTILITIES
 * Role: Component Loader & Satchel Logic
 */

const ForgeUtils = {
    
    async loadComponents() {
        const elements = document.querySelectorAll('[data-include]');
        
        for (const el of elements) {
            const file = el.dataset.include;
            try {
                const response = await fetch(file);
                if (response.ok) {
                    const html = await response.text();
                    el.innerHTML = html;
                    this.executeScripts(el);
                    
                    // Update Satchel if header loaded
                    if (file.includes('header')) {
                        this.updateSatchelCount();
                    }
                }
            } catch (err) {
                console.error('Forge Load Error:', err);
            }
        }
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

    // RENAMED: Cart -> Satchel
    updateSatchelCount() {
        const countEl = document.getElementById('satchel-count');
        if (!countEl) return;
        
        // We still use localStorage 'kynar_cart' for data safety, 
        // but the UI is now 'Satchel'
        const satchel = JSON.parse(localStorage.getItem('kynar_cart') || '[]');
        const count = satchel.length;
        
        if (count > 0) {
            countEl.textContent = `(${count})`;
            countEl.style.opacity = '1';
        } else {
            countEl.textContent = '';
            countEl.style.opacity = '0';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ForgeUtils.loadComponents();
});

/**
 * NAV & DRAWER CONTROLLER
 * Role: Handles opening/closing of Mobile Menu and Satchel
 */
const Navigation = {
    init() {
        // --- 1. MOBILE NAV DRAWER ---
        const navToggle = document.getElementById('nav-toggle');
        const navClose = document.getElementById('close-nav');
        const navDrawer = document.getElementById('nav-drawer');
        const navBackdrop = document.getElementById('nav-backdrop');

        // Open
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navDrawer.classList.add('is-open');
                navBackdrop.classList.add('is-visible');
            });
        }

        // Close (Button & Backdrop)
        const closeNavMenu = () => {
            if (navDrawer) navDrawer.classList.remove('is-open');
            if (navBackdrop) navBackdrop.classList.remove('is-visible');
        };

        if (navClose) navClose.addEventListener('click', closeNavMenu);
        if (navBackdrop) navBackdrop.addEventListener('click', closeNavMenu);

        // --- 2. SATCHEL DRAWER ---
        // Hijack the "Satchel" text link to open the drawer instead of going to page
        const satchelTrigger = document.getElementById('satchel-trigger');
        const satchelDrawer = document.getElementById('satchel-drawer');
        const satchelBackdrop = document.getElementById('satchel-drawer-backdrop');
        const satchelClose = document.getElementById('close-drawer');

        // Logic handled by your existing Satchel object? 
        // If not, add this simple toggle:
        if (satchelTrigger) {
            satchelTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.Satchel) window.Satchel.openDrawer();
            });
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a brief moment for header.html to be injected by ForgeUtils
    setTimeout(() => {
        Navigation.init();
    }, 200);
});
