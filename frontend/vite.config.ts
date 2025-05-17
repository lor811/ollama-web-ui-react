import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@providers': path.resolve(__dirname, './src/providers'),
    },
  },
    build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': [
            'react',
            'react-dom',
            'react-router',
            'react-error-boundary'
          ],
          
          'ui': [
            '@chakra-ui/react',
            'react-icons'
          ],
          
          'markdown': [
            'react-markdown',
            'remark-gfm',
            'rehype-raw',
            'react-syntax-highlighter'
          ],
          
          'data': [
            '@tanstack/react-query'
          ],
          
          'dev-tools': [
            'eslint',
            '@eslint/js',
            'eslint-plugin-react-hooks',
            'eslint-plugin-react-refresh',
            'typescript',
            'typescript-eslint'
          ].filter(() => process.env.NODE_ENV === 'development')
        }
      }
    }
  }
})
