import { ComponentPropsWithoutRef, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: 'bg-ios-blue text-white hover:bg-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white',
    outline: 'border-2 border-ios-blue text-ios-blue hover:bg-blue-50 dark:hover:bg-blue-950',
    ghost: 'text-ios-blue hover:bg-blue-50 dark:hover:bg-blue-950',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      disabled={disabled || isLoading}
      className={cn(
        'rounded-xl font-medium transition-colors duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'no-tap-highlight',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Cargando...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  )
}
