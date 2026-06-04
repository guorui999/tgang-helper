const CACHE_NAME = 'tgang-helper-v1';
const STATIC_CACHE = 'tgang-helper-static-v1';

// Assets to precache on install
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/icons/192.png',
  '/icons/512.png',
];

// Install — precache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== STATIC_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch — network-first for pages, cache-first for static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET, cross-origin, and browser extensions
  if (request.method !== 'GET' || !url.origin.startsWith('http')) return;

  // For static assets (icons, wasm, models) — cache-first
  if (/\.(png|jpg|jpeg|gif|svg|webp|ico|wasm|task|js|css)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // For navigation (HTML pages) — network-first
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Everything else — network-first
  event.respondWith(networkFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Offline fallback for navigation
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    return new Response('Offline', { status: 503 });
  }
}
