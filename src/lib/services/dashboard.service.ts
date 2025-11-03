import { apiClient } from '../api/client'
import type { DashboardStats, DashboardStatsFilters } from '../api/types'

export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  getStats: async (filters?: DashboardStatsFilters): Promise<DashboardStats> => {
    return apiClient.get<DashboardStats>('/dashboard/stats', filters)
  },
}
