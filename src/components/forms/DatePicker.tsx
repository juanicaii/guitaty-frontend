import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import dayjs, { Dayjs } from 'dayjs'

interface DatePickerProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Dayjs
  onSelect: (date: Dayjs) => void
}

export const DatePicker = ({
  isOpen,
  onClose,
  selectedDate,
  onSelect,
}: DatePickerProps) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate)

  const startOfMonth = currentMonth.startOf('month')
  const endOfMonth = currentMonth.endOf('month')
  const startDate = startOfMonth.startOf('week')
  const endDate = endOfMonth.endOf('week')

  const days: Dayjs[] = []
  let day = startDate
  while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
    days.push(day)
    day = day.add(1, 'day')
  }

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'))
  }

  const handleSelectDate = (date: Dayjs) => {
    onSelect(date)
    onClose()
  }

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto pb-safe">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Seleccionar Fecha
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="size-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Calendar */}
              <div className="p-4">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft className="size-5 text-gray-700 dark:text-gray-300" />
                  </button>
                  <span className="text-base font-bold text-gray-900 dark:text-white">
                    {currentMonth.format('MMMM YYYY')}
                  </span>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronRight className="size-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                {/* Week Days */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((day) => {
                    const isSelected = day.isSame(selectedDate, 'day')
                    const isToday = day.isSame(dayjs(), 'day')
                    const isCurrentMonth = day.isSame(currentMonth, 'month')

                    return (
                      <motion.button
                        key={day.format('YYYY-MM-DD')}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSelectDate(day)}
                        className={`
                          aspect-square rounded-lg flex items-center justify-center
                          text-sm font-medium transition-colors
                          ${
                            isSelected
                              ? 'bg-primary text-white'
                              : isToday
                              ? 'bg-primary/20 text-primary'
                              : isCurrentMonth
                              ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              : 'text-gray-400 dark:text-gray-600'
                          }
                        `}
                      >
                        {day.format('D')}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Quick Select Buttons */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleSelectDate(dayjs())}
                    className="flex-1 py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Hoy
                  </button>
                  <button
                    onClick={() => handleSelectDate(dayjs().subtract(1, 'day'))}
                    className="flex-1 py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Ayer
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
