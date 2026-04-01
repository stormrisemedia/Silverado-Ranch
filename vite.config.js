import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Change this to your GitHub repo name if deploying to GitHub Pages
  // e.g. base: '/silverado-inventory/'
  base: '/',
})
