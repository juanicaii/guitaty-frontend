import { apiClient } from '../api/client'
import type {
  Transaction,
  TransactionsResponse,
  TransactionFilters,
  CreateTransactionDto,
  UpdateTransactionDto,
  ApiSuccess,
} from '../api/types'

export const transactionsService = {
  /**
   * Get all transactions with pagination and filters
   */
  getAll: async (filters?: TransactionFilters): Promise<TransactionsResponse> => {
    return apiClient.get<TransactionsResponse>('/transactions', filters)
  },

  /**
   * Get transaction by ID
   */
  getById: async (id: string): Promise<Transaction> => {
    return apiClient.get<Transaction>(`/transactions/${id}`)
  },

  /**
   * Create new transaction
   */
  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    return apiClient.post<Transaction>('/transactions', data)
  },

  /**
   * Update transaction
   */
  update: async (id: string, data: UpdateTransactionDto): Promise<Transaction> => {
    return apiClient.put<Transaction>(`/transactions/${id}`, data)
  },

  /**
   * Delete transaction
   */
  delete: async (id: string): Promise<ApiSuccess> => {
    return apiClient.delete<ApiSuccess>(`/transactions/${id}`)
  },
}
