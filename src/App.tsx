import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { ClerkProvider } from './providers/ClerkProvider'
import { QueryProvider } from './providers/QueryProvider'
import { ThemeProvider } from './components/theme-provider'
import { Toaster } from './components/ui/toaster'
import { TooltipProvider } from './components/ui/tooltip'
import { DashboardLayout } from './layouts/DashboardLayout'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { Dashboard } from './pages/Dashboard'
import { Accounts } from './pages/Accounts'
import { Transactions } from './pages/Transactions'
import { Categories } from './pages/Categories'
import { Subscriptions } from './pages/Subscriptions'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="finance-ui-theme">
      <ClerkProvider>
        <QueryProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="accounts" element={<Accounts />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="subscriptions" element={<Subscriptions />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster />
            </BrowserRouter>
          </TooltipProvider>
        </QueryProvider>
      </ClerkProvider>
    </ThemeProvider>
  )
}

export default App
