/* ══════════════════════════════════════════════════════════════════════════
   KYNAR UI CORE (V7.0 - Masterpiece Logic)
   Features: Command Center Cart, Fluid State Sync, Proximity Haptics
   ══════════════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Initialise State
  window.KYNAR_STATE = { cart: JSON.parse(localStorage.getItem('kynar_cart')) || [] };

  // 2. Critical Component Load & Handshake
  await Promise.all([loadHeader(), loadFooter(), loadCartSidebar()]);

  // 3. Data Handshake (Global Vault Check)
  if (typeof VAULT === 'undefined') {
    try {
      const module = await import('./vault.js');
      window.VAULT = module.VAULT;
    } catch (e) { console.warn("Vault Offline: Running in isolated mode."); }
  }

  // 4. Engine Boot Sequence
  initSmoothScroll();
  initStudioHaptics();
  initSearchEngine(); 
  initCartEngine();

  // 5. Layout & Experience Services
  initMobileStickyCTA();
  applyPreLaunchStatus();
  handleSuccessLogic();
  
  console.log("Kynar Engine V7.0: Masterpiece Mode Active");
});

/* ══════════════════════════════════════════════════════════════════════════
   COMPONENT INJECTORS
   ══════════════════════════════════════════════════════════════════════════ */

async function loadHeader() {
  const headerEl = document.getElementById("global-header");
  if (!headerEl) return;
  try {
    const response = await fetch("components/header.html");
    headerEl.innerHTML = await response.text();
    
    // Bind logic specifically after HTML injection
    initMenuLogic();
    initSearchEngine(); 
    initThemeEngine();
  } catch (err) { console.error("Header Fault:", err); }
}


async function loadFooter() {
  const footerEl = document.getElementById("global-footer");
  if (!footerEl) return;
  try {
    const response = await fetch("components/footer.html");
    footerEl.innerHTML = await response.text();
  } catch (err) { console.error("Footer Fault:", err); }
}

async function loadCartSidebar() {
  // Inject the Master Cart Sidebar if it doesn't exist
  if (document.getElementById('cartSidebar')) return;
  const cartHTML = `
    <div id="cartSidebar" class="cart-sidebar">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
        <h2 style="font-family: var(--font-display); font-size: 1.5rem;">Command Center</h2>
        <button onclick="toggleCart('close')" class="nav-icon" style="font-size: 1.5rem;">✕</button>
      </div>
      <div id="cartList" style="flex-grow: 1; overflow-y: auto;"></div>
      <div class="cart-footer">
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <span style="opacity: 0.5; font-weight: 800; font-size: 0.7rem; letter-spacing: 0.1em;">TOTAL INVESTMENT</span>
          <span id="cartTotal" style="font-family: var(--font-display); font-size: 1.4rem;">£0.00</span>
        </div>
        <button class="checkout-btn" onclick="initiateCheckout()">Authorize Download <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', cartHTML);
}

/* ══════════════════════════════════════════════════════════════════════════
   MASTER CART LOGIC
   ══════════════════════════════════════════════════════════════════════════ */

function initCartEngine() {
  window.toggleCart = (state) => {
    const sidebar = document.getElementById('cartSidebar');
    if (!sidebar) return;
    const isActive = state === 'open';
    sidebar.classList.toggle('active', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
    if (isActive && navigator.vibrate) navigator.vibrate(10);
  };

  window.addToCart = (productId) => {
    const item = VAULT.find(p => p.id === productId);
    if (item && !window.KYNAR_STATE.cart.find(c => c.id === productId)) {
      window.KYNAR_STATE.cart.push(item);
      syncCart();
      window.toggleCart('open');
      if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
    }
  };

  window.removeFromCart = (id) => {
    window.KYNAR_STATE.cart = window.KYNAR_STATE.cart.filter(item => item.id !== id);
    syncCart();
  };

  function syncCart() {
    localStorage.setItem('kynar_cart', JSON.stringify(window.KYNAR_STATE.cart));
    renderCartUI();
  }

  function renderCartUI() {
    const list = document.getElementById('cartList');
    const badge = document.querySelector('.cart-count-badge');
    const totalEl = document.getElementById('cartTotal');
    if (!list) return;

    badge.textContent = window.KYNAR_STATE.cart.length;
    badge.classList.toggle('visible', window.KYNAR_STATE.cart.length > 0);

    list.innerHTML = window.KYNAR_STATE.cart.length === 0 
      ? '<p style="text-align: center; margin-top: 100px; opacity: 0.4;">Archive is empty.</p>'
      : window.KYNAR_STATE.cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-img" style="background:${item.bg}"><img src="${item.image}" style="width:100%; height:100%; object-fit:contain;"></div>
          <div style="flex-grow:1;">
            <h4 style="font-size:0.9rem; margin-bottom:4px;">${item.title}</h4>
            <span style="font-family:var(--font-display); font-size:1rem;">${item.price}</span>
          </div>
          <button onclick="removeFromCart('${item.id}')" style="background:none; border:none; color:var(--accent-gold); font-weight:800; cursor:pointer;">✕</button>
        </div>`).join('');

    const total = window.KYNAR_STATE.cart.reduce((acc, item) => acc + parseFloat(item.price.replace('£', '')), 0);
    totalEl.textContent = `£${total.toFixed(2)}`;
  }

  renderCartUI();
}

