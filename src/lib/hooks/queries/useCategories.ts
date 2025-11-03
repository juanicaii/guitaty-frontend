import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'
import { categoriesService } from '@/lib/services/categories.service'

/**
 * Get all categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: categoriesService.getAll,
  })
}

/**
 * Get category by ID
 */
export const useCategory = (id: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoriesService.getById(id),
    enabled: enabled && !!id,
  })
}
