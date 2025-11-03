# PWA Native Boilerplate - Guía Completa para IA

## 📋 Índice
1. [Stack Tecnológico](#stack-tecnológico)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Configuración Inicial](#configuración-inicial)
4. [Componentes Nativos Core](#componentes-nativos-core)
5. [Sistema de Animaciones](#sistema-de-animaciones)
6. [Gestos Táctiles](#gestos-táctiles)
7. [PWA Configuration](#pwa-configuration)
8. [Optimizaciones de Performance](#optimizaciones-de-performance)
9. [Best Practices & Gotchas](#best-practices--gotchas)
10. [Prompts para IA](#prompts-para-ia)

---

## Stack Tecnológico

### Core
```json
{
  "vite": "^5.0.0",
  "react": "^18.2.0",
  "typescript": "^5.2.0",
  "tailwindcss": "^3.4.0"
}
```

### PWA
```json
{
  "vite-plugin-pwa": "^0.17.0",
  "workbox-window": "^7.0.0",
  "workbox-precaching": "^7.0.0"
}
```

### Animaciones & Gestures
```json
{
  "framer-motion": "^10.16.0",
  "react-spring": "^9.7.0",
  "@use-gesture/react": "^10.3.0"
}
```

### UI & Navigation
```json
{
  "react-router-dom": "^6.20.0",
  "vaul": "^0.9.0",
  "sonner": "^1.2.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.1.0"
}
```

### Utilities
```json
{
  "zustand": "^4.4.0",
  "date-fns": "^2.30.0",
  "nanoid": "^5.0.0"
}
```

---

## Arquitectura del Proyecto

```
pwa-boilerplate/
├── public/
│   ├── icons/
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   └── icon-512x512.png
│   ├── screenshots/
│   │   ├── desktop-1.png
│   │   └── mobile-1.png
│   ├── splash/
│   │   └── apple-splash-*.png (múltiples tamaños)
│   └── manifest.json
│
├── src/
│   ├── components/
│   │   ├── native/
│   │   │   ├── BottomNav/
│   │   │   │   ├── BottomNav.tsx
│   │   │   │   ├── BottomNavItem.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Sheet/
│   │   │   │   ├── BottomSheet.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Card/
│   │   │   │   ├── SwipeableCard.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Header/
│   │   │   │   ├── AppHeader.tsx
│   │   │   │   └── index.ts
│   │   │   ├── PullToRefresh/
│   │   │   │   ├── PullToRefresh.tsx
│   │   │   │   └── index.ts
│   │   │   └── SafeArea/
│   │   │       ├── SafeAreaView.tsx
│   │   │       └── index.ts
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Toast.tsx
│   │   │
│   │   └── layout/
│   │       ├── AppLayout.tsx
│   │       └── PageTransition.tsx
│   │
│   ├── hooks/
│   │   ├── useHaptic.ts
│   │   ├── useSwipe.ts
│   │   ├── useNetworkStatus.ts
│   │   ├── usePWAInstall.ts
│   │   ├── useOnlineStatus.ts
│   │   ├── useSafeArea.ts
│   │   └── usePageVisibility.ts
│   │
│   ├── lib/
│   │   ├── animations/
│   │   │   ├── transitions.ts
│   │   │   ├── springs.ts
│   │   │   └── variants.ts
│   │   ├── gestures/
│   │   │   ├── swipe.ts
│   │   │   └── drag.ts
│   │   ├── pwa/
│   │   │   ├── install.ts
│   │   │   ├── update.ts
│   │   │   └── offline.ts
│   │   └── utils/
│   │       ├── cn.ts
│   │       └── platform.ts
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Profile.tsx
│   │   └── Settings.tsx
│   │
│   ├── store/
│   │   ├── app.store.ts
│   │   └── user.store.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── native.css
│   │   └── animations.css
│   │
│   ├── types/
│   │   ├── index.ts
│   │   └── pwa.d.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Configuración Inicial

### 1. vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Mi PWA App',
        short_name: 'PWA App',
        description: 'Una PWA que se siente nativa',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: 'icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 horas
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@store': path.resolve(__dirname, './src/store'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@types': path.resolve(__dirname, './src/types')
    }
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animations: ['framer-motion', 'react-spring'],
          utils: ['zustand', 'date-fns']
        }
      }
    }
  }
})
```

### 2. tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ios: {
          blue: '#007AFF',
          gray: '#8E8E93',
          lightGray: '#F2F2F7',
          separator: '#C6C6C8'
        },
        android: {
          primary: '#6200EE',
          secondary: '#03DAC6',
          surface: '#121212',
          background: '#FFFFFF'
        }
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      animation: {
        'bounce-in': 'bounceIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-in',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spring': 'spring 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        spring: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionTimingFunction: {
        'ios': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'android': 'cubic-bezier(0.4, 0.0, 0.6, 1)',
      },
    },
  },
  plugins: [],
}
```

### 3. globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* iOS Variables */
  --ios-blue: #007AFF;
  --ios-gray: #8E8E93;
  --ios-light-gray: #F2F2F7;
  --ios-separator: #C6C6C8;
  
  /* Safe Areas */
  --safe-area-inset-top: env(safe-area-inset-top);
  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  --safe-area-inset-left: env(safe-area-inset-left);
  --safe-area-inset-right: env(safe-area-inset-right);
  
  /* Spring Physics */
  --spring-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --spring-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    touch-action: pan-x pan-y;
    overscroll-behavior: none;
  }

  /* Disable text selection on interactive elements */
  button, a {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    user-select: none;
  }

  /* Remove 300ms click delay on mobile */
  a, button, input, select, textarea {
    touch-action: manipulation;
  }

  /* Native scroll feel */
  * {
    -webkit-overflow-scrolling: touch;
  }

  /* Hide scrollbar but keep functionality */
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  /* Safe area utilities */
  .safe-top {
    padding-top: var(--safe-area-inset-top);
  }

  .safe-bottom {
    padding-bottom: var(--safe-area-inset-bottom);
  }

  .safe-left {
    padding-left: var(--safe-area-inset-left);
  }

  .safe-right {
    padding-right: var(--safe-area-inset-right);
  }

  /* iOS-like bounce effect */
  .ios-bounce {
    overscroll-behavior-y: contain;
  }
}

@layer components {
  /* Native button press effect */
  .btn-press {
    @apply active:scale-95 transition-transform duration-100;
  }

  /* Card with native shadow */
  .card-native {
    @apply bg-white dark:bg-gray-900 rounded-2xl shadow-sm;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  /* iOS-style list item */
  .list-item-ios {
    @apply bg-white dark:bg-gray-900 active:bg-gray-50 dark:active:bg-gray-800 
           border-b border-gray-200 dark:border-gray-800 
           transition-colors duration-150;
  }

  /* Backdrop blur like native */
  .backdrop-native {
    @apply backdrop-blur-lg bg-white/80 dark:bg-black/80;
  }

  /* Spring animation */
  .spring {
    transition: all 0.5s var(--spring-bounce);
  }
}

@layer utilities {
  /* Text utilities */
  .text-balance {
    text-wrap: balance;
  }

  /* Performance optimization */
  .gpu-accelerated {
    transform: translateZ(0);
    will-change: transform;
  }

  /* Native feel utilities */
  .no-tap-highlight {
    -webkit-tap-highlight-color: transparent;
  }

  .no-select {
    user-select: none;
    -webkit-user-select: none;
  }

  /* Smooth scroll */
  .smooth-scroll {
    scroll-behavior: smooth;
  }
}
```

---

## Componentes Nativos Core

### 1. SafeAreaView

```typescript
// src/components/native/SafeArea/SafeAreaView.tsx
import { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface SafeAreaViewProps {
  children: ReactNode
  className?: string
  top?: boolean
  bottom?: boolean
  left?: boolean
  right?: boolean
}

export const SafeAreaView = ({ 
  children, 
  className,
  top = true,
  bottom = true,
  left = true,
  right = true
}: SafeAreaViewProps) => {
  return (
    <div 
      className={cn(
        'w-full h-full',
        top && 'safe-top',
        bottom && 'safe-bottom',
        left && 'safe-left',
        right && 'safe-right',
        className
      )}
    >
      {children}
    </div>
  )
}
```

### 2. BottomNav

```typescript
// src/components/native/BottomNav/BottomNav.tsx
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface BottomNavProps {
  children: ReactNode
  className?: string
}

export const BottomNav = ({ children, className }: BottomNavProps) => {
  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'backdrop-native border-t border-gray-200 dark:border-gray-800',
        'pb-safe-bottom',
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-4">
        {children}
      </div>
    </motion.nav>
  )
}

// src/components/native/BottomNav/BottomNavItem.tsx
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface BottomNavItemProps {
  icon: ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

export const BottomNavItem = ({ 
  icon, 
  label, 
  active = false,
  onClick 
}: BottomNavItemProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center gap-1 py-2 px-4',
        'transition-colors duration-200 no-tap-highlight',
        active ? 'text-ios-blue dark:text-blue-400' : 'text-gray-500'
      )}
    >
      <motion.div
        animate={{ scale: active ? 1.1 : 1 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {icon}
      </motion.div>
      <span className="text-xs font-medium">{label}</span>
    </motion.button>
  )
}
```

### 3. BottomSheet

```typescript
// src/components/native/Sheet/BottomSheet.tsx
import { ReactNode } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  snapPoints?: number[]
  className?: string
}

export const BottomSheet = ({ 
  isOpen, 
  onClose, 
  children,
  snapPoints = [0.9],
  className 
}: BottomSheetProps) => {
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 100) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'bg-white dark:bg-gray-900 rounded-t-3xl',
              'max-h-[90vh] overflow-hidden',
              className
            )}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-2rem)] pb-safe-bottom">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

### 4. SwipeableCard

```typescript
// src/components/native/Card/SwipeableCard.tsx
import { ReactNode, useState } from 'react'
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface SwipeableCardProps {
  children: ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  className?: string
}

export const SwipeableCard = ({ 
  children, 
  onSwipeLeft,
  onSwipeRight,
  className 
}: SwipeableCardProps) => {
  const [exitX, setExitX] = useState(0)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      setExitX(200)
      onSwipeRight?.()
    } else if (info.offset.x < -100) {
      setExitX(-200)
      onSwipeLeft?.()
    }
  }

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'card-native p-4 cursor-grab active:cursor-grabbing',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
```

### 5. PullToRefresh

```typescript
// src/components/native/PullToRefresh/PullToRefresh.tsx
import { ReactNode, useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface PullToRefreshProps {
  children: ReactNode
  onRefresh: () => Promise<void>
  threshold?: number
  className?: string
}

export const PullToRefresh = ({ 
  children, 
  onRefresh,
  threshold = 80,
  className 
}: PullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const y = useMotionValue(0)
  const rotate = useTransform(y, [0, threshold], [0, 180])
  const opacity = useTransform(y, [0, threshold], [0, 1])

  const handleRefresh = async () => {
    if (isRefreshing) return
    
    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
      y.set(0)
    }
  }

  const handleDragEnd = () => {
    if (y.get() >= threshold) {
      handleRefresh()
    } else {
      y.set(0)
    }
  }

  return (
    <div ref={containerRef} className={cn('relative overflow-hidden', className)}>
      <motion.div
        style={{ y }}
        drag="y"
        dragConstraints={{ top: 0, bottom: threshold }}
        dragElastic={0.5}
        onDragEnd={handleDragEnd}
        className="relative"
      >
        {/* Refresh Indicator */}
        <motion.div 
          style={{ opacity }}
          className="absolute top-0 left-0 right-0 flex justify-center items-center h-16 -mt-16"
        >
          <motion.div
            style={{ rotate }}
            className={cn(
              'w-8 h-8 border-2 border-t-transparent rounded-full',
              isRefreshing ? 'animate-spin border-ios-blue' : 'border-gray-400'
            )}
          />
        </motion.div>

        {children}
      </motion.div>
    </div>
  )
}
```

### 6. AppHeader

```typescript
// src/components/native/Header/AppHeader.tsx
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AppHeaderProps {
  title: string
  subtitle?: string
  leftAction?: ReactNode
  rightAction?: ReactNode
  onBackPress?: () => void
  transparent?: boolean
  className?: string
}

export const AppHeader = ({ 
  title,
  subtitle,
  leftAction,
  rightAction,
  onBackPress,
  transparent = false,
  className 
}: AppHeaderProps) => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'sticky top-0 z-40 w-full pt-safe-top',
        transparent 
          ? 'bg-transparent' 
          : 'backdrop-native border-b border-gray-200 dark:border-gray-800',
        className
      )}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left Action */}
        <div className="flex items-center min-w-[60px]">
          {onBackPress && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onBackPress}
              className="p-2 -ml-2 no-tap-highlight"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>
          )}
          {leftAction}
        </div>

        {/* Title */}
        <div className="flex-1 text-center px-4">
          <h1 className="text-lg font-semibold truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-500 truncate">{subtitle}</p>
          )}
        </div>

        {/* Right Action */}
        <div className="flex items-center justify-end min-w-[60px]">
          {rightAction}
        </div>
      </div>
    </motion.header>
  )
}
```

---

## Sistema de Animaciones

### 1. Transitions Config

```typescript
// src/lib/animations/transitions.ts

