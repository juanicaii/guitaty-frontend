# API Usage Guide

## Configuración Inicial

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
VITE_API_BASE_URL=http://localhost:3000/api
```

### 2. Configurar Autenticación Clerk (Opcional)

Si usas Clerk para autenticación, configura el token getter en tu `App.tsx`:

```typescript
import { useAuth } from '@clerk/clerk-react'
import { configureApiAuth } from '@/lib/api/client'

function App() {
  const { getToken } = useAuth()

  // Configure auth on mount
  useEffect(() => {
    configureApiAuth(getToken)
  }, [getToken])

  // Rest of your app...
}
```

---

## Uso de Hooks

### Queries (Lectura de Datos)

#### Accounts

```typescript
import { useAccounts, useAccount } from '@/lib/hooks'

function AccountsPage() {
  // Get all accounts
  const { data: accounts, isLoading, error } = useAccounts()

  // Get specific account
  const { data: account } = useAccount('account_id')

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {accounts?.map(account => (
        <div key={account.id}>{account.name}</div>
      ))}
    </div>
  )
}
```

#### Categories

```typescript
import { useCategories, useCategory } from '@/lib/hooks'

function CategoriesPage() {
  const { data: categories } = useCategories()
  const { data: category } = useCategory('category_id')

  return <div>...</div>
}
```

#### Transactions

```typescript
import { useTransactions, useTransaction } from '@/lib/hooks'

function TransactionsPage() {
  // With filters and pagination
  const { data, isLoading } = useTransactions({
    page: 1,
    limit: 20,
    type: 'EXPENSE',
    accountId: 'account_123',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
  })

  // Access data and pagination
  const transactions = data?.data
  const pagination = data?.pagination

  return (
    <div>
      {transactions?.map(tx => (
        <div key={tx.id}>{tx.description}</div>
      ))}
      <div>
        Page {pagination?.page} of {pagination?.totalPages}
      </div>
    </div>
  )
}
```

#### Subscriptions

```typescript
import { useSubscriptions, useSubscription } from '@/lib/hooks'

function SubscriptionsPage() {
  // Filter by active status
  const { data } = useSubscriptions(true) // only active

  return <div>...</div>
}
```

#### Dashboard Stats

```typescript
import { useDashboardStats } from '@/lib/hooks'

function Dashboard() {
  const { data: stats } = useDashboardStats({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
  })

  return (
    <div>
      <h2>USD Stats</h2>
      <p>Income: ${stats?.usd.totalIncome}</p>
      <p>Expenses: ${stats?.usd.totalExpenses}</p>
      <p>Net: ${stats?.usd.netIncome}</p>

      <h2>ARS Stats</h2>
      <p>Income: ${stats?.ars.totalIncome}</p>
      <p>Expenses: ${stats?.ars.totalExpenses}</p>
    </div>
  )
}
```

---

### Mutations (Modificación de Datos)

#### Create Account

```typescript
import { useCreateAccount } from '@/lib/hooks'

function CreateAccountForm() {
  const createAccount = useCreateAccount()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await createAccount.mutateAsync({
        name: 'My Savings',
        type: 'SAVINGS',
        balance: 1000,
        currency: 'USD',
      })
      // Success toast shown automatically
      // Accounts list refetched automatically
    } catch (error) {
      // Error toast shown automatically
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button
        type="submit"
        disabled={createAccount.isPending}
      >
        {createAccount.isPending ? 'Creando...' : 'Crear'}
      </button>
    </form>
  )
}
```

#### Update Account

```typescript
import { useUpdateAccount } from '@/lib/hooks'

