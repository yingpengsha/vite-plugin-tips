import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteTips from 'vite-plugin-tips'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), viteTips()],
})
