import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'
import { transactionsService } from '@/lib/services/transactions.service'
import type { TransactionFilters } from '@/lib/api/types'

/**
 * Get all transactions with pagination and filters
 */
export const useTransactions = (filters?: TransactionFilters) => {
  return useQuery({
    queryKey: queryKeys.transactions.list(filters),
    queryFn: () => transactionsService.getAll(filters),
  })
}

/**
 * Get transaction by ID
 */
export const useTransaction = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.transactions.detail(id),
    queryFn: () => transactionsService.getById(id),
    enabled: enabled && !!id,
  })
}
