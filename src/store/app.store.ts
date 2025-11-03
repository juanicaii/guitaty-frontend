import { create } from 'zustand'

interface AppState {
  isLoading: boolean
  theme: 'light' | 'dark' | 'system'
  setLoading: (loading: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  theme: 'dark',
  setLoading: (loading) => set({ isLoading: loading }),
  setTheme: (theme) => set({ theme }),
}))
