import { apiClient } from '../api/client'
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  ApiSuccess,
} from '../api/types'

export const categoriesService = {
  /**
   * Get all categories (user's custom + default)
   */
  getAll: async (): Promise<Category[]> => {
    return apiClient.get<Category[]>('/categories')
  },

  /**
   * Get category by ID
   */
  getById: async (id: string): Promise<Category> => {
    return apiClient.get<Category>(`/categories/${id}`)
  },

  /**
   * Create new category
   */
  create: async (data: CreateCategoryDto): Promise<Category> => {
    return apiClient.post<Category>('/categories', data)
  },

  /**
   * Update category
   */
  update: async (id: string, data: UpdateCategoryDto): Promise<Category> => {
    return apiClient.put<Category>(`/categories/${id}`, data)
  },

  /**
   * Delete category
   */
  delete: async (id: string): Promise<ApiSuccess> => {
    return apiClient.delete<ApiSuccess>(`/categories/${id}`)
  },
}
