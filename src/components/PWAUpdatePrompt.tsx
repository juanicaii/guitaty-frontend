import { useState, useEffect } from 'react';

export const PWAUpdatePrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  // Detectar si hay un service worker registrado
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setNeedRefresh(true);
                setShowPrompt(true);
              }
            });
          }
        });
      });
    }
  }, []);

  useEffect(() => {
    setShowPrompt(needRefresh || offlineReady);
  }, [needRefresh, offlineReady]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowPrompt(false);
  };

  const handleUpdate = async () => {
    if (needRefresh && 'serviceWorker' in navigator) {
      window.location.reload();
    }
    close();
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {needRefresh ? 'Nueva versión disponible' : 'App lista para usar offline'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {needRefresh
                ? 'Hay una nueva versión de la aplicación disponible'
                : 'La aplicación está lista para funcionar sin conexión'
              }
            </p>
          </div>
        </div>

        <div className="flex space-x-2 mt-3">
          {needRefresh && (
            <button
              onClick={handleUpdate}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
            >
              Actualizar
            </button>
          )}
          <button
            onClick={close}
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
          >
            {needRefresh ? 'Después' : 'Entendido'}
          </button>
        </div>
      </div>
    </div>
  );
};