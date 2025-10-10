import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api'

export function useDashboardStats(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ['dashboard', 'stats', startDate, endDate],
    queryFn: async () => {
      const { data } = await dashboardApi.getStats(startDate, endDate)
      return data
    },
  })
}
