import { useState, useEffect } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export const PWAUpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  
  const { 
    isSupported, 
    isUpdated, 
    isOffline, 
    skipWaiting, 
    error 
  } = useServiceWorker();

  // Mostrar prompt cuando hay actualización disponible
  useEffect(() => {
    if (isUpdated) {
      setShowPrompt(true);
    }
  }, [isUpdated]);

  // Mostrar prompt cuando la app está lista offline
  useEffect(() => {
    if (isSupported && !isOffline) {
      setOfflineReady(true);
      setShowPrompt(true);
    }
  }, [isSupported, isOffline]);

  const close = () => {
    setOfflineReady(false);
    setShowPrompt(false);
  };

  const handleUpdate = async () => {
    try {
      await skipWaiting();
      close();
    } catch (error) {
      console.error('Error updating service worker:', error);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              {isUpdated ? (
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {isUpdated ? 'Nueva versión disponible' : 'App lista para usar offline'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isUpdated
                ? 'Hay una nueva versión de la aplicación disponible con mejoras y correcciones'
                : 'La aplicación está lista para funcionar sin conexión a internet'
              }
            </p>
            {error && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                Error: {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex space-x-2 mt-3">
          {isUpdated && (
            <button
              onClick={handleUpdate}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
            >
              Actualizar ahora
            </button>
          )}
          <button
            onClick={close}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
          >
            {isUpdated ? 'Después' : 'Entendido'}
          </button>
        </div>
      </div>
    </div>
  );
};