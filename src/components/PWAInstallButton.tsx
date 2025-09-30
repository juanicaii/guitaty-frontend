import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { usePWA } from '@/hooks/usePWA';

export const PWAInstallButton = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();

  if (isInstalled || !isInstallable) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      console.log('PWA installed successfully');
    }
  };

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-20 right-4 z-50 flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
    >
      <ArrowDownTrayIcon className="w-5 h-5" />
      <span className="text-sm font-medium">Instalar App</span>
    </button>
  );
};