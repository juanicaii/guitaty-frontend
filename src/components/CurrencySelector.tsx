import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Currency } from '@/types';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface CurrencySelectorProps {
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  compact?: boolean;
}

const currencyFlags = {
  [Currency.USD]: '🇺🇸',
  [Currency.ARS]: '🇦🇷',
};

const currencyNames = {
  [Currency.USD]: 'USD',
  [Currency.ARS]: 'ARS',
};

export function CurrencySelector({
  selectedCurrency,
  onCurrencyChange,
  compact = false
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currencies = [Currency.USD, Currency.ARS];

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2
          ${compact
            ? 'px-2 py-1 text-sm'
            : 'px-3 py-2'
          }
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg shadow-sm
          hover:bg-gray-50 dark:hover:bg-gray-700
          transition-colors
        `}
      >
        <span className="text-lg">{currencyFlags[selectedCurrency]}</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {currencyNames[selectedCurrency]}
        </span>
        <ChevronDownIcon
          className={`
            w-4 h-4 text-gray-500 transition-transform
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            {currencies.map((currency) => (
              <motion.button
                key={currency}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onCurrencyChange(currency);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2.5
                  hover:bg-gray-50 dark:hover:bg-gray-700
                  transition-colors
                  ${selectedCurrency === currency
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : ''
                  }
                `}
              >
                <span className="text-lg">{currencyFlags[currency]}</span>
                <span className={`
                  font-medium
                  ${selectedCurrency === currency
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-900 dark:text-white'
                  }
                `}>
                  {currencyNames[currency]}
                </span>
                {selectedCurrency === currency && (
                  <motion.div
                    layoutId="selectedCurrency"
                    className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}