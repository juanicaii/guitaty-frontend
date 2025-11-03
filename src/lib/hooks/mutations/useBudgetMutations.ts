import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'
import { budgetsService } from '@/lib/services/budgets.service'
import type { CreateBudgetDto, UpdateBudgetDto } from '@/lib/api/types'
import { toast } from 'sonner'

/**
 * Create budget mutation
 */
export const useCreateBudget = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBudgetDto) => budgetsService.create(data),
    onSuccess: () => {
      // Invalidate budgets list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.lists() })
      toast.success('Presupuesto creado exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear el presupuesto')
    },
  })
}

/**
 * Update budget mutation
 */
export const useUpdateBudget = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetDto }) =>
      budgetsService.update(id, data),
    onSuccess: (updatedBudget) => {
      // Update specific budget in cache
      queryClient.setQueryData(
        queryKeys.budgets.detail(updatedBudget.id),
        updatedBudget
      )
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.lists() })
      toast.success('Presupuesto actualizado exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar el presupuesto')
    },
  })
}

/**
 * Delete budget mutation
 */
export const useDeleteBudget = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => budgetsService.delete(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.budgets.detail(id) })
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.budgets.lists() })
      toast.success('Presupuesto eliminado exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar el presupuesto')
    },
  })
}
