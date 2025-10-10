import axios from 'axios'
import type {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
  PaginatedTransactions,
  Subscription,
  CreateSubscriptionInput,
  UpdateSubscriptionInput,
  DashboardStats,
} from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Store the getToken function from Clerk
let getTokenFunction: (() => Promise<string | null>) | null = null

// Set the getToken function from Clerk
export const setGetTokenFunction = (getToken: () => Promise<string | null>) => {
  getTokenFunction = getToken
}

// Request interceptor to add fresh token before each request
api.interceptors.request.use(
  async (config) => {
    if (getTokenFunction) {
      try {
        const token = await getTokenFunction()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (error) {
        console.error('Failed to get auth token:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Legacy helper for backward compatibility
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// Accounts API
export const accountsApi = {
  getAll: () => api.get<Account[]>('/accounts'),
  getById: (id: string) => api.get<Account>(`/accounts/${id}`),
  create: (data: CreateAccountInput) => api.post<Account>('/accounts', data),
  update: (id: string, data: UpdateAccountInput) => api.put<Account>(`/accounts/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean }>(`/accounts/${id}`),
}

// Categories API
export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
  getById: (id: string) => api.get<Category>(`/categories/${id}`),
  create: (data: CreateCategoryInput) => api.post<Category>('/categories', data),
  update: (id: string, data: UpdateCategoryInput) => api.put<Category>(`/categories/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean }>(`/categories/${id}`),
}

// Transactions API
export const transactionsApi = {
  getAll: (filters?: TransactionFilters) => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }
    return api.get<PaginatedTransactions>(`/transactions?${params.toString()}`)
  },
  getById: (id: string) => api.get<Transaction>(`/transactions/${id}`),
  create: (data: CreateTransactionInput) => api.post<Transaction>('/transactions', data),
  update: (id: string, data: UpdateTransactionInput) => api.put<Transaction>(`/transactions/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean }>(`/transactions/${id}`),
}

// Subscriptions API
export const subscriptionsApi = {
  getAll: (isActive?: boolean) => {
    const params = isActive !== undefined ? `?isActive=${isActive}` : ''
    return api.get<{ data: Subscription[] }>(`/subscriptions${params}`)
  },
  getById: (id: string) => api.get<Subscription>(`/subscriptions/${id}`),
  create: (data: CreateSubscriptionInput) => api.post<Subscription>('/subscriptions', data),
  update: (id: string, data: UpdateSubscriptionInput) => api.put<Subscription>(`/subscriptions/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean }>(`/subscriptions/${id}`),
}

// Dashboard API
export const dashboardApi = {
  getStats: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    const queryString = params.toString()
    return api.get<DashboardStats>(`/dashboard/stats${queryString ? `?${queryString}` : ''}`)
  },
}

// Exchange Rate API
interface ExchangeRateResponse {
  result: string
  conversion_rates?: {
    ARS: number
    [key: string]: number
  }
  error?: string
}

export const exchangeRateApi = {
  getUSDtoARS: async (): Promise<number> => {
    try {
      // Using exchangerate-api.com (free tier)
      const response = await axios.get<ExchangeRateResponse>(
        'https://api.exchangerate-api.com/v4/latest/USD'
      )

      if (response.data.result === 'success' || response.data.conversion_rates?.ARS) {
        return response.data.conversion_rates.ARS
      }

      throw new Error('Failed to fetch exchange rate')
    } catch (error) {
      console.error('Error fetching exchange rate:', error)
      // Fallback to default rate if API fails
      return 1421.5
    }
  },
}
