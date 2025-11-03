import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface SafeAreaViewProps {
  children: ReactNode
  className?: string
  top?: boolean
  bottom?: boolean
  left?: boolean
  right?: boolean
}

export const SafeAreaView = ({
  children,
  className,
  top = true,
  bottom = true,
  left = true,
  right = true
}: SafeAreaViewProps) => {
  return (
    <div
      className={cn(
        'w-full h-full',
        top && 'safe-top',
        bottom && 'safe-bottom',
        left && 'safe-left',
        right && 'safe-right',
        className
      )}
    >
      {children}
    </div>
  )
}
