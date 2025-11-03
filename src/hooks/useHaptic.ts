import { useCallback } from 'react'

type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'error' | 'warning' | 'success'

export const useHaptic = () => {
  const trigger = useCallback((type: HapticType = 'light') => {
    // Check if vibration API is available
    if (!navigator.vibrate) return

    const patterns = {
      light: [10],
      medium: [20],
      heavy: [50],
      selection: [5],
      error: [10, 50, 10],
      warning: [30, 20, 30],
      success: [10, 20, 10, 20, 10],
    }

    navigator.vibrate(patterns[type])
  }, [])

  return { trigger }
}
