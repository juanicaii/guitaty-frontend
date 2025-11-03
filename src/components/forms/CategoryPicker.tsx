import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useCategories } from '@/lib/hooks'
import { getIcon } from '@/lib/utils/iconMapper'
import { Skeleton } from '@/components/ui/Skeleton'

interface CategoryPickerProps {
  isOpen: boolean
  onClose: () => void
  selectedCategory: string
  onSelect: (categoryId: string) => void
  type?: 'EXPENSE' | 'INCOME' | 'all'
}

export const CategoryPicker = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelect,
  type = 'all',
}: CategoryPickerProps) => {
  const { data: allCategories = [], isLoading } = useCategories()

  const categories = useMemo(() => {
    if (type === 'all') return allCategories
    return allCategories.filter(cat => cat.type === type)
  }, [allCategories, type])

  const handleSelect = (categoryId: string) => {
    onSelect(categoryId)
  }

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

          {/* Modal - Positioned from bottom */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] flex flex-col"
          >
            <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl flex flex-col max-h-[80vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Seleccionar Categoría
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="size-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Categories Grid */}
              <div className="p-4 overflow-y-auto flex-1 pb-safe">
                {isLoading ? (
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton key={i} className="h-28 rounded-xl" />
                    ))}
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No hay categorías disponibles
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pb-4">
                    {categories.map((category) => (
                      <motion.button
                        key={category.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelect(category.id)}
                        className={`
                          flex flex-col items-center gap-2 p-4 rounded-xl
                          transition-colors duration-200
                          ${
                            selectedCategory === category.id
                              ? 'bg-primary/10 border-2 border-primary'
                              : 'bg-gray-100 dark:bg-gray-700 border-2 border-transparent'
                          }
                        `}
                      >
                        <div className="size-12 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-600">
                          {getIcon(category.icon, 'size-6 text-gray-700 dark:text-gray-300')}
                        </div>
                        <span
                          className={`text-sm font-medium text-center ${
                            selectedCategory === category.id
                              ? 'text-primary'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {category.name}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
