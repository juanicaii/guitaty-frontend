import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types';

const CATEGORIES_KEY = 'categories';

// API Functions
const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/api/categories');
  return data;
};

const createCategory = async (request: CreateCategoryRequest): Promise<Category> => {
  const { data } = await api.post('/api/categories', request);
  return data;
};

const updateCategory = async ({ id, ...request }: UpdateCategoryRequest & { id: string }): Promise<Category> => {
  const { data } = await api.put(`/api/categories/${id}`, request);
  return data;
};

const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/api/categories/${id}`);
};

// Hooks
export const useCategories = () => {
  return useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: getCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_KEY] });
    },
  });
};
