import { useQuery } from '@tanstack/react-query'
import { exchangeRateApi } from '@/lib/api'
import { USD_TO_ARS_RATE } from '@/lib/constants'

export function useExchangeRate() {
  return useQuery({
    queryKey: ['exchangeRate', 'USD', 'ARS'],
    queryFn: exchangeRateApi.getUSDtoARS,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: USD_TO_ARS_RATE, // Use default rate while loading
  })
}