export const transitions = {
  // iOS-like transitions
  ios: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  iosSlow: {
    type: 'spring',
    stiffness: 200,
    damping: 25,
  },
  
  // Android-like transitions
  android: {
    type: 'tween',
    duration: 0.3,
    ease: [0.4, 0.0, 0.6, 1],
  },
  androidSlow: {
    type: 'tween',
    duration: 0.4,
    ease: [0.4, 0.0, 0.2, 1],
  },
  
  // Smooth spring
  spring: {
    type: 'spring',
    stiffness: 260,
    damping: 20,
  },
  
  // Bouncy spring
  springBounce: {
    type: 'spring',
    stiffness: 400,
    damping: 17,
  },
  
  // Quick snap
  snap: {
    type: 'spring',
    stiffness: 500,
    damping: 40,
  },
} as const

export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
} as const
```

### 2. Animation Variants

```typescript
// src/lib/animations/variants.ts

export const pageVariants = {
  initial: { 
    opacity: 0, 
    x: 20 
  },
  enter: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0.0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: 0.2,
      ease: [0.4, 0.0, 1, 1]
    }
  },
}

export const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  },
}

export const slideUpVariants = {
  hidden: { 
    y: '100%' 
  },
  visible: { 
    y: 0,
    transition: {
      type: 'spring',
      damping: 30,
      stiffness: 300
    }
  },
  exit: { 
    y: '100%',
    transition: {
      duration: 0.2
    }
  },
}

