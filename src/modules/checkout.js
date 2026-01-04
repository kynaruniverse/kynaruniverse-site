/* ==========================================================================
   MODULE | WIRELESS CHECKOUT BRIDGE
   Description: Manages Lemon Squeezy Overlay & Dynamic Script Loading
   ========================================================================== */
import { EventBus, EVENTS } from '../core/events.js';

export function initCheckout() {
  
  // 1. Listen for Checkout Signal
  EventBus.on(EVENTS.CHECKOUT_INIT, (url) => {
    if (!url || url === '#') {
      console.warn('[CHECKOUT] No valid URL provided');
      return;
    }

    console.log(`[CHECKOUT] Initializing Overlay: ${url}`);
    
    // Haptic Feedback
    if (navigator.vibrate) navigator.vibrate([10, 50, 10]);

    // Ensure Library is Loaded, then Open
    loadLemonSqueezy().then(() => {
      if (window.LemonSqueezy) {
        window.LemonSqueezy.Url.Open(url);
      } else {
        // Fallback if overlay fails
        window.location.href = url;
      }
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
      console.log('[SYSTEM] Lemon Squeezy Secured');
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
