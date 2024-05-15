import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  preview: {
    port: 5173, 
    strictPort: true
  },
  server: {
    port: 5173, 
    strictPort: true,
    host: true, 
    origin: 'https://0.0.0.0:5173'
  }
})
