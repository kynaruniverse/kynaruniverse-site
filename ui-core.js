/* ══════════════════════════════════════════════════════════════════════════
   KYNAR UI CORE (V6.5 - Legal & Success Sync)
   ══════════════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Critical Component Load
  await Promise.all([loadHeader(), loadFooter()]);

  // 2. Data Handshake
  if (typeof VAULT === 'undefined') {
    try {
      const module = await import('./vault.js');
      window.VAULT = module.VAULT;
    } catch (e) { console.warn("Vault Sync Failed: Fallback to global."); }
  }

  // 3. System Initialization
  initSmoothScroll();
  initStudioHaptics();
  initMobileStickyCTA();
  initSearchEngine(); 

  // 4. State Sync & Success Page Detection
  applyPreLaunchStatus();
  handleSuccessLogic(); // NEW: Specific messaging for Legal/Support/Newsletter
  
  console.log("Kynar Engine V6.5: Fully Synchronised");
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
    initThemeEngine();
    initMenuLogic();
    initSearchEngine(); 
  } catch (err) { console.error("Header Error:", err); }
}

async function loadFooter() {
  const footerEl = document.getElementById("global-footer");
  if (!footerEl) return;
  try {
    const response = await fetch("components/footer.html");
    footerEl.innerHTML = await response.text();
  } catch (err) { console.error("Footer Error:", err); }
}

/* ══════════════════════════════════════════════════════════════════════════
   SUCCESS HUB LOGIC (Dynamic URL Detection)
   ══════════════════════════════════════════════════════════════════════════ */

function handleSuccessLogic() {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");
  const label = document.getElementById("success-label");
  const text = document.getElementById("success-text");

  if (!label || !text) return;

  const successTypes = {
    newsletter: { label: "Signal Verified", text: "Welcome to the Community. Your access to the Archive is now active." },
    support: { label: "Dispatch Received", text: "Our concierge team has received your inquiry. Expect a response within 12 hours." },
    legal: { label: "Protocol Accepted", text: "Your query regarding our Legal Archive has been successfully logged." }
  };

  if (successTypes[type]) {
    label.textContent = successTypes[type].label;
    text.textContent = successTypes[type].text;
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   SEARCH & INTERACTION
   ══════════════════════════════════════════════════════════════════════════ */

function initSearchEngine() {
  const searchTrigger = document.getElementById('searchTrigger');
  if (!searchTrigger || document.getElementById('searchOverlay')) return;

  searchTrigger.onclick = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    const searchHTML = `
      <div id="searchOverlay" class="nav-overlay active" style="padding: 20px; display: flex; flex-direction: column; justify-content: flex-start; background: var(--bg-bone);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
          <span style="font-family: var(--font-display); font-size: 1.2rem; color: var(--accent-gold);">Archive Search</span>
          <button id="closeSearch" class="nav-icon" style="font-weight: 800; font-size: 1.5rem;">✕</button>
        </div>
        <input type="text" id="searchInput" placeholder="Find tools, kits, or archives..." 
               style="width: 100%; padding: 20px; border-radius: 15px; border: 1.5px solid var(--ink-deep); background: var(--bg-surface); font-family: var(--font-body); font-size: 1.1rem; outline: none;">
        <div id="searchResults" style="margin-top: 30px; display: grid; gap: 12px; overflow-y: auto; max-height: 70vh;"></div>
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
        <a href="product.html?id=${p.id}" style="text-decoration: none; background: var(--bg-surface); padding: 12px; border-radius: 12px; display: flex; align-items: center; gap: 15px; border: 1px solid rgba(0,0,0,0.05);">
          <div style="width: 45px; height: 45px; background: ${p.bg}; border-radius: 8px; flex-shrink: 0;"></div>
          <div>
            <div style="font-weight: 700; color: var(--ink-deep); font-size: 0.95rem;">${p.title}</div>
            <div style="font-size: 0.7rem; color: var(--accent-gold); text-transform: uppercase;">${p.tag}</div>
          </div>
        </a>`).join('');
    };

    document.getElementById('closeSearch').onclick = () => {
      document.getElementById('searchOverlay').remove();
      document.body.style.overflow = '';
    };
  };
}

function initMenuLogic() {
  const trigger = document.querySelector('.nav-icon[aria-label="Menu"]');
  const nav = document.getElementById("navOverlay");
  if (trigger && nav) {
    trigger.onclick = () => { nav.classList.add("active"); document.body.style.overflow = "hidden"; };
    document.getElementById("closeMenu").onclick = () => { nav.classList.remove("active"); document.body.style.overflow = ""; };
  }
}

function initStudioHaptics() {
  if (!("ontouchstart" in window) || !navigator.vibrate) return;
  document.body.addEventListener("touchstart", (e) => {
    if (e.target.closest(".btn-primary, .btn-ghost, .nav-icon, .filter-chip")) navigator.vibrate(8);
  }, { passive: true });
}

function initMobileStickyCTA() {
  const productTitle = document.querySelector('h1');
  const stickyBar = document.querySelector('.mobile-sticky-cta');
  if (!productTitle || !stickyBar) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => stickyBar.classList.toggle('visible', !entry.isIntersecting));
  }, { threshold: 0 });
  observer.observe(productTitle);
}

function applyPreLaunchStatus() {
  document.querySelectorAll(".product-card").forEach((card) => {
    const link = card.querySelector("a")?.href;
    if (!link || typeof VAULT === 'undefined') return;
    const pid = new URLSearchParams(link.split('?')[1]).get('id');
    const p = VAULT.find(item => item.id === pid);
    if (p?.status === "coming-soon") {
      card.setAttribute("data-status", "coming-soon");
      card.onclick = (e) => {
        e.preventDefault();
        window.location.href = `product.html?id=${pid}`;
      };
    }
  });
}

function initSmoothScroll() {
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
}
