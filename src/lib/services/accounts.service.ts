import { apiClient } from '../api/client'
import type {
  Account,
  CreateAccountDto,
  UpdateAccountDto,
  ApiSuccess,
} from '../api/types'

export const accountsService = {
  /**
   * Get all accounts
   */
  getAll: async (): Promise<Account[]> => {
    return apiClient.get<Account[]>('/accounts')
  },

  /**
   * Get account by ID
   */
  getById: async (id: string): Promise<Account> => {
    return apiClient.get<Account>(`/accounts/${id}`)
  },

  /**
   * Create new account
   */
  create: async (data: CreateAccountDto): Promise<Account> => {
    return apiClient.post<Account>('/accounts', data)
  },

  /**
   * Update account
   */
  update: async (id: string, data: UpdateAccountDto): Promise<Account> => {
    return apiClient.put<Account>(`/accounts/${id}`, data)
  },

  /**
   * Delete account
   */
  delete: async (id: string): Promise<ApiSuccess> => {
    return apiClient.delete<ApiSuccess>(`/accounts/${id}`)
  },
}
