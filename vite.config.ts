import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Work-related/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        tasks: 'tasks.html',
      },
    },
  },
})
