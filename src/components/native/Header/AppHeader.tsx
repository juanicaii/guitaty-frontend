import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AppHeaderProps {
  title: string
  subtitle?: string
  leftAction?: ReactNode
  rightAction?: ReactNode
  onBackPress?: () => void
  transparent?: boolean
  className?: string
}

export const AppHeader = ({
  title,
  subtitle,
  leftAction,
  rightAction,
  onBackPress,
  transparent = false,
  className
}: AppHeaderProps) => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'sticky top-0 z-40 w-full pt-safe-top',
        transparent
          ? 'bg-transparent'
          : 'backdrop-native border-b border-gray-200 dark:border-gray-800',
        className
      )}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left Action */}
        <div className="flex items-center min-w-[60px]">
          {onBackPress && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onBackPress}
              className="p-2 -ml-2 no-tap-highlight"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
          )}
          {leftAction}
        </div>

        {/* Title */}
        <div className="flex-1 text-center px-4">
          <h1 className="text-lg font-semibold truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-500 truncate">{subtitle}</p>
          )}
        </div>

        {/* Right Action */}
        <div className="flex items-center justify-end min-w-[60px]">
          {rightAction}
        </div>
      </div>
    </motion.header>
  )
}
