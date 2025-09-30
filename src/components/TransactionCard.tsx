import { motion } from 'framer-motion';
import {
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/solid';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Transaction, TransactionType } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
  onEdit?: () => void;
}

const typeIcons = {
  [TransactionType.INCOME]: ArrowDownLeftIcon,
  [TransactionType.EXPENSE]: ArrowUpRightIcon,
  [TransactionType.TRANSFER]: ArrowsRightLeftIcon,
};

const typeColors = {
  [TransactionType.INCOME]: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    icon: 'text-green-600 dark:text-green-400',
    amount: 'text-green-600 dark:text-green-400',
  },
  [TransactionType.EXPENSE]: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    icon: 'text-red-600 dark:text-red-400',
    amount: 'text-red-600 dark:text-red-400',
  },
  [TransactionType.TRANSFER]: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    icon: 'text-blue-600 dark:text-blue-400',
    amount: 'text-gray-900 dark:text-white',
  },
};

export function TransactionCard({ transaction, onClick, onEdit }: TransactionCardProps) {
  const Icon = typeIcons[transaction.type];
  const colors = typeColors[transaction.type];
  const sign = transaction.type === TransactionType.INCOME ? '+' : transaction.type === TransactionType.EXPENSE ? '-' : '';

  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        flex items-center px-4 py-3
        ${onClick ? 'cursor-pointer active:bg-gray-50 dark:active:bg-gray-700/50' : ''}
        transition-colors
      `}
    >
      {/* Icon */}
      <div className={`p-2.5 rounded-xl ${colors.bg} mr-3`}>
        <Icon className={`w-5 h-5 ${colors.icon}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {transaction.description || transaction.category?.name || 'Sin descripción'}
        </p>
        <div className="flex items-center space-x-2 mt-0.5">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(transaction.date, 'dd MMM')}
          </span>
          {transaction.account && (
            <>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {transaction.account.name}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Amount */}
      <div className="text-right ml-3">
        <p className={`text-base font-semibold ${colors.amount}`}>
          {sign}{formatCurrency(transaction.amount, transaction.account?.currency)}
        </p>
        {transaction.category && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[100px]">
            {transaction.category.name}
          </p>
        )}
      </div>

      {/* Edit Button */}
      {onEdit && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="ml-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <PencilIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </motion.button>
      )}

      {/* Chevron */}
      {onClick && (
        <svg
          className="ml-2 w-4 h-4 text-gray-400"
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