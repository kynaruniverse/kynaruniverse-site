/* ==========================================================================
   MODULE | WIRELESS CHECKOUT BRIDGE
   Description: Manages Lemon Squeezy Overlay & Dynamic Script Loading
   ========================================================================== */
import { EventBus, EVENTS } from '../core/events.js';

export function initCheckout() {
  EventBus.on(EVENTS.CHECKOUT_INIT, (url) => {
    if (!url || url === '#') {
      console.warn('[CHECKOUT] No valid URL provided');
      // Show user feedback
      const toast = document.createElement('div');
      toast.className = 'activity-toast visible';
      toast.innerHTML = `
        <span style="font-size: 1.5rem;">⚠️</span>
        <span class="text-bold text-xs">Product not yet available</span>
      `;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 600);
      }, 3000);
      return;
    }

    Logger.log(`[CHECKOUT] Initializing Overlay: ${url}`);
    if (navigator.vibrate) navigator.vibrate([10, 50, 10]);

    loadLemonSqueezy().then(() => {
      if (window.LemonSqueezy) {
        window.LemonSqueezy.Url.Open(url);
      } else {
        window.location.href = url;
      }
    }).catch((err) => {
      console.error('[CHECKOUT] Failed to load:', err);
      window.location.href = url; // Fallback
    });
  });
}

// --- INTERNAL HELPER: Lazy Load Script ---
let scriptLoaded = false;

function loadLemonSqueezy() {
  return new Promise((resolve, reject) => {
    if (scriptLoaded) return resolve();
    if (document.querySelector('script[src*="lemon.js"]')) {
      scriptLoaded = true;
      return resolve();
    }

    const script = document.createElement('script');
    script.src = 'https://assets.lemonsqueezy.com/lemon.js';
    script.defer = true;
    
    script.onload = () => {
      Logger.log('[SYSTEM] Lemon Squeezy Secured');
      scriptLoaded = true;
      // Initialize LS Settings
      if (window.LemonSqueezy) {
        window.LemonSqueezy.Setup({
          eventHandler: (event) => {
             // Optional: Listen for 'Checkout.Success' here to clear cart
             if (event.event === 'Checkout.Success') {
                localStorage.removeItem('kynar_cart');
                window.location.href = 'success.html?type=order';
             }
          }
        });
      }
      resolve();
    };
    
    script.onerror = reject;
    document.head.appendChild(script);
  });
}
