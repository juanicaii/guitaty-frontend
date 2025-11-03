import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import { BudgetItem } from '../components/budgets/BudgetItem'
import { MonthPicker } from '../components/budgets/MonthPicker'
import { FAB } from '../components/ui/FAB'
import { Skeleton } from '../components/ui/Skeleton'
import { motion } from 'framer-motion'
import { useBudgets, useTransactions } from '@/lib/hooks'
import { getIcon } from '@/lib/utils/iconMapper'
import { usePaymentDate } from '@/hooks/usePaymentDate'

dayjs.locale('es')

const MonthlyBudgets = () => {
  const navigate = useNavigate()
  const [monthOffset, setMonthOffset] = useState(0)
  const { getPeriod, formatPeriodForQuery } = usePaymentDate()

  // Get the period for the selected month offset
  const selectedPeriod = useMemo(() => {
    const period = getPeriod(monthOffset)
    return formatPeriodForQuery(period)
  }, [monthOffset, getPeriod, formatPeriodForQuery])

  // Fetch budgets for the selected period
  const { data: budgets = [], isLoading: isLoadingBudgets } = useBudgets({
    period: 'MONTHLY',
    startDate: selectedPeriod.startDate,
    endDate: selectedPeriod.endDate,
  })

  // Fetch transactions for the selected period to calculate spent amounts
  const { data: transactionsData, isLoading: isLoadingTransactions } = useTransactions({
    startDate: selectedPeriod.startDate,
    endDate: selectedPeriod.endDate,
    type: 'EXPENSE',
  })

  // Calculate spent amounts per category
  const categorySpending = useMemo(() => {
    if (!transactionsData?.data) return {}

    return transactionsData.data.reduce((acc, transaction) => {
      const categoryId = transaction.categoryId
      if (!categoryId) return acc
      const amount = parseFloat(transaction.amount)
      acc[categoryId] = (acc[categoryId] || 0) + amount
      return acc
    }, {} as Record<string, number>)
  }, [transactionsData])

  // Combine budgets with spent amounts
  const categoryBudgets = useMemo(() => {
    return budgets
      .filter(budget => budget.category) // Filter out budgets without category
      .map((budget) => ({
        id: budget.id,
        name: budget.category.name,
        icon: getIcon(budget.category.icon, 'size-6'),
        spent: categorySpending[budget.categoryId] || 0,
        limit: parseFloat(budget.amount),
      }))
  }, [budgets, categorySpending])

  // Calculate summary
  const budgetSummary = useMemo(() => {
    const totalLimit = categoryBudgets.reduce((sum, b) => sum + b.limit, 0)
    const totalSpent = categoryBudgets.reduce((sum, b) => sum + b.spent, 0)

    return {
      totalSpent,
      totalLimit,
      remaining: totalLimit - totalSpent,
      currency: 'USD' as const,
    }
  }, [categoryBudgets])

  const isLoading = isLoadingBudgets || isLoadingTransactions

  const formatAmount = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  }

  const percentage = budgetSummary.totalLimit > 0
    ? (budgetSummary.totalSpent / budgetSummary.totalLimit) * 100
    : 0

  if (isLoading) {
    return (
      <div className="flex flex-col bg-background-light dark:bg-background-dark">
        <header className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 pt-safe">
          <div className="size-10"></div>
          <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            Presupuestos Mensuales
          </h1>
          <div className="size-10"></div>
        </header>
        <main className="flex-1 flex flex-col pb-24 px-4 pt-6">
          <Skeleton className="mb-4 h-12 w-full rounded-xl" />
          <Skeleton className="mb-4 h-32 w-full rounded-xl" />
          <Skeleton className="mb-4 h-6 w-32" />
          <Skeleton className="mb-3 h-24 w-full rounded-xl" />
          <Skeleton className="mb-3 h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 pt-safe">
        <div className="size-10"></div>
        <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Presupuestos Mensuales
        </h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 flex flex-col pb-24">
        {/* Month Selector */}
        <div className="flex gap-3 px-4 py-3">
          <MonthPicker
            selectedMonth={dayjs().add(monthOffset, 'month')}
            onMonthChange={(newMonth) => {
              const diff = newMonth.diff(dayjs(), 'month')
              setMonthOffset(diff)
            }}
          />
        </div>

        {/* Summary Card */}
        <div className="px-4 pt-2 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-stretch justify-start rounded-xl bg-white dark:bg-[#1C2431] p-4"
          >
            <div className="flex w-full grow flex-col items-stretch justify-center gap-2">
              <p className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                Gasto Total
              </p>
              <div className="flex items-end gap-3 justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
                    {formatAmount(budgetSummary.totalSpent)} de{' '}
                    {formatAmount(budgetSummary.totalLimit)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal">
                    Quedan {formatAmount(budgetSummary.remaining)} este mes
                  </p>
                </div>
              </div>
              <div className="w-full mt-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full rounded-full bg-expense-green dark:bg-expense-green-dark"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Categories Section */}
        <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Categorías
        </h2>

        {/* Budget List */}
        <div className="flex flex-col gap-2 px-4">
          {categoryBudgets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="mb-4 text-gray-400 dark:text-gray-500">
                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                No hay presupuestos
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400 max-w-sm mb-6">
                Crea tu primer presupuesto para empezar a controlar tus gastos mensuales
              </p>
              <button
                onClick={() => navigate('/presupuestos/nuevo')}
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                Crear Presupuesto
              </button>
            </motion.div>
          ) : (
            categoryBudgets.map((budget, index) => (
              <BudgetItem
                key={budget.id}
                icon={budget.icon}
                name={budget.name}
                spent={budget.spent}
                limit={budget.limit}
                currency={budgetSummary.currency}
                index={index}
                onClick={() => navigate(`/presupuestos/${budget.id}`)}
              />
            ))
          )}
        </div>
      </main>

      {/* FAB */}
      <FAB onClick={() => navigate('/presupuestos/nuevo')} />
    </div>
  )
}

export default MonthlyBudgets
