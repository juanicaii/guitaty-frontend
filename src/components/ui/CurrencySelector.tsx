import { motion } from 'framer-motion'

interface CurrencySelectorProps {
  selectedCurrency: 'USD' | 'ARS'
  onCurrencyChange: (currency: 'USD' | 'ARS') => void
}

export const CurrencySelector = ({
  selectedCurrency,
  onCurrencyChange,
}: CurrencySelectorProps) => {
  return (
    <div className="flex justify-center px-4 py-3">
      <div className="inline-flex rounded-lg bg-gray-200 dark:bg-gray-800 p-1">
        <button
          onClick={() => onCurrencyChange('USD')}
          className="relative px-6 py-2 text-sm font-semibold transition-colors duration-200"
        >
          {selectedCurrency === 'USD' && (
            <motion.div
              layoutId="currency-selector"
              className="absolute inset-0 rounded-md bg-primary"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span
            className={`relative z-10 ${
              selectedCurrency === 'USD'
                ? 'text-white'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            USD
          </span>
        </button>
        <button
          onClick={() => onCurrencyChange('ARS')}
          className="relative px-6 py-2 text-sm font-semibold transition-colors duration-200"
        >
          {selectedCurrency === 'ARS' && (
            <motion.div
              layoutId="currency-selector"
              className="absolute inset-0 rounded-md bg-primary"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span
            className={`relative z-10 ${
              selectedCurrency === 'ARS'
                ? 'text-white'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            ARS
          </span>
        </button>
      </div>
    </div>
  )
}
