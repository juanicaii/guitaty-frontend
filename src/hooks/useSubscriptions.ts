import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { subscriptionsApi } from '@/lib/api'
import type { CreateSubscriptionInput, UpdateSubscriptionInput } from '@/types'

export function useSubscriptions(isActive?: boolean) {
  return useQuery({
    queryKey: ['subscriptions', isActive],
    queryFn: async () => {
      const { data } = await subscriptionsApi.getAll(isActive)
      return data.data
    },
  })
}

export function useSubscription(id: string) {
  return useQuery({
    queryKey: ['subscriptions', id],
    queryFn: async () => {
      const { data } = await subscriptionsApi.getById(id)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateSubscriptionInput) => subscriptionsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    },
  })
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSubscriptionInput }) =>
      subscriptionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    },
  })
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => subscriptionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] })
    },
  })
}
