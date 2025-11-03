import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Tag, Calendar, FileText, ChevronRight, Trash2, Wallet } from 'lucide-react'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { CategoryPicker } from '@/components/forms/CategoryPicker'
import { DatePicker } from '@/components/forms/DatePicker'
import { useTransaction, useCreateTransaction, useUpdateTransaction, useDeleteTransaction, useAccounts, useCategories } from '@/lib/hooks'
import { Skeleton } from '@/components/ui/Skeleton'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { TransactionType } from '@/lib/api/types'
import 'dayjs/locale/es'

dayjs.extend(utc)
dayjs.locale('es')

export default function TransactionForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)

  const [amount, setAmount] = useState('0')
  const [categoryId, setCategoryId] = useState<string>('')
  const [accountId, setAccountId] = useState<string>('')
  const [transactionType, setTransactionType] = useState<TransactionType>('EXPENSE')
  const [date, setDate] = useState<Dayjs>(dayjs())
  const [note, setNote] = useState('')
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch data
  const { data: transaction, isLoading: isLoadingTransaction } = useTransaction(id || '', { enabled: isEditing })
  const { data: accounts = [] } = useAccounts()
  const { data: categories = [] } = useCategories()

  // Mutations
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransaction()

  // Set default account
  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id)
    }
  }, [accounts, accountId])

  // Load transaction data when editing
  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount)
      setCategoryId(transaction.categoryId || '')
      setAccountId(transaction.accountId)
      setTransactionType(transaction.type)
      // Parse date ignoring timezone to prevent date shifting
      const dateStr = transaction.date.split('T')[0]
      setDate(dayjs(dateStr))
      setNote(transaction.description || '')
    }
  }, [transaction])

  const handleAmountChange = (value: string) => {
    const regex = /^\d*\.?\d{0,2}$/
    if (regex.test(value) || value === '') {
      setAmount(value)
    }
  }

  const handleSave = async () => {
    if (!amount || parseFloat(amount) === 0 || !accountId) return

    try {
      const data = {
        amount: parseFloat(amount),
        type: transactionType,
        date: date.format('YYYY-MM-DD'),
        accountId,
        description: note || undefined,
        categoryId: categoryId || undefined,
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
  const selectedAccount = accounts.find(a => a.id === accountId)

  if (isEditing && isLoadingTransaction) {
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
          {isEditing ? 'Editar Transacción' : 'Nueva Transacción'}
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
          {/* Type Selection */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setTransactionType('EXPENSE')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                transactionType === 'EXPENSE'
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Gasto
            </button>
            <button
              onClick={() => setTransactionType('INCOME')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                transactionType === 'INCOME'
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Ingreso
            </button>
          </div>

          {/* Account */}
          <div className="flex items-center gap-4 bg-background-light dark:bg-background-dark px-4 min-h-14 border-b border-slate-200 dark:border-slate-700">
            <div className="text-slate-600 dark:text-slate-300 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0 size-10">
              <Wallet className="size-5" />
            </div>
            <p className="text-slate-800 dark:text-white text-base font-normal leading-normal flex-1">
              Cuenta
            </p>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="bg-transparent text-primary text-base font-medium focus:outline-none"
            >
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.currency})
                </option>
              ))}
            </select>
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
              <ChevronRight className="size-5 text-slate-400 dark:text-slate-500" />
            </div>
          </button>

          {/* Date */}
          <button
            onClick={() => setShowDatePicker(true)}
            className="flex items-center gap-4 bg-background-light dark:bg-background-dark px-4 min-h-14 justify-between border-b border-slate-200 dark:border-slate-700 w-full"
          >
            <div className="flex items-center gap-4">
              <div className="text-slate-600 dark:text-slate-300 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0 size-10">
                <Calendar className="size-5" />
              </div>
              <p className="text-slate-800 dark:text-white text-base font-normal leading-normal flex-1 truncate text-left">
                Fecha
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-primary text-base font-medium leading-normal">
                {date.isSame(dayjs(), 'day')
                  ? 'Hoy'
                  : date.isSame(dayjs().subtract(1, 'day'), 'day')
                  ? 'Ayer'
                  : date.format('DD/MM/YYYY')}
              </span>
              <ChevronRight className="size-5 text-slate-400 dark:text-slate-500" />
            </div>
          </button>

          {/* Note */}
          <div className="flex items-center gap-4 bg-background-light dark:bg-background-dark px-4 min-h-14">
            <div className="flex items-center gap-4 w-full">
              <div className="text-slate-600 dark:text-slate-300 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0 size-10">
                <FileText className="size-5" />
              </div>
              <input
                className="flex-1 bg-transparent text-slate-800 dark:text-white text-base font-normal leading-normal placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 border-0 p-0 focus:outline-none"
                placeholder="Añadir una nota..."
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex px-4 py-3 sticky bottom-0 bg-background-light dark:bg-background-dark w-full">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={!amount || parseFloat(amount) === 0 || createMutation.isPending || updateMutation.isPending}
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

      {/* Pickers */}
      <CategoryPicker
        isOpen={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        selectedCategory={selectedCategory?.id || ''}
        onSelect={(id) => {
          setCategoryId(id)
          setShowCategoryPicker(false)
        }}
      />
      <DatePicker
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={date}
        onSelect={setDate}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="¿Eliminar transacción?"
        message="Esta acción eliminará permanentemente esta transacción. No podrás recuperarla."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
