import { AppHeader } from '@/components/native/Header'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'
import dayjs from 'dayjs'

export default function Profile() {
  const navigate = useNavigate()
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex flex-col">
        <AppHeader title="Perfil" onBackPress={() => navigate('/')} />
        <main className="p-6 space-y-6">
          <div className="card-native p-6 text-center space-y-4">
            <Skeleton className="w-24 h-24 rounded-full mx-auto" />
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <AppHeader title="Perfil" onBackPress={() => navigate('/')} />

      <main className="p-6 space-y-6 pb-24-safe">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-native p-6 text-center space-y-4"
        >
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.fullName || 'User'}
              className="w-24 h-24 rounded-full mx-auto border-4 border-ios-blue"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-ios-blue to-blue-600 rounded-full mx-auto flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.fullName || 'Usuario'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              @{user?.username || user?.firstName?.toLowerCase() || 'usuario'}
            </p>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="card-native p-4 flex items-center gap-4">
            <Mail className="w-5 h-5 text-ios-blue flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {user?.primaryEmailAddress?.emailAddress || 'No email'}
              </p>
            </div>
          </div>

          <div className="card-native p-4 flex items-center gap-4">
            <Calendar className="w-5 h-5 text-ios-blue flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Miembro desde
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {user?.createdAt
                  ? dayjs(user.createdAt).format('DD/MM/YYYY')
                  : 'N/A'}
              </p>
            </div>
          </div>

          <div className="card-native p-4 flex items-center gap-4">
            <User className="w-5 h-5 text-ios-blue flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
              <p className="font-mono text-xs text-gray-600 dark:text-gray-400 truncate">
                {user?.id}
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
