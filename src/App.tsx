import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { queryClient } from '@/lib/queryClient'
import { configureApiAuth } from '@/lib/api/client'
import { ClerkProvider } from '@/providers/ClerkProvider'
import { ProtectedRoute } from '@/components/auth'
import { AppLayout } from '@/components/layout/AppLayout'
import { FormLayout } from '@/components/layout/FormLayout'
import { PageTransition } from '@/components/layout/PageTransition'
import { BottomNav, BottomNavItem } from '@/components/native/BottomNav'
import { SplashScreen } from '@/components/ui/SplashScreen'
import { Home, FolderKanban, History, Wallet } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toaster } from 'sonner'

// Pages
import HomePage from '@/pages/Home'
import ProfilePage from '@/pages/Profile'
import SettingsPage from '@/pages/Settings'
import TransactionFormPage from '@/pages/TransactionForm'
import TransactionHistoryPage from '@/pages/TransactionHistory'
import CategoriesListPage from '@/pages/CategoriesList'
import AccountsListPage from '@/pages/AccountsList'
import MonthlyBudgetsPage from '@/pages/MonthlyBudgets'
import CategoryFormPage from '@/pages/CategoryForm'
import AccountFormPage from '@/pages/AccountForm'
import BudgetFormPage from '@/pages/BudgetForm'
import RecurringPaymentsPage from '@/pages/RecurringPayments'
import SubscriptionFormPage from '@/pages/SubscriptionForm'
import SignInPage from '@/pages/auth/SignIn'
import SignUpPage from '@/pages/auth/SignUp'

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentTab, setCurrentTab] = useState(location.pathname)
  const [showSplash, setShowSplash] = useState(true)
  const { getToken, isLoaded } = useAuth()

  // Configure API client with Clerk auth
  useEffect(() => {
    configureApiAuth(getToken)
  }, [getToken])

  // Hide splash screen after minimum time and auth loaded
  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setShowSplash(false)
      }, 1500) // Show splash for minimum 1.5 seconds
      return () => clearTimeout(timer)
    }
  }, [isLoaded])

  // Sync currentTab with location changes
  useEffect(() => {
    setCurrentTab(location.pathname)
  }, [location.pathname])

  const handleTabChange = (path: string) => {
    setCurrentTab(path)
    navigate(path)
  }

  // Don't show bottom nav on auth pages or form pages
  const isAuthPage = location.pathname.startsWith('/sign-')
  const isFormPage = location.pathname.startsWith('/registro') ||
                     location.pathname.includes('/nueva') ||
                     location.pathname.includes('/nuevo') ||
                     (location.pathname.includes('/categorias/') && location.pathname !== '/categorias') ||
                     (location.pathname.includes('/cuentas/') && location.pathname !== '/cuentas') ||
                     (location.pathname.includes('/presupuestos/') && location.pathname !== '/presupuestos') ||
                     (location.pathname.includes('/suscripciones/') && location.pathname !== '/suscripciones')
  const hideBottomNav = isAuthPage || isFormPage

  return (
    <>
      <Routes location={location}>
        {/* Public Routes */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PageTransition>
                  <HomePage />
                </PageTransition>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PageTransition>
                  <ProfilePage />
                </PageTransition>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PageTransition>
                  <SettingsPage />
                </PageTransition>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/registro"
          element={
            <ProtectedRoute>
              <FormLayout>
                <PageTransition>
                  <TransactionFormPage />
                </PageTransition>
              </FormLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/registro/:id"
          element={
            <ProtectedRoute>
              <FormLayout>
                <PageTransition>
                  <TransactionFormPage />
                </PageTransition>
              </FormLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/historial"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PageTransition>
                  <TransactionHistoryPage />
                </PageTransition>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categorias"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PageTransition>
                  <CategoriesListPage />
                </PageTransition>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cuentas"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PageTransition>
                  <AccountsListPage />
                </PageTransition>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/presupuestos"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PageTransition>
                  <MonthlyBudgetsPage />
                </PageTransition>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categorias/nueva"
          element={
            <ProtectedRoute>
              <FormLayout>
                <PageTransition>
                  <CategoryFormPage />
                </PageTransition>
              </FormLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categorias/:id"
          element={
            <ProtectedRoute>
              <FormLayout>
                <PageTransition>
                  <CategoryFormPage />
                </PageTransition>
              </FormLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cuentas/nueva"
          element={
            <ProtectedRoute>
              <FormLayout>
                <PageTransition>
                  <AccountFormPage />
                </PageTransition>
              </FormLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cuentas/:id"
          element={
            <ProtectedRoute>
              <FormLayout>
                <PageTransition>
                  <AccountFormPage />
                </PageTransition>
              </FormLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/presupuestos/nuevo"
          element={
            <ProtectedRoute>
              <FormLayout>
                <PageTransition>
                  <BudgetFormPage />
                </PageTransition>
              </FormLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/presupuestos/:id"
          element={
            <ProtectedRoute>
              <FormLayout>
                <PageTransition>
                  <BudgetFormPage />
                </PageTransition>
              </FormLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/suscripciones"
          element={
            <ProtectedRoute>
              <AppLayout>
                <PageTransition>
                  <RecurringPaymentsPage />
                </PageTransition>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/suscripciones/nueva"
          element={
            <ProtectedRoute>
              <FormLayout>
                <PageTransition>
                  <SubscriptionFormPage />
                </PageTransition>
              </FormLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/suscripciones/:id"
          element={
            <ProtectedRoute>
              <FormLayout>
                <PageTransition>
                  <SubscriptionFormPage />
                </PageTransition>
              </FormLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Bottom Navigation - Only show on protected routes */}
      {!hideBottomNav && (
        <BottomNav>
          <BottomNavItem
            icon={<Home className="size-6" />}
            label="Home"
            active={currentTab === '/'}
            onClick={() => handleTabChange('/')}
          />
          <BottomNavItem
            icon={<Wallet className="size-6" />}
            label="Presupuestos"
            active={currentTab === '/presupuestos'}
            onClick={() => handleTabChange('/presupuestos')}
          />
          <BottomNavItem
            icon={<FolderKanban className="size-6" />}
            label="Categorías"
            active={currentTab === '/categorias'}
            onClick={() => handleTabChange('/categorias')}
          />
          <BottomNavItem
            icon={<History className="size-6" />}
            label="Transacciones"
            active={currentTab === '/historial'}
            onClick={() => handleTabChange('/historial')}
          />
        </BottomNav>
      )}

      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />

      {/* Splash Screen */}
      <SplashScreen isVisible={showSplash} />
    </>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ClerkProvider>
          <AppContent />
        </ClerkProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
