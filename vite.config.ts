import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


import { crx } from '@crxjs/vite-plugin'

import manifest from './manifest.json'


import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(), crx({ manifest })],
  resolve: {
    alias: {
      '@': './src'
    }
  },
  build: {
    rollupOptions: {
      input: {
        popup: 'src/popup/index.html'
      }
    }
  }
  
})