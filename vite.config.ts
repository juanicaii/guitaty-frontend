import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'offline.html'],
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
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
        // Patrones de archivos para precache
        globPatterns: [
          '**/*.{js,css,ico,png,svg,woff2,woff,ttf}',
          'offline.html',
          'index.html'
        ],
        // Excluir archivos del precache
        globIgnores: [
          '**/node_modules/**/*',
          '**/sw.js',
          '**/workbox-*.js'
        ],
        // Página de fallback para navegación offline
        navigateFallback: '/offline.html',
        navigateFallbackDenylist: [
          /^\/_/, 
          /\/[^/?]+\.[^/]+$/, 
          /^\/api\//,
          /^\/admin\//
        ],
        // Configuración de runtime caching mejorada
        runtimeCaching: [
          // Páginas principales con estrategia NetworkFirst
          {
            urlPattern: /^\/$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 10 // 10 minutos
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Rutas de la aplicación con NetworkFirst
          {
            urlPattern: /^\/(dashboard|transactions|accounts|categories|investments|settings)(\/.*)?$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-pages-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 15 // 15 minutos
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // API endpoints con estrategia híbrida
          {
            urlPattern: /^\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 30 // 30 minutos
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 5
            }
          },
          // Datos financieros con CacheFirst para mejor rendimiento
          {
            urlPattern: /^\/api\/(transactions|accounts|categories|investments)/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'financial-data-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 2 // 2 horas
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          // Imágenes y assets estáticos con CacheFirst
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|avif)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
              }
            }
          },
          // Fuentes con CacheFirst
          {
            urlPattern: /\.(?:woff2|woff|ttf|eot)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
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
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 días
              }
            }
          },
          // Datos de conversión de moneda con estrategia especial
          {
            urlPattern: /^\/api\/currency\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'currency-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 6 // 6 horas
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ],
        // Configuración adicional de Workbox
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        // Configuración de notificaciones
        disableDevLogs: false
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
