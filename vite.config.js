import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const targetUrl = env.VITE_API_URL || env.API_URL || `http://localhost:${env.PORT || 5000}`;

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: targetUrl,
          changeOrigin: true,
        },
        '/health': {
          target: targetUrl,
          changeOrigin: true,
        }
      }
    }
  }
})
