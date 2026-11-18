import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: 'src/renderer',
  resolve: { alias: { '@': resolve('src/renderer') } },
  plugins: [vue()],
  build: { outDir: resolve('dist'), emptyOutDir: true }
})
