import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ClockIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { NativeCard } from '@/components/NativeCard';

export const Investments = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="px-4 py-6 space-y-6 min-h-screen flex flex-col"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Hero Section */}
      <motion.div variants={item} className="text-center py-8">
        <div className="mb-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <ChartBarIcon className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Inversiones
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Próximamente
          </p>
        </div>
      </motion.div>

      {/* Coming Soon Features */}
      <motion.div variants={item} className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Características que vienen:
        </h2>

        <NativeCard className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <ArrowTrendingUpIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Portfolio Tracking
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Rastrea tus inversiones en tiempo real
              </p>
            </div>
          </div>
        </NativeCard>

        <NativeCard className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <ChartBarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Análisis de Performance
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gráficos detallados de rendimiento
              </p>
            </div>
          </div>
        </NativeCard>

        <NativeCard className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <BanknotesIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Múltiples Brokers
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Conecta con diferentes plataformas
              </p>
            </div>
          </div>
        </NativeCard>

        <NativeCard className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <BellIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Alertas y Notificaciones
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recibe updates de tus inversiones
              </p>
            </div>
          </div>
        </NativeCard>
      </motion.div>

      {/* Timeline */}
      <motion.div variants={item} className="mt-8">
        <NativeCard className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="text-center">
            <ClockIcon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Mantente al tanto
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Estamos trabajando en traerte las mejores herramientas para gestionar tus inversiones.
            </p>
            <div className="inline-flex items-center space-x-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>En desarrollo activo</span>
            </div>
          </div>
        </NativeCard>
      </motion.div>

      {/* Spacer for bottom navigation */}
      <div className="h-20" />
    </motion.div>
  );
};