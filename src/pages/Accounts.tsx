import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAccounts, useCreateAccount } from '@/services/accounts';
import { AccountCard } from '@/components/AccountCard';
import { AddAccountSheet } from '@/components/AddAccountSheet';
import { NativeCard } from '@/components/NativeCard';
import { formatCurrency } from '@/utils/format';
import { CreateAccountRequest, Currency } from '@/types';

export const Accounts = () => {
  const [sheetOpened, setSheetOpened] = useState(false);

  const { data: accounts, isLoading } = useAccounts();
  const createMutation = useCreateAccount();
  // const deleteMutation = useDeleteAccount();

  const handleSubmit = (data: CreateAccountRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setSheetOpened(false);
      },
    });
  };

  // Calculate totals by currency
  const totals = useMemo(() => {
    if (!accounts) return { USD: 0, ARS: 0, total: 0 };

    const usdTotal = accounts
      .filter(acc => acc.currency === Currency.USD)
      .reduce((sum, acc) => sum + acc.balance, 0);

    const arsTotal = accounts
      .filter(acc => acc.currency === Currency.ARS)
      .reduce((sum, acc) => sum + acc.balance, 0);

    return {
      USD: usdTotal,
      ARS: arsTotal,
      total: accounts.length
    };
  }, [accounts]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="px-4 py-6 space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-2 gap-4">
        <NativeCard className="text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-2xl mr-2">🇺🇸</span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">USD</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(totals.USD, Currency.USD)}
          </p>
        </NativeCard>

        <NativeCard className="text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-2xl mr-2">🇦🇷</span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">ARS</span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(totals.ARS, Currency.ARS)}
          </p>
        </NativeCard>
      </motion.div>

      {/* Accounts Grid */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Mis Cuentas ({totals.total})
          </h2>
        </div>

        {accounts && accounts.length === 0 ? (
          <NativeCard className="text-center py-8">
            <div className="mb-4">
              <span className="text-4xl">🏦</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tienes cuentas
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Crea tu primera cuenta para comenzar a gestionar tus finanzas
            </p>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setSheetOpened(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-xl font-medium"
            >
              Crear cuenta
            </motion.button>
          </NativeCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts?.map((account) => (
              <motion.div key={account.id} variants={item}>
                <AccountCard
                  account={account}
                  onClick={() => console.log('Account clicked:', account.id)}
                  onEdit={() => console.log('Edit account:', account.id)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Floating Add Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setSheetOpened(true)}
        className="fixed bottom-28 right-4 w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-200"
        style={{
          zIndex: sheetOpened ? 10 : 9999,
          transform: sheetOpened ? 'scale(0.8) translateY(20px)' : 'scale(1)',
          opacity: sheetOpened ? 0.3 : 1,
          pointerEvents: sheetOpened ? 'none' : 'auto'
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <PlusIcon className="w-7 h-7" />
      </motion.button>

      {/* Add Account Sheet */}
      <AddAccountSheet
        isOpen={sheetOpened}
        onClose={() => setSheetOpened(false)}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </motion.div>
  );
};