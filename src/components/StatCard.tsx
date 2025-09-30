import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow';
  format?: 'currency' | 'number' | 'percentage';
}

const colorClasses = {
  blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
  green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
  red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
};

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = 'blue',
  format = 'currency'
}: StatCardProps) {
  const formatValue = () => {
    if (format === 'currency') {
      return typeof value === 'number'
        ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(value)
        : value;
    } else if (format === 'percentage') {
      return typeof value === 'number' ? `${value}%` : value;
    }
    return value;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-sm font-medium ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? (
              <ArrowUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 mr-1" />
            )}
            {Math.abs(change)}%
            {changeLabel && (
              <span className="ml-1 text-gray-500 dark:text-gray-400 text-xs">
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatValue()}
        </p>
      </div>
    </motion.div>
  );
}