
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/strummy/',
  server: {
    proxy: {
      '/itunes-api': {
        target: 'https://itunes.apple.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/itunes-api/, ''),
      },
      '/ai-api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai-api/, ''),
      },

      '/chords-api': {
        target: 'https://strummy-chord-backend.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/chords-api/, '/api'),
      },
    },
  },
})
