# Guía de Integración Clerk Authentication

## ✅ Clerk Auth Integrado

La aplicación ahora tiene autenticación completa con Clerk.

## 📦 Setup Inicial

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Crear Cuenta en Clerk

1. Ve a [https://clerk.com](https://clerk.com)
2. Crea una cuenta gratuita
3. Crea una nueva aplicación
4. Ve al Dashboard

### 3. Obtener API Keys

1. En el Dashboard de Clerk, ve a **API Keys**
2. Copia tu **Publishable Key** (comienza con `pk_test_...`)

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` y agrega tu Clerk key:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_tu_key_aqui
```

### 5. Iniciar la Aplicación

```bash
npm run dev
```

---

## 🎨 Características Implementadas

### ✅ Autenticación Completa
- **Sign In** - Inicio de sesión con email/password
- **Sign Up** - Registro de nuevos usuarios
- **Sign Out** - Cierre de sesión
- **Protected Routes** - Rutas protegidas con redirección automática
- **Session Management** - Gestión automática de sesiones

### ✅ Integración con API
- **API Client** configurado automáticamente con tokens de Clerk
- Todas las requests a la API incluyen el token de autenticación
- Refresh automático de tokens

### ✅ UI Components
- Páginas de Sign In/Sign Up con diseño personalizado
- Perfil de usuario con información de Clerk
- Gestión de cuenta desde Settings
- Loading states con skeletons

### ✅ Protección de Rutas
- Todas las rutas principales protegidas
- Redirección automática a `/sign-in` si no está autenticado
- Navegación condicional (bottom nav oculto en auth pages)

---

## 🔧 Configuración Avanzada (Opcional)

### Personalizar Clerk UI

En `src/pages/auth/SignIn.tsx` y `SignUp.tsx`, puedes personalizar el appearance:

```typescript
<ClerkSignIn
  appearance={{
    elements: {
      rootBox: 'w-full',
      card: 'shadow-none',
      formButtonPrimary: 'bg-ios-blue hover:bg-blue-600',
      // más personalizaciones...
    },
    layout: {
      socialButtonsPlacement: 'bottom',
      socialButtonsVariant: 'iconButton',
    },
  }}
/>
```

### Habilitar Proveedores OAuth

1. En Clerk Dashboard, ve a **User & Authentication** > **Social Connections**
2. Habilita los proveedores que desees (Google, GitHub, etc.)
3. Los botones aparecerán automáticamente en Sign In/Sign Up

### Personalizar Redirects

En `src/providers/ClerkProvider.tsx`:

```typescript
<BaseClerkProvider
  publishableKey={publishableKey}
  navigate={(to) => navigate(to)}
  afterSignInUrl="/"
  afterSignUpUrl="/"
  signInUrl="/sign-in"
  signUpUrl="/sign-up"
>
```

---

## 📱 Hooks Disponibles

### useAuth()

```typescript
import { useAuth } from '@clerk/clerk-react'

const { isSignedIn, isLoaded, userId, getToken } = useAuth()

// isSignedIn - boolean, si el usuario está autenticado
// isLoaded - boolean, si Clerk ha cargado
// userId - string | null, ID del usuario
// getToken - función para obtener el token JWT
```

### useUser()

```typescript
import { useUser } from '@clerk/clerk-react'

const { user, isLoaded } = useUser()

// user.fullName
// user.primaryEmailAddress?.emailAddress
// user.imageUrl
// user.username
// user.createdAt
```

### useClerk()

```typescript
import { useClerk } from '@clerk/clerk-react'

const { signOut, openUserProfile } = useClerk()

// signOut() - cerrar sesión
// openUserProfile() - abrir modal de gestión de perfil
```

---

## 🛡️ Seguridad

### Tokens JWT

- Los tokens se generan automáticamente por Clerk
- Se incluyen en todas las requests a la API
- Se refrescan automáticamente antes de expirar
- Son seguros y no se almacenan en localStorage

### Protected Routes

```typescript
import { ProtectedRoute } from '@/components/auth'

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Backend Verification

En tu backend, verifica los tokens con Clerk:

```typescript
import { clerkClient } from '@clerk/clerk-sdk-node'

// Verificar token en middleware
const token = req.headers.authorization?.replace('Bearer ', '')
const user = await clerkClient.verifyToken(token)
```

---

## 🚀 Rutas Disponibles

### Públicas
- `/sign-in` - Página de inicio de sesión
- `/sign-up` - Página de registro

### Protegidas (requieren autenticación)
- `/` - Home
- `/profile` - Perfil de usuario con info de Clerk
- `/settings` - Configuración con logout

---

## 🐛 Troubleshooting

### Error: "Missing Clerk Publishable Key"
- Asegúrate de tener el archivo `.env` con `VITE_CLERK_PUBLISHABLE_KEY`
- Reinicia el servidor de desarrollo después de crear el `.env`

### Redirect Loop
- Verifica que las rutas de sign-in/sign-up sean públicas
- Asegúrate de no tener ProtectedRoute en páginas de auth

### Token No Incluido en Requests
- Verifica que `configureApiAuth(getToken)` se ejecute en App.tsx
- Asegúrate de estar dentro de ClerkProvider

### Styling Issues
- Clerk usa sus propios estilos por defecto
- Usa `appearance` prop para personalizar
- Puedes importar tus propios estilos CSS

---

## 📚 Recursos

- [Clerk Documentation](https://clerk.com/docs)
- [React Integration Guide](https://clerk.com/docs/quickstarts/react)
- [API Reference](https://clerk.com/docs/reference/clerk-react)
- [Dashboard](https://dashboard.clerk.com)

---

## ✨ Próximos Pasos

1. **Personalizar Email Templates** - En Clerk Dashboard
2. **Agregar MFA** - Autenticación de dos factores
3. **Webhooks** - Sincronizar usuarios con tu DB
4. **Organizations** - Si necesitas multi-tenancy
5. **Rate Limiting** - Protección contra ataques

---

¡Clerk Auth está completamente integrado y listo para usar! 🎉
