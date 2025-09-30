import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useTransactions, useCreateTransaction, useUpdateTransaction } from '@/services/transactions';
import { useAccounts } from '@/services/accounts';
import { useCategories } from '@/services/categories';
import { TransactionCard } from '@/components/TransactionCard';
import { TransactionFilters } from '@/components/TransactionFilters';
import { AddTransactionSheet } from '@/components/AddTransactionSheet';
// import { SimpleDrawer } from '@/components/SimpleDrawer';
import { NativeCard } from '@/components/NativeCard';
import { formatDate } from '@/utils/format';
import { TransactionType, CreateTransactionRequest, Transaction } from '@/types';

export const Transactions = () => {
  const [sheetOpened, setSheetOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | null>(null);
  const [dateRange, setDateRange] = useState<{startDate: string | null, endDate: string | null}>({
    startDate: null,
    endDate: null
  });
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const { data: transactions, isLoading } = useTransactions({
    limit: 100,
    search: searchQuery || undefined,
    type: typeFilter || undefined,
    startDate: dateRange.startDate || undefined,
    endDate: dateRange.endDate || undefined,
  });
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  const handleSubmit = (data: CreateTransactionRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setSheetOpened(false);
      },
    });
  };

  const handleUpdate = (id: string, data: CreateTransactionRequest) => {
    updateMutation.mutate({ id, ...data }, {
      onSuccess: () => {
        setSheetOpened(false);
        setEditingTransaction(null);
      },
    });
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setSheetOpened(true);
  };

  const handleCloseSheet = () => {
    setSheetOpened(false);
    setEditingTransaction(null);
  };

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    if (!transactions?.data) return [];

    const groups: { date: string; dateObj: Date; transactions: Transaction[] }[] = [];
    const transactionsByDate = transactions.data.reduce((acc, transaction) => {
      const dateObj = new Date(transaction.date);
      const dateKey = dateObj.toDateString();
      if (!acc[dateKey]) {
        acc[dateKey] = { dateObj, transactions: [] };
      }
      acc[dateKey].transactions.push(transaction);
      return acc;
    }, {} as Record<string, { dateObj: Date; transactions: Transaction[] }>);

    Object.entries(transactionsByDate)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .forEach(([dateKey, { dateObj, transactions }]) => {
        groups.push({
          date: dateKey,
          dateObj,
          transactions
        });
      });

    return groups;
  }, [transactions?.data]);

  // Calculate totals for filtered transactions
  // const totals = useMemo(() => {
  //   if (!transactions?.data) return { income: 0, expenses: 0, balance: 0 };

  //   const income = transactions.data
  //     .filter(t => t.type === TransactionType.INCOME)
  //     .reduce((sum, t) => sum + t.amount, 0);

  //   const expenses = transactions.data
  //     .filter(t => t.type === TransactionType.EXPENSE)
  //     .reduce((sum, t) => sum + t.amount, 0);

  //   return {
  //     income,
  //     expenses,
  //     balance: income - expenses
  //   };
  // }, [transactions?.data]);

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
      className="px-4 py-4 space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >

      {/* Filters */}
      <motion.div variants={item}>
        <TransactionFilters
          onSearchChange={setSearchQuery}
          onTypeChange={setTypeFilter}
          onDateRangeChange={(startDate, endDate) =>
            setDateRange({ startDate, endDate })
          }
        />
      </motion.div>

      {/* Transactions List */}
      <motion.div variants={item} className="space-y-4">
        {groupedTransactions.length === 0 ? (
          <NativeCard className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron transacciones
            </p>
          </NativeCard>
        ) : (
          groupedTransactions.map((group) => (
            <motion.div
              key={group.date}
              variants={item}
              className="space-y-2"
            >
              {/* Date Header */}
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {formatDate(group.dateObj, 'EEEE, dd MMMM')}
                </h3>
                <span className="text-xs text-gray-400">
                  {group.transactions.length} transacciones
                </span>
              </div>

              {/* Transactions */}
              <NativeCard noPadding className="divide-y divide-gray-100 dark:divide-gray-700">
                {group.transactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onClick={() => console.log('Transaction clicked:', transaction.id)}
                    onEdit={() => handleEdit(transaction)}
                  />
                ))}
              </NativeCard>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Floating Add Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          console.log('Button clicked, setting sheetOpened to true');
          setSheetOpened(true);
        }}
        className="fixed bottom-28 right-4 w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-200"
        style={{
          zIndex: sheetOpened ? 0 : 9999,
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

      

      {/* Add Transaction Sheet */}
      <AddTransactionSheet
        isOpen={sheetOpened}
        onClose={handleCloseSheet}
        onSubmit={handleSubmit}
        onUpdate={handleUpdate}
        editingTransaction={editingTransaction}
        accounts={accounts || []}
        categories={categories || []}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </motion.div>
  );
};