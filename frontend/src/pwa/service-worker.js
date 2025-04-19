// ✅ Activación inmediata del SW
self.addEventListener('install', event => {
  console.log('[SW] Instalado');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Activado');
  clients.claim();
});

// ✅ Ignora completamente los fetch (sin caché)
self.addEventListener('fetch', event => {
  // No hace nada para peticiones fetch, evita errores con POST/PUT
});

// ✅ Manejo de notificaciones push
self.addEventListener('push', event => {
  console.log('[SW] Push recibido');

  const data = event.data ? event.data.json() : {
    title: "📣 Notificación",
    body: "¡Tienes una nueva notificación push!",
  };

  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ✅ Manejo al hacer clic en la notificación
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notificación clickeada');
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
