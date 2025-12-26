/**
 * KYNAR UNIVERSE - Elastic Cart Engine
 * Architect: KynarForge Pro
 * Evolution: Platinum Plus Tactile Edition
 */

const CartSystem = (() => {
    
    const CONFIG = { STORAGE_KEY: 'kynar_cart_v1' };
    let state = { items: JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || [] };

    const UI = {
        get badge() { return document.getElementById('cart-count'); },
        get drawer() { return document.getElementById('cart-side-drawer'); },
        get list() { return document.getElementById('cart-items-list'); },
        get total() { return document.getElementById('cart-drawer-total'); },
        get countTitle() { return document.getElementById('cart-drawer-count'); },
        get overlay() { return document.querySelector('.drawer-overlay'); }
    };

    const save = () => {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state.items));
        updateUI();
    };

    const add = (product) => {
        if (state.items.find(item => item.id === product.id)) {
            openDrawer();
            return;
        }
        state.items.push(product);
        save();
        openDrawer();
    };

    const remove = (productId) => {
        state.items = state.items.filter(item => item.id !== productId);
        save();
        renderItems();
    };

    const injectDrawerHTML = () => {
        if (document.getElementById('cart-side-drawer')) return;
        const drawerHTML = `
            <div id="cart-side-drawer" class="cart-drawer" aria-hidden="true">
                <div class="drawer-header">
                    <span class="drawer-title" style="font-family: 'Bantayog'; letter-spacing: 2px;">INVENTORY (<span id="cart-drawer-count">0</span>)</span>
                    <button class="drawer-close" style="background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
                </div>
                <div class="cart-items-container" id="cart-items-list" style="flex:1; padding:20px; overflow-y:auto;"></div>
                <div class="cart-drawer-footer" style="padding:30px; border-top:1px solid rgba(0,0,0,0.05); background:var(--bg-surface);">
                    <div style="display:flex; justify-content:space-between; margin-bottom:20px; font-weight:bold;">
                        <span>SUBTOTAL</span>
                        <span id="cart-drawer-total" class="text-gold">£0.00</span>
                    </div>
                    <button class="btn btn-primary btn-full-width" id="checkout-btn">SECURE CHECKOUT</button>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', drawerHTML);
    };

    const renderItems = () => {
        if (!UI.list) return;
        UI.list.innerHTML = state.items.length === 0 ? 
            `<div style="text-align:center; padding-top:40px; opacity:0.5;"><i class="fa-solid fa-basket-shopping" style="font-size:30px;"></i><p>Empty</p></div>` :
            state.items.map(item => `
                <div class="cart-item" style="display:flex; align-items:center; gap:15px; margin-bottom:20px; padding-bottom:15px; border-bottom:1px solid rgba(0,0,0,0.05);">
                    <div style="width:50px; height:50px; background:var(--bg-surface); border-radius:8px; display:flex; align-items:center; justify-content:center;"><i class="fa-solid fa-cube" style="opacity:0.2;"></i></div>
                    <div style="flex:1;">
                        <p style="font-weight:bold; font-size:13px; margin:0;">${item.title}</p>
                        <p style="font-size:12px; color:var(--gold-neon); margin:0;">£${item.price.toFixed(2)}</p>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}" style="background:none; border:none; cursor:pointer; opacity:0.3;"><i class="fa-solid fa-trash"></i></button>
                </div>`).join('');
    };

    const updateUI = () => {
        const subtotal = state.items.reduce((sum, item) => sum + item.price, 0);
        if (UI.badge) {
            UI.badge.textContent = state.items.length;
            UI.badge.style.display = state.items.length > 0 ? 'flex' : 'none';
        }
        if (UI.total) UI.total.textContent = `£${subtotal.toFixed(2)}`;
        if (UI.countTitle) UI.countTitle.textContent = state.items.length;
    };

    const openDrawer = () => {
        renderItems();
        UI.drawer?.classList.add('is-open');
        UI.overlay?.classList.add('is-visible');
        document.body.classList.add('drawer-open');
    };

    const init = () => {
        injectDrawerHTML();
        updateUI();
        document.body.addEventListener('click', (e) => {
            if (e.target.closest('#cart-toggle')) openDrawer();
            if (e.target.closest('.drawer-close')) {
                UI.drawer?.classList.remove('is-open');
                UI.overlay?.classList.remove('is-visible');
                document.body.classList.remove('drawer-open');
            }
            if (e.target.closest('.cart-item-remove')) remove(e.target.closest('.cart-item-remove').dataset.id);
            if (e.target.id === 'checkout-btn') window.location.href = 'checkout.html';
        });
    };

    return { init };
})();

document.addEventListener('componentsLoaded', () => CartSystem.init());
