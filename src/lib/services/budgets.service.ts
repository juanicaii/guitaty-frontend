import { apiClient } from '../api/client'
import type {
  Budget,
  CreateBudgetDto,
  UpdateBudgetDto,
  BudgetFilters,
  ApiSuccess,
} from '../api/types'

export const budgetsService = {
  /**
   * Get all budgets with optional filters
   */
  getAll: async (filters?: BudgetFilters): Promise<Budget[]> => {
    return apiClient.get<Budget[]>('/budgets', filters)
  },

  /**
   * Get budget by ID
   */
  getById: async (id: string): Promise<Budget> => {
    return apiClient.get<Budget>(`/budgets/${id}`)
  },

  /**
   * Create new budget
   */
  create: async (data: CreateBudgetDto): Promise<Budget> => {
    return apiClient.post<Budget>('/budgets', data)
  },

  /**
   * Update budget
   */
  update: async (id: string, data: UpdateBudgetDto): Promise<Budget> => {
    return apiClient.put<Budget>(`/budgets/${id}`, data)
  },

  /**
   * Delete budget
   */
  delete: async (id: string): Promise<ApiSuccess> => {
    return apiClient.delete<ApiSuccess>(`/budgets/${id}`)
  },
}
