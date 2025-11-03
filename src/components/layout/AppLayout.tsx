import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface AppLayoutProps {
  children: ReactNode
  className?: string
}

export const AppLayout = ({ children, className }: AppLayoutProps) => {
  return (
    <div className={cn('h-dvh overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-background-dark pb-nav-safe', className)}>
      {children}
    </div>
  )
}
