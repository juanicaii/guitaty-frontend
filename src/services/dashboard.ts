import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import type { DashboardStats, DashboardQueryParams } from '@/types';

const DASHBOARD_KEY = 'dashboard';

// API Functions
const getDashboardStats = async (params?: DashboardQueryParams): Promise<DashboardStats> => {
  const { data } = await api.get('/api/dashboard/stats', { params });
  return data;
};

// Hooks
export const useDashboardStats = (params?: DashboardQueryParams) => {
  return useQuery({
    queryKey: [DASHBOARD_KEY, params],
    queryFn: () => getDashboardStats(params),
  });
};
