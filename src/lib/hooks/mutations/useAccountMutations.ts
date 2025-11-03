import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'
import { accountsService } from '@/lib/services/accounts.service'
import type { CreateAccountDto, UpdateAccountDto } from '@/lib/api/types'
import { toast } from 'sonner'

/**
 * Create account mutation
 */
export const useCreateAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAccountDto) => accountsService.create(data),
    onSuccess: () => {
      // Invalidate accounts list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.lists() })
      toast.success('Cuenta creada exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear la cuenta')
    },
  })
}

/**
 * Update account mutation
 */
export const useUpdateAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountDto }) =>
      accountsService.update(id, data),
    onSuccess: (updatedAccount) => {
      // Update specific account in cache
      queryClient.setQueryData(
        queryKeys.accounts.detail(updatedAccount.id),
        updatedAccount
      )
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.lists() })
      toast.success('Cuenta actualizada exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar la cuenta')
    },
  })
}

/**
 * Delete account mutation
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => accountsService.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.accounts.detail(id) })
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.lists() })
      toast.success('Cuenta eliminada exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar la cuenta')
    },
  })
}