export const fadeVariants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.2
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.15
    }
  },
}

export const scaleVariants = {
  hidden: { 
    scale: 0.8, 
    opacity: 0 
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25
    }
  },
  exit: { 
    scale: 0.8, 
    opacity: 0,
    transition: {
      duration: 0.15
    }
  },
}

export const listItemVariants = {
  hidden: { 
    x: -20, 
    opacity: 0 
  },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.05,
      type: 'spring',
      stiffness: 300,
      damping: 24
    }
  }),
}
```

### 3. Page Transitions Component

```typescript
// src/components/layout/PageTransition.tsx
import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { pageVariants } from '@/lib/animations/variants'

interface PageTransitionProps {
  children: ReactNode
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

---

## Gestos Táctiles

### 1. useSwipe Hook

```typescript
// src/hooks/useSwipe.ts
import { useState, TouchEvent } from 'react'

interface SwipeInput {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
}

export const useSwipe = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50
}: SwipeInput) => {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchEnd = () => {
    const deltaX = touchStart.x - touchEnd.x
    const deltaY = touchStart.y - touchEnd.y

    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY)

    if (isHorizontalSwipe) {
      if (deltaX > threshold) {
        onSwipeLeft?.()
      } else if (deltaX < -threshold) {
        onSwipeRight?.()
      }
    } else {
      if (deltaY > threshold) {
        onSwipeUp?.()
      } else if (deltaY < -threshold) {
        onSwipeDown?.()
      }
    }
  }

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  }
}
```

### 2. useHaptic Hook

```typescript
// src/hooks/useHaptic.ts
import { useCallback } from 'react'

type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'error' | 'warning' | 'success'

export const useHaptic = () => {
  const trigger = useCallback((type: HapticType = 'light') => {
    // Check if vibration API is available
    if (!navigator.vibrate) return

    const patterns = {
      light: [10],
      medium: [20],
      heavy: [50],
      selection: [5],
      error: [10, 50, 10],
      warning: [30, 20, 30],
      success: [10, 20, 10, 20, 10],
    }

    navigator.vibrate(patterns[type])
  }, [])

  return { trigger }
}
```

---

## PWA Configuration

### 1. manifest.json

```json
{
  "name": "Mi PWA App",
  "short_name": "PWA App",
  "description": "Una PWA que se siente nativa",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#000000",
  "background_color": "#ffffff",
  "categories": ["productivity", "utilities"],
  "dir": "ltr",
  "lang": "es-AR",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/mobile-1.png",
      "sizes": "1080x1920",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshots/desktop-1.png",
      "sizes": "1920x1080",
      "type": "image/png",
      "form_factor": "wide"
    }
  ],
  "shortcuts": [
    {
      "name": "Inicio",
      "short_name": "Home",
      "description": "Ir a la página principal",
      "url": "/",
      "icons": [{ "src": "/icons/icon-96x96.png", "sizes": "96x96" }]
    }
  ],
  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  }
}
```

### 2. usePWAInstall Hook

```typescript
// src/hooks/usePWAInstall.ts
import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isIOSStandalone = (window.navigator as any).standalone === true
    setIsInstalled(isStandalone || isIOSStandalone)

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setInstallPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const install = async () => {
    if (!installPrompt) return false

    try {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      
      if (outcome === 'accepted') {
        setIsInstalled(true)
        setIsInstallable(false)
        setInstallPrompt(null)
        return true
      }
      return false
    } catch (error) {
      console.error('Error installing PWA:', error)
      return false
    }
  }

  return {
    isInstalled,
    isInstallable,
    install
  }
}
```

### 3. useNetworkStatus Hook

```typescript
// src/hooks/useNetworkStatus.ts
import { useState, useEffect } from 'react'

interface NetworkStatus {
  online: boolean
  type?: string
  effectiveType?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}

export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatus>({
    online: navigator.onLine
  })

  useEffect(() => {
    const updateStatus = () => {
      const connection = (navigator as any).connection 
        || (navigator as any).mozConnection 
        || (navigator as any).webkitConnection

      setStatus({
        online: navigator.onLine,
        type: connection?.type,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
        saveData: connection?.saveData
      })
    }

    updateStatus()

    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)

    const connection = (navigator as any).connection 
      || (navigator as any).mozConnection 
      || (navigator as any).webkitConnection

    if (connection) {
      connection.addEventListener('change', updateStatus)
    }

    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
      if (connection) {
        connection.removeEventListener('change', updateStatus)
      }
    }
  }, [])

  return status
}
```

### 4. useSplashScreen Hook

```typescript
// src/hooks/useSplashScreen.ts
import { useState, useEffect } from 'react'

interface SplashScreenOptions {
  minDuration?: number // Minimum time to show splash (ms)
  fadeOutDuration?: number // Fade out animation duration (ms)
  autoHide?: boolean // Auto hide when app is ready
}

export const useSplashScreen = (options: SplashScreenOptions = {}) => {
  const {
    minDuration = 1500,
    fadeOutDuration = 500,
    autoHide = false
  } = options

  const [isVisible, setIsVisible] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    // Check if running in Capacitor
    const isCapacitor = !!(window as any).Capacitor
    
    if (isCapacitor) {
      // Use Capacitor's SplashScreen plugin if available
      import('@capacitor/splash-screen').then(({ SplashScreen }) => {
        // Keep native splash visible until we're ready
        if (isReady) {
          const elapsed = Date.now() - startTime
          const remainingTime = Math.max(0, minDuration - elapsed)
          
          setTimeout(() => {
            SplashScreen.hide({ fadeOutDuration })
            setIsVisible(false)
          }, remainingTime)
        }
      }).catch(() => {
        // Fallback if plugin not available
        handleWebSplash()
      })
    } else {
      handleWebSplash()
    }
  }, [isReady, minDuration, fadeOutDuration, startTime])

  const handleWebSplash = () => {
    if (isReady && autoHide) {
      const elapsed = Date.now() - startTime
      const remainingTime = Math.max(0, minDuration - elapsed)
      
      setTimeout(() => {
        setIsVisible(false)
      }, remainingTime)
    }
  }

  const hide = () => {
    const elapsed = Date.now() - startTime
    const remainingTime = Math.max(0, minDuration - elapsed)
    
    setTimeout(() => {
      setIsVisible(false)
      
      // Hide native splash if in Capacitor
      const isCapacitor = !!(window as any).Capacitor
      if (isCapacitor) {
        import('@capacitor/splash-screen').then(({ SplashScreen }) => {
          SplashScreen.hide({ fadeOutDuration })
        }).catch(() => {})
      }
    }, remainingTime)
  }

  const markReady = () => {
    setIsReady(true)
  }

  return {
    isVisible,
    hide,
    markReady,
    isReady
  }
}
```

### 5. SplashScreen Component

```typescript
// src/components/native/SplashScreen/SplashScreen.tsx
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface SplashScreenProps {
  isVisible: boolean
  logo?: string
  appName?: string
  tagline?: string
  className?: string
  fadeOutDuration?: number
}

export const SplashScreen = ({
  isVisible,
  logo,
  appName = 'PWA App',
  tagline,
  className,
  fadeOutDuration = 500
}: SplashScreenProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fadeOutDuration / 1000 }}
          className={cn(
            'fixed inset-0 z-[9999] flex flex-col items-center justify-center',
            'bg-gradient-to-br from-ios-blue to-blue-600',
            'safe-top safe-bottom',
            className
          )}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
              delay: 0.1
            }}
            className="flex flex-col items-center gap-6"
          >
            {/* Logo */}
            {logo && (
              <motion.img
                src={logo}
                alt={appName}
                className="w-24 h-24 rounded-3xl shadow-2xl"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            )}

            {/* App Name */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white"
            >
              {appName}
            </motion.h1>

            {/* Tagline */}
            {tagline && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-white/80"
              >
                {tagline}
              </motion.p>
            )}

            {/* Loading Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-white rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### 6. Using SplashScreen in App

```typescript
// src/App.tsx
import { useEffect } from 'react'
import { useSplashScreen } from '@/hooks/useSplashScreen'
import { SplashScreen } from '@/components/native/SplashScreen'

function App() {
  const { isVisible, markReady } = useSplashScreen({
    minDuration: 2000,
    fadeOutDuration: 500,
    autoHide: true
  })

  useEffect(() => {
    // Simulate loading app resources
    const loadApp = async () => {
      // Load fonts, data, etc.
      await Promise.all([
        // Your loading logic here
        new Promise(resolve => setTimeout(resolve, 1000))
      ])
      
      markReady()
    }

    loadApp()
  }, [markReady])

  return (
    <>
      <SplashScreen 
        isVisible={isVisible}
        logo="/icons/icon-512x512.png"
        appName="Mi PWA"
        tagline="Tu app nativa en la web"
      />
      
      {/* Your app content */}
      <YourApp />
    </>
  )
}
```

---

## Capacitor Integration

### Overview

Capacitor permite convertir tu PWA en una app nativa real para iOS y Android **sin cambiar tu código**. Es la evolución de Ionic y se integra perfectamente con cualquier framework web.

### ¿Cuándo usar Capacitor?

✅ **Usar Capacitor cuando necesitas:**
- Publicar en App Store / Google Play
- Acceso profundo al hardware (Bluetooth, NFC, biometrics)
- APIs nativas no disponibles en web (HealthKit, contactos, etc.)
- Mejor performance en animaciones complejas
- Notificaciones push nativas más confiables
- In-app purchases
- Background tasks
- Deep linking robusto

❌ **No necesitas Capacitor si:**
- Tu PWA cubre todas las necesidades
- No necesitas publicar en stores
- Las Web APIs son suficientes

### Setup Capacitor

#### 1. Instalación

```bash
# Instalar Capacitor
npm install @capacitor/core @capacitor/cli

# Inicializar Capacitor
npx cap init

# Agregar plataformas
npx cap add ios
npx cap add android
```

#### 2. Configuración

```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.tuapp.id',
  appName: 'Tu App',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Para desarrollo
    // url: 'http://192.168.1.X:3000',
    // cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#000000',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#999999',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000'
    }
  }
}

