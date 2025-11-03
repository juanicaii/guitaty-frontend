import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Repeat, Calendar } from 'lucide-react'
import { FAB } from '@/components/ui/FAB'
import { Skeleton } from '@/components/ui/Skeleton'
import { useSubscriptions } from '@/lib/hooks'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

dayjs.locale('es')

export default function RecurringPayments() {
  const navigate = useNavigate()
  const { data: subscriptionsData, isLoading } = useSubscriptions()

  const subscriptions = useMemo(() => {
    return subscriptionsData?.data || []
  }, [subscriptionsData])

  const activeSubscriptions = useMemo(() => {
    return subscriptions.filter(s => s.isActive)
  }, [subscriptions])

  const totalMonthly = useMemo(() => {
    return activeSubscriptions.reduce((sum, sub) => {
      const amount = parseFloat(sub.amount)
      return sum + (sub.billingCycle === 'MONTHLY' ? amount : amount / 12)
    }, 0)
  }, [activeSubscriptions])

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
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-white">
          Pagos Recurrentes
        </h1>
        <div className="size-10"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pt-6 pb-24">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : subscriptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <div className="mb-6 flex items-center justify-center size-20 rounded-full bg-primary/10 dark:bg-primary/20">
              <Repeat className="size-10 text-primary" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Sin suscripciones
            </h2>
            <p className="mb-8 text-center text-gray-600 dark:text-gray-400 max-w-sm">
              Agrega tus suscripciones y pagos recurrentes para tener un mejor control de tus gastos mensuales.
            </p>
            <button
              onClick={() => navigate('/suscripciones/nueva')}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="size-5" />
              Agregar Suscripción
            </button>
          </motion.div>
        ) : (
          <>
            {/* Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg"
            >
              <p className="text-sm font-medium opacity-90 mb-1">Gasto mensual total</p>
              <p className="text-3xl font-bold">${totalMonthly.toFixed(2)}</p>
              <p className="text-sm opacity-75 mt-2">{activeSubscriptions.length} suscripciones activas</p>
            </motion.div>

            {/* Subscriptions List */}
            <div className="space-y-3">
              {subscriptions.map((subscription, index) => {
                const nextBilling = dayjs(subscription.nextBillingDate)
                const daysUntil = nextBilling.diff(dayjs(), 'day')

                return (
                  <motion.div
                    key={subscription.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/suscripciones/${subscription.id}`)}
                    className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 dark:bg-primary/20 shrink-0">
                          <Repeat className="size-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {subscription.name}
                          </h3>
                          {subscription.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {subscription.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-3">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ${parseFloat(subscription.amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {subscription.billingCycle === 'MONTHLY' ? '/mes' : '/año'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="size-4" />
                        <span>Próximo pago: {nextBilling.format('DD/MM/YYYY')}</span>
                      </div>
                      {daysUntil <= 7 && daysUntil >= 0 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                          {daysUntil === 0 ? 'Hoy' : `${daysUntil}d`}
                        </span>
                      )}
                      {!subscription.isActive && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                          Inactiva
                        </span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </>
        )}
      </main>

      {/* FAB */}
      {subscriptions.length > 0 && (
        <FAB onClick={() => navigate('/suscripciones/nueva')} />
      )}
    </div>
  )
}
