/**
 * KYNAR UNIVERSE - Core Application Logic
 * Architecture: Modular
 * Standards: ES6+, Vanilla JS
 */

const KynarApp = (() => {
    
    // --- 1. STATE & CONFIG ---
    const state = {
        isDrawerOpen: false,
        searchDebounce: null
    };

    // --- 2. ACCESSIBILITY / TRAP MANAGER ---
    // Interfaces with the robust FocusTrap in utilities.js
    const TrapManager = {
        activate(element) {
            if (typeof window.activateFocusTrap === 'function') {
                window.activateFocusTrap(element, 'main-ui-trap');
            }
        },
        deactivate() {
            if (typeof window.deactivateFocusTrap === 'function') {
                window.deactivateFocusTrap('main-ui-trap');
            }
        }
    };

    // --- 3. UI MODULE ---
    const UI = {
        elements: {
            // These are getters because elements might be injected dynamically
            get burger() { return document.querySelector('.custom-burger'); },
            get sideDrawer() { return document.getElementById('side-drawer'); },
            get overlay() { return document.getElementById('drawer-overlay'); },
            get closeButtons() { return document.querySelectorAll('.drawer-close, .drawer-close-btn, .auth-modal-close'); },
            get mobileFilterBtn() { return document.querySelector('.mobile-filter-btn'); },
            get authModal() { return document.getElementById('auth-modal'); },
            get signupModal() { return document.getElementById('signup-modal'); }
        },

        init() {
            this.bindEvents();
            this.highlightActiveLink();
            this.setupAuthTriggers();
        },

        highlightActiveLink() {
            // Automatically underline the current page in the nav
            const path = window.location.pathname;
            const page = path.split("/").pop() || "index.html";
            
            // Desktop Nav
            const links = document.querySelectorAll('.main-nav a');
            links.forEach(link => {
                // Strip href to just filename
                const href = link.getAttribute('href');
                if (href === page) {
                    link.style.color = "var(--color-star-red)";
                } else {
                    link.style.color = ""; // Reset
                }
            });
        },

        bindEvents() {
            // Delegated listener for static + dynamic elements
            document.body.addEventListener('click', (e) => {
                // Burger Click
                if (e.target.closest('.custom-burger')) {
                    this.toggleDrawer('main');
                }
                
                // Close Buttons
                if (e.target.closest('.drawer-close') || e.target.closest('.drawer-close-btn') || e.target.closest('.auth-modal-close')) {
                    this.closeAll();
                }

                // Overlay Click
                if (e.target.classList.contains('drawer-overlay') || e.target.classList.contains('auth-modal-backdrop')) {
                    this.closeAll();
                }

                // Mobile Filter Toggle
                if (e.target.closest('.mobile-filter-btn') || e.target.id === 'mobile-filter-toggle') {
                    this.toggleDrawer('filter');
                }
            });

            // Global Escape Key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeAll();
            });
        },

        toggleDrawer(type) {
            const target = type === 'filter' ? document.getElementById('filter-sidebar') : this.elements.sideDrawer;
            if (!target) return;
            this.open(target);
        },

        open(element) {
            this.closeAll(); // Ensure clean slate
            element.classList.add('is-open');
            element.setAttribute('aria-hidden', 'false');
            
            // Show overlay
            if (this.elements.overlay) {
                this.elements.overlay.classList.add('is-visible');
            }
            
            document.body.classList.add('drawer-open');
            state.isDrawerOpen = true;
            TrapManager.activate(element);
        },

        closeAll() {
            const openElements = document.querySelectorAll('.is-open');
            openElements.forEach(el => {
                el.classList.remove('is-open');
                el.setAttribute('aria-hidden', 'true');
            });

            if (this.elements.overlay) {
                this.elements.overlay.classList.remove('is-visible');
            }

            document.body.classList.remove('drawer-open');
            state.isDrawerOpen = false;
            TrapManager.deactivate();
        },

        setupAuthTriggers() {
            // Handle "Sign in" clicks
            document.body.addEventListener('click', (e) => {
                const trigger = e.target.closest('.sign-in-link') || e.target.closest('[href="#login"]');
                if (trigger) {
                    const isLoggedIn = document.body.classList.contains('user-logged-in');
                    if (!isLoggedIn) {
                        e.preventDefault();
                        const modal = this.elements.authModal;
                        if(modal) this.open(modal);
                    }
                }

                // Toggle between Login and Signup
                if (e.target.id === 'auth-toggle-mode') {
                    if (this.elements.authModal) this.elements.authModal.classList.remove('is-open');
                    if (this.elements.signupModal) this.open(this.elements.signupModal);
                }

                if (e.target.id === 'back-to-login') {
                    if (this.elements.signupModal) this.elements.signupModal.classList.remove('is-open');
                    if (this.elements.authModal) this.open(this.elements.authModal);
                }
            });
        }
    };

    // --- 4. MARKETPLACE MODULE ---
    const Marketplace = {
        get container() { return document.getElementById('product-container'); },
        
        init() {
            if (!this.container) return; // Not on marketplace page
            
            this.setupFilters();
            this.parseUrlParams();
            // Initial filter run
            this.filter(); 
        },

        setupFilters() {
            const searchInput = document.getElementById('search-input');
            const sortDropdown = document.querySelector('.sort-dropdown');
            const clearBtn = document.getElementById('clear-filters');
            const applyBtn = document.getElementById('apply-filters-btn');

            // Search input (Debounced)
            if (searchInput) {
                searchInput.addEventListener('input', () => {
                    clearTimeout(state.searchDebounce);
                    state.searchDebounce = setTimeout(() => this.filter(), 300);
                });
            }

            // Checkboxes & Radios
            document.body.addEventListener('change', (e) => {
                if (e.target.matches('.cat-filter, .type-filter, input[name="price"]')) {
                    this.filter();
                }
                if (e.target.matches('.sort-dropdown')) {
                    this.filter();
                }
            });

            // Clear Button
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                    document.querySelectorAll('input[name="price"]').forEach(r => r.checked = (r.value === 'all'));
                    if(searchInput) searchInput.value = '';
                    if(sortDropdown) sortDropdown.value = 'newest';
                    this.filter();
                });
            }
            
            // Mobile "Apply" Button (Just closes drawer)
            if (applyBtn) {
                applyBtn.addEventListener('click', () => UI.closeAll());
            }
        },

        filter() {
            const products = Array.from(this.container.children).filter(el => el.classList.contains('list-item'));
            if (!products.length) return;

            const query = document.getElementById('search-input')?.value.trim().toLowerCase() || "";
            const activeCats = Array.from(document.querySelectorAll('.cat-filter:checked')).map(cb => cb.value);
            const activeTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value);
            const priceFilter = document.querySelector('input[name="price"]:checked')?.value || 'all';
            const sortBy = document.querySelector('.sort-dropdown')?.value || 'newest';

            let visibleCount = 0;
            let visibleProducts = [];

            products.forEach(product => {
                const title = product.querySelector('h4')?.textContent.toLowerCase() || '';
                const cat = product.dataset.category || '';
                const type = product.dataset.type || '';
                const price = parseFloat(product.dataset.price || 0);

                const matchesSearch = !query || title.includes(query);
                const matchesCat = activeCats.length === 0 || activeCats.includes(cat);
                const matchesType = activeTypes.length === 0 || activeTypes.includes(type);
                
                let matchesPrice = true;
                if (priceFilter === 'under10') matchesPrice = price > 0 && price < 10;
                if (priceFilter === 'over10') matchesPrice = price >= 10;
                if (priceFilter === '0') matchesPrice = price === 0;

                if (matchesSearch && matchesCat && matchesType && matchesPrice) {
                    product.style.display = 'flex';
                    visibleProducts.push(product);
                    visibleCount++;
                } else {
                    product.style.display = 'none';
                }
            });

            this.sort(visibleProducts, sortBy);
            
            // Update "Showing X results"
            const countDisplay = document.getElementById('result-count');
            const emptyState = document.getElementById('empty-state');
            
            if (countDisplay) countDisplay.textContent = `Showing ${visibleCount} creation${visibleCount !== 1 ? 's' : ''}`;
            if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        },

        sort(products, method) {
            products.sort((a, b) => {
                const priceA = parseFloat(a.dataset.price || 0);
                const priceB = parseFloat(b.dataset.price || 0);
                // For "Newest", we need data-date. If missing, we default to DOM order (0)
                const dateA = new Date(a.dataset.date || 0).getTime();
                const dateB = new Date(b.dataset.date || 0).getTime();

                if (method === 'low-high') return priceA - priceB;
                if (method === 'high-low') return priceB - priceA;
                if (method === 'newest') return dateB - dateA;
                return 0;
            });

            // Re-append sorted
            const fragment = document.createDocumentFragment();
            products.forEach(el => fragment.appendChild(el));
            this.container.prepend(fragment);
        },

        parseUrlParams() {
            const urlParams = new URLSearchParams(window.location.search);
            const cat = urlParams.get('category');
            if (cat) {
                const cb = document.querySelector(`.cat-filter[value="${cat}"]`);
                if (cb) cb.checked = true;
            }
        }
    };
    
        // --- 5. GUIDES MODULE ---
    const Guides = {
        init() {
            // Only run if we are on the guides page
            if (!document.querySelector('.guides-page')) return;
            
            const filterTabs = document.querySelectorAll('.filter-tab');
            const guideCards = document.querySelectorAll('.guide-card');

            if (filterTabs.length === 0) return;

            filterTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const category = tab.getAttribute('data-category');

                    // 1. Update active state visuals
                    filterTabs.forEach(t => { 
                        t.classList.remove('btn-primary'); 
                        t.classList.add('btn-secondary');
                    });
                    tab.classList.remove('btn-secondary');
                    tab.classList.add('btn-primary');

                    // 2. Filter cards
                    guideCards.forEach(card => {
                        const cardCat = card.getAttribute('data-category');
                        if (category === 'all' || cardCat === category) {
                            card.style.display = 'flex';
                            // Optional: Add a fade-in animation
                            card.style.opacity = '0';
                            setTimeout(() => card.style.opacity = '1', 50);
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });
        }
    };


    return {
        init: () => {
            UI.init();
            Marketplace.init();
            Guides.init();
            console.log('✨ KYNAR Universe Engine Started');
        }
    };
})();

// Wait for components (header/footer) to be injected before starting
document.addEventListener('componentsLoaded', () => {
    KynarApp.init();
});

// Fallback safety net (in case event missed)
setTimeout(() => {
    if (!window.kynarAppStarted) {
        window.kynarAppStarted = true;
        KynarApp.init();
    }
}, 800);
