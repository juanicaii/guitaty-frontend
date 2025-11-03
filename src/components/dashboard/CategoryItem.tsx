import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface CategoryItemProps {
  name: string
  icon: ReactNode
  amount: number
  percentage: number
  color: string
  currency?: 'USD' | 'ARS'
  index?: number
}

export const CategoryItem = ({
  name,
  icon,
  amount,
  percentage,
  color,
  currency = 'USD',
  index = 0,
}: CategoryItemProps) => {
  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amt)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 bg-transparent p-3 rounded-lg"
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center rounded-lg bg-gray-200/50 dark:bg-gray-800 shrink-0 size-12"
        style={{ color }}
      >
        {icon}
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">
          {name}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
          {formatCurrency(amount)}
        </p>
      </div>

      {/* Progress */}
      <div className="flex flex-col items-end shrink-0">
        <p className="text-gray-900 dark:text-white text-base font-bold">
          {percentage}%
        </p>
        <div className="w-20 mt-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </motion.div>
  )
}
