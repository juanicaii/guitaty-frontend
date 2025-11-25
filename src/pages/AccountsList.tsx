import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Landmark, TrendingUp, Wallet, CreditCard, DollarSign, FileText } from 'lucide-react'
import { AccountCard } from '@/components/accounts'
import { FAB } from '@/components/ui/FAB'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAccounts } from '@/lib/hooks'
import type { AccountType } from '@/lib/api/types'

// Map account types to icons
const getAccountIcon = (type: AccountType) => {
  switch (type) {
    case 'SAVINGS':
      return <Landmark className="size-6" />
    case 'INVESTMENT':
      return <TrendingUp className="size-6" />
    case 'CHECKING':
      return <Wallet className="size-6" />
    case 'CREDIT_CARD':
      return <CreditCard className="size-6" />
    case 'CASH':
      return <DollarSign className="size-6" />
    case 'OTHER':
    default:
      return <FileText className="size-6" />
  }
}

// Map account types to Spanish labels
const getAccountTypeLabel = (type: AccountType) => {
  switch (type) {
    case 'SAVINGS':
      return 'Ahorros'
    case 'INVESTMENT':
      return 'Inversión'
    case 'CHECKING':
      return 'Cuenta Corriente'
    case 'CREDIT_CARD':
      return 'Tarjeta de Crédito'
    case 'CASH':
      return 'Efectivo'
    case 'OTHER':
    default:
      return 'Otra'
  }
}

export default function AccountsList() {
  const navigate = useNavigate()
  const { data: accounts = [], isLoading } = useAccounts()

  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, account) => sum + parseFloat(account.balance), 0)
  }, [accounts])

  const handleAccountClick = (id: string) => {
    navigate(`/cuentas/${id}`)
  }

  const handleAddAccount = () => {
    navigate('/cuentas/nueva')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="relative flex w-full flex-col bg-background-light dark:bg-background-dark">
        <header className="sticky top-0 z-10 flex items-center border-b border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark p-4 pb-2 pt-safe">
          <div className="flex h-12 w-12"></div>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">
            Mis Cuentas
          </h1>
          <div className="flex h-12 w-12"></div>
        </header>
        <main className="flex-grow px-4 pt-6 pb-24-safe">
          <Skeleton className="mb-8 h-28 w-full rounded-xl" />
          <Skeleton className="mb-3 h-20 w-full rounded-xl" />
          <Skeleton className="mb-3 h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center border-b border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark p-4 pb-2 pt-safe">
        <div className="flex h-12 w-12"></div>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">
          Mis Cuentas
        </h1>
        <div className="flex h-12 w-12"></div>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-4 pt-6 pb-24">
        {/* Total Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-xl bg-zinc-900 dark:bg-[#1C2431] p-6 text-white shadow-lg"
        >
          <p className="text-sm font-medium text-gray-400">Balance Total</p>
          <p className="mt-1 text-4xl font-bold tracking-tight">
            {formatCurrency(totalBalance)}
          </p>
        </motion.div>

        {/* Accounts List */}
        <div className="space-y-3">
          {accounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <AccountCard
                id={account.id}
                name={account.name}
                type={getAccountTypeLabel(account.type)}
                balance={parseFloat(account.balance)}
                currency={account.currency}
                icon={getAccountIcon(account.type)}
                onClick={() => handleAccountClick(account.id)}
              />
            </motion.div>
          ))}
        </div>
      </main>

      {/* FAB */}
      <FAB onClick={handleAddAccount} />
    </div>
  )
}
