import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Moon,
  Calendar,
} from 'lucide-react'
import { usePaymentDate } from '@/hooks/usePaymentDate'

export default function Settings() {
  const navigate = useNavigate()
  const { signOut, openUserProfile } = useClerk()
  const { user } = useUser()
  const [darkMode, setDarkMode] = useState(true)
  const { paymentDate, setPaymentDate } = usePaymentDate()
  const [isEditingDate, setIsEditingDate] = useState(false)
  const [tempDate, setTempDate] = useState(paymentDate.toString())

  const handleSignOut = async () => {
    await signOut()
    navigate('/sign-in')
  }

  const handleDateChange = () => {
    const newDate = parseInt(tempDate, 10)
    if (!isNaN(newDate) && newDate >= 1 && newDate <= 31) {
      setPaymentDate(newDate)
      setIsEditingDate(false)
    }
  }

  const handleCancelEdit = () => {
    setTempDate(paymentDate.toString())
    setIsEditingDate(false)
  }

  const preferenceItems = [
    {
      icon: Moon,
      label: 'Modo oscuro',
      toggle: true,
      value: darkMode,
      onChange: setDarkMode,
    },
  ]

  return (
    <div className="relative flex w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 sticky top-0 z-10 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 pt-safe">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 shrink-0 items-center justify-center text-gray-900 dark:text-white"
        >
          <ArrowLeft className="size-6" />
        </button>
        <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 dark:text-white flex-1 text-center">
          Ajustes
        </h1>
        <div className="size-10 shrink-0"></div>
      </div>

      <div className="flex flex-col p-4 space-y-8 pb-24">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-16 w-16 overflow-hidden">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {user?.firstName?.[0] || 'U'}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center flex-1 min-w-0">
            <p className="text-gray-900 dark:text-white text-lg font-bold leading-tight truncate">
              {user?.fullName || 'Usuario'}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal truncate">
              {user?.primaryEmailAddress?.emailAddress || 'email@ejemplo.com'}
            </p>
            <button
              onClick={() => openUserProfile()}
              className="text-primary text-sm font-medium leading-normal mt-1 text-left"
            >
              Editar Perfil
            </button>
          </div>
        </motion.div>

        {/* Sections Container */}
        <div className="flex flex-col space-y-6">
          {/* Preferencias Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-sm font-bold leading-tight tracking-widest text-text-light-secondary dark:text-text-dark-secondary px-4 pb-2 uppercase">
              Preferencias
            </h2>
            <div className="flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark">
              {preferenceItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 p-4 min-h-14 justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-expense-green dark:text-expense-green-dark flex items-center justify-center rounded-lg bg-expense-green/10 dark:bg-expense-green-dark/10 shrink-0 size-10">
                      <item.icon className="size-5" />
                    </div>
                    <p className="text-text-light-primary dark:text-text-dark-primary text-base font-normal leading-normal flex-1 truncate">
                      {item.label}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={item.value}
                      onChange={(e) => item.onChange?.(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-expense-green dark:peer-checked:bg-expense-green-dark"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Configuración Financiera Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-sm font-bold leading-tight tracking-widest text-text-light-secondary dark:text-text-dark-secondary px-4 pb-2 uppercase">
              Configuración Financiera
            </h2>
            <div className="flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden border border-border-light dark:border-border-dark">
              <div className="flex items-center gap-4 p-4 min-h-14 justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-primary dark:text-primary flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 shrink-0 size-10">
                    <Calendar className="size-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-text-light-primary dark:text-text-dark-primary text-base font-normal leading-normal">
                      Día de cobro
                    </p>
                    <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm leading-normal">
                      Define el inicio de tu mes financiero
                    </p>
                  </div>
                </div>
                {isEditingDate ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={tempDate}
                      onChange={(e) => setTempDate(e.target.value)}
                      className="w-16 px-2 py-1 text-center bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg text-text-light-primary dark:text-text-dark-primary"
                      autoFocus
                    />
                    <button
                      onClick={handleDateChange}
                      className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium"
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingDate(true)}
                    className="px-4 py-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-lg text-base font-semibold hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
                  >
                    Día {paymentDate}
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sign Out Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={handleSignOut}
            className="w-full py-4 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary font-bold text-base hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
          >
            Cerrar Sesión
          </motion.button>

          {/* Version */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-text-light-secondary dark:text-text-dark-secondary pt-4"
          >
            Versión de la aplicación 1.2.3
          </motion.p>
        </div>
      </div>
    </div>
  )
}
