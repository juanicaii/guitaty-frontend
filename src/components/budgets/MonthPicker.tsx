import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

interface MonthPickerProps {
  selectedMonth: Dayjs
  onMonthChange: (month: Dayjs) => void
}

export const MonthPicker = ({ selectedMonth, onMonthChange }: MonthPickerProps) => {
  const [isOpen, setIsOpen] = useState(false)

  // Generate last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    return dayjs().subtract(i, 'month')
  })

  const handleSelect = (month: Dayjs) => {
    onMonthChange(month)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-200 dark:bg-gray-800 pl-4 pr-2"
      >
        <p className="text-gray-800 dark:text-white text-sm font-medium leading-normal capitalize">
          {selectedMonth.format('MMMM YYYY')}
        </p>
        <ChevronDown className="text-gray-800 dark:text-white size-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 z-50 min-w-[200px] bg-white dark:bg-[#1C2431] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="max-h-[300px] overflow-y-auto">
                {months.map((month) => {
                  const isSelected = month.isSame(selectedMonth, 'month')
                  return (
                    <button
                      key={month.format('YYYY-MM')}
                      onClick={() => handleSelect(month)}
                      className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors capitalize ${
                        isSelected
                          ? 'bg-primary/10 text-primary'
                          : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {month.format('MMMM YYYY')}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
