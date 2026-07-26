import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    {
      name: 'mock-figma-assets',
      enforce: 'pre',
      resolveId(source) {
        if (source.startsWith('figma:asset/')) {
          return source;
        }
        return null;
      },
      load(id) {
        if (id.startsWith('figma:asset/')) {
          // Return a transparent 1x1 pixel PNG data URI as a fallback
          return `export default "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";`;
        }
        return null;
      }
    }
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // Optimize build performance
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        // Manual chunking for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion': ['motion/react'],
          'icons': ['lucide-react'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },

  server: {
    host: true,
    port: 5173,
    strictPort: false,
    open: true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'motion/react', 'lucide-react'],
  },
})
