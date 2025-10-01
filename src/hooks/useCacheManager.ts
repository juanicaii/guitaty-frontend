import { useCallback } from 'react';

export const useCacheManager = () => {
  const clearCache = useCallback(async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();

        // Limpiar cachés específicos que pueden causar problemas
        const cachesToClear = cacheNames.filter(name =>
          name.includes('pages-cache') ||
          name.includes('api-cache') ||
          name.includes('workbox-precache')
        );

        for (const cacheName of cachesToClear) {
          await caches.delete(cacheName);
          console.log(`Cache cleared: ${cacheName}`);
        }

        // Opcional: También limpiar localStorage relacionado con PWA
        if (localStorage.getItem('pwa-cache-version')) {
          localStorage.removeItem('pwa-cache-version');
        }

        return true;
      } catch (error) {
        console.error('Error clearing cache:', error);
        return false;
      }
    }
    return false;
  }, []);

  const clearSpecificCache = useCallback(async (cacheName: string) => {
    if ('caches' in window) {
      try {
        await caches.delete(cacheName);
        console.log(`Specific cache cleared: ${cacheName}`);
        return true;
      } catch (error) {
        console.error(`Error clearing cache ${cacheName}:`, error);
        return false;
      }
    }
    return false;
  }, []);

  const getCacheInfo = useCallback(async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        const cacheInfo = [];

        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          cacheInfo.push({
            name: cacheName,
            entries: keys.length,
            urls: keys.map(req => req.url)
          });
        }

        return cacheInfo;
      } catch (error) {
        console.error('Error getting cache info:', error);
        return [];
      }
    }
    return [];
  }, []);

  const reloadApp = useCallback(() => {
    // Forzar recarga completa sin caché
    window.location.reload();
  }, []);

  return {
    clearCache,
    clearSpecificCache,
    getCacheInfo,
    reloadApp
  };
};