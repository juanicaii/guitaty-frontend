import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useAuth, SignIn } from '@clerk/clerk-react';
import { queryClient } from '@/services/queryClient';
import { setAuthTokenGetter } from '@/utils/api';
import { BottomTabBar } from '@/components/BottomTabBar';
import { PWAInstallButton } from '@/components/PWAInstallButton';
import { PWAUpdatePrompt } from '@/components/PWAUpdatePrompt';
import { Dashboard } from '@/pages/Dashboard';
import { Transactions } from '@/pages/Transactions';
import { Accounts } from '@/pages/Accounts';
import { Categories } from '@/pages/Categories';
import { Investments } from '@/pages/Investments';
import { Settings } from '@/pages/Settings';
import { useAppStore } from '@/stores/appStore';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const currentTab = useAppStore((state) => state.currentTab);

  // Set up the token getter for API calls
  useEffect(() => {
    if (isSignedIn) {
      setAuthTokenGetter(getToken);
    }
  }, [isSignedIn, getToken]);

  const pages = {
    dashboard: <Dashboard />,
    transactions: <Transactions />,
    accounts: <Accounts />,
    categories: <Categories />,
    investments: <Investments />,
    settings: <Settings />,
  };

  const setCurrentTab = useAppStore((state) => state.setCurrentTab);

  // Show loading while Clerk initializes
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-900 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-600 dark:border-t-blue-400 absolute inset-0 mx-auto"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-4 font-medium">Cargando...</p>
        </motion.div>
      </div>
    );
  }

  // Show sign in if not authenticated
  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-4"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Guitaty App
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestiona tus finanzas personales
            </p>
          </div>
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
          />
        </motion.div>
      </div>
    );
  }

  // Show app if authenticated
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
        {/* Native-style header bar */}
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-semibold text-center text-gray-900 dark:text-white"
            >
              {currentTab === 'dashboard' && 'Guitaty App'}
              {currentTab === 'transactions' && 'Transacciones'}
              {currentTab === 'accounts' && 'Mis Cuentas'}
              {currentTab === 'categories' && 'Categorías'}
              {currentTab === 'investments' && 'Inversiones'}
              {currentTab === 'settings' && 'Configuración'}
            </motion.h1>
          </div>
        </div>

        {/* Main content with animations */}
        <AnimatePresence mode="wait">
          <motion.main
            key={currentTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="pb-20"
          >
            {pages[currentTab as keyof typeof pages] || pages.dashboard}
          </motion.main>
        </AnimatePresence>

        {/* Bottom Tab Navigation */}
        <BottomTabBar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
        />

        {/* PWA Install Button */}
        <PWAInstallButton />
      </div>
    </QueryClientProvider>
  );
}

export default App;
