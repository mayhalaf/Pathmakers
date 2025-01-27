import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,  // React runs on 5173
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // Backend runs on 4000
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
