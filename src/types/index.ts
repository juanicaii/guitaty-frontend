// Enums
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER'
}

export enum AccountType {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CREDIT_CARD = 'CREDIT_CARD',
  CASH = 'CASH',
  INVESTMENT = 'INVESTMENT',
  OTHER = 'OTHER'
}

export enum Currency {
  USD = 'USD',
  ARS = 'ARS'
}

// Models
export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: Currency;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description?: string;
  type: TransactionType;
  date: string;
  accountId: string;
  categoryId?: string;
  receiptId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  account?: Account;
  category?: Category;
}

export interface Investment {
  ticker: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  profit: number;
  profitPercentage: number;
}

export interface PortfolioStats {
  totalInvested: number;
  currentValue: number;
  totalProfit: number;
  totalProfitPercentage: number;
  investments: Investment[];
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  accountsCount: number;
  transactionsCount: number;
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
}

// Request types
export interface CreateCategoryRequest {
  name: string;
  color?: string;
  icon?: string;
  type: TransactionType;
}

export interface UpdateCategoryRequest {
  name?: string;
  color?: string;
  icon?: string;
  type?: TransactionType;
}

export interface CreateAccountRequest {
  name: string;
  type: AccountType;
  balance: number;
  currency: Currency;
}

export interface UpdateAccountRequest {
  name?: string;
  type?: AccountType;
  balance?: number;
  currency?: Currency;
}

export interface CreateTransactionRequest {
  amount: number;
  description?: string;
  type: TransactionType;
  date: string | Date;
  accountId: string;
  categoryId?: string;
  receiptId?: string;
  metadata?: Record<string, any>;
}

export interface UpdateTransactionRequest {
  amount?: number;
  description?: string;
  type?: TransactionType;
  date?: string | Date;
  accountId?: string;
  categoryId?: string;
  receiptId?: string;
  metadata?: Record<string, any>;
}

export interface TransactionsQueryParams {
  page?: number;
  limit?: number;
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface InvestmentCredentials {
  username: string;
  password: string;
}

export interface DashboardQueryParams {
  startDate?: string;
  endDate?: string;
}

// Response types
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
