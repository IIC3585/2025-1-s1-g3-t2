import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    // 🧩 Esto ayuda a evitar problemas con HMR y WebSocket en entornos locales
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192x192.png', 'icon-512x512.png'],
      manifest: {
        name: 'Editor de Imágenes WASM',
        short_name: 'ImgEditor',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0f172a',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      strategies: 'injectManifest',
      srcDir: 'src/pwa',
      filename: 'service-worker.js',
      injectManifest: {
        swSrc: 'src/pwa/service-worker.js'
      },
      workbox: {
        // ⚠️ Solo precachea si realmente es necesario. En modo desarrollo lo evitamos.
        globPatterns: [],
        runtimeCaching: [] // Sin runtime caching: sin cache
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ]
})
