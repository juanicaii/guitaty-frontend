# Guitaty - PWA Personal Finance

Una aplicación PWA de finanzas personales construida con las mejores prácticas de desarrollo nativo para web.

## 🚀 Stack Tecnológico

- **Vite** - Build tool
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Query** - Data fetching & caching
- **Clerk** - Authentication
- **Zustand** - State management
- **React Router** - Routing
- **dayjs** - Date utilities
- **PWA** - Progressive Web App features

## 📦 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# API Backend
VITE_API_BASE_URL=http://localhost:3000/api

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_tu_key_aqui
```

### 3. Obtener Clerk API Key

1. Ve a [https://clerk.com](https://clerk.com) y crea una cuenta
2. Crea una nueva aplicación
3. Copia tu **Publishable Key** desde el Dashboard
4. Pégala en tu archivo `.env`

Ver guía completa en: **[CLERK_AUTH_GUIDE.md](./CLERK_AUTH_GUIDE.md)**

## 🛠️ Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Build

```bash
npm run build
```

## 📱 Características

### ✅ PWA Completa
- Service Worker con estrategias de caché
- Soporte offline
- Instalable en dispositivos móviles
- Safe areas para iOS/Android

### ✅ Autenticación (Clerk)
- Sign In / Sign Up
- Gestión de sesiones
- Protección de rutas
- Integración automática con API
- Perfil de usuario

### ✅ API Integration
- Cliente HTTP configurado con autenticación
- React Query para data fetching
- Queries y Mutations optimizadas
- Cache automático e invalidación
- Manejo de errores con toasts

### ✅ UI/UX Nativa
- Animaciones con Framer Motion
- Componentes nativos (BottomNav, BottomSheet, etc.)
- Gestos táctiles con @use-gesture
- Haptic feedback
- Transiciones de página
- Modo oscuro (próximamente)

### ✅ Performance
- Code splitting
- Lazy loading
- Optimistic updates
- PWA caching strategies
- TypeScript estricto

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── auth/        # ProtectedRoute
│   ├── native/      # BottomNav, BottomSheet, Header, SafeArea
│   ├── ui/          # Button, Skeleton
│   └── layout/      # AppLayout, PageTransition
├── hooks/
│   ├── queries/     # useAccounts, useTransactions, etc.
│   └── mutations/   # useCreateAccount, useUpdateTransaction, etc.
├── lib/
│   ├── api/         # API client, types, queryKeys
│   ├── services/    # accounts, categories, transactions, etc.
│   ├── animations/  # Transitions, variants
│   └── utils/       # cn, platform detection
├── pages/
│   ├── auth/        # SignIn, SignUp
│   ├── Home.tsx
│   ├── Profile.tsx
│   └── Settings.tsx
├── providers/       # ClerkProvider
├── store/           # Zustand stores
└── styles/          # globals.css
```

## 🎨 Componentes Disponibles

### Nativos
- `SafeAreaView` - Manejo de safe areas iOS/Android
- `BottomNav` + `BottomNavItem` - Navegación inferior animada
- `BottomSheet` - Sheet con gestos de arrastre
- `AppHeader` - Header con navegación

### UI
- `Button` - Botones con variantes (primary, secondary, outline, ghost)
- `Skeleton` - Loading skeletons

### Auth
- `ProtectedRoute` - Protección de rutas con Clerk

### Layout
- `AppLayout` - Layout principal con SafeArea
- `PageTransition` - Transiciones entre páginas

## 🔐 Autenticación

La app usa Clerk para autenticación. Ver documentación completa:

**→ [CLERK_AUTH_GUIDE.md](./CLERK_AUTH_GUIDE.md)**

Rutas públicas:
- `/sign-in` - Inicio de sesión
- `/sign-up` - Registro

Rutas protegidas (requieren autenticación):
- `/` - Dashboard
- `/profile` - Perfil de usuario
- `/settings` - Configuración

## 🌐 API Integration

La app se conecta a una API backend de finanzas personales. Ver documentación:

**→ [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)**
**→ [API_USAGE.md](./API_USAGE.md)**

### Recursos disponibles:
- **Accounts** - Cuentas bancarias
- **Categories** - Categorías de transacciones
- **Transactions** - Transacciones con paginación
- **Subscriptions** - Suscripciones recurrentes
- **Dashboard Stats** - Estadísticas y analytics

### Ejemplo de uso:

```typescript
import { useAccounts, useCreateAccount } from '@/lib/hooks'

function MyComponent() {
  // Query
  const { data: accounts, isLoading } = useAccounts()

  // Mutation
  const createAccount = useCreateAccount()

  const handleCreate = async () => {
    await createAccount.mutateAsync({
      name: 'Savings',
      type: 'SAVINGS',
      currency: 'USD',
    })
  }

  return <div>...</div>
}
```

## 📚 Documentación

- **[CLERK_AUTH_GUIDE.md](./CLERK_AUTH_GUIDE.md)** - Guía completa de autenticación
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Documentación de la API backend
- **[API_USAGE.md](./API_USAGE.md)** - Guía de uso de queries y mutations
- **[PWA_NATIVE_BOILERPLATE_GUIDE.md](./PWA_NATIVE_BOILERPLATE_GUIDE.md)** - Guía PWA original

## 🎯 Próximos Pasos

1. ✅ ~~Instalar dependencias~~
2. ✅ ~~Configurar Clerk Auth~~
3. ✅ ~~Integrar API backend~~
4. 🔄 Generar íconos PWA en `/public/icons/`
5. 🔄 Implementar páginas de Dashboard
6. 🔄 Agregar gráficos y estadísticas
7. 🔄 Implementar modo oscuro
8. 🔄 Configurar analytics
9. 🔄 Configurar error tracking (Sentry)

## 📝 Notas Importantes

- **Clerk Auth**: Necesitas configurar tu Publishable Key en `.env`
- **Backend API**: Debe estar corriendo en `http://localhost:3000/api`
- **Íconos PWA**: Genera íconos usando [PWA Builder](https://www.pwabuilder.com/)
- **Service Worker**: Se genera automáticamente con Vite PWA
- **React Query DevTools**: Disponibles en modo desarrollo

## 🐛 Troubleshooting

### "Missing Clerk Publishable Key"
→ Crea archivo `.env` con tu Clerk key

### "API Connection Failed"
→ Asegúrate que el backend esté corriendo en puerto 3000

### Errores de TypeScript
→ Ejecuta `npm run build` para ver errores detallados

## 🤝 Contribuir

Este proyecto es un boilerplate base. Siéntete libre de:
- Agregar más componentes nativos
- Mejorar las animaciones
- Agregar más páginas
- Personalizar el diseño

## 📄 Licencia

MIT

---

**¿Necesitas ayuda?** Revisa las guías en la carpeta del proyecto:
- `CLERK_AUTH_GUIDE.md` - Autenticación
- `API_USAGE.md` - Integración con API
- `PWA_NATIVE_BOILERPLATE_GUIDE.md` - Componentes PWA
