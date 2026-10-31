const CACHE_NAME = 'galaxy-burgers-pwa-v2';
const STATIC_ASSETS = [
  '/app/',
  '/app/index.html',
  '/app/manifest.json',
  '/app/icon-192.svg',
  '/app/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📱 [Service Worker] Pre-cacheando assets de Galaxy Burgers PWA');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('📱 [Service Worker] Fallo pre-cacheo parcial:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('📱 [Service Worker] Purgando caché obsoleta:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Ignorar peticiones API para que siempre consulten en vivo
  if (event.request.url.includes('/api/')) {
    return;
  }

  // Para navegación (HTML), usar estrategia Network-First para evitar bundles desfasados
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            return cached || caches.match('/app/index.html');
          });
        })
    );
    return;
  }

  // Para otros assets (CSS, JS, imágenes): Cache-First con fallback a red y actualización de caché
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch((err) => {
        console.warn('📱 [Service Worker] Recurso no disponible offline:', event.request.url);
      });
    })
  );
});