/* ══════════════════════════════════════════════════════════════════════════
   EXPERIENCE & SEARCH
   ══════════════════════════════════════════════════════════════════════════ */

function initSearchEngine() {
  const trigger = document.getElementById('searchTrigger');
  if (!trigger || document.getElementById('searchOverlay')) return;

  trigger.onclick = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    const searchHTML = `
      <div id="searchOverlay" class="nav-overlay active" style="padding: 20px; background: var(--bg-bone);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; width: 100%; max-width: 800px; margin: 0 auto 40px auto;">
          <span style="font-family: var(--font-display); font-size: 1.2rem; color: var(--accent-gold);">Archive Index</span>
          <button id="closeSearch" class="nav-icon" style="font-size: 1.5rem;">✕</button>
        </div>
        <div style="width: 100%; max-width: 800px; margin: 0 auto;">
          <input type="text" id="searchInput" placeholder="Search the archive..." style="width: 100%; padding: 25px; border-radius: 20px; border: 1px solid rgba(0,0,0,0.1); background: var(--bg-surface); font-size: 1.2rem; outline: none; box-shadow: var(--shadow-float);">
          <div id="searchResults" style="margin-top: 30px; display: grid; gap: 15px; overflow-y: auto; max-height: 60vh;"></div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', searchHTML);
    document.body.style.overflow = 'hidden';
    const input = document.getElementById('searchInput');
    input.focus();

    input.oninput = (e) => {
      const query = e.target.value.toLowerCase();
      const results = document.getElementById('searchResults');
      if (query.length < 2) { results.innerHTML = ''; return; }
      const matches = VAULT.filter(p => p.title.toLowerCase().includes(query) || p.tag.toLowerCase().includes(query));
      results.innerHTML = matches.map(p => `
        <a href="product.html?id=${p.id}" class="product-card" style="flex-direction: row; padding: 15px; align-items: center; gap: 20px; text-decoration: none;">
          <div style="width: 60px; height: 60px; background: ${p.bg}; border-radius: 12px; padding: 10px;"><img src="${p.image}" style="width:100%; height:100%; object-fit:contain;"></div>
          <div><h4 style="color:var(--ink-deep); margin:0;">${p.title}</h4><span style="font-size:0.7rem; color:var(--accent-gold); font-weight:800; text-transform:uppercase;">${p.tag}</span></div>
        </a>`).join('');
    };

    document.getElementById('closeSearch').onclick = () => {
      document.getElementById('searchOverlay').remove();
      document.body.style.overflow = '';
    };
  };
}

function initStudioHaptics() {
  if (!("ontouchstart" in window) || !navigator.vibrate) return;
  document.body.addEventListener("touchstart", (e) => {
    if (e.target.closest(".btn-primary, .btn-ghost, .nav-icon, .filter-chip, .product-card")) navigator.vibrate(8);
  }, { passive: true });
}

function initSmoothScroll() {
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({ duration: 1.4, lerp: 0.08, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }
}

function handleSuccessLogic() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");
  const label = document.getElementById("success-label");
  if (!label || !type) return;

  const dictionary = {
    newsletter: "Signal Verified",
    support: "Dispatch Received",
    legal: "Protocol Accepted"
  };

  if (dictionary[type]) {
    label.textContent = dictionary[type];
    if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
  }
}

function initMenuLogic() {
  const trigger = document.getElementById("menuTrigger");
  const nav = document.getElementById("navOverlay");
  if (trigger && nav) {
    trigger.onclick = () => { nav.classList.add("active"); document.body.style.overflow = "hidden"; };
    document.getElementById("closeMenu").onclick = () => { nav.classList.remove("active"); document.body.style.overflow = ""; };
  }
}

function applyPreLaunchStatus() {
  document.querySelectorAll(".product-card").forEach((card) => {
    const link = card.querySelector("a")?.href;
    if (!link || typeof VAULT === 'undefined') return;
    const pid = new URLSearchParams(link.split('?')[1]).get('id');
    const p = VAULT.find(item => item.id === pid);
    if (p?.status === "coming-soon") {
      card.setAttribute("data-status", "coming-soon");
      card.onclick = (e) => { e.preventDefault(); window.location.href = `product.html?id=${pid}`; };
    }
  });
}

function initMobileStickyCTA() {
  const title = document.querySelector('h1');
  const bar = document.querySelector('.mobile-sticky-cta');
  if (!title || !bar) return;
  new IntersectionObserver(([e]) => bar.classList.toggle('visible', !e.isIntersecting)).observe(title);
}

function initThemeEngine() {
  const themeBtn = document.getElementById('themeToggle');
  if (!themeBtn) return;

  // Sync saved preference
  if (localStorage.getItem('kynar_theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

  themeBtn.onclick = () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('kynar_theme', isDark ? 'dark' : 'light');
    if (navigator.vibrate) navigator.vibrate(10);
  };
}
