import { EventBus, EVENTS } from '../core/events.js';
import { getProduct } from '../data/vault.js';

const CART_KEY = 'kynar_cart';

export function initCart() {
  // Load State
  let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

  // Update UI immediately on load
  updateCartUI(cart);

  // --- LISTENERS ---
  
  // 1. Add to Cart
  EventBus.on(EVENTS.CART_ADD, (productId) => {
    const product = getProduct(productId);
    const exists = cart.find(p => p.id === productId);

    if (product && !exists) {
      cart.push(product);
      save();
      Logger.log(`[CART] Added ${product.title}`);
      if(navigator.vibrate) navigator.vibrate([15, 30]);
    } else {
      if(navigator.vibrate) navigator.vibrate([10, 10]);
    }
    
    EventBus.emit(EVENTS.CART_TOGGLE, 'open');
  });

  // 2. Remove from Cart
  EventBus.on(EVENTS.CART_REMOVE, (productId) => {
    cart = cart.filter(p => p.id !== productId);
    save();
  });

  // 3. Toggle Sidebar UI
  EventBus.on(EVENTS.CART_TOGGLE, (action) => {
    const sidebar = document.getElementById('cartSidebar');
    if (!sidebar) return;
    
    if (action === 'open') sidebar.classList.add('active');
    else if (action === 'close') sidebar.classList.remove('active');
    else sidebar.classList.toggle('active');
  });

  // --- HELPERS ---
  function save() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartUI(cart);
  }

  function updateCartUI(currentCart) {
    const badge = document.getElementById('cart-badge');
    const itemsContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('cart-checkout-btn');
  if (checkoutBtn) {
    if (currentCart.length === 0) {
      checkoutBtn.disabled = true;
    } else {
      checkoutBtn.disabled = false;
      // For single item, use direct checkout
      if (currentCart.length === 1) {
        checkoutBtn.setAttribute('data-trigger', 'checkout:init');
        checkoutBtn.setAttribute('data-payload', currentCart[0].checkout + '?embed=1');
      } else {
        checkoutBtn.setAttribute('data-trigger', 'checkout:init');
        checkoutBtn.setAttribute('data-payload', 'YOUR_BUNDLE_CHECKOUT_URL?embed=1');
      }
    }
  }
    if (badge) {
      badge.textContent = currentCart.length;
      badge.classList.toggle('visible', currentCart.length > 0);
    }

    if (itemsContainer) {
      if (currentCart.length === 0) {
        itemsContainer.innerHTML = `<p class="text-center text-faded text-sm" style="margin-top: 50px;">Your cart is empty.</p>`;
      } else {
        itemsContainer.innerHTML = currentCart.map(p => `
          <div class="flex-between" style="border-bottom: 1px solid var(--color-border); padding-bottom: 10px;">
            <div class="flex-row gap-md">
              <img src="${p.image}" style="width: 40px; height: 40px; object-fit: contain; background: var(--color-sage); border-radius: 6px;">
              <div>
                <div class="text-xs text-bold text-upper">${p.title}</div>
                <div class="text-xs text-faded">${p.price}</div>
              </div>
            </div>
            <button class="nav-icon" style="color: var(--color-error)" data-trigger="${EVENTS.CART_REMOVE}" data-payload="${p.id}">✕</button>
          </div>
        `).join('');
      }
    }

    if (totalEl) {
      const total = currentCart.reduce((acc, item) => {
        const val = parseFloat(item.price.replace(/[£,$]/g, ''));
        return acc + val;
      }, 0);
      totalEl.textContent = `£${total.toFixed(2)}`;
    }
  }
}
