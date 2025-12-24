/**
 * KYNAR UNIVERSE - Core Application Logic
 * Architect: AetherCode
 * Description: Layout controller, Marketplace filtering, and Guides logic.
 */

const KynarApp = (() => {
    
    // --- 1. STATE & CONFIG ---
    const state = {
        isDrawerOpen: false,
        searchDebounce: null,
        initialized: false
    };

    // --- 2. ACCESSIBILITY MANAGER ---
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

    // --- 3. UI LAYOUT MODULE ---
    const UI = {
        elements: {
            get sideDrawer() { return document.getElementById('side-drawer'); },
            get overlay() { return document.getElementById('drawer-overlay'); },
            get authModal() { return document.getElementById('auth-modal'); }
        },

        init() {
            this.bindEvents();
            this.highlightActiveLink();
        },

        highlightActiveLink() {
            const path = window.location.pathname;
            const page = path.split("/").pop() || "index.html";
            
            document.querySelectorAll('.main-nav a, .drawer-list a').forEach(link => {
                const href = link.getAttribute('href');
                if (href === page) {
                    link.style.color = "var(--color-star-red)";
                    link.classList.add('active-page'); // Helper class
                } else {
                    link.style.color = ""; 
                    link.classList.remove('active-page');
                }
            });
        },

        bindEvents() {
            document.body.addEventListener('click', (e) => {
                const target = e.target;

                // A. Burger Menu (Open Drawer)
                if (target.closest('.custom-burger')) {
                    this.toggleDrawer('main');
                }
                
                // B. Close Buttons (Generic)
                if (target.closest('.drawer-close') || target.closest('.drawer-close-btn')) {
                    this.closeAll();
                }

                // C. Overlay Click
                if (target.classList.contains('drawer-overlay')) {
                    this.closeAll();
                }

                // D. Mobile Filter Toggle
                if (target.closest('.mobile-filter-btn') || target.id === 'mobile-filter-toggle') {
                    this.toggleDrawer('filter');
                }
            });

            // Global Escape Key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeAll();
            });
        },

        toggleDrawer(type) {
            const target = type === 'filter' 
                ? document.getElementById('filter-sidebar') 
                : this.elements.sideDrawer;
                
            if (!target) return;
            this.open(target);
        },

                open(element) {
            if (!element) return;
            this.closeAll(); 
            element.classList.add('is-open');
            element.setAttribute('aria-hidden', 'false');
            
            this.elements.overlay?.classList.add('is-visible');
            document.body.classList.add('drawer-open');
            state.isDrawerOpen = true;
            TrapManager.activate(element);
        },

                closeAll() {
            const openUI = document.querySelectorAll('.side-drawer.is-open, .marketplace-filters.is-open, .auth-modal.is-open');
            
            openUI.forEach(el => {
                el.classList.remove('is-open');
                el.setAttribute('aria-hidden', 'true');
            });

            this.elements.overlay?.classList.remove('is-visible');
            document.body.classList.remove('drawer-open');
            
            state.isDrawerOpen = false;
            TrapManager.deactivate();
        }
    }; // Properly close the UI module

    // --- 3.5 REVEAL SYSTEM ---
    const RevealSystem = {
        init() {
            const elements = document.querySelectorAll('.reveal-on-scroll');
            if (!elements.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            elements.forEach(el => observer.observe(el));
        }
    };

    // --- 4. MARKETPLACE MODULE ---
    const Marketplace = {
        get container() { return document.getElementById('product-container'); },
        
        init() {
            if (!this.container) return; // Not on marketplace page
            this.setupFilters();
            this.parseUrlParams(); // Process ?search=... or ?category=...
            this.filter(); 
        },

                        setupFilters() {
            // Unified Search: Look for the Header search bar
            const searchInput = document.getElementById('global-search-input');
            const pageSearchInput = document.getElementById('search-input'); // Defined to prevent ReferenceError
            const clearBtn = document.getElementById('clear-filters');
            const applyBtn = document.getElementById('apply-filters-btn');

            // Listen to both search inputs if they exist (filter nulls)
            [searchInput, pageSearchInput].filter(input => input).forEach(input => {
                input.addEventListener('input', () => {
                    clearTimeout(state.searchDebounce);
                    state.searchDebounce = setTimeout(() => this.filter(), 300);
                });
            });


            // Change Event Delegation
            document.body.addEventListener('change', (e) => {
                if (e.target.matches('.cat-filter, .type-filter, input[name="price"], .sort-dropdown')) {
                    this.filter();
                }
            });

            // Clear Filters
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                    document.querySelectorAll('input[name="price"]').forEach(r => r.checked = (r.value === 'all'));
                    
                    if(searchInput) searchInput.value = '';
                    if(pageSearchInput) pageSearchInput.value = '';
                    
                    const sort = document.querySelector('.sort-dropdown');
                    if(sort) sort.value = 'newest';
                    
                    this.filter();
                });
            }
            
            if (applyBtn) {
                applyBtn.addEventListener('click', () => UI.closeAll());
            }
        },

        filter() {
            const products = Array.from(this.container.children).filter(el => el.classList.contains('list-item'));
            if (!products.length) return;

            // Get query from either input
            const q1 = document.getElementById('global-search-input')?.value.trim().toLowerCase() || "";
            const q2 = document.getElementById('search-input')?.value.trim().toLowerCase() || "";
            const query = q2 || q1; // Prefer page specific, fallback to global

            const activeCats = Array.from(document.querySelectorAll('.cat-filter:checked')).map(cb => cb.value);
            const priceFilter = document.querySelector('input[name="price"]:checked')?.value || 'all';
            const sortBy = document.querySelector('.sort-dropdown')?.value || 'newest';

            let visibleCount = 0;
            let visibleProducts = [];

            products.forEach(product => {
                const title = product.querySelector('h4')?.textContent.toLowerCase() || '';
                const cat = product.dataset.category || '';
                const price = parseFloat(product.dataset.price || 0);

                const matchesSearch = !query || title.includes(query);
                const matchesCat = activeCats.length === 0 || activeCats.includes(cat);
                
                let matchesPrice = true;
                if (priceFilter === 'under10') matchesPrice = price > 0 && price < 10;
                if (priceFilter === 'over10') matchesPrice = price >= 10;
                if (priceFilter === '0') matchesPrice = price === 0; // Free items

                if (matchesSearch && matchesCat && matchesPrice) {
                    product.style.display = 'flex';
                    visibleProducts.push(product);
                    visibleCount++;
                } else {
                    product.style.display = 'none';
                }
            });

            this.sort(visibleProducts, sortBy);
            
            const countDisplay = document.getElementById('result-count');
            const emptyState = document.getElementById('empty-state');
            
            if (countDisplay) countDisplay.textContent = `Showing ${visibleCount} creation${visibleCount !== 1 ? 's' : ''}`;
            if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        },

                sort(products, method) {
            products.sort((a, b) => {
                const pA = parseFloat(a.dataset.price || 0), pB = parseFloat(b.dataset.price || 0);
                const dA = new Date(a.dataset.date || 0).getTime(), dB = new Date(b.dataset.date || 0).getTime();

                if (method === 'low-high') return pA - pB;
                if (method === 'high-low') return pB - pA;
                return dB - dA; // Default Newest
            });

                        // Use fragment to batch DOM updates for performance
            const fragment = document.createDocumentFragment();
            products.forEach(el => fragment.appendChild(el));
            this.container.appendChild(fragment);
},


        parseUrlParams() {
            const urlParams = new URLSearchParams(window.location.search);
            
            // 1. Handle Category
            const cat = urlParams.get('category');
            if (cat) {
                const cb = document.querySelector(`.cat-filter[value="${cat}"]`);
                if (cb) cb.checked = true;
            }

            // 2. Handle Search Query (From Header)
            const search = urlParams.get('search');
            if (search) {
                // Populate the inputs so filter() sees them
                const globalInput = document.getElementById('global-search-input');
                const pageInput = document.getElementById('search-input');
                if (globalInput) globalInput.value = search;
                if (pageInput) pageInput.value = search;
            }
        }
    };

    // --- 5. GUIDES MODULE ---
    const Guides = {
        init() {
            if (!document.querySelector('.guides-page')) return;
            
            const filterTabs = document.querySelectorAll('.filter-tab');
            const guideCards = document.querySelectorAll('.guide-card');

            if (filterTabs.length === 0) return;

            filterTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const category = tab.dataset.category;

                    // Update Active Tab
                    filterTabs.forEach(t => { 
                        t.classList.remove('btn-primary'); 
                        t.classList.add('btn-secondary');
                    });
                    tab.classList.remove('btn-secondary');
                    tab.classList.add('btn-primary');

                    // Filter Cards
                    guideCards.forEach(card => {
                        const cardCat = card.dataset.category;
                        if (category === 'all' || cardCat === category) {
                            card.style.display = 'flex';
                            card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
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
            if (state.initialized) return; 
            state.initialized = true;

            UI.init();
            Marketplace.init();
            Guides.init();
            RevealSystem.init(); // <--- This line is the spark plug!
            console.log('✨ KYNAR Universe Engine Started');
                    // Update Footer Year
        const yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        }
    };

})();

// Temporal Bridge for Marketplace Actions
window.kynarPurchases = {
    addToWishlist: (item) => {
        console.log("Added to wishlist:", item.title);
        // This will be linked to firebase-logic.js in the next phase
        alert(`${item.title} added to wishlist!`);
    }
};


// Initialize when Components are Ready
document.addEventListener('componentsLoaded', () => {
    KynarApp.init();
});

// Fallback safety (in case components load faster than script execution)
if (document.querySelector('.header-wrapper header')) {
    KynarApp.init();
}
