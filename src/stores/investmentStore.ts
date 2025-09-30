import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InvestmentState {
  savedCredentials: {
    username: string;
    password: string;
  } | null;
  saveCredentials: (username: string, password: string) => void;
  clearCredentials: () => void;
}

export const useInvestmentStore = create<InvestmentState>()(
  persist(
    (set) => ({
      savedCredentials: null,
      saveCredentials: (username, password) =>
        set({ savedCredentials: { username, password } }),
      clearCredentials: () => set({ savedCredentials: null }),
    }),
    {
      name: 'investment-credentials',
    }
  )
);
