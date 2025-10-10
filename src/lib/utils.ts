import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string, currency: string = 'USD'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(numAmount)
}

export function formatDate(date: string | Date): string {
  if (typeof date === 'string') {
    // Parse date without timezone conversion
    // If date is in ISO format (2024-01-15), create date in local timezone
    const [year, month, day] = date.split('T')[0].split('-')
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