function EditAccountForm({ accountId }) {
  const updateAccount = useUpdateAccount()

  const handleSubmit = async (data) => {
    await updateAccount.mutateAsync({
      id: accountId,
      data: {
        name: 'Updated Name',
        balance: 2000,
      },
    })
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

#### Delete Account

```typescript
import { useDeleteAccount } from '@/lib/hooks'

function AccountItem({ account }) {
  const deleteAccount = useDeleteAccount()

  const handleDelete = async () => {
    if (confirm('¿Eliminar cuenta?')) {
      await deleteAccount.mutateAsync(account.id)
    }
  }

  return (
    <div>
      <span>{account.name}</span>
      <button onClick={handleDelete}>Eliminar</button>
    </div>
  )
}
```

#### Create Transaction

```typescript
import { useCreateTransaction } from '@/lib/hooks'

function NewTransactionForm() {
  const createTransaction = useCreateTransaction()

  const handleSubmit = async (data) => {
    await createTransaction.mutateAsync({
      amount: 45.99,
      type: 'EXPENSE',
      date: new Date().toISOString(),
      accountId: 'account_123',
      categoryId: 'cat_groceries',
      description: 'Grocery shopping',
    })
  }

  return <form>...</form>
}
```

---

## Patrones Avanzados

### Loading States

```typescript
function MyComponent() {
  const { data, isLoading, isFetching, isError } = useAccounts()

  if (isLoading) return <Skeleton />
  if (isError) return <ErrorMessage />

  return (
    <div>
      {isFetching && <LoadingSpinner />}
      {/* Your content */}
    </div>
  )
}
```

### Optimistic Updates

Los mutations ya incluyen optimistic updates automáticos. Al crear/actualizar/eliminar:
- Se invalidan las queries relacionadas
- Los datos se refrescan automáticamente
- El cache se actualiza de forma optimista

### Conditional Queries

```typescript
function AccountDetails({ accountId }) {
  // Only fetch if accountId exists
  const { data } = useAccount(accountId, !!accountId)

  return <div>...</div>
}
```

### Pagination

```typescript
function TransactionsList() {
  const [page, setPage] = useState(1)

  const { data } = useTransactions({ page, limit: 20 })

  return (
    <div>
      {/* transactions list */}
      <button
        onClick={() => setPage(p => p - 1)}
        disabled={!data?.pagination.hasPrev}
      >
        Previous
      </button>
      <button
        onClick={() => setPage(p => p + 1)}
        disabled={!data?.pagination.hasNext}
      >
        Next
      </button>
    </div>
  )
}
```

### Error Handling Custom

```typescript
function MyComponent() {
  const { data, error } = useAccounts()

  if (error instanceof ApiClientError) {
    if (error.status === 401) {
      // Redirect to login
    } else if (error.status === 404) {
      return <NotFound />
    }
  }

  return <div>...</div>
}
```

---

## TypeScript Types

Todos los tipos están disponibles:

```typescript
import type {
  Account,
  Category,
  Transaction,
  Subscription,
  DashboardStats,
  AccountType,
  Currency,
  TransactionType,
  BillingCycle,
} from '@/lib/api/types'
```

---

## Query Keys

Para invalidaciones manuales:

```typescript
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api/queryKeys'

function MyComponent() {
  const queryClient = useQueryClient()

  const refreshAccounts = () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.accounts.lists()
    })
  }

  return <button onClick={refreshAccounts}>Refresh</button>
}
```

---

## Servicios Directos

Si necesitas llamar a la API fuera de React:

```typescript
import { accountsService } from '@/lib/services/accounts.service'

async function someFunction() {
  const accounts = await accountsService.getAll()
  const account = await accountsService.getById('id')

  const newAccount = await accountsService.create({
    name: 'New Account',
    type: 'CHECKING',
  })
}
```

---

## Resumen de Hooks Disponibles

### Queries
- `useAccounts()` - Lista de cuentas
- `useAccount(id)` - Cuenta específica
- `useCategories()` - Lista de categorías
- `useCategory(id)` - Categoría específica
- `useTransactions(filters?)` - Lista de transacciones con filtros
- `useTransaction(id)` - Transacción específica
- `useSubscriptions(isActive?)` - Lista de suscripciones
- `useSubscription(id)` - Suscripción específica
- `useDashboardStats(filters?)` - Estadísticas del dashboard

### Mutations
- `useCreateAccount()` - Crear cuenta
- `useUpdateAccount()` - Actualizar cuenta
- `useDeleteAccount()` - Eliminar cuenta
- `useCreateCategory()` - Crear categoría
- `useUpdateCategory()` - Actualizar categoría
- `useDeleteCategory()` - Eliminar categoría
- `useCreateTransaction()` - Crear transacción
- `useUpdateTransaction()` - Actualizar transacción
- `useDeleteTransaction()` - Eliminar transacción
- `useCreateSubscription()` - Crear suscripción
- `useUpdateSubscription()` - Actualizar suscripción
- `useDeleteSubscription()` - Eliminar suscripción

---

## Notas Importantes

1. **Autenticación**: Configura Clerk antes de usar la API
2. **Toasts**: Los mutations muestran toasts automáticamente con sonner
3. **Cache**: React Query maneja el cache automáticamente
4. **Invalidación**: Las mutaciones invalidan queries relacionadas automáticamente
5. **Error Handling**: Los errores se manejan automáticamente con toasts
6. **TypeScript**: Todos los tipos están completamente tipados
