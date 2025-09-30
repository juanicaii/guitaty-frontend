import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  CurrencyDollarIcon,
  ArrowTrendingDownIcon,
  ArrowsRightLeftIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import { useCategories, useCreateCategory, useUpdateCategory } from '@/services/categories';
import { CategoryCard } from '@/components/CategoryCard';
import { AddCategorySheet } from '@/components/AddCategorySheet';
import { NativeCard } from '@/components/NativeCard';
import { TransactionType, CreateCategoryRequest, Category } from '@/types';

export const Categories = () => {
  const [sheetOpened, setSheetOpened] = useState(false);
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories, isLoading } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  // const deleteMutation = useDeleteCategory();

  const handleSubmit = (data: CreateCategoryRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setSheetOpened(false);
      },
    });
  };

  const handleUpdate = (id: string, data: CreateCategoryRequest) => {
    updateMutation.mutate({ id, ...data }, {
      onSuccess: () => {
        setSheetOpened(false);
        setEditingCategory(null);
      },
    });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setSheetOpened(true);
  };

  const handleCloseSheet = () => {
    setSheetOpened(false);
    setEditingCategory(null);
  };

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return filterType === 'ALL'
      ? categories
      : categories.filter(cat => cat.type === filterType);
  }, [categories, filterType]);

  // Calculate totals by type
  const totals = useMemo(() => {
    if (!categories) return { income: 0, expense: 0, transfer: 0 };

    return {
      income: categories.filter(cat => cat.type === TransactionType.INCOME).length,
      expense: categories.filter(cat => cat.type === TransactionType.EXPENSE).length,
      transfer: categories.filter(cat => cat.type === TransactionType.TRANSFER).length,
    };
  }, [categories]);

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

  const filterOptions = [
    { value: 'ALL', label: 'Todas', count: categories?.length || 0 },
    { value: TransactionType.EXPENSE, label: 'Gastos', count: totals.expense },
    { value: TransactionType.INCOME, label: 'Ingresos', count: totals.income },
    { value: TransactionType.TRANSFER, label: 'Transfer', count: totals.transfer },
  ];

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
      {/* Filter Pills */}
      <motion.div variants={item}>
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide pb-2">
          {filterOptions.map((option) => (
            <motion.button
              key={option.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterType(option.value as any)}
              className={`
                flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap
                transition-all duration-200
                ${filterType === option.value
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              <span>{option.label}</span>
              <span className={`
                px-2 py-0.5 rounded-full text-xs font-semibold
                ${filterType === option.value
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }
              `}>
                {option.count}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        <NativeCard className="text-center">
          <div className="mb-2 flex justify-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            {totals.income}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ingresos</p>
        </NativeCard>

        <NativeCard className="text-center">
          <div className="mb-2 flex justify-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <ArrowTrendingDownIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            {totals.expense}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Gastos</p>
        </NativeCard>

        <NativeCard className="text-center">
          <div className="mb-2 flex justify-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <ArrowsRightLeftIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {totals.transfer}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Transfer</p>
        </NativeCard>
      </motion.div>

      {/* Categories Grid */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {filterType === 'ALL' ? 'Todas las Categorías' :
             filterOptions.find(opt => opt.value === filterType)?.label}
            <span className="text-gray-500 dark:text-gray-400 ml-2">
              ({filteredCategories.length})
            </span>
          </h2>
        </div>

        {filteredCategories.length === 0 ? (
          <NativeCard className="text-center py-8">
            <div className="mb-4 flex justify-center">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                <FolderIcon className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {filterType === 'ALL' ? 'No tienes categorías' : `No hay categorías de ${filterOptions.find(opt => opt.value === filterType)?.label.toLowerCase()}`}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filterType === 'ALL'
                ? 'Crea tu primera categoría para organizar tus transacciones'
                : 'Crea una nueva categoría para este tipo de transacción'
              }
            </p>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setSheetOpened(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-xl font-medium"
            >
              Crear categoría
            </motion.button>
          </NativeCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCategories.map((category) => (
              <motion.div key={category.id} variants={item}>
                <CategoryCard
                  category={category}
                  onClick={() => console.log('Category clicked:', category.id)}
                  onEdit={() => handleEdit(category)}
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

      {/* Add Category Sheet */}
      <AddCategorySheet
        isOpen={sheetOpened}
        onClose={handleCloseSheet}
        onSubmit={handleSubmit}
        onUpdate={handleUpdate}
        editingCategory={editingCategory}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </motion.div>
  );
};