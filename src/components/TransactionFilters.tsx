import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { TransactionType } from '@/types';

interface TransactionFiltersProps {
  onSearchChange: (search: string) => void;
  onTypeChange: (type: TransactionType | null) => void;
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void;
}

export function TransactionFilters({
  onSearchChange,
  onTypeChange,
  onDateRangeChange,
}: TransactionFiltersProps) {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<TransactionType | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year' | 'custom' | null>('month');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange(value);
  };

  const handleTypeSelect = (type: TransactionType | null) => {
    setSelectedType(type);
    onTypeChange(type);
  };

  const handleDateRangeSelect = (range: typeof dateRange) => {
    setDateRange(range);

    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = new Date();

    switch (range) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
        // Handle custom date range separately
        return;
      default:
        onDateRangeChange(null, null);
        return;
    }

    onDateRangeChange(
      startDate?.toISOString().split('T')[0] || null,
      endDate?.toISOString().split('T')[0] || null
    );
  };

  const typeFilters = [
    { value: null, label: 'Todos', color: 'bg-gray-100 dark:bg-gray-800' },
    { value: TransactionType.INCOME, label: 'Ingresos', color: 'bg-green-100 dark:bg-green-900/30' },
    { value: TransactionType.EXPENSE, label: 'Gastos', color: 'bg-red-100 dark:bg-red-900/30' },
    { value: TransactionType.TRANSFER, label: 'Transfer', color: 'bg-blue-100 dark:bg-blue-900/30' },
  ];

  const dateRangeOptions = [
    { value: 'week', label: 'Última semana' },
    { value: 'month', label: 'Este mes' },
    { value: 'year', label: 'Este año' },
    { value: null, label: 'Todo' },
  ];

  return (
    <div className="space-y-3 px-4 py-2">
      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Buscar transacciones..."
          className="w-full pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl
                   text-gray-900 dark:text-white placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {search && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <XMarkIcon className="w-5 h-5 text-gray-400" />
          </motion.button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`
            flex items-center space-x-1.5 px-3 py-1.5 rounded-lg
            ${showFilters
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }
          `}
        >
          <FunnelIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Filtros</span>
        </motion.button>

        {/* Type Filter Pills */}
        {typeFilters.map((filter) => (
          <motion.button
            key={filter.value || 'all'}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTypeSelect(filter.value)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap
              transition-all duration-200
              ${selectedType === filter.value
                ? filter.value === TransactionType.INCOME
                  ? 'bg-green-500 text-white'
                  : filter.value === TransactionType.EXPENSE
                  ? 'bg-red-500 text-white'
                  : filter.value === TransactionType.TRANSFER
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-white'
                : `${filter.color} text-gray-700 dark:text-gray-300`
              }
            `}
          >
            {filter.label}
          </motion.button>
        ))}
      </div>

      {/* Extended Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3 pt-2"
        >
          {/* Date Range Selector */}
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
            <CalendarIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            {dateRangeOptions.map((option) => (
              <motion.button
                key={option.value || 'all'}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateRangeSelect(option.value as any)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap
                  ${dateRange === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}