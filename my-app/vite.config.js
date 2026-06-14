import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['nek_kaam.png'],
      manifest: {
        id: '/',
        name: 'Nek Kaam Foundation',
        short_name: 'Nek Kaam',
        description: 'Nek Kaam Foundation Official App',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/FinalNek.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/FinalNek.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})