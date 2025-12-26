/**
 * KYNAR UNIVERSE - Core Application Logic
 * Architect: AetherCode
 * Description: Layout controller, Marketplace filtering, and Guides logic.
 * Status: GOLD MASTER (Fixed ID & Class Consistency)
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
        activate(element, id = 'main-ui-trap') {
            if (typeof window.activateFocusTrap === 'function') {
                window.activateFocusTrap(element, id);
            }
        },
        deactivate(id = 'main-ui-trap') {
            if (typeof window.deactivateFocusTrap === 'function') {
                window.deactivateFocusTrap(id);
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
                    link.style.color = "var(--gold-neon)";
                    link.classList.add('active-page');
                } else {
                    link.style.color = ""; 
                    link.classList.remove('active-page');
                }
            });
        },

        bindEvents() {
            document.body.addEventListener('click', (e) => {
                const target = e.target;

                // A. Burger Menu (Open Main Drawer)
                if (target.closest('.custom-burger')) {
                    this.open(this.elements.sideDrawer);
                }
                
                // B. Close Buttons (Global Handler for ALL Modals/Drawers)
                if (target.closest('.drawer-close') || 
                    target.closest('.drawer-close-btn') || 
                    target.closest('.auth-modal-close') ||
                    target.closest('.filter-close-btn') || 
                    target.closest('.quick-view-close')) {
                    this.closeAll();
                }

                // C. Overlay Click (Close everything)
                if (target.classList.contains('drawer-overlay') || 
                    target.classList.contains('auth-modal-backdrop') ||
                    target.classList.contains('filter-backdrop') ||
                    target.classList.contains('quick-view-backdrop')) {
                    this.closeAll();
                }
            });

            // Global Escape Key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeAll();
            });
        },

        open(element) {
            if (!element) return;
            this.closeAll(); // Close others first
            
            // 1. Reset Scroll
            element.scrollTop = 0;
            
            // 2. Visual Open (Using Standard .is-open)
            element.classList.add('is-open');
            element.setAttribute('aria-hidden', 'false');
            
            // 3. Body Lock & Overlay
            this.elements.overlay?.classList.add('is-visible');
            document.body.classList.add('drawer-open');
            state.isDrawerOpen = true;
            
            // 4. Trap Focus
            setTimeout(() => TrapManager.activate(element), 50);
        },

        closeAll() {
            // Target ALL possible open elements (Drawers, Filter Modal, Quick View, Auth)
            const openUI = document.querySelectorAll(
                '.side-drawer.is-open, .modern-filter-modal.is-open, .quick-view-modal.is-open, .auth-modal.is-open'
            );
            
            openUI.forEach(el => {
                el.classList.remove('is-open'); // Standardized class
                el.classList.remove('is-active'); // Fallback cleanup
                el.setAttribute('aria-hidden', 'true');
            });

            // Hide Overlays
            this.elements.overlay?.classList.remove('is-visible');
            document.querySelectorAll('.loading-overlay').forEach(o => o.classList.remove('is-visible'));

            document.body.classList.remove('drawer-open');
            document.body.style.overflow = ''; // Release scroll lock
            
            state.isDrawerOpen = false;
            TrapManager.deactivate();
        }
    };

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
        get quickViewModal() { return document.getElementById('quick-view-modal'); },
        get filterModal() { return document.getElementById('filter-modal'); },
        
        init() {
            if (!this.container) return; 
            this.setupFilters();
            this.parseUrlParams();
            this.filter(); 
            this.setupQuickView();
        },

        setupQuickView() {
            this.container.addEventListener('click', (e) => {
                const card = e.target.closest('.list-item');
                const isBtn = e.target.closest('.js-add-to-cart');
                
                // Open Quick View if clicking card (but not the button)
                if (card && !isBtn) {
                    this.openQuickView(card);
                }
            });
        },

        openQuickView(card) {
            if (!this.quickViewModal) return;

            // 1. Harvest Data
            const data = card.dataset;
            const imgSrc = card.querySelector('.item-visual')?.innerHTML || ''; 
            // Note: Kynar 2026 uses FontAwesome icons in .item-visual, so we copy HTML
            
            const title = card.querySelector('h4')?.textContent;
            const price = card.querySelector('.item-price')?.textContent;
            const desc = card.querySelector('.item-details p')?.textContent;

            // 2. Populate UI
            document.getElementById('qv-title').textContent = title;
            document.getElementById('qv-category').textContent = `${data.category || 'Asset'} • ${data.type || 'Digital'}`;
            document.getElementById('qv-description').textContent = desc || "No description available.";
            document.getElementById('qv-price').textContent = price;
            
            // Handle Visual (Icon Clone)
            const visualContainer = document.getElementById('qv-image');
            visualContainer.innerHTML = imgSrc;
            visualContainer.style.display = 'flex';
            visualContainer.style.alignItems = 'center';
            visualContainer.style.justifyContent = 'center';
            visualContainer.style.fontSize = '80px'; // Scale up icon

            // Setup Add Button Clone
            const qvBtn = document.getElementById('qv-add-btn');
            qvBtn.onclick = () => {
                const originalBtn = card.querySelector('.js-add-to-cart');
                if(originalBtn) originalBtn.click();
                UI.closeAll();
            };

            // 3. Open (Using UI Module for consistency)
            UI.open(this.quickViewModal);
        },

        setupFilters() {
            const openBtns = document.querySelectorAll('#mobile-filter-toggle, .mobile-filter-btn'); 
            const resetBtn = document.getElementById('clear-filters-btn');
            const applyBtn = document.getElementById('apply-filters-btn');

            // Open Logic
            openBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    UI.open(this.filterModal);
                });
            });

            // Apply Button
            if (applyBtn) {
                applyBtn.addEventListener('click', () => {
                    this.filter();
                    UI.closeAll();
                });
            }

            // Reset Logic
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    document.querySelectorAll('.cat-filter').forEach(cb => cb.checked = false);
                    document.querySelectorAll('input[name="price"]').forEach(r => r.checked = (r.value === 'all'));
                    const sort = document.querySelector('.sort-dropdown');
                    if (sort) sort.value = 'newest';

                    this.filter();
                    UI.closeAll();
                });
            }
        },

        filter() {
             const products = Array.from(this.container.children).filter(el => el.classList.contains('list-item'));
            if (!products.length) return;

            const q1 = document.getElementById('global-search-input')?.value.trim().toLowerCase() || "";
            const q2 = document.getElementById('search-input')?.value.trim().toLowerCase() || "";
            const query = q2 || q1; 

            // Updated for Checkboxes (Kynar 2026 uses <input type="checkbox">)
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
                if (priceFilter === '0') matchesPrice = price === 0;

                if (matchesSearch && matchesCat && matchesPrice) {
                    product.style.display = 'flex'; // Bento cards are flex containers
                    visibleProducts.push(product);
                    visibleCount++;
                } else {
                    product.style.display = 'none';
                }
            });

            this.sort(visibleProducts, sortBy);
            
            const countDisplay = document.getElementById('result-count');
            const emptyState = document.getElementById('empty-state');
            
            if (countDisplay) countDisplay.textContent = `${visibleCount} Signal${visibleCount !== 1 ? 's' : ''} Found`;
            if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        },

        sort(products, method) {
            products.sort((a, b) => {
                const pA = parseFloat(a.dataset.price || 0), pB = parseFloat(b.dataset.price || 0);
                // Random date simulation for demo, or add data-date to HTML
                const dA = Math.random(); 
                const dB = Math.random();

                if (method === 'low-high') return pA - pB;
                if (method === 'high-low') return pB - pA;
                return 0; // Default order
            });

            const fragment = document.createDocumentFragment();
            products.forEach(el => fragment.appendChild(el));
            this.container.appendChild(fragment);
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

    // --- 5. GUIDES MODULE (2026 Update) ---
    const Guides = {
        init() {
            const grid = document.getElementById('guides-grid');
            if (!grid) return;

            const pills = document.querySelectorAll('.filter-pill');
            const searchInput = document.getElementById('guide-search');
            const cards = document.querySelectorAll('.guide-tile');

            pills.forEach(pill => {
                pill.addEventListener('click', () => {
                    pills.forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    const category = pill.dataset.category;
                    this.filterGrid(cards, category, searchInput ? searchInput.value : '');
                });
            });

            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const activePill = document.querySelector('.filter-pill.active');
                    const category = activePill ? activePill.dataset.category : 'all';
                    this.filterGrid(cards, category, e.target.value);
                });
            }
        },

        filterGrid(cards, category, searchTerm) {
            const term = searchTerm.toLowerCase().trim();

            cards.forEach(card => {
                const cardCat = card.dataset.category;
                const title = card.querySelector('h3').textContent.toLowerCase();
                const desc = card.querySelector('p').textContent.toLowerCase();
                
                const catMatch = (category === 'all' || cardCat === category);
                const searchMatch = !term || title.includes(term) || desc.includes(term);

                if (catMatch && searchMatch) {
                    card.style.display = 'flex';
                    if(card.classList.contains('reveal-on-scroll')) {
                        card.classList.add('is-visible');
                    }
                } else {
                    card.style.display = 'none';
                }
            });
        }
    };

    // --- INIT ---
    return {
        init: () => {
            if (state.initialized) return; 
            state.initialized = true;

            UI.init();
            Marketplace.init();
            Guides.init();
            RevealSystem.init();
            console.log('✨ KYNAR Universe Engine Started');
            
            const yearEl = document.getElementById('year');
            if (yearEl) yearEl.textContent = new Date().getFullYear();
        }
    };

})();

// Initialize when Components are Ready
document.addEventListener('componentsLoaded', () => {
    KynarApp.init();
});

// Fallback safety
if (document.querySelector('.header-wrapper header')) {
    KynarApp.init();
}
