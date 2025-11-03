import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface BottomNavProps {
  children: ReactNode
  className?: string
}

export const BottomNav = ({ children, className }: BottomNavProps) => {
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'backdrop-native border-t border-gray-200 dark:border-gray-800',
        'pb-safe',
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-4">
        {children}
      </div>
    </motion.nav>
  )
}