export default config
```

#### 3. Plugins Esenciales

```bash
# Core plugins
npm install @capacitor/splash-screen
npm install @capacitor/status-bar
npm install @capacitor/haptics
npm install @capacitor/keyboard
npm install @capacitor/network
npm install @capacitor/app
npm install @capacitor/share

# Advanced plugins
npm install @capacitor/camera
npm install @capacitor/filesystem
npm install @capacitor/geolocation
npm install @capacitor/push-notifications
npm install @capacitor/local-notifications
```

#### 4. Platform Detection Hook

```typescript
// src/hooks/usePlatform.ts
import { useState, useEffect } from 'react'
import { Capacitor } from '@capacitor/core'

export type Platform = 'web' | 'ios' | 'android'

export const usePlatform = () => {
  const [platform, setPlatform] = useState<Platform>('web')
  const [isNative, setIsNative] = useState(false)

  useEffect(() => {
    const currentPlatform = Capacitor.getPlatform() as Platform
    setPlatform(currentPlatform)
    setIsNative(Capacitor.isNativePlatform())
  }, [])

  return {
    platform,
    isNative,
    isWeb: platform === 'web',
    isIOS: platform === 'ios',
    isAndroid: platform === 'android',
  }
}
```

#### 5. Unified Haptics Hook

```typescript
// src/hooks/useHaptic.ts (Updated with Capacitor support)
import { useCallback } from 'react'
import { usePlatform } from './usePlatform'

