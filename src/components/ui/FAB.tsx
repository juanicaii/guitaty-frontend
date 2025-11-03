import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Plus } from 'lucide-react'

interface FABProps {
  icon?: ReactNode
  onClick?: () => void
  className?: string
}

export const FAB = ({ icon, onClick, className }: FABProps) => {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`
        fixed bottom-20 right-6 z-40
        flex items-center justify-center size-14
        rounded-full
        bg-brand-accent dark:bg-brand-accent-dark
        text-white
        shadow-lg hover:shadow-xl
        transition-shadow duration-200
        ${className}
      `}
    >
      {icon || <Plus className="size-8" />}
    </motion.button>
  )
}
