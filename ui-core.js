/* ==========================================================================
   KYNAR ENGINE v8.0 | INDUSTRIAL CORE
   Architecture: Modules -> Event Bus -> Global Delegation
   ========================================================================== */

import { EventBus, EVENTS } from './src/core/events.js';
import { initCart } from './src/modules/cart.js';
import { initCheckout } from './src/modules/checkout.js';

/* --- BOOT SEQUENCE --- */
document.addEventListener("DOMContentLoaded", () => {
  console.log("System: Engine Online");

  // 1. Initialize Modules
  initTheme();
  initCart();
  initCheckout();
  initUIHandlers();
  
  // 2. Load Partials (Header/Footer)
  loadComponent('global-header', 'components/header.html');
  loadComponent('global-footer', 'components/footer.html');

  // 3. Register Service Worker (Scale)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('System: Service Worker Secured'))
      .catch(err => console.log('System: SW Failed', err));
  }
});

/* --- GLOBAL EVENT DELEGATION (The "Wireless" System) --- */
document.body.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-trigger]');
  
  if (trigger) {
    if (trigger.tagName === 'A' && !trigger.dataset.trigger.includes('checkout')) {
    } else {
       e.preventDefault();
    }
    
    const action = trigger.dataset.trigger;
    const payload = trigger.dataset.payload;

    if (navigator.vibrate) navigator.vibrate(10);

    console.log(`[ENGINE] Signal: ${action} >> ${payload || 'void'}`);
    EventBus.emit(action, payload);
    return;
  }
});


/* --- UI HANDLERS --- */
function initUIHandlers() {
  EventBus.on(EVENTS.MENU_TOGGLE, () => {
    const el = document.getElementById('navOverlay');
    if(el) el.classList.toggle('active');
  });

  EventBus.on(EVENTS.SEARCH_TOGGLE, () => {
    const el = document.getElementById('searchOverlay');
    if(el) {
      el.classList.toggle('active');
      if (el.classList.contains('active')) el.querySelector('input').focus();
    }
  });

  EventBus.on(EVENTS.THEME_TOGGLE, () => {
    document.body.classList.toggle('dark-mode');
    const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('kynar_theme', current);
  });
  
  EventBus.on(EVENTS.MODAL_OPEN, (id) => {
    window.location.href = `product.html?id=${id}`;
  });
}

/* --- UTILITIES --- */
function initTheme() {
  const theme = localStorage.getItem('kynar_theme') || 'light';
  if (theme === 'dark') document.body.classList.add('dark-mode');
}

async function loadComponent(elementId, path) {
  const el = document.getElementById(elementId);
  if (!el) return;
  try {
    const res = await fetch(path);
    if (res.ok) {
      el.innerHTML = await res.text();
      if(path.includes('header')) EventBus.emit('ui:header_loaded');
    }
  } catch (err) {
    console.error(`Failed to load ${path}`, err);
  }
}