import * as LucideIcons from 'lucide-react'

export const getCategoryIcon = (iconName: string, className?: string) => {
  // Check if it's an emoji (Unicode character)
  const isEmoji = /\p{Emoji}/u.test(iconName)

  if (isEmoji) {
    // Return emoji as text
    return <span className={className}>{iconName}</span>
  }

  // Try to get lucide icon
  const Icon = (LucideIcons as any)[iconName] as React.ComponentType<{ className?: string }>

  if (!Icon) {
    return <LucideIcons.Package className={className} />
  }

  return <Icon className={className} />
}
