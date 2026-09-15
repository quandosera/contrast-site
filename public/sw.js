// public/sw.js - n8v Service Worker
const CACHE_NAME = 'n8v-static-v1';

const PRECACHE_ASSETS = [
    '/',
    '/favicon.ico',
    '/images/n8v.png',
    '/images/noise.svg',
    '/site.webmanifest',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/apple-touch-icon.png'
];

// Install: Pre-cache core offline assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                console.warn('[n8v SW] Pre-cache warning:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// Activate: Purge old cache versions
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Smart routing with explicit stream bypass
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // 1. NEVER INTERCEPT OR CACHE AUDIO STREAMS, SSE, OR LIVE APIS
    if (
        request.method !== 'GET' ||
        url.hostname.includes('radio.n8v.uk') ||
        url.pathname.includes('/listen') ||
        url.pathname.includes('/sse') ||
        url.pathname.endsWith('.mp3') ||
        url.pathname.includes('/api/') ||
        url.protocol.startsWith('chrome-extension')
    ) {
        return; // Direct network pass-through
    }

    // 2. HTML Page Navigations: Network-First (Fresh SSR with offline fallback)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse.ok) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    const cachedResponse = await caches.match(request);
                    if (cachedResponse) return cachedResponse;
                    const homeFallback = await caches.match('/');
                    return homeFallback || new Response('Offline - n8v Radio', {
                        status: 503,
                        headers: { 'Content-Type': 'text/plain' }
                    });
                })
        );
        return;
    }

    // 3. Static Assets: Cache-First with Background Revalidation
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return networkResponse;
                })
                .catch(() => cachedResponse);

            return cachedResponse || fetchPromise;
        })
    );
});
