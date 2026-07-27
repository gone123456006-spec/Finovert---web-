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
        /*
         * Declarative chunking only.
         *
         * An id-matching manualChunks(id) function previously shipped here and
         * broke production with a blank page: assigning arbitrary node_modules
         * subsets to chunks let Rollup emit chunks with circular top-level
         * dependencies, so a module could be evaluated before its dependency
         * had initialised. It never reproduces locally because dev serves
         * unbundled ESM and never runs this code path. Keep it an explicit
         * entry-point list.
         */
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
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
