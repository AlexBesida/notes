const cacheName = 'f-notes-v1';
const staticAssets = [
  './',
  './index.html',
  './FluxUI.css',
  './main.css',
  './main.js',
  './Assets/AppIcon.ico',
  './Assets/AppIcon.png',
  './Assets/AppIcon512.png',
  './Assets/AppIconWhite.svg',
  './Fonts/GoogleSans-Medium.ttf',
  './Fonts/GoogleSans-Regular.ttf',
  './Fonts/GoogleSans-Bold.ttf',
  './JS/buttons.js',
  './JS/firestore.js'
];

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}