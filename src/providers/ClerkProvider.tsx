import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error('Missing Clerk Publishable Key')
}

interface ClerkProviderProps {
  children: ReactNode
}

export const ClerkProvider = ({ children }: ClerkProviderProps) => {
  const navigate = useNavigate()

  return (
    <BaseClerkProvider
      publishableKey={publishableKey}
      navigate={(to) => navigate(to)}
    >
      {children}
    </BaseClerkProvider>
  )
}
