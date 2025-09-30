# Guitaty App - PWA

Aplicación de finanzas personales desarrollada como Progressive Web App (PWA) con las tecnologías más modernas.

## Stack Tecnológico

- **Vite** - Build tool y dev server
- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Clerk** - Autenticación y gestión de usuarios
- **Konsta UI** - Componentes nativos iOS/Android
- **Tailwind CSS** - Utility-first CSS
- **Zustand** - State management
- **React Query** - Server state & caching
- **VitePWA** - Progressive Web App capabilities

## Características

- ✅ **Autenticación con Clerk** - Login/Signup seguro
- ✅ **Token JWT** - Todas las peticiones incluyen Bearer token
- ✅ Instalable en home screen (iOS/Android)
- ✅ Funcionamiento offline
- ✅ Interfaz nativa iOS/Android con Konsta UI
- ✅ Gestión de cuentas bancarias
- ✅ Registro de transacciones (ingresos/gastos)
- ✅ Categorías personalizables
- ✅ Dashboard con estadísticas
- ✅ Integración con inversiones (Cocos Capital)
- ✅ Modo oscuro
- ✅ Multi-moneda (USD/ARS)

## Estructura del Proyecto

```
src/
├── components/        # Componentes reutilizables
│   └── Layout.tsx    # Layout principal con navegación
├── pages/            # Páginas de la app
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── Accounts.tsx
│   ├── Categories.tsx
│   ├── Investments.tsx
│   └── Settings.tsx
├── services/         # React Query hooks y API calls
│   ├── queryClient.ts
│   ├── accounts.ts
│   ├── categories.ts
│   ├── transactions.ts
│   ├── investments.ts
│   └── dashboard.ts
├── stores/           # Zustand stores
│   ├── appStore.ts
│   └── investmentStore.ts
├── types/            # TypeScript types
│   └── index.ts
├── utils/            # Utilidades
│   ├── api.ts
│   ├── constants.ts
│   └── format.ts
├── App.tsx           # Componente principal
├── main.tsx          # Entry point
└── index.css         # Estilos globales
```

## Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar Clerk:**

   a. Crear una cuenta en [Clerk](https://clerk.com)

   b. Crear una nueva aplicación en el dashboard de Clerk

   c. Copiar la **Publishable Key** del dashboard

3. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Editar `.env` con tu configuración:
```
VITE_API_BASE_URL=http://localhost:3000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_tu_key_aqui
```

4. **Iniciar desarrollo:**
```bash
npm run dev
```

5. **Build para producción:**
```bash
npm run build
```

6. **Preview de producción:**
```bash
npm run preview
```

## Autenticación con Clerk

La aplicación usa **Clerk** para autenticación. Esto significa:

### Configuración del Backend
Tu backend debe validar el token JWT de Clerk. En cada petición HTTP, la app envía el token en el header:

```
Authorization: Bearer <clerk-jwt-token>
```

### Validación en el Backend (Ejemplo Node.js/Express)

```javascript
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// Proteger rutas con middleware
app.use('/api', ClerkExpressRequireAuth());

// El userId estará disponible en req.auth.userId
app.get('/api/accounts', (req, res) => {
  const userId = req.auth.userId;
  // Usar userId para filtrar datos del usuario
});
```

### Flujo de Autenticación

1. Usuario se registra/login con Clerk
2. Clerk genera un JWT token
3. El token se almacena automáticamente
4. En cada petición, el interceptor de Axios obtiene el token y lo agrega al header
5. El backend valida el token y extrae el `userId`
6. El backend retorna solo datos del usuario autenticado

## API Endpoints

La aplicación está configurada para consumir los siguientes endpoints (todos requieren autenticación):

### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/:id` - Actualizar categoría
- `DELETE /api/categories/:id` - Eliminar categoría

### Cuentas
- `GET /api/accounts` - Listar cuentas
- `POST /api/accounts` - Crear cuenta
- `PUT /api/accounts/:id` - Actualizar cuenta
- `DELETE /api/accounts/:id` - Eliminar cuenta

### Transacciones
- `GET /api/transactions` - Listar transacciones (con paginación y filtros)
- `POST /api/transactions` - Crear transacción
- `PUT /api/transactions/:id` - Actualizar transacción
- `DELETE /api/transactions/:id` - Eliminar transacción

### Inversiones
- `POST /api/investments` - Obtener portfolio
- `POST /api/investments/portfolio` - Estadísticas del portfolio

### Dashboard
- `GET /api/dashboard/stats` - Obtener estadísticas

## Características PWA

### Instalación
La app se puede instalar en el home screen de dispositivos móviles y desktop.

### Offline
- Assets estáticos cacheados automáticamente
- API calls con estrategia "Network First"
- Fallback a caché cuando no hay conexión

### Manifest
Configurado en `vite.config.ts` con:
- Nombre y descripción
- Iconos de diferentes tamaños
- Tema y colores
- Display mode standalone
- Orientación portrait

## Desarrollo

### Agregar una nueva página

1. Crear componente en `src/pages/`
2. Agregar caso en el switch de `App.tsx`
3. Agregar tab en `Layout.tsx` si es necesario

### Agregar un nuevo endpoint

1. Crear archivo de servicio en `src/services/`
2. Definir funciones API
3. Crear custom hooks con React Query
4. Exportar hooks para usar en componentes

### Agregar tipos TypeScript

Editar `src/types/index.ts` con las nuevas interfaces/enums.

## Deployment

La app puede ser desplegada en cualquier hosting estático:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- Firebase Hosting

El build genera archivos estáticos en `dist/` listos para deployment.

## Browser Support

- Chrome/Edge (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- iOS Safari 12+
- Chrome Android 90+

## Licencia

MIT
