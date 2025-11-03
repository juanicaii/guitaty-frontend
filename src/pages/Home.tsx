import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { DonutChart } from '@/components/dashboard/DonutChart'
import { CategoryList } from '@/components/dashboard/CategoryList'
import { FAB } from '@/components/ui/FAB'
import { Skeleton } from '@/components/ui/Skeleton'
import { CurrencySelector } from '@/components/ui/CurrencySelector'
import { User, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDashboardStats } from '@/lib/hooks'
import { getIcon } from '@/lib/utils/iconMapper'
import { usePaymentDate } from '@/hooks/usePaymentDate'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

export default function Home() {
  const navigate = useNavigate()
  const { user, isLoaded } = useUser()
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'ARS'>('ARS')
  const [monthOffset, setMonthOffset] = useState(0)
  const { getPeriod, formatPeriodForQuery } = usePaymentDate()

  // Get current financial period based on payment date and month offset
  const currentPeriod = useMemo(() => {
    const period = getPeriod(monthOffset)
    return formatPeriodForQuery(period)
  }, [monthOffset, getPeriod, formatPeriodForQuery])

  // Get dashboard stats from API
  const { data: dashboardData, isLoading: isLoadingStats } = useDashboardStats(currentPeriod)

  // Calculate display month
  const displayMonth = useMemo(() => {
    return dayjs().add(monthOffset, 'month')
  }, [monthOffset])

  const handlePreviousMonth = () => {
    setMonthOffset(prev => prev - 1)
  }

  const handleNextMonth = () => {
    setMonthOffset(prev => prev + 1)
  }

  // Transform API data to component format
  const displayData = useMemo(() => {
    if (!dashboardData) {
      return {
        balance: 0,
        totalSpent: 0,
        currency: selectedCurrency,
        categories: [],
      }
    }

    const currencyData = selectedCurrency === 'USD' ? dashboardData.usd : dashboardData.ars

    return {
      balance: currencyData.accountBalance,
      totalSpent: currencyData.totalExpenses,
      currency: selectedCurrency,
      categories: currencyData.topExpenseCategories
        .filter((cat) => cat.category !== null)
        .map((cat) => ({
          id: cat.categoryId || 'uncategorized',
          name: cat.category!.name,
          icon: getIcon(cat.category!.icon, 'size-6'),
          amount: cat.amount,
          percentage: currencyData.totalExpenses > 0
            ? Math.round((cat.amount / currencyData.totalExpenses) * 100)
            : 0,
          color: cat.category!.color || '#666666',
        })),
    }
  }, [dashboardData, selectedCurrency])

  if (!isLoaded || isLoadingStats) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="p-4">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-64 w-64 mx-auto mb-6 rounded-full" />
          <Skeleton className="h-20 w-full mb-3" />
          <Skeleton className="h-20 w-full mb-3" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between"
      >
        {/* Left: Profile Button */}
        <div className="flex w-12 items-center justify-start">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-transparent text-gray-800 dark:text-white"
          >
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="size-6" />
            )}
          </button>
        </div>

        {/* Center: Month Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousMonth}
            className="flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>
          <h2 className="text-gray-800 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] min-w-[140px] text-center">
            {displayMonth.format('MMMM YYYY')}
          </h2>
          <button
            onClick={handleNextMonth}
            className="flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Right: Settings Button */}
        <div className="flex w-12 items-center justify-end">
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-transparent text-gray-800 dark:text-white"
          >
            <Settings className="size-6" />
          </button>
        </div>
      </motion.div>

      {/* Currency Selector */}
      <CurrencySelector
        selectedCurrency={selectedCurrency}
        onCurrencyChange={setSelectedCurrency}
      />

      {/* Balance */}
      <DashboardStats balance={displayData.balance} currency={displayData.currency} />

      {/* Donut Chart */}
      <DonutChart
        categories={displayData.categories}
        totalSpent={displayData.totalSpent}
        currency={displayData.currency}
      />

      {/* Category List */}
      <CategoryList
        categories={displayData.categories}
        currency={displayData.currency}
        onViewAll={() => navigate('/categorias')}
      />

      {/* FAB */}
      <FAB onClick={() => navigate('/registro')} />
    </div>
  )
}
