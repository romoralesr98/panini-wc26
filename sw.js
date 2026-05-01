// Cambia esta fecha cada vez que publiques una actualización (formato YYYY-MM-DD)
const VERSION = '2026-05-01';
const CACHE = 'panini-wc26-' + VERSION;

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(['/', '/index.html']))
  );
  // Actívate inmediatamente sin esperar a que cierren las pestañas
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Borra cachés viejos
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Guarda la versión más reciente del servidor
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});

// Recibe señal de la app para activarse inmediatamente
self.addEventListener('message', e => {
  if (e.data && e.data.action === 'skipWaiting') self.skipWaiting();
});
