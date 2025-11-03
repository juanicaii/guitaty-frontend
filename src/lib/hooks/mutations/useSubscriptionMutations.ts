import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'
import { subscriptionsService } from '@/lib/services/subscriptions.service'
import type { CreateSubscriptionDto, UpdateSubscriptionDto } from '@/lib/api/types'
import { toast } from 'sonner'

/**
 * Create subscription mutation
 */
export const useCreateSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSubscriptionDto) => subscriptionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.lists() })
      toast.success('Suscripción creada exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear la suscripción')
    },
  })
}

/**
 * Update subscription mutation
 */
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubscriptionDto }) =>
      subscriptionsService.update(id, data),
    onSuccess: (updatedSubscription) => {
      queryClient.setQueryData(
        queryKeys.subscriptions.detail(updatedSubscription.id),
        updatedSubscription
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.lists() })
      toast.success('Suscripción actualizada exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar la suscripción')
    },
  })
}

/**
 * Delete subscription mutation
 */
export const useDeleteSubscription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => subscriptionsService.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.subscriptions.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions.lists() })
      toast.success('Suscripción eliminada exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar la suscripción')
    },
  })
}
