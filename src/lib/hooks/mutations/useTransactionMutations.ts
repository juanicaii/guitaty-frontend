import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'
import { transactionsService } from '@/lib/services/transactions.service'
import type { CreateTransactionDto, UpdateTransactionDto } from '@/lib/api/types'
import { toast } from 'sonner'

/**
 * Create transaction mutation
 */
export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTransactionDto) => transactionsService.create(data),
    onSuccess: () => {
      // Invalidate transactions list
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.lists() })
      // Invalidate accounts (balance changed)
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.lists() })
      // Invalidate dashboard stats
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      toast.success('Transacción creada exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear la transacción')
    },
  })
}

/**
 * Update transaction mutation
 */
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionDto }) =>
      transactionsService.update(id, data),
    onSuccess: (updatedTransaction) => {
      queryClient.setQueryData(
        queryKeys.transactions.detail(updatedTransaction.id),
        updatedTransaction
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      toast.success('Transacción actualizada exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar la transacción')
    },
  })
}

/**
 * Delete transaction mutation
 */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => transactionsService.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.transactions.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all })
      toast.success('Transacción eliminada exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar la transacción')
    },
  })
}
