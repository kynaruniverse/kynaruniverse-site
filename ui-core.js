/* ==========================================================================
   KYNAR ENGINE v9.1 | INDUSTRIAL CORE (SAFETY PATCHED)
   ========================================================================== */
import { EventBus, EVENTS } from './src/core/events.js';
import { Logger } from './src/core/logger.js';
import { initCart } from './src/modules/cart.js';
import { initCheckout } from './src/modules/checkout.js';

/* --- BOOT SEQUENCE --- */
document.addEventListener("DOMContentLoaded", async () => {
  Logger.log("System: Engine Booting...");

  try {
    // 1. Initialize Sync Core
    initTheme();
    initCheckout();
    
    // 2. Load UI Shell (Critical Path) with Error Handling
    await Promise.all([
      loadComponent('global-header', 'components/header.html'),
      injectOverlays() 
    ]);

    // 3. Initialize UI-Dependent Modules
    initCart();
    initUIHandlers();
    
    // Non-critical load (don't await)
    loadComponent('global-footer', 'components/footer.html'); 

  } catch (err) {
    console.error("CRITICAL SYSTEM FAILURE:", err);
    // Emergency Fallback: If overlays fail, force show content so site isn't blank
    document.querySelectorAll('.reveal-up').forEach(el => el.classList.add('reveal-visible'));
  }

  // 4. Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .catch(err => console.error('SW Failed:', err));
  }
  
  Logger.log("System: Engine Online");
});

/* --- GLOBAL EVENT DELEGATION --- */
document.body.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-trigger]');
  if (trigger) {
    if (trigger.tagName !== 'A' || trigger.dataset.trigger.includes('prevent')) {
       e.preventDefault();
    }
    const action = trigger.dataset.trigger;
    const payload = trigger.dataset.payload;
    if (navigator.vibrate) navigator.vibrate(10);
    EventBus.emit(action, payload);
  }
});

/* --- UI HANDLERS --- */
function initUIHandlers() {
  EventBus.on(EVENTS.MENU_TOGGLE, () => {
    document.getElementById('navOverlay')?.classList.toggle('active');
  });

  EventBus.on(EVENTS.SEARCH_TOGGLE, () => {
    const el = document.getElementById('searchOverlay');
    if(el) {
      el.classList.toggle('active');
      if (el.classList.contains('active')) setTimeout(() => el.querySelector('input').focus(), 100);
    }
  });

  EventBus.on(EVENTS.THEME_TOGGLE, () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('kynar_theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });
  
  EventBus.on(EVENTS.MODAL_OPEN, (id) => window.location.href = `product.html?id=${id}`);
}

/* --- UTILITIES --- */
function initTheme() {
  const theme = localStorage.getItem('kynar_theme');
  if (theme === 'dark') document.body.classList.add('dark-mode');
}

async function injectOverlays() {
  try {
    const res = await fetch('components/overlays.html');
    if (!res.ok) throw new Error(`HTTP ${res.status} - File not found`);
    const html = await res.text();
    document.body.insertAdjacentHTML('beforeend', html);
  } catch (err) {
    console.error("Overlay Injection Failed:", err);
    // If missing, we still want the site to work, just without the cart sidebar
  }
}

async function loadComponent(elementId, path) {
  const el = document.getElementById(elementId);
  if (!el) return;
  try {
    const res = await fetch(path);
    if (res.ok) el.innerHTML = await res.text();
  } catch (err) {
    console.error(`Failed to load ${path}`, err);
  }
}
