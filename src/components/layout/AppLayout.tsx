import { ReactNode } from 'react'
import { SafeAreaView } from '@/components/native/SafeArea'
import { cn } from '@/lib/utils/cn'

interface AppLayoutProps {
  children: ReactNode
  className?: string
}

export const AppLayout = ({ children, className }: AppLayoutProps) => {
  return (
    <SafeAreaView>
      <div className={cn('min-h-screen bg-gray-50 dark:bg-background-dark', className)}>
        {children}
      </div>
    </SafeAreaView>
  )
}
