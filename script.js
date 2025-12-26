/**
 * KYNAR UNIVERSE - Elastic Stack Engine
 * Architect: AetherCode
 * Description: Logic for card-shuffling, accordion expansion, and elastic search.
 */

const KynarApp = (() => {
    
    // --- 1. STATE & CONFIG ---
    const state = {
        activeCard: null,
        initialized: false,
        stackZIndex: 100
    };

    // --- 2. ELASTIC UI MODULE ---
    const UI = {
        init() {
            this.bindGlobalEvents();
            this.setupElasticSearch();
            console.log('✨ Elastic UI Engine Synchronized');
        },

        bindGlobalEvents() {
            document.body.addEventListener('click', (e) => {
                const target = e.target;

                // A. Card Expansion (The Wallet Shuffling)
                const cardHeader = target.closest('.stack-card-header');
                if (cardHeader) {
                    this.toggleCard(cardHeader.parentElement);
                }

                // B. Side Menu Toggle
                if (target.closest('#mobile-menu-trigger')) {
                    this.toggleDrawer('side-drawer');
                }

                // C. Cart Toggle
                if (target.closest('#cart-toggle')) {
                    this.toggleDrawer('cart-side-drawer');
                }

                // D. Global Close Triggers
                if (target.closest('.drawer-close') || target.classList.contains('drawer-overlay')) {
                    this.closeEverything();
                }
            });

            // Escape Key Safety
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeEverything();
            });
        },

        /**
         * The Core Elastic Mechanic:
         * Toggles the card's vertical expansion and manages Z-index priority.
         */
        toggleCard(card) {
            const isClosing = card.classList.contains('is-expanded');
            
            // Close any other open cards first (Stack Integrity)
            document.querySelectorAll('.stack-card.is-expanded').forEach(el => {
                el.classList.remove('is-expanded');
                el.style.zIndex = el.dataset.originalZ; 
            });

            if (!isClosing) {
                // Save original Z if not set
                if (!card.dataset.originalZ) {
                    card.dataset.originalZ = window.getComputedStyle(card).zIndex;
                }
                
                // Expand and Lift
                card.classList.add('is-expanded');
                card.style.zIndex = 500; // Pull to very front
                
                // Haptic alignment
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        },

        setupElasticSearch() {
            const overlay = document.getElementById('elastic-search-overlay');
            if (!overlay) return;

            // Simple click listener for search icons that aren't pull-gestures
            document.body.addEventListener('click', (e) => {
                if (e.target.closest('.search-submit') || e.target.closest('.search-accent')) {
                    overlay.classList.add('is-open');
                    document.body.classList.add('drawer-open');
                }
            });
        },

        toggleDrawer(id) {
            const drawer = document.getElementById(id);
            const overlay = document.querySelector('.drawer-overlay');
            if (!drawer) return;

            const isOpen = drawer.classList.contains('is-open');
            this.closeEverything();

            if (!isOpen) {
                drawer.classList.add('is-open');
                overlay?.classList.add('is-visible');
                document.body.classList.add('drawer-open');
            }
        },

        closeEverything() {
            const activeElements = document.querySelectorAll('.is-open, .is-expanded, .is-visible');
            activeElements.forEach(el => {
                el.classList.remove('is-open', 'is-expanded', 'is-visible');
                if (el.dataset.originalZ) el.style.zIndex = el.dataset.originalZ;
            });
            
            document.body.classList.remove('drawer-open');
        }
    };

    // --- 3. MARKETPLACE MODULE (Elastic Adaption) ---
    const Marketplace = {
        init() {
            const container = document.getElementById('product-container');
            if (!container) return;
            
            this.setupAddToCart();
            console.log('📦 Marketplace Stack Validated');
        },

        setupAddToCart() {
            document.body.addEventListener('click', (e) => {
                const btn = e.target.closest('.js-add-to-cart');
                if (!btn) return;

                // Fire the global cart logic (handled in cart.js)
                // We provide visual haptic feedback here
                if (window.LoadingState) window.LoadingState.buttonStart(btn);
                
                setTimeout(() => {
                    if (window.LoadingState) window.LoadingState.buttonEnd(btn, "ACQUIRED");
                }, 800);
            });
        }
    };

    // --- INIT SEQUENCE ---
    return {
        init: () => {
            if (state.initialized) return;
            state.initialized = true;

            UI.init();
            Marketplace.init();

            // Handle Footer Year
            const yearEl = document.getElementById('year');
            if (yearEl) yearEl.textContent = new Date().getFullYear();
        }
    };
})();

// Bootup on Component Injection
document.addEventListener('componentsLoaded', () => {
    KynarApp.init();
});

// Fallback for direct page access
if (document.querySelector('.header-wrapper')) {
    KynarApp.init();
}
