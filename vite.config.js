import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-index-to-404',
      closeBundle() {
        fs.copyFileSync('dist/index.html', 'dist/404.html')
      }
    }
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://8yboiwp3ec.execute-api.ap-south-1.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/prod')
      }
    }
  }
}) 




  
