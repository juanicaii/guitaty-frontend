import { motion } from 'framer-motion'

interface CategoryData {
  name: string
  amount: number
  percentage: number
  color: string
}

interface DonutChartProps {
  categories: CategoryData[]
  totalSpent: number
  currency?: 'USD' | 'ARS'
}

export const DonutChart = ({ categories, totalSpent, currency = 'USD' }: DonutChartProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Calculate SVG circle segments
  const radius = 54
  const circumference = 2 * Math.PI * radius

  // Create segments based on percentages
  const segments = categories.map((category, index) => {
    const previousPercentages = categories
      .slice(0, index)
      .reduce((sum, cat) => sum + cat.percentage, 0)

    const offset = circumference - (category.percentage / 100) * circumference
    const rotation = (previousPercentages / 100) * 360

    return {
      ...category,
      offset,
      rotation,
    }
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="relative flex justify-center items-center py-8 my-6"
    >
      <svg
        className="transform -rotate-90"
        width="240"
        height="240"
        viewBox="0 0 120 120"
      >
        {/* Background circle */}
        <circle
          className="stroke-gray-200 dark:stroke-gray-700/50"
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="12"
        />

        {/* Category segments */}
        {segments.map((segment, index) => (
          <circle
            key={index}
            className={`transition-all duration-500`}
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            strokeWidth="12"
            stroke={segment.color}
            strokeDasharray={circumference}
            strokeDashoffset={segment.offset}
            transform={`rotate(${segment.rotation} 60 60)`}
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          Gastado
        </p>
        <p className="text-gray-900 dark:text-white text-2xl font-bold">
          {formatCurrency(totalSpent)}
        </p>
      </div>
    </motion.div>
  )
}
