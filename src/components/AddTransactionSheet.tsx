import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Drawer } from 'vaul';
import {
  XMarkIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  TagIcon,
  BanknotesIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { TransactionType, CreateTransactionRequest, Account, Category, Currency, Transaction } from '@/types';
import { formatCurrency } from '@/utils/format';

interface AddTransactionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionRequest) => void;
  onUpdate?: (id: string, data: CreateTransactionRequest) => void;
  accounts: Account[];
  categories: Category[];
  isLoading?: boolean;
  editingTransaction?: Transaction | null;
}

export function AddTransactionSheet({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  accounts,
  categories,
  isLoading = false,
  editingTransaction = null,
}: AddTransactionSheetProps) {
  const isEditing = !!editingTransaction;

  const [formData, setFormData] = useState<Partial<CreateTransactionRequest & { currency: Currency }>>({
    type: TransactionType.EXPENSE,
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    currency: Currency.USD,
  });

  const [activeType, setActiveType] = useState<TransactionType>(TransactionType.EXPENSE);

  // Load editing data or reset form
  useEffect(() => {
    if (isOpen && isEditing && editingTransaction) {
      // Find the account to get its currency
      const account = accounts.find(a => a.id === editingTransaction.accountId);
      setFormData({
        type: editingTransaction.type,
        amount: editingTransaction.amount,
        description: editingTransaction.description || '',
        date: editingTransaction.date.split('T')[0], // Convert to YYYY-MM-DD format
        accountId: editingTransaction.accountId,
        categoryId: editingTransaction.categoryId || undefined,
        currency: account?.currency || Currency.USD,
      });
      setActiveType(editingTransaction.type);
    } else if (!isOpen) {
      setTimeout(() => {
        setFormData({
          type: TransactionType.EXPENSE,
          date: new Date().toISOString().split('T')[0],
          amount: 0,
          currency: Currency.USD,
        });
        setActiveType(TransactionType.EXPENSE);
      }, 300); // Wait for close animation
    }
  }, [isOpen, isEditing, editingTransaction, accounts]);

  const handleTypeChange = (type: TransactionType) => {
    setActiveType(type);
    setFormData({ ...formData, type });
  };

  const handleSubmit = () => {
    if (!formData.amount || !formData.accountId) return;

    // Remove currency from formData as it's not needed in the API
    const { currency, ...submitData } = formData;

    const transactionData = {
      ...submitData,
      amount: Number(formData.amount),
    } as CreateTransactionRequest;

    if (isEditing && editingTransaction && onUpdate) {
      onUpdate(editingTransaction.id, transactionData);
    } else {
      onSubmit(transactionData);
    }

    // Don't close or reset form here - let the parent handle it in onSuccess
  };

  const typeOptions = [
    { value: TransactionType.INCOME, label: 'Ingreso', color: 'green' },
    { value: TransactionType.EXPENSE, label: 'Gasto', color: 'red' },
    { value: TransactionType.TRANSFER, label: 'Transfer', color: 'blue' },
  ];

  // const selectedAccount = accounts.find(acc => acc.id === formData.accountId);
  const selectedCurrency = formData.currency || Currency.USD;

  const getCurrencySymbol = (currency: Currency) => {
    return currency === Currency.ARS ? '$' : 'US$';
  };

  const getCurrencyFlag = (currency: Currency) => {
    return currency === Currency.ARS ? '🇦🇷' : '🇺🇸';
  };

  console.log('AddTransactionSheet render:', { isOpen, accounts: accounts?.length, categories: categories?.length });

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => {
        console.log('Drawer onOpenChange:', open);
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
              {isEditing ? 'Editar Transacción' : 'Nueva Transacción'}
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
          <div className="px-4 overflow-y-auto flex-1 pb-36">
              {/* Transaction Type Selector */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {typeOptions.map((type) => (
                  <motion.button
                    key={type.value}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTypeChange(type.value)}
                    className={`
                      py-3 px-4 rounded-xl font-medium transition-all
                      ${activeType === type.value
                        ? type.color === 'green'
                          ? 'bg-green-500 text-white'
                          : type.color === 'red'
                          ? 'bg-red-500 text-white'
                          : 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    {type.label}
                  </motion.button>
                ))}
              </div>

              {/* Currency Selector */}
              <div className="mb-4">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <span className="mr-2">💱</span>
                  Moneda
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, currency: Currency.USD })}
                    className={`
                      p-4 rounded-xl border-2 transition-all flex items-center justify-center space-x-2
                      ${(formData.currency || Currency.USD) === Currency.USD
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

              {/* Amount Input */}
              <div className="mb-6">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <CurrencyDollarIcon className="w-4 h-4 mr-1.5" />
                  Monto
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-500">
                    {getCurrencySymbol(selectedCurrency)}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="w-full pl-20 pr-4 py-4 text-2xl font-bold bg-gray-100 dark:bg-gray-800 rounded-xl
                             text-gray-900 dark:text-white placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <DocumentTextIcon className="w-4 h-4 mr-1.5" />
                  Descripción
                </label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ej: Compra en supermercado"
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl
                           text-gray-900 dark:text-white placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Account Selector */}
              <div className="mb-4">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <BanknotesIcon className="w-4 h-4 mr-1.5" />
                  Cuenta ({selectedCurrency})
                </label>
                <div className="space-y-2">
                  {accounts.filter(account => account.currency === selectedCurrency).length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 py-3 px-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                      No hay cuentas disponibles en {selectedCurrency}
                    </p>
                  ) : (
                    accounts
                      .filter(account => account.currency === selectedCurrency)
                      .map((account) => (
                        <motion.button
                          key={account.id}
                          type="button"
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, accountId: account.id })}
                          className={`
                            w-full p-4 rounded-xl border-2 transition-all text-left
                            ${formData.accountId === account.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <span className="text-lg">{getCurrencyFlag(account.currency)}</span>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                  {account.currency}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {account.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {account.type}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(account.balance, account.currency)}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      ))
                  )}
                </div>
              </div>

              {/* Category Selector */}
              <div className="mb-4">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <TagIcon className="w-4 h-4 mr-1.5" />
                  Categoría
                </label>
                <select
                  value={formData.categoryId || ''}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl
                           text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sin categoría</option>
                  {categories
                    .filter(cat => cat.type === activeType)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Date Selector */}
              <div className="mb-6">
                <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <CalendarIcon className="w-4 h-4 mr-1.5" />
                  Fecha
                </label>
                <input
                  type="date"
                  value={typeof formData.date === 'string' ? formData.date : (formData.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0])}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl
                           text-gray-900 dark:text-white
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={!formData.amount || !formData.accountId || isLoading}
                  className={`
                    w-full py-4 rounded-xl font-semibold text-white
                    ${!formData.amount || !formData.accountId || isLoading
                      ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                      : activeType === TransactionType.INCOME
                      ? 'bg-green-500 hover:bg-green-600 active:bg-green-700'
                      : activeType === TransactionType.EXPENSE
                      ? 'bg-red-500 hover:bg-red-600 active:bg-red-700'
                      : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                    }
                    transition-colors duration-200
                  `}
                >
                  {isLoading
                    ? (isEditing ? 'Guardando...' : 'Guardando...')
                    : (isEditing ? 'Guardar Cambios' : 'Agregar Transacción')
                  }
                </motion.button>
              </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}