type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'error' | 'warning' | 'success'

export const useHaptic = () => {
  const { isNative } = usePlatform()

  const trigger = useCallback(async (type: HapticType = 'light') => {
    if (isNative) {
      try {
        const { Haptics, ImpactStyle, NotificationType } = await import('@capacitor/haptics')
        
        switch (type) {
          case 'light':
            await Haptics.impact({ style: ImpactStyle.Light })
            break
          case 'medium':
            await Haptics.impact({ style: ImpactStyle.Medium })
            break
          case 'heavy':
            await Haptics.impact({ style: ImpactStyle.Heavy })
            break
          case 'selection':
            await Haptics.selectionStart()
            break
          case 'error':
            await Haptics.notification({ type: NotificationType.Error })
            break
          case 'warning':
            await Haptics.notification({ type: NotificationType.Warning })
            break
          case 'success':
            await Haptics.notification({ type: NotificationType.Success })
            break
        }
      } catch (error) {
        console.warn('Haptics not available:', error)
      }
    } else {
      // Fallback to Web Vibration API
      if (!navigator.vibrate) return

      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50],
        selection: [5],
        error: [10, 50, 10],
        warning: [30, 20, 30],
        success: [10, 20, 10, 20, 10],
      }

      navigator.vibrate(patterns[type])
    }
  }, [isNative])

  return { trigger }
}
```

#### 6. Native Camera Integration

```typescript
// src/hooks/useCamera.ts
import { useState } from 'react'
import { usePlatform } from './usePlatform'

export const useCamera = () => {
  const { isNative } = usePlatform()
  const [isLoading, setIsLoading] = useState(false)

  const takePicture = async () => {
    setIsLoading(true)
    
    try {
      if (isNative) {
        const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera')
        
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera
        })
        
        return image.webPath
      } else {
        // Fallback to web file input
        return new Promise<string>((resolve, reject) => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'image/*'
          input.capture = 'environment'
          
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
              const reader = new FileReader()
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = reject
              reader.readAsDataURL(file)
            }
          }
          
          input.click()
        })
      }
    } catch (error) {
      console.error('Camera error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    takePicture,
    isLoading
  }
}
```

#### 7. Status Bar Management

```typescript
// src/hooks/useStatusBar.ts
import { useEffect } from 'react'
import { usePlatform } from './usePlatform'

interface StatusBarOptions {
  style?: 'light' | 'dark'
  backgroundColor?: string
}

export const useStatusBar = (options: StatusBarOptions = {}) => {
  const { isNative } = usePlatform()

  useEffect(() => {
    if (!isNative) return

    const updateStatusBar = async () => {
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar')
        
        if (options.style) {
          await StatusBar.setStyle({
            style: options.style === 'light' ? Style.Light : Style.Dark
          })
        }
        
        if (options.backgroundColor) {
          await StatusBar.setBackgroundColor({
            color: options.backgroundColor
          })
        }
      } catch (error) {
        console.warn('StatusBar not available:', error)
      }
    }

    updateStatusBar()
  }, [isNative, options.style, options.backgroundColor])
}
```

#### 8. Build & Deploy Commands

```json
// package.json scripts
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:cap": "npm run build && npx cap sync",
    "cap:open:ios": "npx cap open ios",
    "cap:open:android": "npx cap open android",
    "cap:sync": "npx cap sync",
    "cap:copy": "npx cap copy",
    "ios": "npm run build:cap && npx cap open ios",
    "android": "npm run build:cap && npx cap open android"
  }
}
```

#### 9. Conditional Features Component

```typescript
// src/components/native/PlatformFeature.tsx
import { ReactNode } from 'react'
import { usePlatform } from '@/hooks/usePlatform'

interface PlatformFeatureProps {
  web?: ReactNode
  ios?: ReactNode
  android?: ReactNode
  native?: ReactNode
  children?: ReactNode
}

export const PlatformFeature = ({
  web,
  ios,
  android,
  native,
  children
}: PlatformFeatureProps) => {
  const { platform, isNative: isNativePlatform } = usePlatform()

  if (children) return <>{children}</>
  
  if (native && isNativePlatform) return <>{native}</>
  
  if (ios && platform === 'ios') return <>{ios}</>
  if (android && platform === 'android') return <>{android}</>
  if (web && platform === 'web') return <>{web}</>
  
  return null
}

// Usage:
// <PlatformFeature
//   web={<WebShareButton />}
//   native={<NativeShareButton />}
// />
```

---

## NativeScript Integration (Alternative)

### Overview

NativeScript es otra alternativa para convertir tu app web en nativa. A diferencia de Capacitor, NativeScript compila a código nativo real, ofreciendo mejor performance pero requiriendo más cambios en el código.

### Capacitor vs NativeScript

| Feature | Capacitor | NativeScript |
|---------|-----------|--------------|
| **Approach** | WebView híbrido | UI nativa real |
| **Performance** | Buena | Excelente |
| **Code sharing** | 100% | ~70-80% |
| **Learning curve** | Baja | Media-Alta |
| **Plugins** | Muchos | Muchos |
| **Bundle size** | Medio | Pequeño |
| **Development speed** | Rápido | Medio |
| **Best for** | PWA → Native | Apps complejas |

### Cuándo elegir NativeScript

✅ **Usar NativeScript cuando:**
- Necesitas máxima performance nativa
- Apps con UI muy compleja
- Apps con muchas animaciones
- Bundle size es crítico
- No te importa reescribir algunas partes

❌ **Usar Capacitor cuando:**
- Quieres mantener tu código web intacto
- Desarrollo rápido es prioridad
- Ya tienes una PWA funcionando
- Tu equipo es principalmente web

### Setup Básico NativeScript

```bash
# Instalar CLI
npm install -g @nativescript/cli

