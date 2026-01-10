/* service-worker.js - Kinetic Vitro Engine v2.0 */

const CACHE_NAME = 'kynar-core-v2.5';
const IMAGE_CACHE = 'kynar-images-v1.0';

// 1. Expanded Asset List for Full Offline Sector Support
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/shop-tech.html',
    '/shop-life.html',
    '/shop-family.html',
    '/hub.html',
    '/about.html',
    '/404.html',
    '/css/tokens.css',
    '/css/base.css',
    '/css/components.css',
    '/css/pages.css',
    '/js/main.js',
    '/js/search-index.js',
    '/assets/images/favicon.ico',
    '/assets/images/icon-192.png',
    '/assets/images/icon-512.png'
];

// 2. INSTALL: Deep Cache
self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// 3. ACTIVATE: Cleanup and "Secure" Handshake
self.addEventListener('activate', (evt) => {
    evt.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME && key !== IMAGE_CACHE)
                    .map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// 4. FETCH: Intelligent Routing
self.addEventListener('fetch', (evt) => {
    const { request } = evt;
    const url = new URL(request.url);

    // STRATEGY A: Navigation (HTML) -> Network First, Fallback to Cache
    if (request.mode === 'navigate') {
        evt.respondWith(
            fetch(request).catch(() => caches.match(url.pathname) || caches.match('/index.html'))
        );
        return;
    }

    // STRATEGY B: Images -> Cache First, then Stale-While-Revalidate
    if (request.destination === 'image') {
        evt.respondWith(
            caches.open(IMAGE_CACHE).then((cache) => {
                return cache.match(request).then((cached) => {
                    const fetched = fetch(request).then((networkResponse) => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });
                    return cached || fetched;
                });
            })
        );
        return;
    }

    // STRATEGY C: Core Assets (CSS/JS) -> Cache First
    evt.respondWith(
        caches.match(request).then((cached) => cached || fetch(request))
    );
});

// 5. SECURE STATUS HANDSHAKE: Listen for UI pings
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CHECK_SECURE_STATUS') {
        event.ports[0].postMessage({ status: 'SECURE_CONNECTION_ACTIVE' });
    }
});
