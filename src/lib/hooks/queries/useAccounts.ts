import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'
import { accountsService } from '@/lib/services/accounts.service'

/**
 * Get all accounts
 */
export const useAccounts = () => {
  return useQuery({
    queryKey: queryKeys.accounts.list(),
    queryFn: accountsService.getAll,
  })
}

/**
 * Get account by ID
 */
export const useAccount = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.accounts.detail(id),
    queryFn: () => accountsService.getById(id),
    enabled: enabled && !!id,
  })
}
