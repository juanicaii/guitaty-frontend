import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface TransactionItemProps {
  id: string
  icon: ReactNode
  title: string
  category: string
  amount: number
  currency?: 'USD' | 'ARS'
  onClick?: () => void
}

export const TransactionItem = ({
  icon,
  title,
  category,
  amount,
  currency = 'USD',
  onClick,
}: TransactionItemProps) => {
  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amt)
  }

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200/50 dark:bg-[#1C2431] dark:ring-white/10 cursor-pointer"
    >
      <div className="flex min-h-[72px] items-center gap-4 p-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 dark:text-white truncate">
            {title}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {category}
          </p>
        </div>
        <p className="shrink-0 text-lg font-semibold text-gray-900 dark:text-white">
          {formatCurrency(amount)}
        </p>
      </div>
    </motion.div>
  )
}
