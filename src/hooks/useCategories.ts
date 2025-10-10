import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoriesApi } from '@/lib/api'
import type { CreateCategoryInput, UpdateCategoryInput } from '@/types'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await categoriesApi.getAll()
      return data
    },
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: async () => {
      const { data } = await categoriesApi.getById(id)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoriesApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryInput }) =>
      categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
