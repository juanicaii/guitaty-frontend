import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Tag, Calendar, FileText, ChevronRight, Trash2, Wallet, Repeat } from 'lucide-react'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { CategoryPicker } from '@/components/forms/CategoryPicker'
import { DatePicker } from '@/components/forms/DatePicker'
import { useSubscription, useCreateSubscription, useUpdateSubscription, useDeleteSubscription, useAccounts, useCategories } from '@/lib/hooks'
import { Skeleton } from '@/components/ui/Skeleton'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { BillingCycle } from '@/lib/api/types'
import 'dayjs/locale/es'

dayjs.extend(utc)
dayjs.locale('es')

export default function SubscriptionForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)

  const [name, setName] = useState('')
  const [amount, setAmount] = useState('0')
  const [categoryId, setCategoryId] = useState<string>('')
  const [accountId, setAccountId] = useState<string>('')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY')
  const [nextBillingDate, setNextBillingDate] = useState<Dayjs>(dayjs().add(1, 'month'))
  const [description, setDescription] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [showCategoryPicker, setShowCategoryPicker] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch data
  const { data: subscription, isLoading: isLoadingSubscription } = useSubscription(id || '', isEditing)
  const { data: accounts = [] } = useAccounts()
  const { data: categories = [] } = useCategories()

  // Mutations
  const createMutation = useCreateSubscription()
  const updateMutation = useUpdateSubscription()
  const deleteMutation = useDeleteSubscription()

  // Set default account
  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id)
    }
  }, [accounts, accountId])

  // Load subscription data when editing
  useEffect(() => {
    if (subscription) {
      setName(subscription.name)
      setAmount(subscription.amount)
      setCategoryId(subscription.categoryId || '')
      setAccountId(subscription.accountId)
      setBillingCycle(subscription.billingCycle)
      // Parse date ignoring timezone to prevent date shifting
      const dateStr = subscription.nextBillingDate.split('T')[0]
      setNextBillingDate(dayjs(dateStr))
      setDescription(subscription.description || '')
      setIsActive(subscription.isActive)
    }
  }, [subscription])

  const handleAmountChange = (value: string) => {
    const regex = /^\d*\.?\d{0,2}$/
    if (regex.test(value) || value === '') {
      setAmount(value)
    }
  }

  const handleSave = async () => {
    if (!name || !amount || parseFloat(amount) === 0 || !accountId) return

    try {
      const data = {
        name,
        amount: parseFloat(amount),
        billingCycle,
        nextBillingDate: nextBillingDate.format('YYYY-MM-DD'),
        accountId,
        description: description || undefined,
        categoryId: categoryId || undefined,
        ...(isEditing && { isActive }),
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

  if (isEditing && isLoadingSubscription) {
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
          {isEditing ? 'Editar Suscripción' : 'Nueva Suscripción'}
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

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="w-full max-w-md mx-auto px-4 pt-6">
          {/* Name Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre de la suscripción
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Netflix, Spotify, Gym..."
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </motion.div>

          {/* Amount Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monto
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-800 dark:text-white">$</span>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-slate-800 dark:text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </motion.div>

          {/* Billing Cycle Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ciclo de facturación
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setBillingCycle('MONTHLY')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  billingCycle === 'MONTHLY'
                    ? 'bg-primary text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setBillingCycle('YEARLY')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                  billingCycle === 'YEARLY'
                    ? 'bg-primary text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Anual
              </button>
            </div>
          </motion.div>

          {/* Form Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-2"
          >
            {/* Account */}
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 min-h-14 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="text-slate-600 dark:text-slate-300 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0 size-10">
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
              className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 min-h-14 justify-between border border-gray-200 dark:border-gray-700 rounded-xl w-full"
            >
              <div className="flex items-center gap-4">
                <div className="text-slate-600 dark:text-slate-300 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0 size-10">
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

            {/* Next Billing Date */}
            <button
              onClick={() => setShowDatePicker(true)}
              className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 min-h-14 justify-between border border-gray-200 dark:border-gray-700 rounded-xl w-full"
            >
              <div className="flex items-center gap-4">
                <div className="text-slate-600 dark:text-slate-300 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0 size-10">
                  <Calendar className="size-5" />
                </div>
                <p className="text-slate-800 dark:text-white text-base font-normal leading-normal flex-1 truncate text-left">
                  Próximo pago
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className="text-primary text-base font-medium leading-normal">
                  {nextBillingDate.format('DD/MM/YYYY')}
                </span>
                <ChevronRight className="size-5 text-slate-400 dark:text-slate-500" />
              </div>
            </button>

            {/* Description */}
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 min-h-14 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-center gap-4 w-full">
                <div className="text-slate-600 dark:text-slate-300 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0 size-10">
                  <FileText className="size-5" />
                </div>
                <input
                  className="flex-1 bg-transparent text-slate-800 dark:text-white text-base font-normal leading-normal placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 border-0 p-0 focus:outline-none"
                  placeholder="Añadir una nota..."
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Is Active Toggle (only in edit mode) */}
            {isEditing && (
              <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 min-h-14 border border-gray-200 dark:border-gray-700 rounded-xl">
                <div className="flex items-center gap-4 w-full">
                  <div className="text-slate-600 dark:text-slate-300 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0 size-10">
                    <Repeat className="size-5" />
                  </div>
                  <p className="text-slate-800 dark:text-white text-base font-normal leading-normal flex-1">
                    Activa
                  </p>
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      isActive ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        isActive ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex px-4 py-3 sticky bottom-0 bg-background-light dark:bg-background-dark w-full">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={!name || !amount || parseFloat(amount) === 0 || createMutation.isPending || updateMutation.isPending}
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
        selectedDate={nextBillingDate}
        onSelect={setNextBillingDate}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="¿Eliminar suscripción?"
        message="Esta acción eliminará permanentemente esta suscripción. No podrás recuperarla."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
