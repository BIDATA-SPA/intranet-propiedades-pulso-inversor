import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import dynamicImport from 'vite-plugin-dynamic-import'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-macros'],
      },
    }),
    dynamicImport(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        display: 'standalone',
        display_override: ['window-controls-overlay'],
        lang: 'es-ES',
        name: 'Pulso Propiedades',
        short_name:
          'Pulso Propiedades | La Plataforma Líder en Canje de Propiedades Inmobiliarias',
        description:
          'Descubre Pulso Propiedades, tu aliado definitivo en el corretaje de propiedades. Conéctate con una red ética de corredores y maximiza tus oportunidades de canje con seguridad y eficiencia. Únete a la comunidad de corretaje más innovadora y confiable de Chile.',
        theme_color: '#19223c',
        background_color: '#d4d4d4',
        icons: [
          {
            src: '/img/pwa/pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: '/img/pwa/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/img/pwa/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
              },
            },
          },
        ],
      },
    }),
  ],
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'build',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
          }
        },
      },
    },
    sourcemap: false,
  },
  server: {
    host: true,
  },
})
