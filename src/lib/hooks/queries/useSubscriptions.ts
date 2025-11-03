import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'
import { subscriptionsService } from '@/lib/services/subscriptions.service'

/**
 * Get all subscriptions
 */
export const useSubscriptions = (isActive?: boolean) => {
  return useQuery({
    queryKey: queryKeys.subscriptions.list(isActive),
    queryFn: () => subscriptionsService.getAll(isActive),
  })
}

/**
 * Get subscription by ID
 */
export const useSubscription = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.subscriptions.detail(id),
    queryFn: () => subscriptionsService.getById(id),
    enabled: enabled && !!id,
  })
}
