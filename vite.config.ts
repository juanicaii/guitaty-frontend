import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'offline.html'],
      strategies: 'generateSW',
      injectRegister: 'auto',
      manifest: {
        name: 'Guitaty - Finanzas Personales',
        short_name: 'Guitaty App',
        description: 'Aplicación completa para gestionar tus finanzas personales, transacciones, cuentas y categorías',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        lang: 'es',
        categories: ['finance', 'productivity', 'utilities'],
        screenshots: [
          {
            src: '/screenshots/dashboard-narrow.png',
            sizes: '540x720',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Dashboard principal con resumen financiero'
          },
          {
            src: '/screenshots/dashboard-wide.png',
            sizes: '1024x593',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Vista de dashboard en pantalla amplia'
          }
        ],
        shortcuts: [
          {
            name: 'Nueva Transacción',
            short_name: 'Transacción',
            description: 'Agregar una nueva transacción rápidamente',
            url: '/transactions?action=new',
            icons: [{ src: '/icons/shortcut-transaction.png', sizes: '192x192' }]
          },
          {
            name: 'Ver Dashboard',
            short_name: 'Dashboard',
            description: 'Ver resumen financiero principal',
            url: '/',
            icons: [{ src: '/icons/shortcut-dashboard.png', sizes: '192x192' }]
          }
        ],
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Solo cachear assets específicos, no todo
        globPatterns: [
          '**/*.{js,css,ico,png,svg,woff2}',
          'offline.html'
        ],
        // Excluir index.html del precache para evitar caché agresivo
        globIgnores: ['**/index.html'],
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/, /^\/api\//],
        runtimeCaching: [
          // Caché para la página principal con NetworkFirst
          {
            urlPattern: /^\/$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 5 // 5 minutos
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // API endpoints con NetworkFirst
          {
            urlPattern: /^\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 // 1 hora
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 3
            }
          },
          // Imágenes con CacheFirst
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 días
              }
            }
          },
          // JS y CSS con StaleWhileRevalidate
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 1 día
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
