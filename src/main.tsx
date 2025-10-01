import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

console.log('Clerk Key loaded:', PUBLISHABLE_KEY?.substring(0, 20) + '...')

// Suprimir errores de cookies en desarrollo
if (import.meta.env.DEV) {
  const originalError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.('__clerk_test_etld') || args[0]?.includes?.('cookie')) {
      return; // Suprimir errores de cookies de Clerk
    }
    originalError.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/"
      signInUrl="/"
      signUpUrl="/"
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#3b82f6'
        }
      }}
      isSatellite={false}
      domain={window.location.hostname}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
