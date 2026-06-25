import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

const rootDirectory = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: {
      '@': path.resolve(rootDirectory, 'src'),
      models: path.resolve(rootDirectory, '/models')
    }
  },
  server: {
    proxy: {
      '/chat': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (requestPath) => requestPath.replace(/^\/chat/, '/api')
      }
    }
  }
})