import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { espViteBuild } from '@aidenvigue/vite-plugin-static-c'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    espViteBuild()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