# Crear proyecto con React
ns create my-app --react

# O migrar proyecto existente
ns migrate
```

### Configuración con Vite

```typescript
// nativescript.config.ts
import { NativeScriptConfig } from '@nativescript/core'

export default {
  id: 'com.tuapp.id',
  appPath: 'src',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  },
  ios: {
    teamId: 'YOUR_TEAM_ID'
  }
} as NativeScriptConfig
```

### Platform Detection

```typescript
// src/utils/platform.ts
import { isAndroid, isIOS } from '@nativescript/core'

export const Platform = {
  isAndroid,
  isIOS,
  isWeb: !isAndroid && !isIOS
}
```

---

## Hybrid Approach (Recomendado)

### Strategy: PWA First + Native When Needed

La mejor estrategia es:

1. **Desarrollar como PWA** con Vite
2. **Wrappear con Capacitor** cuando necesites features nativas
3. **Usar Progressive Enhancement** para features nativas

```typescript
// src/lib/native-bridge.ts
import { Capacitor } from '@capacitor/core'

export class NativeBridge {
  static get isNative() {
    return Capacitor.isNativePlatform()
  }

  static get platform() {
    return Capacitor.getPlatform()
  }

  static async share(data: { title?: string; text?: string; url?: string }) {
    if (this.isNative) {
      const { Share } = await import('@capacitor/share')
      return Share.share(data)
    } else if (navigator.share) {
      return navigator.share(data)
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(data.url || data.text || '')
      return { activityType: 'clipboard' }
    }
  }

  static async haptic(type: 'light' | 'medium' | 'heavy' = 'light') {
    if (this.isNative) {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics')
      const style = {
        light: ImpactStyle.Light,
        medium: ImpactStyle.Medium,
        heavy: ImpactStyle.Heavy
      }[type]
      return Haptics.impact({ style })
    } else if (navigator.vibrate) {
      const duration = { light: 10, medium: 20, heavy: 50 }[type]
      return navigator.vibrate(duration)
    }
  }

  static async getPhoto() {
    if (this.isNative) {
      const { Camera, CameraResultType } = await import('@capacitor/camera')
      return Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri
      })
    } else {
      // Web fallback
      return new Promise((resolve, reject) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = () => resolve({ webPath: reader.result })
            reader.onerror = reject
            reader.readAsDataURL(file)
          }
        }
        input.click()
      })
    }
  }
}

// Usage:
// await NativeBridge.share({ url: 'https://...' })
// await NativeBridge.haptic('medium')
// const photo = await NativeBridge.getPhoto()
```

### Migration Path

```
Phase 1: PWA Development
├── Develop with Vite + React
├── Test as PWA
└── Deploy to web

Phase 2: Capacitor Wrap (if needed)
├── npm install @capacitor/core @capacitor/cli
├── npx cap init
├── Add iOS/Android platforms
└── Enhance with native features

Phase 3: Native Features
├── Add native plugins
├── Implement platform-specific UI
└── Test on real devices

Phase 4: Store Deployment
├── Build for production
├── Test thoroughly
└── Submit to stores
```

---

## Optimizaciones de Performance

### 1. Lazy Loading Components

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PageTransition } from '@/components/layout/PageTransition'

// Lazy load pages
const Home = lazy(() => import('@/pages/Home'))
const Profile = lazy(() => import('@/pages/Profile'))
const Settings = lazy(() => import('@/pages/Settings'))

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-12 h-12 border-4 border-ios-blue border-t-transparent rounded-full animate-spin" />
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </PageTransition>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
```

### 2. Virtual Scrolling para Listas

```typescript
// src/components/ui/VirtualList.tsx
import { ReactNode, useRef, useState, useEffect } from 'react'

interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  renderItem: (item: T, index: number) => ReactNode
  className?: string
}

export function VirtualList<T>({ 
  items, 
  itemHeight, 
  renderItem,
  className 
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => setScrollTop(container.scrollTop)
    const handleResize = () => setContainerHeight(container.clientHeight)

    handleResize()
    container.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    return () => {
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.ceil((scrollTop + containerHeight) / itemHeight)
  const visibleItems = items.slice(startIndex, endIndex)

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ overflowY: 'auto', height: '100%' }}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              left: 0,
              right: 0
            }}
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 3. Image Optimization

```typescript
// src/components/ui/OptimizedImage.tsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface OptimizedImageProps {
  src: string
  alt: string
  placeholder?: string
  className?: string
  aspectRatio?: string
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg==',
  className,
  aspectRatio = '16/9'
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImageSrc(src)
      setIsLoaded(true)
    }
  }, [src])

  return (
    <motion.div 
      className={cn('relative overflow-hidden bg-gray-100', className)}
      style={{ aspectRatio }}
    >
      <motion.img
        src={imageSrc}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </motion.div>
  )
}
```

---

## Best Practices & Gotchas

### ⚠️ Cosas Importantes a Tener en Cuenta

#### 1. **Touch Events vs Click Events**
```typescript
// ❌ MAL - Usa click en mobile
<button onClick={handleClick}>Click</button>

// ✅ BIEN - Usa touch events o motion
import { motion } from 'framer-motion'
<motion.button 
  onTap={handleClick}
  whileTap={{ scale: 0.95 }}
>
  Click
</motion.button>
```

#### 2. **Prevenir 300ms Delay**
```css
/* Agregar en globals.css */
* {
  touch-action: manipulation;
}
```

#### 3. **Safe Areas para Notch/Island**
```typescript
// Siempre usar SafeAreaView en layouts principales
<SafeAreaView>
  <YourContent />
</SafeAreaView>
```

#### 4. **Scrolling Performance**
```css
/* Usar hardware acceleration */
.scrollable {
  transform: translateZ(0);
  will-change: transform;
  -webkit-overflow-scrolling: touch;
}
```

#### 5. **Prevenir Text Selection en UI Elements**
```css
button, a, .interactive {
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
```

#### 6. **Keyboard Aware Views**
```typescript
// Hook para manejar el teclado
import { useEffect, useState } from 'react'

export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      const visualViewport = window.visualViewport
      if (!visualViewport) return
      
      const keyboardHeight = window.innerHeight - visualViewport.height
      setKeyboardHeight(keyboardHeight)
    }

    window.visualViewport?.addEventListener('resize', handleResize)
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [])

  return keyboardHeight
}
```

#### 7. **iOS Bounce Scroll**
```css
/* Prevenir overscroll bounce */
body {
  overscroll-behavior: none;
}

