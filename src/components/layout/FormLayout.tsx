import { ReactNode } from 'react'
import { SafeAreaView } from '@/components/native/SafeArea'
import { cn } from '@/lib/utils/cn'

interface FormLayoutProps {
  children: ReactNode
  className?: string
}

export const FormLayout = ({ children, className }: FormLayoutProps) => {
  return (
    <SafeAreaView>
      <div className={cn('min-h-dvh overflow-y-auto overflow-x-hidden', className)}>
        {children}
      </div>
    </SafeAreaView>
  )
}
