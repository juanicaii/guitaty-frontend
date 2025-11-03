import { apiClient } from '../api/client'
import type {
  Subscription,
  SubscriptionsResponse,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  ApiSuccess,
} from '../api/types'

export const subscriptionsService = {
  /**
   * Get all subscriptions
   */
  getAll: async (isActive?: boolean): Promise<SubscriptionsResponse> => {
    const params = isActive !== undefined ? { isActive: String(isActive) } : undefined
    return apiClient.get<SubscriptionsResponse>('/subscriptions', params)
  },

  /**
   * Get subscription by ID
   */
  getById: async (id: string): Promise<Subscription> => {
    return apiClient.get<Subscription>(`/subscriptions/${id}`)
  },

  /**
   * Create new subscription
   */
  create: async (data: CreateSubscriptionDto): Promise<Subscription> => {
    return apiClient.post<Subscription>('/subscriptions', data)
  },

  /**
   * Update subscription
   */
  update: async (id: string, data: UpdateSubscriptionDto): Promise<Subscription> => {
    return apiClient.put<Subscription>(`/subscriptions/${id}`, data)
  },

  /**
   * Delete subscription
   */
  delete: async (id: string): Promise<ApiSuccess> => {
    return apiClient.delete<ApiSuccess>(`/subscriptions/${id}`)
  },
}
