import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'
import { categoriesService } from '@/lib/services/categories.service'
import type { CreateCategoryDto, UpdateCategoryDto } from '@/lib/api/types'
import { toast } from 'sonner'

/**
 * Create category mutation
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() })
      toast.success('Categoría creada exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al crear la categoría')
    },
  })
}

/**
 * Update category mutation
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoriesService.update(id, data),
    onSuccess: (updatedCategory) => {
      queryClient.setQueryData(
        queryKeys.categories.detail(updatedCategory.id),
        updatedCategory
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() })
      toast.success('Categoría actualizada exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar la categoría')
    },
  })
}

/**
 * Delete category mutation
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.categories.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() })
      toast.success('Categoría eliminada exitosamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar la categoría')
    },
  })
}
