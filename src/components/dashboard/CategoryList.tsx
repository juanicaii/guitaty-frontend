import { CategoryItem } from './CategoryItem'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface Category {
  id: string
  name: string
  icon: ReactNode
  amount: number
  percentage: number
  color: string
}

interface CategoryListProps {
  categories: Category[]
  currency?: 'USD' | 'ARS'
  onViewAll?: () => void
}

export const CategoryList = ({
  categories,
  currency = 'USD',
  onViewAll,
}: CategoryListProps) => {
  return (
    <div className="flex flex-col gap-2 px-4 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pb-2 flex justify-between items-center"
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Categorías de Gastos
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-brand-accent dark:text-brand-accent-dark hover:underline"
          >
            Ver todos
          </button>
        )}
      </motion.div>

      {/* Categories */}
      {categories.map((category, index) => (
        <CategoryItem
          key={category.id}
          name={category.name}
          icon={category.icon}
          amount={category.amount}
          percentage={category.percentage}
          color={category.color}
          currency={currency}
          index={index}
        />
      ))}
    </div>
  )
}
