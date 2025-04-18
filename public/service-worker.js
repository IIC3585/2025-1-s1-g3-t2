const CACHE_NAME = 'cache-pwa-web';
  const urlsToCache = [
    '/',
    '/index.html',
    '/src/main.js',
    '/src/style.css',
    '/src/filters/filters.js',
    '/src/filters/filters.wasm',
    '/app-svg.svg',
    '/photoshop192.png',
    '/photoshop.png',
    '/manifest.json'
  ];
  

self.addEventListener('install', (event) => {
    console.log('Instalando Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache abierto, agregando archivos...');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('¡Archivos cacheados con éxito!');
            })
            .catch((error) => {
                console.error('Error al cachear:', error);
            })
    );
});
self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request).catch(() => {
            return caches.match('/index.html'); 
          });
        })
    );
  });

  self.addEventListener('push', e => {
    const data = e.data.json();

    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/192x192.png',
      badge: '/192x192.png',
        vibrate: [200, 100, 200],
        // data: {
        //     url: 'http://tu-pwa.com'
        // }
    });
  });
  