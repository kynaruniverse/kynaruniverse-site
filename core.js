/**
 * ══════════════════════════════════════════════════════════════════════════
 * MODULE: KYNAR MARKETPLACE CORE (V1.4 - MASTER SYNC)
 * ══════════════════════════════════════════════════════════════════════════
 * @description The central brain of Kynar. Manages component loading, 
 * left/right drawer exclusivity, and global event delegation.
 */

const KynarCore = {
  // 1. COMPONENT LOADER: Fetches HTML fragments (header, modals, etc.)
  async loadComponents() {
    const elements = document.querySelectorAll("[data-include]");
    const promises = Array.from(elements).map(async (el) => {
      const file = el.dataset.include;
      try {
        const response = await fetch(file);
        if (response.ok) {
          const html = await response.text();
          el.innerHTML = html;
          this.executeScripts(el);
          
          // Dispatch signals for other modules (like Cart) to sync
          if (file.includes("header")) document.dispatchEvent(new Event("KynarHeaderLoaded"));
          if (file.includes("modals")) document.dispatchEvent(new Event("KynarModalsLoaded"));
        }
      } catch (err) {
        console.error(`Kynar Core: Error loading ${file}`, err);
      }
    });
    await Promise.all(promises);
  },

  // Re-initializes <script> tags found inside loaded HTML fragments
  executeScripts(container) {
    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  },

  // 2. GLOBAL INTERACTION ENGINE: Listens for all clicks on the document
  initInteractions() {
    document.body.addEventListener("click", (e) => {
      
      // --- A. NAVIGATION DRAWER (LEFT SIDE) ---
      if (e.target.closest("#nav-toggle")) {
        // Ensure the Cart is closed before opening Menu
        if (window.KynarCart) window.KynarCart.closeDrawer();
        this.toggleMenu(true);
      }
      if (e.target.closest("#close-nav") || e.target.id === "nav-backdrop") {
        this.toggleMenu(false);
      }

      // --- B. AUTHENTICATION MODALS ---
      if (e.target.closest(".trigger-access")) {
        e.preventDefault();
        // Close all drawers before opening Auth Modal
        this.toggleMenu(false); 
        if (window.KynarCart) window.KynarCart.closeDrawer();
        this.openAuthModal();
      }
      const overlay = document.getElementById("modal-overlay");
      if (e.target === overlay || e.target.id === "close-access") {
        this.closeAuthModal();
      }

      // --- C. CART DRAWER (RIGHT SIDE) ---
      if (e.target.closest("#cart-trigger")) {
        e.preventDefault();
        // Ensure the Nav Menu is closed before opening Cart
        this.toggleMenu(false); 
        if (window.KynarCart) window.KynarCart.openDrawer();
      }
      
      // Specifically listen for the Cart Close elements in modals.html
      if (e.target.closest("#close-drawer") || e.target.id === "cart-drawer-backdrop") {
        if (window.KynarCart) window.KynarCart.closeDrawer();
      }
    });

    // Smart Header Logic: Hides on scroll down, reveals on scroll up
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.app-header');
      // Do not hide the header if any drawer or modal is open (Scroll Lock active)
      if (!header || document.body.style.overflow === "hidden") return;
      
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
      lastScrollY = window.scrollY;
    }, { passive: true });
  },

  // 3. UI STATE CONTROLLERS
  toggleMenu(isOpen) {
    const drawer = document.getElementById("nav-drawer");
    const backdrop = document.getElementById("nav-backdrop");
    if (!drawer) return;

    if (isOpen) {
      drawer.classList.add("is-open");
      if (backdrop) backdrop.classList.add("is-visible");
      document.body.style.overflow = "hidden"; // Lock page scroll
    } else {
      drawer.classList.remove("is-open");
      if (backdrop) backdrop.classList.remove("is-visible");
      document.body.style.overflow = ""; // Release page scroll
    }
  },

  openAuthModal() {
    const overlay = document.getElementById("modal-overlay");
    if (overlay) {
      overlay.classList.add("is-visible");
      document.body.style.overflow = "hidden";
      if (window.Haptics) window.Haptics.medium();
    }
  },

  closeAuthModal() {
    const overlay = document.getElementById("modal-overlay");
    if (overlay) {
      overlay.classList.remove("is-visible");
      document.body.style.overflow = "";
    }
  }
};

// 4. INITIALIZATION SEQUENCE
document.addEventListener("DOMContentLoaded", async () => {
  // First, fetch and inject HTML fragments
  await KynarCore.loadComponents();
  
  // Second, activate the global interaction listeners
  KynarCore.initInteractions();

  // Create and initialize the visual scroll progress indicator
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-indicator';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    if (progressBar) progressBar.style.width = scrolled + "%";
  }, { passive: true });
});

// Export to Global Window Object
window.KynarCore = KynarCore;
