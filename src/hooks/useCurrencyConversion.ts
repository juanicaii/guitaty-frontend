import { useState, useEffect } from 'react';
import { Currency } from '@/types';

// Exchange rates (en producción esto vendría de una API)
const EXCHANGE_RATES = {
  USD_TO_ARS: 1000, // 1 USD = 1000 ARS (ejemplo)
  ARS_TO_USD: 0.001, // 1 ARS = 0.001 USD
};

export function useCurrencyConversion(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  const [convertedAmount, setConvertedAmount] = useState(amount);

  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setConvertedAmount(amount);
      return;
    }

    if (fromCurrency === Currency.USD && toCurrency === Currency.ARS) {
      setConvertedAmount(amount * EXCHANGE_RATES.USD_TO_ARS);
    } else if (fromCurrency === Currency.ARS && toCurrency === Currency.USD) {
      setConvertedAmount(amount * EXCHANGE_RATES.ARS_TO_USD);
    }
  }, [amount, fromCurrency, toCurrency]);

  return convertedAmount;
}

export function useMultiCurrencyBalance(accounts: any[], displayCurrency: Currency) {
  const totalInUSD = accounts?.reduce((acc, account) => {
    const amountInUSD = account.currency === Currency.USD
      ? account.balance
      : account.balance * EXCHANGE_RATES.ARS_TO_USD;
    return acc + amountInUSD;
  }, 0) || 0;

  const totalInARS = accounts?.reduce((acc, account) => {
    const amountInARS = account.currency === Currency.ARS
      ? account.balance
      : account.balance * EXCHANGE_RATES.USD_TO_ARS;
    return acc + amountInARS;
  }, 0) || 0;

  return displayCurrency === Currency.USD ? totalInUSD : totalInARS;
}