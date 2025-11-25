// Enums
export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'CASH' | 'INVESTMENT' | 'OTHER'
export type Currency = 'USD' | 'ARS'
export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER'
export type BillingCycle = 'MONTHLY' | 'YEARLY'
export type BudgetPeriod = 'MONTHLY' | 'YEARLY'

// Account
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

export interface CreateAccountDto {
  name: string
  type: AccountType
  balance?: number
  currency?: Currency
}

export interface UpdateAccountDto {
  name?: string
  type?: AccountType
  balance?: number
  currency?: Currency
}

// Category
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

export interface CreateCategoryDto {
  name: string
  type: TransactionType
  color?: string
  icon?: string
}

export interface UpdateCategoryDto {
  name?: string
  type?: TransactionType
  color?: string
  icon?: string
}

// Transaction
export interface Transaction {
  id: string
  amount: string
  description: string | null
  type: TransactionType
  date: string
  currency: Currency
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

export interface CreateTransactionDto {
  amount: number
  type: TransactionType
  date: string
  accountId: string
  description?: string
  categoryId?: string
}

export interface UpdateTransactionDto {
  amount?: number
  type?: TransactionType
  date?: string
  accountId?: string
  description?: string
  categoryId?: string
}

export interface TransactionsResponse {
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

export interface TransactionFilters {
  page?: number
  limit?: number
  accountId?: string
  categoryId?: string
  type?: TransactionType | 'all'
  startDate?: string
  endDate?: string
  search?: string
  [key: string]: string | number | undefined
}

// Subscription
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
}

export interface CreateSubscriptionDto {
  name: string
  amount: number
  billingCycle: BillingCycle
  nextBillingDate: string
  accountId: string
  description?: string
  categoryId?: string
}

export interface UpdateSubscriptionDto {
  name?: string
  amount?: number
  billingCycle?: BillingCycle
  nextBillingDate?: string
  accountId?: string
  description?: string
  categoryId?: string
  isActive?: boolean
}

export interface SubscriptionsResponse {
  data: Subscription[]
}

// Budget
export interface Budget {
  id: string
  name?: string
  categoryId: string
  amount: string
  spent?: string
  period: BudgetPeriod
  startDate: string
  endDate: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  userId: string
  category: {
    id: string
    name: string
    color: string | null
    icon: string | null
  }
}

export interface CreateBudgetDto {
  categoryId: string
  amount: number
  period: BudgetPeriod
}

export interface UpdateBudgetDto {
  categoryId?: string
  amount?: number
  period?: BudgetPeriod
  startDate?: string
  endDate?: string
}

export interface BudgetsResponse {
  data: Budget[]
}

export interface BudgetFilters {
  period?: BudgetPeriod
  categoryId?: string
  startDate?: string
  endDate?: string
  [key: string]: string | undefined
}

// Dashboard Stats
export interface CategoryExpense {
  categoryId: string | null
  amount: number
  category: {
    name: string
    color: string | null
    icon: string | null
  } | null
}

export interface CurrencyStats {
  totalIncome: number
  totalExpenses: number
  netIncome: number
  accountBalance: number
  topExpenseCategories: CategoryExpense[]
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

export interface DashboardStatsFilters {
  startDate?: string
  endDate?: string
  [key: string]: string | undefined
}

// Account Balance
export interface AccountBalance {
  currency: Currency
  balance: number
}

// Generic API Response
export interface ApiError {
  error: string
}

export interface ApiSuccess {
  success: boolean
}
