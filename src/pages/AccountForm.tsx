import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { X, Trash2 } from 'lucide-react'
import { useAccount, useCreateAccount, useUpdateAccount, useDeleteAccount } from '@/lib/hooks'
import { Skeleton } from '@/components/ui/Skeleton'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { AccountType, Currency } from '@/lib/api/types'

const ACCOUNT_TYPES: Array<{ value: AccountType; label: string }> = [
  { value: 'SAVINGS', label: 'Ahorros' },
  { value: 'CASH', label: 'Efectivo' },
  { value: 'INVESTMENT', label: 'Inversiones' },
  { value: 'CREDIT_CARD', label: 'Tarjeta de Crédito' },
  { value: 'CHECKING', label: 'Cuenta Corriente' },
  { value: 'OTHER', label: 'Otro' },
]

const CURRENCIES: Array<{ value: Currency; label: string }> = [
  { value: 'USD', label: 'USD - Dólar' },
  { value: 'ARS', label: 'ARS - Peso Argentino' },
]

const AccountForm = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)

  const [accountName, setAccountName] = useState('')
  const [accountType, setAccountType] = useState<AccountType>('SAVINGS')
  const [currency, setCurrency] = useState<Currency>('USD')
  const [initialBalance, setInitialBalance] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch account if editing
  const { data: account, isLoading: isLoadingAccount } = useAccount(id || '', isEditing)

  // Mutations
  const createMutation = useCreateAccount()
  const updateMutation = useUpdateAccount()
  const deleteMutation = useDeleteAccount()

  // Load account data when editing
  useEffect(() => {
    if (account) {
      setAccountName(account.name)
      setAccountType(account.type)
      setCurrency(account.currency)
      setInitialBalance(account.balance)
    }
  }, [account])

  const handleSave = async () => {
    if (!accountName.trim()) return

    try {
      const data = {
        name: accountName,
        type: accountType,
        currency,
        balance: initialBalance ? parseFloat(initialBalance) : 0,
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

  const handleClose = () => {
    navigate(-1)
  }

  const canSave = accountName.trim() && accountType

  if (isEditing && isLoadingAccount) {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
        <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-40" />
          <div className="w-12" />
        </div>
        <div className="p-4 space-y-6">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <main className="flex h-full flex-grow flex-col">
        {/* Header */}
        <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between">
          <button
            onClick={handleClose}
            className="text-gray-800 dark:text-gray-200 flex size-12 shrink-0 items-center justify-center"
          >
            <X className="size-6" />
          </button>
          <h2 className="text-gray-900 dark:text-gray-100 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
            {isEditing ? 'Editar Cuenta' : 'Añadir Nueva Cuenta'}
          </h2>
          <div className="flex size-12 shrink-0 items-center justify-end">
            {isEditing && (
              <button
                onClick={handleDeleteClick}
                className="text-red-500 dark:text-red-400 hover:text-red-700"
              >
                <Trash2 className="size-5" />
              </button>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex-grow p-4">
          <div className="flex flex-col gap-6">
            {/* Account Name */}
            <label className="flex flex-col flex-1">
              <p className="text-gray-800 dark:text-gray-300 text-base font-medium leading-normal pb-2">
                Nombre de la cuenta
              </p>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base font-normal leading-normal"
                placeholder="Mi cuenta de ahorros"
              />
            </label>

            {/* Account Type */}
            <label className="flex flex-col flex-1">
              <p className="text-gray-800 dark:text-gray-300 text-base font-medium leading-normal pb-2">
                Tipo de cuenta
              </p>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as AccountType)}
                className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base font-normal leading-normal"
              >
                <option value="" disabled>
                  Seleccionar tipo
                </option>
                {ACCOUNT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Currency */}
            <label className="flex flex-col flex-1">
              <p className="text-gray-800 dark:text-gray-300 text-base font-medium leading-normal pb-2">
                Moneda
              </p>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-4 text-base font-normal leading-normal"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.value} value={curr.value}>
                    {curr.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Initial Balance */}
            <label className="flex flex-col flex-1">
              <p className="text-gray-800 dark:text-gray-300 text-base font-medium leading-normal pb-2">
                {isEditing ? 'Saldo actual' : 'Saldo inicial'}
              </p>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 dark:text-gray-500 text-base">
                  {currency === 'USD' ? '$' : '$'}
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-gray-100 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-background-dark focus:border-primary h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 pl-8 pr-4 py-4 text-base font-normal leading-normal"
                  placeholder="0.00"
                />
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="sticky bottom-0 bg-background-light dark:bg-background-dark p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleSave}
            disabled={!canSave || createMutation.isPending || updateMutation.isPending}
            className="flex min-w-[84px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background-light dark:focus:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="truncate">
              {createMutation.isPending || updateMutation.isPending
                ? 'Guardando...'
                : isEditing
                  ? 'Actualizar Cuenta'
                  : 'Guardar Cuenta'}
            </span>
          </button>
        </div>
      </main>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="¿Eliminar cuenta?"
        message="Esta acción eliminará permanentemente esta cuenta y todas sus transacciones asociadas. No podrás recuperarlas."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}

export default AccountForm
