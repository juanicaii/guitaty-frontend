import { useAuth } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/Skeleton'

interface ProtectedRouteProps {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn } = useAuth()

  // Show loading skeleton while auth is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen p-6 space-y-4">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }

  return <>{children}</>
}
