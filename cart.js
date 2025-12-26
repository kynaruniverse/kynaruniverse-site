/**
 * KYNAR UNIVERSE - Shopping Cart Engine & UI
 * Architect: KynarForge Pro
 * Description: Injects UI, manages LocalStorage, and handles Drawer interactions.
 */

const CartSystem = (() => {
    
    // --- CONFIG & STATE ---
    const CONFIG = {
        STORAGE_KEY: 'kynar_cart_v1',
    };

    let state = {
        items: JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || [],
    };

    // --- DOM ELEMENTS ---
        const UI = {
        // FIXED: Updated ID to match Kynar 2026 Header
        get badge() { return document.getElementById('cart-count'); },
        get drawer() { return document.getElementById('cart-side-drawer'); },
        get list() { return document.getElementById('cart-items-list'); },
        get total() { return document.getElementById('cart-drawer-total'); },
        get countTitle() { return document.getElementById('cart-drawer-count'); },
        get overlay() { return document.getElementById('drawer-overlay'); }
    };


    // --- CORE ENGINE ---
    
    const save = () => {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state.items));
        updateUI();
    };

    const add = (product) => {
        if (state.items.find(item => item.id === product.id)) {
            showToast("Item already in cart!");
            openDrawer(); // Auto-open to show user
            return;
        }

        state.items.push(product);
        save();
        showToast(`Added: ${product.title}`);
        openDrawer(); // Auto-open on add
    };

    const remove = (productId) => {
        state.items = state.items.filter(item => item.id !== productId);
        save();
        renderItems(); // Re-render list
    };

    const getTotals = () => {
        const subtotal = state.items.reduce((sum, item) => sum + item.price, 0);
        return {
            count: state.items.length,
            subtotal: subtotal.toFixed(2)
        };
    };

    // --- UI MANAGER ---

    const injectDrawerHTML = () => {
        if (document.getElementById('cart-side-drawer')) return;

        const drawerHTML = `
            <div id="cart-side-drawer" class="side-drawer cart-drawer" aria-hidden="true">
                <div class="drawer-header">
                    <span class="drawer-title">Your Cart (<span id="cart-drawer-count">0</span>)</span>
                    <button class="drawer-close-btn" aria-label="Close cart">&times;</button>
                </div>
                
                <div class="cart-items-container" id="cart-items-list">
                    </div>
                
                <div class="cart-drawer-footer">
                    <div class="cart-subtotal">
                        <span>Subtotal</span>
                        <span id="cart-drawer-total">£0.00</span>
                    </div>
                    <button class="btn btn-primary btn-full-width" id="checkout-btn">Checkout</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', drawerHTML);
    };

    const renderItems = () => {
        if (!UI.list) return;

        if (state.items.length === 0) {
            UI.list.innerHTML = `
                <div class="cart-empty-state">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <p>Your cart is empty.</p>
                </div>`;
        } else {
            UI.list.innerHTML = state.items.map(item => `
                <div class="cart-item">
                    <div class="cart-item-img" style="background-color: #eee;"></div> 
                    <div class="cart-item-details">
                        <p class="cart-item-title">${item.title}</p>
                        <p class="cart-item-price">£${item.price.toFixed(2)}</p>
                    </div>
                    
                    <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove ${item.title}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
    };

    const updateUI = () => {
        const totals = getTotals();
        
        // Header Badge
        if (UI.badge) {
            UI.badge.textContent = totals.count;
            UI.badge.style.display = totals.count > 0 ? 'flex' : 'none';
            UI.badge.classList.remove('pop-anim');
            void UI.badge.offsetWidth;
            UI.badge.classList.add('pop-anim');
        }

        // Drawer Totals
        if (UI.total) UI.total.textContent = `£${totals.subtotal}`;
        if (UI.countTitle) UI.countTitle.textContent = totals.count;
    };

    const openDrawer = () => {
        renderItems();
        // Mimic script.js open logic
        const drawer = UI.drawer;
        const overlay = UI.overlay;
        
        // Close others first (simple way: remove is-open from everything)
        document.querySelectorAll('.is-open').forEach(el => el.classList.remove('is-open'));

        if (drawer) {
            drawer.classList.add('is-open');
            drawer.setAttribute('aria-hidden', 'false');
        }
        if (overlay) overlay.classList.add('is-visible');
        document.body.classList.add('drawer-open');
    };

    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'cart-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('visible'), 10);
        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // --- EVENT LISTENERS ---

    const init = () => {
        injectDrawerHTML();
        updateUI();

        // 1. Global Click Delegation
        document.body.addEventListener('click', (e) => {
            const target = e.target;

            // Open Drawer (Header Icon)
            if (target.closest('.cart-trigger')) {
                e.preventDefault();
                openDrawer();
            }

            // Remove Item
            const removeBtn = target.closest('.cart-item-remove');
            if (removeBtn) {
                remove(removeBtn.dataset.id);
            }
            
                        // Checkout Navigation
            if (target.id === 'checkout-btn') {
                e.preventDefault();
                if (state.items.length === 0) {
                    showToast("Your cart is empty!");
                } else {
                    window.location.href = 'checkout.html';
                }
            }


            // Add to Cart
            const addBtn = target.closest('.js-add-to-cart');
            if (addBtn) {
                e.preventDefault();
                const product = {
                    id: addBtn.dataset.id,
                    title: addBtn.dataset.title,
                    price: parseFloat(addBtn.dataset.price),
                };
                
                if (window.LoadingState) LoadingState.buttonStart(addBtn);
                setTimeout(() => {
                    add(product);
                    if (window.LoadingState) LoadingState.buttonEnd(addBtn, "Added");
                }, 300);
            }
        });

        console.log('🛒 Kynar Cart UI Initialized');
    };

    return { init };

})();

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', CartSystem.init);
} else {
    CartSystem.init();
}
