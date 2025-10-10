// Account Types
export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'CASH' | 'INVESTMENT' | 'OTHER'
export type Currency = 'USD' | 'ARS'

export interface Account {
  id: string
  name: string
  type: AccountType
  balance: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  userId: string
  currency: Currency
  _count: {
    transactions: number
  }
}

export interface CreateAccountInput {
  name: string
  type: AccountType
  balance?: number
  currency?: Currency
}

export interface UpdateAccountInput {
  name?: string
  type?: AccountType
  balance?: number
  currency?: Currency
}

// Category Types
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER'

export interface Category {
  id: string
  name: string
  color: string | null
  icon: string | null
  type: TransactionType
  isDefault: boolean
  createdAt: string
  updatedAt: string
  userId: string | null
}

export interface CreateCategoryInput {
  name: string
  type: TransactionType
  color?: string
  icon?: string
}

export interface UpdateCategoryInput {
  name?: string
  type?: TransactionType
  color?: string
  icon?: string
}

// Transaction Types
export interface Transaction {
  id: string
  amount: string
  description: string | null
  type: TransactionType
  date: string
  processed: boolean
  aiExtracted: boolean
  metadata: Record<string, any> | null
  createdAt: string
  updatedAt: string
  userId: string
  accountId: string
  categoryId: string | null
  receiptId: string | null
  account: {
    id: string
    name: string
    type: AccountType
    currency: Currency
  }
  category: {
    id: string
    name: string
    color: string | null
    icon: string | null
  } | null
  receipt: any | null
}

export interface CreateTransactionInput {
  amount: number
  type: TransactionType
  date: string
  accountId: string
  description?: string
  categoryId?: string
}

export interface UpdateTransactionInput {
  amount?: number
  description?: string
  type?: TransactionType
  date?: string
  accountId?: string
  categoryId?: string
}

export interface TransactionFilters {
  page?: number
  limit?: number
  accountId?: string
  categoryId?: string
  type?: string
  startDate?: string
  endDate?: string
  search?: string
}

export interface PaginatedTransactions {
  data: Transaction[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Subscription Types
export type BillingCycle = 'MONTHLY' | 'YEARLY'

export interface Subscription {
  id: string
  name: string
  description: string | null
  amount: string
  billingCycle: BillingCycle
  nextBillingDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  userId: string
  accountId: string
  categoryId: string | null
  account: {
    id: string
    name: string
    currency: Currency
  }
}

export interface CreateSubscriptionInput {
  name: string
  amount: number
  billingCycle: BillingCycle
  nextBillingDate: string
  accountId: string
  description?: string
  categoryId?: string
}

export interface UpdateSubscriptionInput {
  name?: string
  description?: string
  amount?: number
  billingCycle?: BillingCycle
  nextBillingDate?: string
  accountId?: string
  categoryId?: string
  isActive?: boolean
}

// Dashboard Stats Types
export interface CurrencyStats {
  totalIncome: number
  totalExpenses: number
  netIncome: number
  accountBalance: number
  topExpenseCategories: TopExpenseCategory[]
}

export interface TopExpenseCategory {
  categoryId: string
  amount: number
  category: {
    name: string
    color: string | null
    icon: string | null
  }
}

export interface MonthlyTrend {
  month: string
  usd: {
    income: number
    expenses: number
  }
  ars: {
    income: number
    expenses: number
  }
}

export interface DashboardStats {
  usd: CurrencyStats
  ars: CurrencyStats
  transactionCount: number
  monthlyTrend: MonthlyTrend[]
}

// API Error Type
export interface ApiError {
  error: string
}
