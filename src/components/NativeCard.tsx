import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface NativeCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
}

export function NativeCard({ children, className = '', onClick, noPadding = false }: NativeCardProps) {
  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={`
        bg-white dark:bg-gray-800 rounded-2xl
        shadow-sm dark:shadow-none dark:border dark:border-gray-700
        ${!noPadding ? 'p-4' : ''}
        ${onClick ? 'cursor-pointer active:shadow-none transition-shadow' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

interface NativeListItemProps {
  title: string;
  subtitle?: string | ReactNode;
  value?: string | ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  showArrow?: boolean;
}

export function NativeListItem({
  title,
  subtitle,
  value,
  icon,
  onClick,
  showArrow = false
}: NativeListItemProps) {
  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={`
        flex items-center px-4 py-3
        ${onClick ? 'cursor-pointer active:bg-gray-50 dark:active:bg-gray-700/50' : ''}
      `}
      onClick={onClick}
    >
      {icon && (
        <div className="mr-3 flex-shrink-0">
          {icon}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-base font-medium text-gray-900 dark:text-white truncate">
          {title}
        </p>
        {subtitle && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {typeof subtitle === 'string' ? (
              <p className="truncate">{subtitle}</p>
            ) : (
              subtitle
            )}
          </div>
        )}
      </div>

      {value && (
        <div className="ml-3 text-right">
          {typeof value === 'string' ? (
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {value}
            </p>
          ) : (
            value
          )}
        </div>
      )}

      {showArrow && (
        <svg
          className="ml-2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      )}
    </motion.div>
  );
}