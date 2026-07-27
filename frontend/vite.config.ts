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
    // Target modern browsers — smaller, faster bundles
    target: ['es2020', 'chrome79', 'firefox67', 'safari13'],
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: false, // Faster builds
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Granular manual chunking for better HTTP/2 caching
        manualChunks(id) {
          // Core React runtime — always cached
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }
          // Motion library
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
            return 'motion';
          }
          // Icon library
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          // Radix UI components (large, tree-shake poorly)
          if (id.includes('node_modules/@radix-ui')) {
            return 'radix-ui';
          }
          // MUI (very large - only used in admin section)
          if (id.includes('node_modules/@mui') || id.includes('node_modules/@emotion')) {
            return 'mui';
          }
          // Charts
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3')) {
            return 'charts';
          }
          // Forms / utilities
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/date-fns')) {
            return 'forms';
          }
        },
        // Deterministic file naming for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
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
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'motion/react',
      'lucide-react',
    ],
    // Exclude large, rarely-changed packages from pre-bundling
    exclude: ['@mui/material', '@mui/icons-material'],
  },

  // Ensure assets < 4kb are inlined (reduces HTTP requests)
  base: '/',
})
