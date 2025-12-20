/* ============================================================
   KYNAR UNIVERSE - GLOBAL JAVASCRIPT
   Handles: Navigation, Side Drawer, Auth Modals, Marketplace Engine
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ===== 1. CORE ELEMENTS ===== */
    const burger = document.querySelector('.custom-burger');
    const drawer = document.querySelector('.side-drawer');
    const overlay = document.querySelector('.drawer-overlay');
    const filterSidebar = document.getElementById('filter-sidebar');
    const filterToggle = document.getElementById('mobile-filter-toggle');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');

    /* ===== 2. DRAWER & SIDEBAR LOGIC ===== */
    function openDrawer(element) {
        if (!element || !overlay) return;
        element.classList.add('is-open');
        overlay.classList.add('is-visible');
        document.body.classList.add('drawer-open');
    }
    
    function closeAllDrawers() {
        if (drawer) drawer.classList.remove('is-open');
        if (filterSidebar) filterSidebar.classList.remove('is-open');
        if (overlay) overlay.classList.remove('is-visible');
        document.body.classList.remove('drawer-open');
    }
    
    // Burger Menu click
    if (burger) {
        burger.addEventListener('click', () => openDrawer(drawer));
    }

    // Filter Mobile Toggle click
    if (filterToggle) {
        filterToggle.addEventListener('click', () => openDrawer(filterSidebar));
    }

    // Apply & Close Button
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            closeAllDrawers();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Close on overlay click or X button
    if (overlay) overlay.addEventListener('click', closeAllDrawers);
    document.querySelectorAll('.drawer-close').forEach(btn => {
        btn.addEventListener('click', closeAllDrawers);
    });

    /* ===== 3. AUTH MODAL LOGIC ===== */
    const authTriggers = document.querySelectorAll('.sign-in-link');
    const authModal = document.querySelector('.auth-modal');
    
    if (authTriggers.length > 0 && authModal) {
        authTriggers.forEach(trigger => trigger.addEventListener('click', (e) => {
            if (!auth.currentUser) { // Only open if NOT logged in
                e.preventDefault();
                closeAllDrawers();
                authModal.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            }
        }));
    }

    /* ===== 4. MARKETPLACE ENGINE ===== */
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultCountText = document.getElementById('result-count');
    const emptyState = document.getElementById('empty-state');
    const sortDropdown = document.querySelector('.sort-dropdown');

    function runAllFilters() {
        const products = document.querySelectorAll('.list-item');
        if (products.length === 0) return;

        const query = searchInput?.value.trim().toLowerCase() || "";
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

        if (resultCountText) resultCountText.textContent = `Showing ${visibleCount} creation${visibleCount === 1 ? '' : 's'}`;
        if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    // Search Redirection logic
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            if (!window.location.pathname.includes('marketplace')) {
                e.preventDefault();
                window.location.href = `marketplace.html?search=${encodeURIComponent(searchInput.value)}`;
            } else {
                e.preventDefault();
                runAllFilters();
            }
        });
    }

    // Re-run filters on any change
    document.querySelectorAll('.cat-filter, .type-filter, input[name="price"], .sort-dropdown').forEach(el => {
        el.addEventListener('change', runAllFilters);
    });

    // ESCAPE KEY
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllDrawers();
            if (authModal) authModal.classList.remove('is-open');
        }
    });

    // Check URL on load
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('search') || urlParams.get('category')) {
        if (searchInput) searchInput.value = urlParams.get('search') || "";
        const cat = urlParams.get('category');
        if (cat) {
            const cb = document.querySelector(`.cat-filter[value="${cat}"]`);
            if (cb) cb.checked = true;
        }
        runAllFilters();
    }
});
