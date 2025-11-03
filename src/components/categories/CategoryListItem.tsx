import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface CategoryListItemProps {
  id: string
  name: string
  icon: ReactNode
  type: 'expense' | 'income'
  onClick?: () => void
}

export const CategoryListItem = ({
  name,
  icon,
  type,
  onClick,
}: CategoryListItemProps) => {
  const colorClass = type === 'expense' ? 'text-primary' : 'text-expense-green dark:text-expense-green-dark'
  const bgClass = type === 'expense' ? 'bg-primary/10' : 'bg-expense-green/10 dark:bg-expense-green-dark/10'

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative flex min-h-[60px] items-center gap-4 px-4 cursor-pointer"
    >
      <div className={`flex shrink-0 items-center justify-center rounded-lg size-10 ${bgClass} ${colorClass}`}>
        {icon}
      </div>
      <p className="flex-1 truncate text-base font-medium text-text-primary-light dark:text-text-primary-dark">
        {name}
      </p>
      <div className="shrink-0">
        <div className="flex size-7 items-center justify-center text-text-secondary-light dark:text-text-secondary-dark">
          <ChevronRight className="size-5" />
        </div>
      </div>
    </motion.div>
  )
}