/* O permitir solo en containers específicos */
.scrollable {
  overscroll-behavior-y: contain;
}
```

#### 8. **Fixed Position en iOS**
```css
/* Fixed elements en iOS Safari */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  /* Importante para iOS */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}
```

#### 9. **Viewport Meta Tag Correcto**
```html
<!-- index.html -->
<meta 
  name="viewport" 
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
>
```

#### 10. **Service Worker Updates**
```typescript
// src/lib/pwa/update.ts
import { useRegisterSW } from 'virtual:pwa-register/react'

export const usePWAUpdate = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const update = () => {
    updateServiceWorker(true)
  }

  return { needRefresh, update, close: () => setNeedRefresh(false) }
}
```

#### 11. **Optimistic UI Updates**
```typescript
// Ejemplo de optimistic update
const handleLike = async (id: string) => {
  // 1. Update UI immediately
  setLikes(prev => prev + 1)
  
  try {
    // 2. Send request to server
    await api.like(id)
  } catch (error) {
    // 3. Revert if fails
    setLikes(prev => prev - 1)
    toast.error('Failed to like')
  }
}
```

#### 12. **Gestión de Estados de Carga**
```typescript
// Usar skeleton loaders en vez de spinners
const isLoading = true

{isLoading ? (
  <div className="space-y-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-32 w-full" />
  </div>
) : (
  <ActualContent />
)}
```

---

## Prompts para IA

### Prompt 1: Crear Componente Nativo

```
Crea un componente React con TypeScript que se sienta nativo para mobile:

Requisitos:
- Usar Framer Motion para animaciones suaves
- Incluir gestos táctiles (swipe, tap, long-press según corresponda)
- Implementar haptic feedback usando el hook useHaptic
- Responsive design con Tailwind CSS
- Soporte para modo oscuro
- Transiciones tipo iOS con spring physics
- Safe area aware usando SafeAreaView
- Optimizado para performance (memo, useCallback cuando sea necesario)
- Accesibilidad (ARIA labels, keyboard navigation)

Componente: [DESCRIPCIÓN DEL COMPONENTE]

Ejemplo de uso esperado:
[CÓDIGO DE EJEMPLO]
```

### Prompt 2: Optimizar Performance

```
Optimiza este componente React para máxima performance en PWA mobile:

Considera:
- Virtual scrolling si maneja listas largas
- Lazy loading de imágenes con placeholder
- Code splitting con React.lazy
- Memoization (useMemo, useCallback, React.memo)
- Debouncing/throttling de eventos
- GPU acceleration con CSS transforms
- Eliminar re-renders innecesarios
- Intersection Observer para lazy load
- Web Workers para cálculos pesados si aplica

Código actual:
[TU CÓDIGO]
```

### Prompt 3: Implementar Gesture

```
Implementa un sistema de gestos para este componente usando @use-gesture/react:

Gestos necesarios:
- [Lista de gestos: swipe, drag, pinch, etc.]

Requisitos:
- Animaciones suaves con Framer Motion
- Haptic feedback en acciones
- Cancelación de gestos
- Threshold configurable
- Callbacks para cada gesto
- Soporte para gestos compuestos
- Prevenir scroll del body durante drag

Componente objetivo:
[DESCRIPCIÓN]
```

### Prompt 4: Crear Layout Nativo

```
Crea un layout principal para PWA que incluya:

Componentes:
- AppHeader con navegación back
- SafeAreaView para safe areas
- BottomNav con tabs animados
- PageTransition para navegación
- Soporte para modals y sheets
- Sistema de toasts/notifications

Características:
- Stack navigation (push/pop con animaciones)
- Persistencia de scroll position
- Manejo de keyboard (ajustar viewport)
- Loading states y skeleton screens
- Offline indicator
- Pull to refresh en páginas que lo necesiten

Stack: React Router + Framer Motion + Tailwind
```

### Prompt 5: PWA Features

```
Implementa las siguientes features PWA:

1. Install prompt personalizado con el hook usePWAInstall
2. Update notification cuando hay nueva versión
3. Offline fallback con UI informativa
4. Network status indicator
5. Cache de assets críticos
6. Background sync para acciones offline
7. Push notifications setup
8. Share target API

Requisitos:
- UI nativa y no intrusiva
- Animaciones suaves
- Manejo de errores robusto
- TypeScript con tipos completos
- Zustand para estado global si es necesario

Contexto de la app:
[DESCRIPCIÓN DE TU APP]
```

### Prompt 6: Animación Compleja

```
Crea una animación compleja usando Framer Motion:

Descripción de la animación:
[DESCRIBE LA ANIMACIÓN EN DETALLE]

Requisitos:
- Spring physics realista
- Secuenciación de animaciones
- Gesture integration (si aplica)
- Variantes para diferentes estados
- Orchestration de múltiples elementos
- Performance optimizada (GPU acceleration)
- Cancelación/interrupción limpia
- Soporte para reduced motion

Referencia de comportamiento:
[APP O SITIO DE REFERENCIA]
```

### Prompt 7: Formulario Nativo

```
Crea un formulario que se sienta nativo con:

Campos:
[LISTA DE CAMPOS Y TIPOS]

Features:
- Validación en tiempo real
- Animaciones de error suaves
- Keyboard tipo correcto para cada input
- Auto-focus y navegación con Enter/Tab
- Ajuste de viewport cuando aparece el keyboard
- Loading state durante submit
- Haptic feedback en errores
- Mensajes de éxito con animación
- Preservar datos en caso de error
- Accesibilidad completa

Usar: React Hook Form + Zod para validación
```

### Prompt 8: Lista Optimizada

```
Crea una lista infinita optimizada para mobile con:

Características:
- Virtual scrolling para performance
- Pull to refresh
- Infinite scroll
- Skeleton loaders
- Empty state con ilustración
- Error state con retry
- Swipeable items (acciones left/right)
- Sticky headers por sección
- Search/filter con debouncing
- Animación de items (stagger)

Datos:
[TIPO DE DATOS Y ESTRUCTURA]

Acciones por item:
[LISTA DE ACCIONES]
```

### Prompt 9: Integración Capacitor

```
Integra Capacitor en mi proyecto PWA existente para agregar capacidades nativas:

