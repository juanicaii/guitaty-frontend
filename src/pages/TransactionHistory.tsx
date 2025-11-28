import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, Repeat } from 'lucide-react'
import { TransactionItem } from '@/components/transactions'
import { Skeleton } from '@/components/ui/Skeleton'
import { useTransactions } from '@/lib/hooks'
import { getIcon } from '@/lib/utils/iconMapper'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

export default function TransactionHistory() {
  const navigate = useNavigate()
  const { data: transactionsData, isLoading } = useTransactions()

  // Transform API transactions to component format
  const transactions = useMemo(() => {
    if (!transactionsData?.data) return []

    return transactionsData.data.map((t) => ({
      id: t.id,
      title: t.description || 'Sin descripción',
      category: t.category?.name || 'Sin categoría',
      amount: t.type === 'EXPENSE' ? -parseFloat(t.amount) : parseFloat(t.amount),
      currency: t.currency,
      // Parse date ignoring timezone to prevent date shifting
      date: t.date.split('T')[0],
      icon: getIcon(t.category?.icon, 'size-6'),
    }))
  }, [transactionsData])

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    return transactions.reduce((groups, transaction) => {
      const date = transaction.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(transaction)
      return groups
    }, {} as Record<string, typeof transactions>)
  }, [transactions])

  // Format date label
  const getDateLabel = (date: string) => {
    const transactionDate = dayjs(date)
    const today = dayjs()
    const yesterday = dayjs().subtract(1, 'day')

    if (transactionDate.isSame(today, 'day')) {
      return 'HOY'
    } else if (transactionDate.isSame(yesterday, 'day')) {
      return 'AYER'
    } else {
      return transactionDate.format('D [DE] MMMM').toUpperCase()
    }
  }

  const handleTransactionClick = (id: string) => {
    navigate(`/registro/${id}`)
  }

  if (isLoading) {
    return (
      <div className="relative flex w-full flex-col bg-background-light dark:bg-background-dark">
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark p-4 pb-2 pt-safe">
          <div className="flex h-12 w-12 items-center justify-start">
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-900 dark:text-white">
              <Search className="size-6" />
            </button>
          </div>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">
            Tus Gastos
          </h1>
          <div className="flex h-12 w-12 items-center justify-end">
            <button
              onClick={() => navigate('/registro')}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white"
            >
              <Plus className="size-6" />
            </button>
          </div>
        </div>
        <main className="flex-1 px-4 pt-6 pb-24-safe">
          <Skeleton className="mb-4 h-6 w-24" />
          <Skeleton className="mb-3 h-20 w-full rounded-xl" />
          <Skeleton className="mb-3 h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark p-4 pb-2 pt-safe">
        <div className="flex h-12 w-12 items-center justify-start">
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-900 dark:text-white">
            <Search className="size-6" />
          </button>
        </div>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">
          Tus Gastos
        </h1>
        <div className="flex h-12 w-12 items-center justify-end">
          <button
            onClick={() => navigate('/registro')}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white"
          >
            <Plus className="size-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 pt-6 pb-24">
        {/* Recurring Payments Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/suscripciones')}
          className="w-full mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/20 dark:border-primary/30 hover:border-primary/40 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-full bg-primary/20 dark:bg-primary/30">
                <Repeat className="size-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Pagos Recurrentes
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Gestiona tus suscripciones
                </p>
              </div>
            </div>
            <div className="text-primary">
              <Plus className="size-5" />
            </div>
          </div>
        </motion.button>

        {/* Transactions List */}
        {Object.entries(groupedTransactions)
          .sort(([dateA], [dateB]) => dayjs(dateB).diff(dayjs(dateA)))
          .map(([date, items]) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                {getDateLabel(date)}
              </h2>
              <div className="space-y-3">
                {items.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    id={transaction.id}
                    icon={transaction.icon}
                    title={transaction.title}
                    category={transaction.category}
                    amount={transaction.amount}
                    currency={transaction.currency}
                    onClick={() => handleTransactionClick(transaction.id)}
                  />
                ))}
              </div>
            </motion.div>
          ))}
      </main>
    </div>
  )
}
