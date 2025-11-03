import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface FormLayoutProps {
  children: ReactNode
  className?: string
}

export const FormLayout = ({ children, className }: FormLayoutProps) => {
  return (
    <div className={cn('h-dvh overflow-y-auto overflow-x-hidden flex flex-col', className)}>
      {children}
    </div>
  )
}
