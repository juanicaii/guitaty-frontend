import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface AccountCardProps {
  id: string
  name: string
  type: string
  balance: number
  currency?: 'USD' | 'ARS'
  icon: ReactNode
  onClick?: () => void
}

export const AccountCard = ({
  name,
  type,
  balance,
  currency = 'USD',
  icon,
  onClick,
}: AccountCardProps) => {
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
      className="flex items-center gap-4 rounded-xl bg-white dark:bg-[#1C2431] p-4 shadow-sm min-h-[72px] cursor-pointer"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex-grow min-w-0">
        <p className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(balance)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {name} - {type}
        </p>
      </div>
      <div className="shrink-0">
        <ChevronRight className="size-5 text-gray-400 dark:text-gray-500" />
      </div>
    </motion.div>
  )
}
