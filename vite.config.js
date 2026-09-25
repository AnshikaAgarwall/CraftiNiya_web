import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        'e:/Projects/e-commerce_web',
        'C:/Users/anshi/.gemini/antigravity-ide/brain',
      ],
    },
  },
})

