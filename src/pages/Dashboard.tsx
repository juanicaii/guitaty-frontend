import { useState } from 'react';
import { useDashboardStats } from '@/services/dashboard';
import { useAccounts } from '@/services/accounts';
import { formatCurrency } from '@/utils/format';
import { FinancialChart } from '@/components/FinancialChart';
import { NativeCard, NativeListItem } from '@/components/NativeCard';
import { CurrencySelector } from '@/components/CurrencySelector';
import { useMultiCurrencyBalance } from '@/hooks/useCurrencyConversion';
import { Currency } from '@/types';
import {
  BanknotesIcon,

  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
 
  WalletIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  // Calculate current month date range
  const getCurrentMonthRange = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const monthRange = getCurrentMonthRange();
  const { data: stats, isLoading } = useDashboardStats(monthRange);
  const { data: accounts } = useAccounts();
  const [displayCurrency, setDisplayCurrency] = useState<Currency>(Currency.USD);

  // Calcular balance total en la moneda seleccionada
  const totalBalance = useMultiCurrencyBalance(accounts || [], displayCurrency);

  // Función helper para conversión de moneda
  const convertCurrency = (amount: number, fromCurrency: Currency, toCurrency: Currency): number => {
    if (fromCurrency === toCurrency) return amount;

    // Tasas de cambio (en producción esto vendría de una API)
    const USD_TO_ARS = 1000;
    const ARS_TO_USD = 0.001;

    if (fromCurrency === Currency.USD && toCurrency === Currency.ARS) {
      return amount * USD_TO_ARS;
    } else if (fromCurrency === Currency.ARS && toCurrency === Currency.USD) {
      return amount * ARS_TO_USD;
    }
    return amount;
  };

  // Convertir ingresos y gastos
  const totalIncome = convertCurrency(
    stats?.totalIncome || 0,
    Currency.USD,
    displayCurrency
  );

  const totalExpenses = convertCurrency(
    stats?.totalExpenses || 0,
    Currency.USD,
    displayCurrency
  );

  // Mock data para gráficos de demostración
  const monthlyData = [
    { name: 'Ene', value: 4000, ingresos: 4000, gastos: 2400 },
    { name: 'Feb', value: 3000, ingresos: 3000, gastos: 1398 },
    { name: 'Mar', value: 2000, ingresos: 2000, gastos: 9800 },
    { name: 'Abr', value: 2780, ingresos: 2780, gastos: 3908 },
    { name: 'May', value: 1890, ingresos: 1890, gastos: 4800 },
    { name: 'Jun', value: 2390, ingresos: 2390, gastos: 3800 },
    { name: 'Jul', value: 3490, ingresos: 3490, gastos: 4300 },
  ];

  const categoryData = stats?.categoryBreakdown?.map(item => ({
    name: item.categoryName,
    value: item.amount
  })) || [];

 
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="px-4 py-6 space-y-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Currency Selector */}
      <motion.div variants={item} className="flex justify-end">
        <CurrencySelector
          selectedCurrency={displayCurrency}
          onCurrencyChange={setDisplayCurrency}
        />
      </motion.div>
      {/* Balance Card - Native Style */}
      <motion.div variants={item}>
        <NativeCard className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium">Balance Total</p>
              <p className="text-3xl font-bold mt-1">
                {formatCurrency(totalBalance, displayCurrency)}
              </p>
              {/* Mostrar equivalencia si hay cuentas en ambas monedas */}
              {accounts && accounts.some(acc => acc.currency !== displayCurrency) && (
                <p className="text-blue-200 text-xs mt-1">
                  ≈ {formatCurrency(
                    totalBalance,
                    displayCurrency === Currency.USD ? Currency.ARS : Currency.USD
                  )}
                </p>
              )}
            </div>
            <div className="p-2 bg-white/20 rounded-xl">
              <WalletIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            <span className="font-medium">+12.5%</span>
            <span className="ml-2 text-blue-100">vs mes anterior</span>
          </div>
        </NativeCard>
      </motion.div>

      {/* Quick Stats - Native Cards */}
      <motion.div variants={item} className="grid grid-cols-2 gap-4">
        <NativeCard>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs font-medium text-green-600">+8.2%</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ingresos</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(totalIncome, displayCurrency)}
          </p>
        </NativeCard>

        <NativeCard>
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <ArrowTrendingDownIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs font-medium text-red-600">-3.4%</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Gastos</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {formatCurrency(totalExpenses, displayCurrency)}
          </p>
        </NativeCard>
      </motion.div>

      {/* Mini Chart - Native Style */}
      <motion.div variants={item}>
        <NativeCard noPadding>
          <div className="p-4 pb-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Resumen Mensual
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Últimos 7 meses
            </p>
          </div>
          <div className="px-2">
            <FinancialChart
              title=""
              data={monthlyData}
              type="area"
              height={180}
              dataKeys={['ingresos', 'gastos']}
              colors={['#10B981', '#EF4444']}
            />
          </div>
        </NativeCard>
      </motion.div>

      {/* Accounts Section - Native Style */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cuentas
          </h2>
          <button className="p-1.5 rounded-full bg-blue-500 text-white">
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
        <NativeCard noPadding className="divide-y divide-gray-100 dark:divide-gray-700">
          {accounts?.map((account) => {
            // Convertir el balance si es necesario usando la función helper
            const displayBalance = account.currency === displayCurrency
              ? account.balance
              : convertCurrency(account.balance, account.currency, displayCurrency);

            return (
              <NativeListItem
                key={account.id}
                title={account.name}
                subtitle={
                  <div className="flex items-center space-x-2">
                    <span>{account.type}</span>
                    {account.currency === Currency.USD ? (
                      <span className="text-xs">🇺🇸</span>
                    ) : (
                      <span className="text-xs">🇦🇷</span>
                    )}
                  </div>
                }
                value={
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(displayBalance, displayCurrency)}
                    </p>
                    {account.currency !== displayCurrency && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatCurrency(account.balance, account.currency)}
                      </p>
                    )}
                  </div>
                }
                icon={
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                    <BanknotesIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                }
                onClick={() => console.log('Account clicked:', account.id)}
                showArrow
              />
            );
          })}
        </NativeCard>
      </motion.div>

      {/* Categories Breakdown - Native Style */}
      {categoryData.length > 0 && (
        <motion.div variants={item}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Gastos por Categoría
          </h2>
          <NativeCard noPadding className="divide-y divide-gray-100 dark:divide-gray-700">
            {stats?.categoryBreakdown?.slice(0, 5).map((item) => (
              <div key={item.categoryId} className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.categoryName}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      convertCurrency(item.amount, Currency.USD, displayCurrency),
                      displayCurrency
                    )}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-blue-500 h-2 rounded-full"
                  />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {item.percentage.toFixed(1)}% del total
                </span>
              </div>
            ))}
          </NativeCard>
        </motion.div>
      )}

     
    </motion.div>
  );
};
