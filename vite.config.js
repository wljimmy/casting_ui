import { defineConfig } from 'vite'
import path from 'path'

// 生成时间戳
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)

// https://vitejs.dev/config/
export default defineConfig({
  appType: 'mpa',
  root: './src',
  publicDir: '../public',
  build: {
    outDir: `../dist/${timestamp}`,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html')
      }
    }
  }
})