Features nativas necesarias:
[LISTA: camera, geolocation, push notifications, etc.]

Requisitos:
- Setup completo de Capacitor
- Configuración de plugins
- Platform detection hook
- Graceful fallbacks para web
- Native bridge unificado que funcione en web y nativo
- TypeScript types completos
- Error handling robusto
- Condicional rendering por plataforma

Stack actual:
- Vite + React + TypeScript
- [Otros detalles de tu stack]
```

### Prompt 10: Native Feature with Fallback

```
Implementa esta feature con soporte nativo (Capacitor) y fallback web:

Feature: [DESCRIPCIÓN DE LA FEATURE]

Debe incluir:
- Versión nativa usando plugin de Capacitor
- Fallback a Web API cuando esté disponible
- Fallback manual/custom cuando no hay API
- Platform detection automático
- UI consistente en todas las plataformas
- Loading y error states
- Haptic feedback en versión nativa
- TypeScript con tipos específicos por plataforma

Ejemplo de uso esperado:
[CÓDIGO DE EJEMPLO]
```

### Prompt 11: Splash Screen System

```
Crea un sistema completo de splash screen que funcione tanto en PWA como en Capacitor:

Requisitos:
- Hook useSplashScreen con control manual
- Componente SplashScreen animado
- Soporte para logo, app name, tagline
- Minimum duration configurable
- Fade out suave
- Integración con Capacitor SplashScreen plugin
- Fallback web con animaciones
- Loading progress indicator
- Preload de recursos críticos
- Marca como "ready" después de cargar

Recursos a precargar:
[LISTA DE RECURSOS]

Duración mínima: [TIEMPO]
```

---

## Checklist Final

### Pre-Launch

- [ ] **PWA Manifest** completo con todos los tamaños de iconos
- [ ] **Service Worker** configurado con estrategias de cache
- [ ] **Splash screens** generados para iOS
- [ ] **Meta tags** correctos (viewport, theme-color, etc.)
- [ ] **HTTPS** en producción
- [ ] **Lighthouse Score** > 90 en todas las categorías
- [ ] **Touch targets** mínimo 44x44px
- [ ] **Font loading** optimizado (font-display: swap)
- [ ] **Images** en WebP con fallback
- [ ] **Lazy loading** en todas las imágenes
- [ ] **Code splitting** implementado
- [ ] **Bundle size** analizado y optimizado
- [ ] **Performance budget** definido

### Native/Capacitor (si aplica)

- [ ] **Capacitor.config.ts** configurado correctamente
- [ ] **iOS icons** y splash screens generados
- [ ] **Android icons** y splash screens generados
- [ ] **Permissions** declarados en AndroidManifest.xml
- [ ] **Permissions** declarados en Info.plist (iOS)
- [ ] **App signing** configurado para ambas plataformas
- [ ] **Deep linking** configurado (si aplica)
- [ ] **Push notifications** configuradas (si aplica)
- [ ] **Status bar** styling correcto en ambas plataformas
- [ ] **Safe areas** funcionando en iOS
- [ ] **Back button** de Android manejado correctamente
- [ ] **App lifecycle** manejado (pause, resume)
- [ ] **Testeado en dispositivos físicos** iOS y Android
- [ ] **Build de producción** testeado antes de subir a stores

### UX Nativa

- [ ] **Animaciones suaves** en todas las transiciones
- [ ] **Gestos táctiles** implementados donde corresponda
- [ ] **Haptic feedback** en acciones importantes
- [ ] **Loading states** con skeleton screens
- [ ] **Error states** con retry options
- [ ] **Empty states** con call-to-action
- [ ] **Pull to refresh** en vistas que lo necesiten
- [ ] **Infinite scroll** optimizado
- [ ] **Safe areas** respetadas en todos los layouts
- [ ] **Keyboard handling** correcto
- [ ] **Modo oscuro** funcional
- [ ] **Offline experience** aceptable

### Testing

- [ ] Testeado en **iOS Safari**
- [ ] Testeado en **Chrome Android**
- [ ] Testeado en **diferentes tamaños** de pantalla
- [ ] Testeado **modo oscuro** y claro
- [ ] Testeado **modo offline**
- [ ] Testeado **instalación** como PWA
- [ ] Testeado **actualización** de service worker
- [ ] Testeado **notificaciones push** (si aplica)
- [ ] **Performance profiling** realizado
- [ ] **Memory leaks** verificados
- [ ] **Accessibility audit** pasado

### Deployment

- [ ] **Environment variables** configuradas
- [ ] **Analytics** implementados
- [ ] **Error tracking** (Sentry, etc.)
- [ ] **CDN** para assets estáticos
- [ ] **Compression** (gzip/brotli) habilitado
- [ ] **Cache headers** configurados
- [ ] **Redirects** configurados (www, https)
- [ ] **robots.txt** y **sitemap.xml**
- [ ] **Social meta tags** (OG, Twitter)

---

## Recursos Adicionales

### Documentación Oficial
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox Guide](https://developers.google.com/web/tools/workbox)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [NativeScript Docs](https://docs.nativescript.org/)

### Tools
- [PWA Builder](https://www.pwabuilder.com/) - Generar assets y manifest
- [Real Favicon Generator](https://realfavicongenerator.net/) - Iconos multiplataforma
- [App Icon Generator](https://www.appicon.co/) - Splash screens iOS
- [Squoosh](https://squoosh.app/) - Optimizar imágenes
- [Capacitor Asset Generator](https://github.com/ionic-team/capacitor-assets) - Generate all native assets

### Inspiración
- [Mobbin](https://mobbin.com/) - UI patterns nativos
- [iOS Design Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design](https://m3.material.io/)

---

## Notas Finales

Este boilerplate está diseñado para crear PWAs que rivalizan con apps nativas en términos de UX y performance. Los principios clave son:

1. **Performance First**: Cada decisión de diseño considera el impacto en performance
2. **Progressive Enhancement**: La app funciona en todos los contextos, mejorando donde es posible
3. **Native Feel**: Gestos, animaciones y comportamientos que usuarios esperan de apps nativas
4. **Offline First**: La app es útil incluso sin conexión
5. **Accessibility**: Accesible para todos los usuarios desde el día uno

**Recuerda**: El objetivo es que los usuarios no noten que están usando una PWA. Si lo lograste, hiciste un excelente trabajo.
