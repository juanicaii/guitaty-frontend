// Service Worker personalizado para Guitaty App
// Versión: 2.0.0

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

// Precaché automático de Workbox
precacheAndRoute(self.__WB_MANIFEST);

const CACHE_NAME = 'guitaty-app-v2.0.0';
const OFFLINE_CACHE = 'guitaty-offline-v1.0.0';
const SYNC_CACHE = 'guitaty-sync-v1.0.0';

// Archivos críticos para precache
const CRITICAL_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
];

// Configuración de rutas con Workbox
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages-cache',
    networkTimeoutSeconds: 5,
    plugins: [{
      cacheKeyWillBeUsed: async ({ request }) => {
        return `${request.url}?v=${Date.now()}`;
      }
    }]
  })
);

// API endpoints
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 5,
    plugins: [{
      cacheKeyWillBeUsed: async ({ request }) => {
        return `${request.url}?v=${Date.now()}`;
      }
    }]
  })
);

// Assets estáticos
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [{
      cacheKeyWillBeUsed: async ({ request }) => {
        return request.url;
      }
    }]
  })
);

// JS y CSS
registerRoute(
  ({ request }) => 
    request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources-cache'
  })
);

// Eventos del Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando service worker...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activando service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== OFFLINE_CACHE && 
              cacheName !== SYNC_CACHE) {
            console.log('[SW] Eliminando cache obsoleto:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Service worker activado');
      return self.clients.claim();
    })
  );
});

// Fallback para navegación offline
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages-cache',
    networkTimeoutSeconds: 3,
    plugins: [{
      handlerDidError: async () => {
        return caches.match('/offline.html');
      }
    }]
  })
);

// Manejo de notificaciones push
self.addEventListener('push', (event) => {
  console.log('[SW] Notificación push recibida');
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización disponible',
    icon: '/pwa-192x192.png',
    badge: '/pwa-64x64.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalles',
        icon: '/icons/shortcut-dashboard.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icons/shortcut-transaction.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Guitaty App', options)
  );
});

// Manejo de clics en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Click en notificación:', event.action);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sincronización en background
self.addEventListener('sync', (event) => {
  console.log('[SW] Sincronización en background:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Manejo de mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

async function doBackgroundSync() {
  console.log('[SW] Ejecutando sincronización en background...');
  
  try {
    // Aquí implementarías la lógica de sincronización
    // Por ejemplo, sincronizar datos pendientes
    const syncCache = await caches.open(SYNC_CACHE);
    const pendingRequests = await syncCache.keys();
    
    for (const request of pendingRequests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          // Eliminar de la cola de sincronización
          await syncCache.delete(request);
          console.log('[SW] Sincronizado:', request.url);
        }
      } catch (error) {
        console.log('[SW] Error sincronizando:', request.url, error);
      }
    }
  } catch (error) {
    console.error('[SW] Error en sincronización background:', error);
  }
}

// Manejo de mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Limpieza de cache obsoleto en activación
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== OFFLINE_CACHE && 
              cacheName !== SYNC_CACHE) {
            console.log('[SW] Eliminando cache obsoleto:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

console.log('[SW] Service Worker cargado correctamente');
