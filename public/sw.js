// Service Worker personalizado para Guitaty App
// Versión: 2.0.0

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

// Eventos del Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cacheando assets críticos...');
        return cache.addAll(CRITICAL_ASSETS);
      })
      .then(() => {
        console.log('[SW] Service worker instalado correctamente');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Error durante la instalación:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activando service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
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
      .then(() => {
        console.log('[SW] Service worker activado');
        return self.clients.claim();
      })
  );
});

// Estrategia de caché inteligente
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo procesar requests HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }

  // Estrategias específicas por tipo de contenido
  if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isAssetRequest(request)) {
    event.respondWith(handleAssetRequest(request));
  } else {
    event.respondWith(handleGenericRequest(request));
  }
});

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

// Funciones auxiliares
function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

function isAPIRequest(request) {
  return request.url.includes('/api/') || 
         request.url.includes('/graphql');
}

function isAssetRequest(request) {
  return /\.(js|css|png|jpg|jpeg|gif|svg|woff2?|ttf|eot|ico)$/i.test(request.url);
}

async function handleNavigationRequest(request) {
  try {
    // Intentar red desde la red primero
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cachear la respuesta exitosa
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] Red no disponible, buscando en cache...');
  }

  // Fallback al cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Fallback final a página offline
  return caches.match('/offline.html');
}

async function handleAPIRequest(request) {
  const cache = await caches.open('api-cache');
  
  try {
    // NetworkFirst para APIs
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cachear respuestas exitosas
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] API no disponible, buscando en cache...');
    
    // Fallback al cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Respuesta offline para APIs
    return new Response(
      JSON.stringify({ 
        error: 'Sin conexión', 
        offline: true,
        message: 'Los datos se sincronizarán cuando se restablezca la conexión'
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleAssetRequest(request) {
  const cache = await caches.open('assets-cache');
  
  // CacheFirst para assets estáticos
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Asset no disponible:', request.url);
    return new Response('Asset no disponible', { status: 404 });
  }
}

async function handleGenericRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Recurso no disponible', { status: 404 });
  }
}

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

// Limpieza periódica de cache
setInterval(async () => {
  try {
    const cacheNames = await caches.keys();
    const now = Date.now();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        const dateHeader = response.headers.get('date');
        
        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime();
          if (now - responseDate > maxAge) {
            await cache.delete(request);
            console.log('[SW] Cache expirado eliminado:', request.url);
          }
        }
      }
    }
  } catch (error) {
    console.error('[SW] Error en limpieza de cache:', error);
  }
}, 24 * 60 * 60 * 1000); // Cada 24 horas

console.log('[SW] Service Worker cargado correctamente');
