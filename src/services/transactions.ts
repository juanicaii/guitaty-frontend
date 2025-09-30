import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import type {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionsQueryParams,
  PaginatedResponse
} from '@/types';

const TRANSACTIONS_KEY = 'transactions';

// API Functions
const getTransactions = async (params?: TransactionsQueryParams): Promise<PaginatedResponse<Transaction>> => {
  const { data } = await api.get('/api/transactions', { params });
  return data;
};

const createTransaction = async (request: CreateTransactionRequest): Promise<Transaction> => {
  const { data } = await api.post('/api/transactions', request);
  return data;
};

const updateTransaction = async ({ id, ...request }: UpdateTransactionRequest & { id: string }): Promise<Transaction> => {
  const { data } = await api.put(`/api/transactions/${id}`, request);
  return data;
};

const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/api/transactions/${id}`);
};

// Hooks
export const useTransactions = (params?: TransactionsQueryParams) => {
  return useQuery({
    queryKey: [TRANSACTIONS_KEY, params],
    queryFn: () => getTransactions(params),
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_KEY] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
