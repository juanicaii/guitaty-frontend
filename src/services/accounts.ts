import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import type { Account, CreateAccountRequest, UpdateAccountRequest } from '@/types';

const ACCOUNTS_KEY = 'accounts';

// API Functions
const getAccounts = async (): Promise<Account[]> => {
  const { data } = await api.get('/api/accounts');
  return data;
};

const createAccount = async (request: CreateAccountRequest): Promise<Account> => {
  const { data } = await api.post('/api/accounts', request);
  return data;
};

const updateAccount = async ({ id, ...request }: UpdateAccountRequest & { id: string }): Promise<Account> => {
  const { data } = await api.put(`/api/accounts/${id}`, request);
  return data;
};

const deleteAccount = async (id: string): Promise<void> => {
  await api.delete(`/api/accounts/${id}`);
};

// Hooks
export const useAccounts = () => {
  return useQuery({
    queryKey: [ACCOUNTS_KEY],
    queryFn: getAccounts,
  });
};

export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_KEY] });
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_KEY] });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_KEY] });
    },
  });
};
