import { motion } from 'framer-motion'

interface DashboardStatsProps {
  balance: number
  currency?: 'USD' | 'ARS'
}

export const DashboardStats = ({ balance, currency = 'USD' }: DashboardStatsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 text-center mt-6"
    >
      <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal pb-1 pt-1">
        Balance del Mes
      </p>
      <h1 className="text-gray-900 dark:text-white tracking-tight text-4xl font-bold leading-tight">
        {formatCurrency(balance)}
      </h1>
    </motion.div>
  )
}
