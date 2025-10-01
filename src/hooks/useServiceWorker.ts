import { useState, useEffect, useCallback } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isInstalled: boolean;
  isUpdated: boolean;
  isOffline: boolean;
  registration: ServiceWorkerRegistration | null;
  error: string | null;
}

interface ServiceWorkerActions {
  updateServiceWorker: () => Promise<void>;
  skipWaiting: () => Promise<void>;
  clearCache: () => Promise<void>;
  getCacheSize: () => Promise<number>;
  requestNotificationPermission: () => Promise<NotificationPermission>;
  subscribeToPush: () => Promise<PushSubscription | null>;
}

export const useServiceWorker = (): ServiceWorkerState & ServiceWorkerActions => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isInstalled: false,
    isUpdated: false,
    isOffline: !navigator.onLine,
    registration: null,
    error: null
  });

  // Verificar si el service worker está instalado
  useEffect(() => {
    if (!state.isSupported) return;

    const checkServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        setState(prev => ({
          ...prev,
          isInstalled: !!registration.active,
          registration
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Error checking service worker status'
        }));
      }
    };

    checkServiceWorker();
  }, [state.isSupported]);

  // Escuchar cambios en el service worker
  useEffect(() => {
    if (!state.isSupported || !state.registration) return;

    const handleUpdateFound = () => {
      const newWorker = state.registration?.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setState(prev => ({ ...prev, isUpdated: true }));
          }
        });
      }
    };

    state.registration.addEventListener('updatefound', handleUpdateFound);

    return () => {
      state.registration?.removeEventListener('updatefound', handleUpdateFound);
    };
  }, [state.isSupported, state.registration]);

  // Escuchar cambios de conectividad
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOffline: false }));
    const handleOffline = () => setState(prev => ({ ...prev, isOffline: true }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Actualizar service worker
  const updateServiceWorker = useCallback(async () => {
    if (!state.registration) return;

    try {
      await state.registration.update();
      setState(prev => ({ ...prev, isUpdated: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error updating service worker'
      }));
    }
  }, [state.registration]);

  // Saltar espera y activar nueva versión
  const skipWaiting = useCallback(async () => {
    if (!state.registration?.waiting) return;

    try {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setState(prev => ({ ...prev, isUpdated: false }));
      
      // Recargar la página para usar la nueva versión
      window.location.reload();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error skipping waiting'
      }));
    }
  }, [state.registration]);

  // Limpiar cache
  const clearCache = useCallback(async () => {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      
      // Recargar la página para aplicar cambios
      window.location.reload();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error clearing cache'
      }));
    }
  }, []);

  // Obtener tamaño del cache
  const getCacheSize = useCallback(async (): Promise<number> => {
    try {
      const cacheNames = await caches.keys();
      let totalSize = 0;

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        
        for (const request of requests) {
          const response = await cache.match(request);
          if (response) {
            const blob = await response.blob();
            totalSize += blob.size;
          }
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return 0;
    }
  }, []);

  // Solicitar permiso para notificaciones
  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    if (Notification.permission === 'granted') {
      return Notification.permission;
    }

    if (Notification.permission === 'denied') {
      throw new Error('Notification permission denied');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }, []);

  // Suscribirse a notificaciones push
  const subscribeToPush = useCallback(async (): Promise<PushSubscription | null> => {
    if (!state.registration) {
      throw new Error('Service worker not registered');
    }

    try {
      const permission = await requestNotificationPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission not granted');
      }

      const subscription = await state.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY
      });

      return subscription;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error subscribing to push notifications'
      }));
      return null;
    }
  }, [state.registration, requestNotificationPermission]);

  return {
    ...state,
    updateServiceWorker,
    skipWaiting,
    clearCache,
    getCacheSize,
    requestNotificationPermission,
    subscribeToPush
  };
};

// Hook para manejar notificaciones push
export const usePushNotifications = () => {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('PushManager' in window && 'serviceWorker' in navigator);
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    const getSubscription = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);
      } catch (error) {
        console.error('Error getting push subscription:', error);
      }
    };

    getSubscription();
  }, [isSupported]);

  const subscribe = async (): Promise<PushSubscription | null> => {
    if (!isSupported) return null;

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY
      });
      
      setSubscription(sub);
      return sub;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      return null;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    if (!subscription) return false;

    try {
      const success = await subscription.unsubscribe();
      if (success) {
        setSubscription(null);
      }
      return success;
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      return false;
    }
  };

  return {
    subscription,
    isSupported,
    subscribe,
    unsubscribe
  };
};
