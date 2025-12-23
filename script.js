/**
 * KYNAR UNIVERSE - Core Application Logic
 * Architecture: Modular (IIFE)
 * Standards: ES6+, Vanilla JS, Accessible
 */

const KynarApp = (() => {
    
    // --- 1. STATE & CONFIG ---
    const state = {
        isDrawerOpen: false,
        activeTrap: null,
        searchDebounce: null
    };

    // --- 2. ACCESSIBILITY UTILITIES ---
    
    // robust focus trap to keep keyboard users inside modals/drawers
    const FocusTrap = {
        focusableSelector: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        
        activate(element) {
            const focusableContent = element.querySelectorAll(this.focusableSelector);
            const firstFocusable = focusableContent[0];
            const lastFocusable = focusableContent[focusableContent.length - 1];

            state.activeTrap = (e) => {
                const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
                if (!isTabPressed) return;

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            };

            document.addEventListener('keydown', state.activeTrap);
            // Focus the first element immediately for better UX
            if (firstFocusable) firstFocusable.focus();
        },

        deactivate() {
            if (state.activeTrap) {
                document.removeEventListener('keydown', state.activeTrap);
                state.activeTrap = null;
            }
        }
    };

    // --- 3. UI MODULE (Drawers, Modals, Navigation) ---
    const UI = {
        elements: {
            burger: document.querySelector('.custom-burger'),
            sideDrawer: document.getElementById('side-drawer'),
            overlay: document.getElementById('drawer-overlay'),
            filterSidebar: document.getElementById('filter-sidebar'), // If it exists
            authModal: document.getElementById('auth-modal'),
            signupModal: document.getElementById('signup-modal'),
            closeButtons: document.querySelectorAll('.drawer-close, .drawer-close-btn, .auth-modal-close'),
            mobileFilterBtn: document.querySelector('.mobile-filter-btn')
        },

        init() {
            this.bindEvents();
            this.handleScrollHeader();
        },

        bindEvents() {
            const { burger, overlay, closeButtons, mobileFilterBtn } = this.elements;

            // Toggle Main Drawer
            if (burger) {
                burger.addEventListener('click', () => this.toggleDrawer('main'));
            }

            // Mobile Filter Sidebar (if on marketplace)
            if (mobileFilterBtn) {
                mobileFilterBtn.addEventListener('click', () => this.toggleDrawer('filter'));
            }

            // Close actions
            if (overlay) overlay.addEventListener('click', () => this.closeAll());
            closeButtons.forEach(btn => btn.addEventListener('click', () => this.closeAll()));

            // Global Escape Key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeAll();
            });

            // Auth Triggers
            this.setupAuthTriggers();
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
            this.elements.overlay.classList.add('is-visible');
            
            document.body.classList.add('drawer-open');
            state.isDrawerOpen = true;

            // Trap Focus inside the active element
            FocusTrap.activate(element);
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

            // Remove Focus Trap
            FocusTrap.deactivate();
        },

        setupAuthTriggers() {
            // Logic: If user is NOT logged in, open modal. 
            // If logged in, let the link go to account page.
            // Note: Actual auth check logic relies on AuthUI module or global state.
            
            const triggers = document.querySelectorAll('.sign-in-link, [href="#login"]');
            
            triggers.forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    const isLoggedIn = document.body.classList.contains('user-logged-in'); // Assumes AuthUI adds this class
                    
                    if (!isLoggedIn) {
                        e.preventDefault();
                        this.open(this.elements.authModal);
                    }
                });
            });

            // Toggle between Sign In and Sign Up
            const toggleModeBtn = document.getElementById('auth-toggle-mode');
            const backToLoginBtn = document.getElementById('back-to-login');

            if (toggleModeBtn) {
                toggleModeBtn.addEventListener('click', () => {
                    this.elements.authModal.classList.remove('is-open');
                    this.open(this.elements.signupModal);
                });
            }

            if (backToLoginBtn) {
                backToLoginBtn.addEventListener('click', () => {
                    this.elements.signupModal.classList.remove('is-open');
                    this.open(this.elements.authModal);
                });
            }
        },

        handleScrollHeader() {
            // Optional: Add shadow to header on scroll
            const header = document.querySelector('.header-wrapper');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 10) {
                    header.classList.add('is-scrolled');
                } else {
                    header.classList.remove('is-scrolled');
                }
            }, { passive: true });
        }
    };

    // --- 4. MARKETPLACE MODULE (Filters, Sort, Search) ---
    const Marketplace = {
        container: document.getElementById('product-container'),
        elements: {
            searchInput: document.getElementById('search-input'),
            sortDropdown: document.querySelector('.sort-dropdown'),
            countDisplay: document.getElementById('result-count'),
            emptyState: document.getElementById('empty-state'),
            clearBtn: document.getElementById('clear-filters')
        },
        
        init() {
            // Only run if we are on the marketplace page
            if (!this.container) return; 
            
            this.bindEvents();
            this.parseUrlParams();
            this.filter(); // Initial run
        },

        bindEvents() {
            // Debounced Search
            if (this.elements.searchInput) {
                this.elements.searchInput.addEventListener('input', (e) => {
                    clearTimeout(state.searchDebounce);
                    state.searchDebounce = setTimeout(() => this.filter(), 300);
                });
            }

            // Filters (Delegation or direct attach)
            const filters = document.querySelectorAll('.cat-filter, .type-filter, input[name="price"]');
            filters.forEach(f => f.addEventListener('change', () => this.filter()));

            // Sort
            if (this.elements.sortDropdown) {
                this.elements.sortDropdown.addEventListener('change', () => this.filter());
            }

            // Clear All
            if (this.elements.clearBtn) {
                this.elements.clearBtn.addEventListener('click', () => this.resetFilters());
            }
        },

        filter() {
            const products = Array.from(this.container.children).filter(el => el.classList.contains('list-item'));
            if (products.length === 0) return;

            // Get current filter states
            const query = this.elements.searchInput?.value.trim().toLowerCase() || "";
            const activeCats = Array.from(document.querySelectorAll('.cat-filter:checked')).map(cb => cb.value);
            const activeTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value);
            const priceFilter = document.querySelector('input[name="price"]:checked')?.value || 'all';
            const sortBy = this.elements.sortDropdown?.value || 'newest';

            let visibleCount = 0;
            let visibleProducts = [];

            // 1. Filter Visibility
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

                const isVisible = matchesSearch && matchesCat && matchesType && matchesPrice;
                
                // Toggle visibility efficiently
                if (isVisible) {
                    product.style.display = 'flex'; // Restore flex layout
                    visibleProducts.push(product);
                    visibleCount++;
                } else {
                    product.style.display = 'none';
                }
            });

            // 2. Sort Visible Items
            this.sort(visibleProducts, sortBy);

            // 3. Update UI
            this.updateUI(visibleCount);
        },

        sort(products, method) {
            // We use Flexbox order or DOM re-appending. 
            // Re-appending is more robust for screen readers.
            
            const sorted = products.sort((a, b) => {
                const priceA = parseFloat(a.dataset.price || 0);
                const priceB = parseFloat(b.dataset.price || 0);
                // Assume data-date exists or fallback to index
                const dateA = parseInt(a.dataset.date || 0); 
                const dateB = parseInt(b.dataset.date || 0);

                if (method === 'low-high') return priceA - priceB;
                if (method === 'high-low') return priceB - priceA;
                if (method === 'newest') return dateB - dateA; // Descending
                return 0;
            });

            // Re-append sorted elements to container (moves them visually)
            const fragment = document.createDocumentFragment();
            sorted.forEach(el => fragment.appendChild(el));
            this.container.prepend(fragment); // Prepend so they appear at top
        },

        updateUI(count) {
            if (this.elements.countDisplay) {
                this.elements.countDisplay.textContent = `Showing ${count} creation${count !== 1 ? 's' : ''}`;
            }
            if (this.elements.emptyState) {
                this.elements.emptyState.style.display = count === 0 ? 'block' : 'none';
            }
        },

        resetFilters() {
            // Uncheck all boxes
            document.querySelectorAll('.cat-filter, .type-filter').forEach(cb => cb.checked = false);
            const priceAll = document.querySelector('input[name="price"][value="all"]');
            if (priceAll) priceAll.checked = true;
            
            if (this.elements.searchInput) this.elements.searchInput.value = '';
            if (this.elements.sortDropdown) this.elements.sortDropdown.value = 'newest';

            this.filter();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        parseUrlParams() {
            const urlParams = new URLSearchParams(window.location.search);
            const cat = urlParams.get('category');
            const search = urlParams.get('search');

            if (cat) {
                const cb = document.querySelector(`.cat-filter[value="${cat}"]`);
                if (cb) cb.checked = true;
            }
            if (search && this.elements.searchInput) {
                this.elements.searchInput.value = search;
            }
        }
    };

    // --- 5. INITIALIZATION ---
    return {
        init: () => {
            UI.init();
            Marketplace.init();
            
            // Log for debugging
            console.log('✨ KYNAR Universe Loaded');
        }
    };

})();

// Start the engine
document.addEventListener('DOMContentLoaded', KynarApp.init);
