// Service worker: caches every file on first visit so the exhibit runs offline.
// Bump CACHE_VERSION whenever files are added or renamed.
const CACHE_VERSION = 'blm-v4';

const FILES = [
  './',
  'index.html',
  'detail.html',
  'manifest.webmanifest',
  'css/bootstrap.min.css',
  'css/styles.css',
  'js/data.js',
  'js/index.js',
  'js/detail.js',
  'js/app.js',
  'icons/icon-180.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Serve from the cache first (works offline). When the network is available,
// refresh the cached copy in the background so data updates arrive on the
// next launch.
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_VERSION).then(async cache => {
      // detail.html?mode=...&name=... is the same file for every person.
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req)
        .then(res => {
          if (res && res.ok) {
            const url = new URL(req.url);
            url.search = '';
            cache.put(url.toString(), res.clone());
          }
          return res;
        })
        .catch(() => undefined);

      if (cached) {
        event.waitUntil(network);
        return cached;
      }
      const res = await network;
      return res || cache.match('index.html');
    })
  );
});
