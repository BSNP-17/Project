// vite.config.js - UPDATED COMPLETE VERSION
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // Your backend port
        changeOrigin: true
      }
    }
  },
  test: {
    globals: true,          // ✅ enables global test/expect
    environment: 'jsdom',   // ✅ gives you document/window in tests
    setupFiles: './src/setupTests.js', // ✅ runs MSW + jest-dom setup
    coverage: {
      reporter: ['text', 'json', 'html'], // optional: nice coverage reports
    }
  }
})