import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Drawer } from 'vaul';
import {
  XMarkIcon,
  BanknotesIcon,
  CreditCardIcon,
  WalletIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { AccountType, Currency, CreateAccountRequest } from '@/types';

interface AddAccountSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAccountRequest) => void;
  isLoading?: boolean;
}

const accountTypes = [
  { value: AccountType.CHECKING, label: 'Cuenta Corriente', icon: BanknotesIcon, color: 'blue' },
  { value: AccountType.SAVINGS, label: 'Cuenta de Ahorro', icon: BuildingLibraryIcon, color: 'green' },
  { value: AccountType.CREDIT_CARD, label: 'Tarjeta de Crédito', icon: CreditCardIcon, color: 'purple' },
  { value: AccountType.CASH, label: 'Efectivo', icon: WalletIcon, color: 'yellow' },
  { value: AccountType.INVESTMENT, label: 'Inversión', icon: ChartBarIcon, color: 'indigo' },
  { value: AccountType.OTHER, label: 'Otra', icon: BanknotesIcon, color: 'gray' },
];

export function AddAccountSheet({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AddAccountSheetProps) {
  const [formData, setFormData] = useState<CreateAccountRequest>({
    name: '',
    type: AccountType.CHECKING,
    balance: 0,
    currency: Currency.USD,
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData({
          name: '',
          type: AccountType.CHECKING,
          balance: 0,
          currency: Currency.USD,
        });
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!formData.name) return;

    onSubmit({
      ...formData,
      balance: Number(formData.balance),
    });

    // Reset form
    setFormData({
      name: '',
      type: AccountType.CHECKING,
      balance: 0,
      currency: Currency.USD,
    });

    onClose();
  };

  const getCurrencySymbol = (currency: Currency) => {
    return currency === Currency.ARS ? '$' : 'US$';
  };

  const getCurrencyFlag = (currency: Currency) => {
    return currency === Currency.ARS ? '🇦🇷' : '🇺🇸';
  };

  console.log('AddAccountSheet render:', { isOpen });

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => {
        console.log('Account Drawer onOpenChange:', open);
        if (!open) {
          onClose();
        }
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-white dark:bg-gray-900 flex flex-col rounded-t-[20px] h-[85%] fixed bottom-0 left-0 right-0 outline-none">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-700 mb-4 mt-4" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-4 flex-shrink-0">
            <Drawer.Title className="text-xl font-semibold text-gray-900 dark:text-white">
              Nueva Cuenta
            </Drawer.Title>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800"
              type="button"
            >
              <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="px-4 overflow-y-auto flex-1 min-h-0 pb-36">
            {/* Account Name */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <DocumentTextIcon className="w-4 h-4 mr-1.5" />
                Nombre de la Cuenta
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Cuenta Principal"
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl
                         text-gray-900 dark:text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Account Type */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                🏦 Tipo de Cuenta
              </label>
              <div className="grid grid-cols-2 gap-3">
                {accountTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <motion.button
                      key={type.value}
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`
                        p-4 rounded-xl border-2 transition-all text-left
                        ${formData.type === type.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`
                          p-2 rounded-lg
                          ${type.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                            type.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                            type.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                            type.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
                            type.color === 'indigo' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' :
                            'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
                          }
                        `}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {type.label}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Currency Selector */}
            <div className="mb-4">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                💱 Moneda
              </label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, currency: Currency.USD })}
                  className={`
                    p-4 rounded-xl border-2 transition-all flex items-center justify-center space-x-2
                    ${formData.currency === Currency.USD
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    }
                  `}
                >
                  <span className="text-xl">🇺🇸</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">USD</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Dólares</p>
                  </div>
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFormData({ ...formData, currency: Currency.ARS })}
                  className={`
                    p-4 rounded-xl border-2 transition-all flex items-center justify-center space-x-2
                    ${formData.currency === Currency.ARS
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                    }
                  `}
                >
                  <span className="text-xl">🇦🇷</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white">ARS</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Pesos</p>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Initial Balance */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                💰 Balance Inicial
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl font-bold text-gray-500">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.balance || ''}
                  onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="w-full pl-20 pr-4 py-4 text-xl font-bold bg-gray-100 dark:bg-gray-800 rounded-xl
                           text-gray-900 dark:text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {getCurrencyFlag(formData.currency)} Introduce el balance actual de la cuenta
              </p>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!formData.name || isLoading}
                className={`
                  w-full py-4 rounded-xl font-semibold text-white
                  ${!formData.name || isLoading
                    ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                  }
                  transition-colors duration-200
                `}
              >
                {isLoading ? 'Creando...' : 'Crear Cuenta'}
              </motion.button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}