import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/traigent-web/', // For GitHub Pages: achi-traigent.github.io/traigent-web/
}) 