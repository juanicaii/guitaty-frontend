import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'
import { dashboardService } from '@/lib/services/dashboard.service'
import type { DashboardStatsFilters } from '@/lib/api/types'

/**
 * Get dashboard statistics
 */
export const useDashboardStats = (filters?: DashboardStatsFilters) => {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(filters),
    queryFn: () => dashboardService.getStats(filters),
  })
}
