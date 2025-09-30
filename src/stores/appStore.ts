import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Currency } from '@/types';

interface AppState {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Currency preference
  defaultCurrency: Currency;
  setDefaultCurrency: (currency: Currency) => void;

  // Navigation
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // Currency
      defaultCurrency: Currency.USD,
      setDefaultCurrency: (currency) => set({ defaultCurrency: currency }),

      // Navigation
      currentTab: 'dashboard',
      setCurrentTab: (tab) => set({ currentTab: tab }),
    }),
    {
      name: 'finance-app-storage',
    }
  )
);
