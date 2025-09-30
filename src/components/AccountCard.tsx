import { motion } from 'framer-motion';
import {
  BanknotesIcon,
  CreditCardIcon,
  WalletIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { Account, AccountType, Currency } from '@/types';
import { formatCurrency } from '@/utils/format';

interface AccountCardProps {
  account: Account;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

const accountTypeIcons = {
  [AccountType.CHECKING]: BanknotesIcon,
  [AccountType.SAVINGS]: BuildingLibraryIcon,
  [AccountType.CREDIT_CARD]: CreditCardIcon,
  [AccountType.CASH]: WalletIcon,
  [AccountType.INVESTMENT]: ChartBarIcon,
  [AccountType.OTHER]: BanknotesIcon,
};

const accountTypeColors = {
  [AccountType.CHECKING]: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  [AccountType.SAVINGS]: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  [AccountType.CREDIT_CARD]: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  [AccountType.CASH]: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  [AccountType.INVESTMENT]: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  [AccountType.OTHER]: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400',
};

const accountTypeLabels = {
  [AccountType.CHECKING]: 'Cuenta Corriente',
  [AccountType.SAVINGS]: 'Cuenta de Ahorro',
  [AccountType.CREDIT_CARD]: 'Tarjeta de Crédito',
  [AccountType.CASH]: 'Efectivo',
  [AccountType.INVESTMENT]: 'Inversión',
  [AccountType.OTHER]: 'Otra',
};

const getCurrencyFlag = (currency: Currency) => {
  return currency === Currency.ARS ? '🇦🇷' : '🇺🇸';
};

export function AccountCard({ account, onEdit, onDelete, onClick }: AccountCardProps) {
  const Icon = accountTypeIcons[account.type];
  const colorClass = accountTypeColors[account.type];
  const isNegative = account.balance < 0;

  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4
        border border-gray-100 dark:border-gray-700
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {account.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {accountTypeLabels[account.type]}
            </p>
          </div>
        </div>

        {(onEdit || onDelete) && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <EllipsisVerticalIcon className="w-5 h-5 text-gray-400" />
          </motion.button>
        )}
      </div>

      {/* Balance */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            Balance
          </p>
          <p className={`text-2xl font-bold ${
            isNegative
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-900 dark:text-white'
          }`}>
            {formatCurrency(account.balance, account.currency)}
          </p>
        </div>

        {/* Currency Badge */}
        <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
          <span className="text-sm">{getCurrencyFlag(account.currency)}</span>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {account.currency}
          </span>
        </div>
      </div>

      {/* Credit Card specific info */}
      {account.type === AccountType.CREDIT_CARD && account.balance < 0 && (
        <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-xs text-red-600 dark:text-red-400">
            Deuda pendiente
          </p>
        </div>
      )}
    </motion.div>
  );
}