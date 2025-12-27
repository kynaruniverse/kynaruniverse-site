/**
 * SOFT ROYAL CORE SYSTEM
 * Role: Component Loader, Global Navigation & System State
 */

const ForgeCore = {
    
    // --- 1. COMPONENT LOADER ---
    async loadComponents() {
        const elements = document.querySelectorAll('[data-include]');
        
        const promises = Array.from(elements).map(async (el) => {
            const file = el.dataset.include;
            try {
                const response = await fetch(file);
                if (response.ok) {
                    const html = await response.text();
                    el.innerHTML = html;
                    
                    // Re-hydrate scripts found in the injected HTML
                    this.executeScripts(el);
                    
                    // SIGNAL: Header Ready
                    if (file.includes('header')) {
                        document.dispatchEvent(new Event('ForgeHeaderLoaded'));
                    }
                    
                    // SIGNAL: Modals Ready
                    if (file.includes('modals')) {
                        document.dispatchEvent(new Event('ForgeModalsLoaded'));
                    }
                } else {
                    console.error(`Forge: Failed to load ${file}`);
                }
            } catch (err) {
                console.error(`Forge: System Error loading ${file}`, err);
            }
        });

        await Promise.all(promises);
    },

    // Helper to run scripts inside injected HTML (like the ModalUI logic)
    executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });
    },

    // --- 2. NAVIGATION CONTROLLER (Main Menu) ---
    initNavigation() {
        const trigger = document.getElementById('nav-toggle');
        const drawer = document.getElementById('nav-drawer');
        const backdrop = document.getElementById('nav-backdrop');
        const closeBtn = document.getElementById('close-nav');

        if (!trigger || !drawer) return;

        const openMenu = () => {
            drawer.classList.add('is-open');
            if (backdrop) backdrop.classList.add('is-visible');
            document.body.style.overflow = 'hidden'; // Lock Scroll
        };

        const closeMenu = () => {
            drawer.classList.remove('is-open');
            if (backdrop) backdrop.classList.remove('is-visible');
            document.body.style.overflow = ''; // Unlock Scroll
        };

        trigger.addEventListener('click', openMenu);
        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        if (backdrop) backdrop.addEventListener('click', closeMenu);
    },

    // --- 3. GLOBAL MODAL CONTROLLER ---
    initModals() {
        // Listen for any button with class .trigger-access
        // This allows buttons anywhere (Header, Identity page, Library) to open the auth modal
        document.body.addEventListener('click', (e) => {
            if (e.target.closest('.trigger-access')) {
                e.preventDefault();
                this.openAuthModal();
            }
        });

        // Modal Close Logic
        const overlay = document.getElementById('modal-overlay');
        const closeBtn = document.getElementById('close-access');

        if (overlay) {
            const closeModal = () => {
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
            };

            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            // Close on background click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeModal();
            });
        }
    },

    openAuthModal() {
        const overlay = document.getElementById('modal-overlay');
        if (overlay) {
            overlay.style.visibility = 'visible';
            overlay.style.opacity = '1';
        } else {
            console.warn('Forge: Modal overlay not found. Ensure components/modals.html is loaded.');
        }
    }
};

// --- SYSTEM BOOT SEQUENCE ---
document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Load Shell (Header, Footer, Modals)
    await ForgeCore.loadComponents();

    // 2. Initialize Subsystems
    ForgeCore.initNavigation();
    ForgeCore.initModals();

    // 3. Log Status
    console.log("Soft Royal Engine: Online");
});

// Expose for external access if needed
window.ForgeCore = ForgeCore;
