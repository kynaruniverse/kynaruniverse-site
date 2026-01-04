/* ==========================================================================
   SERVICE WORKER | KYNAR V9.0 INDUSTRIAL
   Strategy: Stale-While-Revalidate (Mobile First)
   ========================================================================== */

const CACHE_NAME = 'kynar-v9.0-industrial'; // BUMPED TO V9.0
const ASSETS = [
  '/',
  '/index.html',
  '/shop.html',
  '/product.html',
  '/styles.css',
  '/ui-core.js',
  '/src/data/vault.js',
  '/src/core/events.js',
  '/src/core/logger.js',
  '/src/modules/cart.js',
  '/src/modules/checkout.js',
  '/components/header.html',
  '/components/footer.html',
  '/components/overlays.html', // CRITICAL: New file added
  '/components/ProductCard.js',
  '/components/ProductDetail.js',
  '/assets/fonts/Bantayog.woff2',
  '/assets/fonts/GlacialIndifferenceRegular.woff2'
];

self.addEventListener('install', (e) => {
  // Force new service worker to take control immediately
  self.skipWaiting(); 
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  // Clean up old caches (v7.0, v7.5, etc.)
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Strategy: Network First for HTML (to get fresh content/prices), Cache First for Assets
  if (e.request.destination === 'document') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((res) => res || fetch(e.request))
    );
  }
});

