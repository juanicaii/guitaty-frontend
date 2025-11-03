import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Tag, Repeat, Trash2 } from 'lucide-react'
import { CategoryPicker } from '@/components/forms/CategoryPicker'
import { useBudget, useCreateBudget, useUpdateBudget, useDeleteBudget, useCategories } from '@/lib/hooks'
import { Skeleton } from '@/components/ui/Skeleton'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { BudgetPeriod } from '@/lib/api/types'

export default function BudgetForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)

  const [amount, setAmount] = useState('0')
  const [categoryId, setCategoryId] = useState<string>('')
  const [period, setPeriod] = useState<BudgetPeriod>('MONTHLY')
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch data
  const { data: budget, isLoading: isLoadingBudget, error } = useBudget(id || '', isEditing)

  console.log('useBudget hook state:', { budget, isLoadingBudget, error, isEditing, id })
  const { data: categories = [] } = useCategories()

  // Mutations
  const createMutation = useCreateBudget()
  const updateMutation = useUpdateBudget()
  const deleteMutation = useDeleteBudget()

  // Load budget data when editing
  useEffect(() => {
    console.log('Budget loaded:', budget)
    console.log('Is editing:', isEditing)
    console.log('Budget ID:', id)
    if (budget) {
      console.log('Setting form data:', {
        amount: budget.amount,
        categoryId: budget.categoryId,
        period: budget.period
      })
      setAmount(budget.amount)
      setCategoryId(budget.categoryId)
      setPeriod(budget.period)
    }
  }, [budget, isEditing, id])

  const handleAmountChange = (value: string) => {
    const regex = /^\d*\.?\d{0,2}$/
    if (regex.test(value) || value === '') {
      setAmount(value)
    }
  }

  const handleSave = async () => {
    if (!amount || parseFloat(amount) === 0 || !categoryId) return

    try {
      const data = {
        categoryId,
        amount: parseFloat(amount),
        period,
      }

      if (isEditing && id) {
        await updateMutation.mutateAsync({ id, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      navigate(-1)
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!id) return

    try {
      await deleteMutation.mutateAsync(id)
      setShowDeleteConfirm(false)
      navigate(-1)
    } catch (error) {
      // Error handled by mutation
      setShowDeleteConfirm(false)
    }
  }

  const selectedCategory = categories.find(c => c.id === categoryId)

  if (isEditing && isLoadingBudget) {
    return (
      <div className="relative flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
        <div className="flex items-center p-4 pb-2 justify-between">
          <Skeleton className="h-12 w-12" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex flex-col items-center justify-center flex-grow p-4">
          <Skeleton className="h-16 w-48 mb-8" />
          <Skeleton className="h-14 w-full mb-2" />
          <Skeleton className="h-14 w-full mb-2" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex size-12 shrink-0 items-center justify-center text-slate-800 dark:text-white"
        >
          <ArrowLeft className="size-6" />
        </button>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-slate-800 dark:text-white">
          {isEditing ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
        </h2>
        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              onClick={handleDeleteClick}
              className="text-red-500 dark:text-red-400 hover:text-red-700"
            >
              <Trash2 className="size-5" />
            </button>
          )}
          <button
            onClick={() => navigate(-1)}
            className="text-primary text-base font-bold leading-normal tracking-[0.015em]"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Amount Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center flex-grow"
      >
        <div className="flex items-center justify-center px-4 pb-3 pt-6">
          <span className="text-slate-800 dark:text-white tracking-tight text-[56px] font-bold leading-tight">
            $
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0"
            className="text-slate-800 dark:text-white tracking-tight text-[56px] font-bold leading-tight bg-transparent border-0 focus:outline-none focus:ring-0 text-center max-w-[300px] placeholder-slate-300 dark:placeholder-slate-600"
            autoFocus
          />
        </div>

        {/* Form Fields */}
        <div className="w-full max-w-md px-4 mt-8 space-y-2">
          {/* Period Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Período
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setPeriod('MONTHLY')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  period === 'MONTHLY'
                    ? 'bg-primary text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setPeriod('YEARLY')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  period === 'YEARLY'
                    ? 'bg-primary text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Anual
              </button>
            </div>
          </div>

          {/* Category */}
          <button
            onClick={() => setShowCategoryPicker(true)}
            className="flex items-center gap-4 bg-background-light dark:bg-background-dark px-4 min-h-14 justify-between border-b border-slate-200 dark:border-slate-700 w-full"
          >
            <div className="flex items-center gap-4">
              <div className="text-slate-600 dark:text-slate-300 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0 size-10">
                <Tag className="size-5" />
              </div>
              <p className="text-slate-800 dark:text-white text-base font-normal leading-normal flex-1 truncate text-left">
                Categoría
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-primary text-base font-medium leading-normal">
                {selectedCategory?.name || 'Seleccionar'}
              </span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex px-4 py-3 sticky bottom-0 bg-background-light dark:bg-background-dark w-full">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={!amount || parseFloat(amount) === 0 || !categoryId || createMutation.isPending || updateMutation.isPending}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 flex-1 bg-primary text-white text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="truncate">
            {createMutation.isPending || updateMutation.isPending
              ? 'Guardando...'
              : isEditing
                ? 'Actualizar'
                : 'Guardar'}
          </span>
        </motion.button>
      </div>

      {/* Category Picker */}
      <CategoryPicker
        isOpen={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        selectedCategory={selectedCategory?.id || ''}
        onSelect={(id) => {
          setCategoryId(id)
          setShowCategoryPicker(false)
        }}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="¿Eliminar presupuesto?"
        message="Esta acción eliminará permanentemente este presupuesto. No podrás recuperarlo."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
