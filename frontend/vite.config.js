// vite.config.js
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    // para que el HMR / websocket funcione bien en local
    hmr: { protocol: 'ws', host: 'localhost', port: 5173 }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',

      // IMPORTANTÍSIMO: le decimos que usamos tu propio SW
      strategies: 'injectManifest',

      // aquí indicas la carpeta donde vive tu SW:
      srcDir: 'src/pwa',
      // y el nombre final:
      filename: 'service-worker.js',

      injectManifest: {
        // ahora, swSrc es relativo a srcDir:
        swSrc: 'service-worker.js'
      },

      includeAssets: [
        'favicon.svg',
        'icon-192x192.png',
        'icon-512x512.png'
      ],
      manifest: {
        name: 'Editor de Imágenes WASM',
        short_name: 'ImgEditor',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0f172a',
        icons: [
          { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ]
      },

      workbox: {
        // aquí defines lo que quieras cachear; en producción
        globPatterns: ['**/*.{js,css,html,png,svg,wasm}'],
        runtimeCaching: []
      },

      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ]
})
