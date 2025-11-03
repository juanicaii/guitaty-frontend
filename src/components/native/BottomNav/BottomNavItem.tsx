import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface BottomNavItemProps {
  icon: ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

export const BottomNavItem = ({
  icon,
  label,
  active = false,
  onClick
}: BottomNavItemProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-1 py-2 px-4 w-full',
        'transition-colors duration-200 no-tap-highlight',
        active
          ? 'text-brand-accent dark:text-brand-accent-dark'
          : 'text-gray-500 dark:text-gray-400'
      )}
    >
      <motion.div
        animate={{ scale: active ? 1.1 : 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {icon}
      </motion.div>
      <span className={cn('text-xs', active ? 'font-bold' : 'font-medium')}>
        {label}
      </span>
    </motion.button>
  )
}
