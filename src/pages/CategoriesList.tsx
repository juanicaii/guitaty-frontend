import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { CategoryListItem } from '@/components/categories'
import { FAB } from '@/components/ui/FAB'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCategories } from '@/lib/hooks'
import { getIcon } from '@/lib/utils/iconMapper'

export default function CategoriesList() {
  const navigate = useNavigate()
  const { data: categories = [], isLoading } = useCategories()

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === 'EXPENSE'),
    [categories]
  )
  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === 'INCOME'),
    [categories]
  )

  const handleCategoryClick = (id: string) => {
    navigate(`/categorias/${id}`)
  }

  const handleAddCategory = () => {
    navigate('/categorias/nueva')
  }

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200/50 dark:border-white/10 bg-background-light/80 px-4 backdrop-blur-sm dark:bg-background-dark/80">
          <button
            onClick={() => navigate(-1)}
            className="flex size-10 items-center justify-center text-gray-900 dark:text-white"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Categorías
          </h1>
          <div className="size-10"></div>
        </header>
        <main className="flex-1 px-4 pt-6 pb-24">
          <Skeleton className="mb-4 h-6 w-24" />
          <Skeleton className="mb-4 h-32 w-full rounded-xl" />
          <Skeleton className="mb-4 h-6 w-24" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200/50 dark:border-white/10 bg-background-light/80 px-4 backdrop-blur-sm dark:bg-background-dark/80">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center text-gray-900 dark:text-white"
        >
          <ArrowLeft className="size-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          Categorías
        </h1>
        <div className="size-10"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pt-6 pb-24">
        <div className="space-y-4">
          {/* Expense Categories Section */}
          {expenseCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Gastos
              </h2>
              <div className="overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1C2431]">
                {expenseCategories.map((category, index) => (
                  <div key={category.id}>
                    <CategoryListItem
                      id={category.id}
                      name={category.name}
                      icon={getIcon(category.icon, 'size-5')}
                      type="expense"
                      onClick={() => handleCategoryClick(category.id)}
                    />
                    {index < expenseCategories.length - 1 && (
                      <hr className="border-gray-300 dark:border-gray-700 ml-14" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Income Categories Section */}
          {incomeCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Ingresos
              </h2>
              <div className="overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1C2431]">
                {incomeCategories.map((category, index) => (
                  <div key={category.id}>
                    <CategoryListItem
                      id={category.id}
                      name={category.name}
                      icon={getIcon(category.icon, 'size-5')}
                      type="income"
                      onClick={() => handleCategoryClick(category.id)}
                    />
                    {index < incomeCategories.length - 1 && (
                      <hr className="border-gray-300 dark:border-gray-700 ml-14" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* FAB */}
      <FAB onClick={handleAddCategory} />
    </div>
  )
}
