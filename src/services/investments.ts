import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import type { Investment, PortfolioStats, InvestmentCredentials } from '@/types';

const INVESTMENTS_KEY = 'investments';

// API Functions
const getInvestments = async (credentials: InvestmentCredentials): Promise<Investment[]> => {
  const { data } = await api.post('/api/investments', credentials);
  return data;
};

const getPortfolioStats = async (credentials: InvestmentCredentials): Promise<PortfolioStats> => {
  const { data } = await api.post('/api/investments/portfolio', credentials);
  return data;
};

// Hooks
export const useInvestments = (credentials?: InvestmentCredentials) => {
  return useQuery({
    queryKey: [INVESTMENTS_KEY, credentials],
    queryFn: () => getInvestments(credentials!),
    enabled: !!credentials?.username && !!credentials?.password,
  });
};

export const usePortfolioStats = () => {
  return useMutation({
    mutationFn: getPortfolioStats,
  });
};
