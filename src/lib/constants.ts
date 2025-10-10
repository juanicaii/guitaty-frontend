import type { AccountType, BillingCycle, TransactionType } from '@/types'

export const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'CHECKING', label: 'Checking' },
  { value: 'SAVINGS', label: 'Savings' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'CASH', label: 'Cash' },
  { value: 'INVESTMENT', label: 'Investment' },
  { value: 'OTHER', label: 'Other' },
]

export const CURRENCIES = [
  { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
  { value: 'ARS', label: 'ARS - Argentine Peso', symbol: '$' },
] as const

// Conversion rate: 1 USD = X ARS
// Default rate from Google (updated: Oct 10, 2025)
export const USD_TO_ARS_RATE = 1421.5

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  customRate?: number
): number => {
  if (fromCurrency === toCurrency) {
    return amount
  }

  const rate = customRate || USD_TO_ARS_RATE

  if (fromCurrency === 'USD' && toCurrency === 'ARS') {
    return amount * rate
  }

  if (fromCurrency === 'ARS' && toCurrency === 'USD') {
    return amount / rate
  }

  // Default: no conversion
  return amount
}

export const TRANSACTION_TYPES: { value: TransactionType; label: string; color: string }[] = [
  { value: 'INCOME', label: 'Income', color: 'text-green-600' },
  { value: 'EXPENSE', label: 'Expense', color: 'text-red-600' },
  { value: 'TRANSFER', label: 'Transfer', color: 'text-blue-600' },
]

export const BILLING_CYCLES: { value: BillingCycle; label: string }[] = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
]

export const DEFAULT_CATEGORY_COLORS = [
  '#FF5733', '#33C3FF', '#FFB733', '#33FF57',
  '#B733FF', '#FF33E9', '#33FFF5', '#FF8C33',
  '#5733FF', '#33FFB7', '#FF3385', '#85FF33',
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
]

export const CATEGORY_ICONS = [
  // Shopping & Food
  { name: 'ShoppingCart', label: 'Shopping Cart' },
  { name: 'ShoppingBag', label: 'Shopping Bag' },
  { name: 'Coffee', label: 'Coffee' },
  { name: 'Utensils', label: 'Food' },
  { name: 'Pizza', label: 'Pizza' },
  { name: 'Apple', label: 'Groceries' },

  // Transportation
  { name: 'Car', label: 'Car' },
  { name: 'Bus', label: 'Bus' },
  { name: 'Bike', label: 'Bike' },
  { name: 'Plane', label: 'Flight' },
  { name: 'Train', label: 'Train' },
  { name: 'Fuel', label: 'Fuel' },

  // Home & Utilities
  { name: 'Home', label: 'Home' },
  { name: 'Zap', label: 'Electricity' },
  { name: 'Wifi', label: 'Internet' },
  { name: 'Droplet', label: 'Water' },
  { name: 'Wrench', label: 'Maintenance' },

  // Entertainment
  { name: 'Tv', label: 'TV' },
  { name: 'Music', label: 'Music' },
  { name: 'Film', label: 'Movies' },
  { name: 'Gamepad2', label: 'Gaming' },
  { name: 'PartyPopper', label: 'Entertainment' },

  // Health & Fitness
  { name: 'Heart', label: 'Health' },
  { name: 'Dumbbell', label: 'Fitness' },
  { name: 'Pill', label: 'Medicine' },
  { name: 'Stethoscope', label: 'Medical' },

  // Education & Work
  { name: 'GraduationCap', label: 'Education' },
  { name: 'BookOpen', label: 'Books' },
  { name: 'Briefcase', label: 'Work' },
  { name: 'Laptop', label: 'Computer' },

  // Finance
  { name: 'DollarSign', label: 'Money' },
  { name: 'Wallet', label: 'Wallet' },
  { name: 'CreditCard', label: 'Credit Card' },
  { name: 'TrendingUp', label: 'Investment' },
  { name: 'PiggyBank', label: 'Savings' },
  { name: 'Banknote', label: 'Cash' },

  // Shopping Categories
  { name: 'Shirt', label: 'Clothing' },
  { name: 'Watch', label: 'Accessories' },
  { name: 'Glasses', label: 'Glasses' },
  { name: 'Baby', label: 'Baby' },
  { name: 'Dog', label: 'Pets' },
  { name: 'Cat', label: 'Pets' },

  // Communication
  { name: 'Smartphone', label: 'Phone' },
  { name: 'Mail', label: 'Mail' },
  { name: 'MessageSquare', label: 'Messages' },

  // Misc
  { name: 'Gift', label: 'Gifts' },
  { name: 'Package', label: 'Package' },
  { name: 'Sparkles', label: 'Special' },
  { name: 'Star', label: 'Favorite' },
  { name: 'Trophy', label: 'Achievement' },
  { name: 'Calendar', label: 'Calendar' },
]
