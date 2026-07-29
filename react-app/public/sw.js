const CACHE_NAME = 'grade-calc-pwa-v12';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/LOGO.png',
  '/favicon.svg'
];

// Install: pre-cache shell assets & skip waiting
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => console.warn('Pre-cache warning:', err));
    })
  );
});

// Activate: delete all old caches immediately & claim clients
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for navigation & assets, fallback to cache
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // HTML / Navigation requests -> Always network-first so new bundle hashes load
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put('/index.html', copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match('/index.html').then(cached => cached || caches.match('/'));
        })
    );
    return;
  }

  // Assets (JS, CSS, Images, SVGs) -> Network-first, fallback to cache
  event.respondWith(
    fetch(request)
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});
