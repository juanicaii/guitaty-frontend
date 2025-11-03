import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface BudgetItemProps {
  icon: ReactNode
  name: string
  spent: number
  limit: number
  color?: string
  currency?: 'USD' | 'ARS'
  index?: number
  onClick?: () => void
}

export const BudgetItem = ({
  icon,
  name,
  spent,
  limit,
  color,
  currency = 'USD',
  index = 0,
  onClick,
}: BudgetItemProps) => {
  const percentage = (spent / limit) * 100
  const isExceeded = spent > limit
  const isWarning = percentage >= 90 && !isExceeded

  // Determine progress bar color based on budget status
  let barColorClass = ''
  let barColorStyle = ''

  if (isExceeded) {
    barColorClass = 'bg-red-500'
  } else if (isWarning) {
    barColorClass = 'bg-orange-400'
  } else {
    // Use green for normal state
    barColorStyle = '#50C878'
  }

  const formatAmount = (amount: number) => {
    if (currency === 'ARS') {
      return `$${amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onClick={onClick}
      className={`flex gap-4 bg-white dark:bg-[#1C2431] p-3 justify-between rounded-xl items-center ${onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className="text-gray-800 dark:text-white flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800 shrink-0 size-12">
          {icon}
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">
            {name}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">
            {formatAmount(spent)} de {formatAmount(limit)} gastados
          </p>
        </div>
      </div>
      <div className="shrink-0">
        <div className="w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 h-1.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{
              duration: 0.8,
              delay: index * 0.05 + 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className={`h-full rounded-full ${barColorClass}`}
            style={barColorStyle ? { backgroundColor: barColorStyle } : undefined}
          />
        </div>
      </div>
    </motion.div>
  )
}
