/* ============================================================
   KYNAR UNIVERSE - GLOBAL JAVASCRIPT
   Handles: Navigation, Side Drawer, Auth Modals, Marketplace Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ===== 1. SIDE DRAWER & NAVIGATION ===== */
    const burger = document.querySelector('.custom-burger');
    const drawer = document.querySelector('.side-drawer');
    const closeBtn = drawer ? drawer.querySelector('.drawer-close') : null;
    const overlay = document.querySelector('.drawer-overlay');
    
    function openDrawer() {
        if (!drawer || !overlay) return;
        drawer.classList.add('is-open');
        overlay.classList.add('is-visible');
        document.body.classList.add('drawer-open');
        drawer.setAttribute('aria-hidden', 'false');
        if (burger) burger.setAttribute('aria-expanded', 'true');
    }
    
    function closeDrawer() {
        if (!drawer || !overlay) return;
        drawer.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        document.body.classList.remove('drawer-open');
        drawer.setAttribute('aria-hidden', 'true');
        if (burger) burger.setAttribute('aria-expanded', 'false');
    }
    
    if (burger && drawer && overlay) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = drawer.classList.contains('is-open');
            isOpen ? closeDrawer() : openDrawer();
        });
        
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeDrawer();
            });
        }
        
        overlay.addEventListener('click', closeDrawer);
    }

    /* ===== 2. AUTH MODAL LOGIC ===== */
    const authTriggers = document.querySelectorAll('.sign-in-link');
    const authModal = document.querySelector('.auth-modal');
    const authClose = document.querySelector('.auth-modal-close');
    const authBackdrop = document.querySelector('.auth-modal-backdrop');

    function openAuth() {
        if (authModal) authModal.classList.add('is-open');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    function closeAuth() {
        if (authModal) authModal.classList.remove('is-open');
        document.body.style.overflow = ''; 
    }

    if (authTriggers.length > 0 && authModal) {
        authTriggers.forEach(trigger => trigger.addEventListener('click', (e) => {
            e.preventDefault();
            closeDrawer(); // Close mobile menu if open
            openAuth();
        }));

        if (authClose) authClose.addEventListener('click', closeAuth);
        if (authBackdrop) authBackdrop.addEventListener('click', closeAuth);
    }
    
    /* ===== 3. GLOBAL SEARCH & MARKETPLACE ENGINE ===== */
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const filterToggle = document.getElementById('mobile-filter-toggle');
    const filterSidebar = document.getElementById('filter-sidebar');
    const resultCountText = document.getElementById('result-count');
    const emptyState = document.getElementById('empty-state');
    const productContainer = document.getElementById('product-container');
    const sortDropdown = document.querySelector('.sort-dropdown');
    const resetBtn = document.getElementById('clear-filters');

    // --- A. Mobile Toggle ---
    if (filterToggle && filterSidebar) {
        filterToggle.addEventListener('click', () => {
            filterSidebar.classList.toggle('active');
            // Change button text or icon if needed
            const isShowing = filterSidebar.classList.contains('active');
            filterToggle.textContent = isShowing ? 'Close Filters' : 'Filter Creations';
        });
    }

    // --- B. The "Master" Filter Function ---
    function runAllFilters() {
        const products = document.querySelectorAll('.list-item');
        if (products.length === 0) return; // Exit if not on marketplace page

        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const activeCats = Array.from(document.querySelectorAll('.cat-filter:checked')).map(cb => cb.value);
        const activeTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value);
        const priceFilter = document.querySelector('input[name="price"]:checked')?.value || 'all';

        let visibleCount = 0;

        products.forEach(product => {
            const title = product.querySelector('h4')?.textContent.toLowerCase() || '';
            const category = product.getAttribute('data-category') || '';
            const type = product.getAttribute('data-type') || '';
            const price = parseFloat(product.getAttribute('data-price')) || 0;

            const matchesSearch = !query || title.includes(query);
            const matchesCat = activeCats.length === 0 || activeCats.includes(category);
            const matchesType = activeTypes.length === 0 || activeTypes.includes(type);
            
            let matchesPrice = true;
            if (priceFilter === '0') matchesPrice = (price === 0);
            else if (priceFilter === 'under10') matchesPrice = (price > 0 && price < 10);
            else if (priceFilter === 'over10') matchesPrice = (price >= 10);

            if (matchesSearch && matchesCat && matchesType && matchesPrice) {
                product.style.display = 'flex';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });

        // Update UI
        if (resultCountText) {
            resultCountText.textContent = `Showing ${visibleCount} creation${visibleCount === 1 ? '' : 's'}`;
        }
        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    // --- C. Event Listeners ---
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentPath = window.location.pathname;
            // Check if we are NOT on the marketplace page
            if (!currentPath.includes('marketplace')) {
                window.location.href = `marketplace.html?search=${encodeURIComponent(searchInput.value)}`;
            } else {
                runAllFilters();
            }
        });
    }

    // Live search refinement as user types
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            if (window.location.pathname.includes('marketplace')) {
                runAllFilters();
            }
        });
    }

    document.querySelectorAll('.cat-filter, .type-filter, input[name="price"]').forEach(el => {
        el.addEventListener('change', runAllFilters);
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('.cat-filter, .type-filter').forEach(c => c.checked = false);
            const allPrice = document.querySelector('input[name="price"][value="all"]');
            if (allPrice) allPrice.checked = true;
            if (searchInput) searchInput.value = '';
            runAllFilters();
        });
    }

    if (sortDropdown && productContainer) {
        sortDropdown.addEventListener('change', () => {
            const productsArr = Array.from(document.querySelectorAll('.list-item'));
            const sortBy = sortDropdown.value;
            
            productsArr.sort((a, b) => {
                const priceA = parseFloat(a.getAttribute('data-price')) || 0;
                const priceB = parseFloat(b.getAttribute('data-price')) || 0;
                return sortBy === 'low-high' ? priceA - priceB : priceB - priceA;
            });
            
            productsArr.forEach(p => productContainer.appendChild(p));
        });
    }

    /* ===== 4. ESCAPE KEY & GLOBAL CLOSE ===== */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDrawer();
            closeAuth();
            if (filterSidebar) filterSidebar.classList.remove('active');
        }
    });

    /* ===== 5. INITIAL LOAD CHECK (URL Params) ===== */
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const catParam = urlParams.get('category');

    if (searchParam || catParam) {
        if (searchInput && searchParam) searchInput.value = searchParam;
        if (catParam) {
            const cb = document.querySelector(`.cat-filter[value="${catParam}"]`);
            if (cb) cb.checked = true;
        }
        runAllFilters();
    }
});
