const CACHE_NAME = 'grade-calculator-cache-v6';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json?v=3',
  '/LOGO.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/X_Calculator/Grade_Calculator/Universal_Calculator.html',
  '/X_Calculator/Grade_Calculator/about.html',
  '/X_Calculator/Grade_Calculator/Universal_Calculator.js',
  '/X_Calculator/Grade_Calculator/Grade.css',
  '/X_Calculator/CGPA_Calculator/CGPA.html',
  '/X_Calculator/CGPA_Calculator/CGPA_Result.html'
];

// Install: pre-cache all core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => console.error('Cache addAll failed:', err))
  );
  self.skipWaiting();
});

// Activate: clear out any old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first for HTML, cache-first for everything else
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET requests; skip cross-origin requests (CDNs, fonts, etc.)
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // For same-origin HTML requests: network-first with cache fallback
  const acceptHeader = request.headers.get('Accept') || '';
  if (isSameOrigin && acceptHeader.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request).then(r => r || caches.match('/X_Calculator/Grade_Calculator/Universal_Calculator.html')))
    );
    return;
  }

  // For all other same-origin requests: cache-first with network fallback
  if (isSameOrigin) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // For cross-origin (fonts, CDN icons), just fetch normally
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});
