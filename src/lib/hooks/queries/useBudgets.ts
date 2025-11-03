import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'
import { budgetsService } from '@/lib/services/budgets.service'
import type { BudgetFilters } from '@/lib/api/types'

/**
 * Get all budgets with optional filters
 */
export const useBudgets = (filters?: BudgetFilters) => {
  return useQuery({
    queryKey: queryKeys.budgets.list(filters),
    queryFn: async () => {
      const budgets = await budgetsService.getAll(filters)
      return budgets || []
    },
  })
}

/**
 * Get budget by ID
 */
export const useBudget = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.budgets.detail(id),
    queryFn: () => budgetsService.getById(id),
    enabled: enabled && !!id,
  })
}
