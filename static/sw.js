// Nombre del caché
const CACHE_NAME = "mi-app-cache-v1";

// Archivos que se guardarán en caché durante la instalación
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Evento de instalación: guarda los archivos en caché
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Evento de activación: limpia cachés antiguos si cambiaste la versión
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

// Evento de fetch: responde con caché primero, si no existe, va a la red
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Devuelve desde caché si existe, si no, busca en la red
      return response || fetch(event.request);
    })
  );
});