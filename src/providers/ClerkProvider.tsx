import { ClerkProvider as BaseClerkProvider, useAuth } from '@clerk/clerk-react'
import { ReactNode, useEffect } from 'react'
import { setGetTokenFunction } from '@/lib/api'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key')
}

interface ClerkProviderProps {
  children: ReactNode
}

function AuthTokenSync({ children }: { children: ReactNode }) {
  const { getToken } = useAuth()

  useEffect(() => {
    // Set the getToken function so axios interceptor can use it
    setGetTokenFunction(getToken)
  }, [getToken])

  return <>{children}</>
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  return (
    <BaseClerkProvider publishableKey={clerkPubKey}>
      <AuthTokenSync>{children}</AuthTokenSync>
    </BaseClerkProvider>
  )
}
