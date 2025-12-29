/**
 * ══════════════════════════════════════════════════════════════════════════
 * MODULE: KYNAR MARKETPLACE CORE (V2.1 - SUPABASE INTEGRATED)
 * ══════════════════════════════════════════════════════════════════════════
 * @description The central nervous system. Manages component injection,
 * global drawer physics, scroll interactions, and Auth Modals.
 */

const KynarCore = {
  
  // 1. COMPONENT LOADER: Fetches HTML fragments (header, footer, etc.)
  async loadComponents() {
    const elements = document.querySelectorAll("[data-include]");
    const promises = Array.from(elements).map(async (el) => {
      const file = el.dataset.include;
      try {
        const response = await fetch(file);
        if (response.ok) {
          const html = await response.text();
          el.innerHTML = html;
          this.executeScripts(el); // Re-run any scripts inside the fetched HTML
          
          // Dispatch Signal: "Header is ready, attach listeners now"
          if (file.includes("header")) document.dispatchEvent(new Event("KynarHeaderLoaded"));
          if (file.includes("modals")) document.dispatchEvent(new Event("KynarModalsLoaded"));
        }
      } catch (err) {
        console.error(`Kynar Core: Error loading ${file}`, err);
      }
    });
    await Promise.all(promises);
  },

  // Helper: Re-initializes <script> tags found inside loaded HTML
  executeScripts(container) {
    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  },

  // 2. DRAWER & INTERFACE PHYSICS
  initInterface() {
    const overlay = document.getElementById('interface-overlay');
    const navDrawer = document.getElementById('nav-drawer');
    const cartDrawer = document.getElementById('cart-drawer');

    // -- DEFINE GLOBAL FUNCTIONS (Accessible by HTML onclick="") --

    // A. Toggle Navigation
    window.toggleNav = function() {
      if (!navDrawer) return;
      const isActive = navDrawer.classList.contains('active');
      window.closeAllDrawers(); // Close Cart if open
      
      if (!isActive) {
        navDrawer.classList.add('active');
        if(overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock Scroll
      }
    };

    // B. Toggle Cart
    window.toggleCart = function() {
      if (!cartDrawer) return;
      const isActive = cartDrawer.classList.contains('active');
      window.closeAllDrawers(); // Close Nav if open
      
      if (!isActive) {
        cartDrawer.classList.add('active');
        if(overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock Scroll
      }
    };

    // C. Master Close
    window.closeAllDrawers = function() {
      if(navDrawer) navDrawer.classList.remove('active');
      if(cartDrawer) cartDrawer.classList.remove('active');
      
      // Close Modals too
      const activeModal = document.querySelector('.auth-modal.active');
      if(activeModal) activeModal.classList.remove('active');
      
      if(overlay) overlay.classList.remove('active');
      document.body.style.overflow = ''; // Release Scroll
    };

    // -- EVENT LISTENERS --
    
    // Close when clicking the dark overlay
    if(overlay) {
      overlay.addEventListener('click', window.closeAllDrawers);
    }

    // Close on Escape Key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') window.closeAllDrawers();
    });
  },

  // 3. SCROLL INTELLIGENCE
  initScrollEffects() {
    // A. Scroll Progress Bar
    let progressBar = document.getElementById('scroll-indicator');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'scroll-indicator';
        document.body.appendChild(progressBar);
    }

    // B. Header Hide/Show Logic
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      // 1. Update Progress Bar
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      if (progressBar) progressBar.style.width = scrolled + "%";

      // 2. Smart Header (Hide on Scroll Down)
      const header = document.querySelector('.app-header');
      if (!header || document.body.style.overflow === "hidden") return;

      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        header.classList.add('header-hidden');
      } else {
        header.classList.remove('header-hidden');
      }
      lastScrollY = window.scrollY;
    }, { passive: true });
  },

  // 4. MODAL MANAGER (Required for Auth)
  openAuthModal(type = 'login') {
    window.closeAllDrawers(); // Close nav/cart first
    
    // We expect modals.html to have injected a div with id="auth-modal"
    const modal = document.getElementById('auth-modal');
    const overlay = document.getElementById('interface-overlay');
    
    if (modal && overlay) {
      modal.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Switch tab based on type ('login' or 'register')
      const loginTab = document.getElementById('tab-login');
      const regTab = document.getElementById('tab-register');
      const loginForm = document.getElementById('login-form');
      const regForm = document.getElementById('register-form');

      if (type === 'register' && regTab && loginTab) {
          regTab.click(); // Simulate click on register tab
      } else if (loginTab) {
          loginTab.click(); // Default to login
      }
    } else {
      console.warn("Auth Modal not found in DOM yet.");
    }
  },

  closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    const overlay = document.getElementById('interface-overlay');
    
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// 5. IGNITION SEQUENCE
document.addEventListener("DOMContentLoaded", async () => {
  // Step 1: inject the HTML (Header, Footer, Modals)
  await KynarCore.loadComponents();
  
  // Step 2: Initialize the Drawers (Now that elements exist)
  KynarCore.initInterface();

  // Step 3: Start Scroll Effects
  KynarCore.initScrollEffects();
  
  console.log("VisualForge System: Kynar Core V2.1 Online");
});

// Export Global
window.KynarCore = KynarCore;
