/* ============================================================
   KYNAR UNIVERSE - GLOBAL JAVASCRIPT
   Handles: Navigation, Side Drawer, Marketplace Filters, and Search
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
        burger.setAttribute('aria-expanded', 'true');
    }
    
    function closeDrawer() {
        if (!drawer || !overlay) return;
        drawer.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        document.body.classList.remove('drawer-open');
        drawer.setAttribute('aria-hidden', 'true');
        burger.setAttribute('aria-expanded', 'false');
    }
    
    if (burger && drawer && closeBtn && overlay) {
        // Open/close via burger
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = drawer.classList.contains('is-open');
            isOpen ? closeDrawer() : openDrawer();
        });
        
        // Close via "X" button
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeDrawer();
        });
        
        // Close via overlay click
        overlay.addEventListener('click', closeDrawer);
        
        // Close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
                closeDrawer();
            }
        });
    }
    
        /* ===== 2. GLOBAL SEARCH & MARKETPLACE ENGINE ===== */
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
            filterSidebar.classList.toggle('active'); // Matches the CSS we wrote
        });
    }

    // --- B. The "Master" Filter Function ---
    function runAllFilters() {
        const products = document.querySelectorAll('.list-item');
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const activeCats = Array.from(document.querySelectorAll('.cat-filter:checked')).map(cb => cb.value);
        const activeTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value);
        const priceFilter = document.querySelector('input[name="price"]:checked')?.value || 'all';

        let visibleCount = 0;

        products.forEach(product => {
            // Get data
            const title = product.querySelector('h4')?.textContent.toLowerCase() || '';
            const category = product.getAttribute('data-category') || '';
            const type = product.getAttribute('data-type') || '';
            const price = parseFloat(product.getAttribute('data-price')) || 0;

            // Check Search
            const matchesSearch = !query || title.includes(query);
            // Check Category
            const matchesCat = activeCats.length === 0 || activeCats.includes(category);
            // Check Type
            const matchesType = activeTypes.length === 0 || activeTypes.includes(type);
            // Check Price
            let matchesPrice = true;
            if (priceFilter === '0') matchesPrice = (price === 0);
            else if (priceFilter === 'under10') matchesPrice = (price > 0 && price < 10);
            else if (priceFilter === 'over10') matchesPrice = (price >= 10);

            // Final Decision
            if (matchesSearch && matchesCat && matchesType && matchesPrice) {
                product.style.display = 'flex';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });

        // Update UI (Count and Empty State)
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
            if (!window.location.pathname.includes('marketplace')) {
                window.location.href = `marketplace.html?search=${encodeURIComponent(searchInput.value)}`;
            } else {
                runAllFilters();
            }
        });
    }

    // Listen for any checkbox/radio change
    document.querySelectorAll('.cat-filter, .type-filter, input[name="price"]').forEach(el => {
        el.addEventListener('change', runAllFilters);
    });

    // Reset logic
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('.cat-filter, .type-filter').forEach(c => c.checked = false);
            const allPrice = document.querySelector('input[name="price"][value="all"]');
            if (allPrice) allPrice.checked = true;
            if (searchInput) searchInput.value = '';
            runAllFilters();
        });
    }

    // Sort Logic (Stays separate as it reorders elements)
    if (sortDropdown) {
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

    // Initial Load Check (URL Params)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('search') || urlParams.get('category')) {
        if (searchInput) searchInput.value = urlParams.get('search') || '';
        const cat = urlParams.get('category');
        if (cat) {
            const cb = document.querySelector(`.cat-filter[value="${cat}"]`);
            if (cb) cb.checked = true;
        }
        runAllFilters();
    }
});
