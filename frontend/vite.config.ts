import { defineConfig } from 'vite'
import { createRequire } from 'node:module'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { PluginOption } from 'vite'

// ---------------------------------------------------------------------------
// Platform guard for the Cloudflare Workers plugin
//
// @cloudflare/vite-plugin requires the Workerd native runtime and is ONLY
// valid when deploying to Cloudflare Workers via `wrangler deploy`.
//
// On Vercel (and during any plain `vite build`) this env var is absent, so
// the plugin — including its native Workerd binary — is never loaded.
//
// To deploy to Cloudflare Workers locally, set:
//   DEPLOY_TARGET=cloudflare npm run deploy --workspace=frontend
// ---------------------------------------------------------------------------
function getCloudflarePlugin(): PluginOption {
  if (process.env.DEPLOY_TARGET !== 'cloudflare') return null

  try {
    // ESM files cannot use require() directly. createRequire gives us CJS
    // semantics without a dynamic import (which would need async defineConfig).
    const _require = createRequire(import.meta.url)
    const { cloudflare } = _require('@cloudflare/vite-plugin') as typeof import('@cloudflare/vite-plugin')
    return cloudflare() as PluginOption
  } catch {
    // Plugin not installed in this environment — skip silently
    return null
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    // Intercept figma:asset/* virtual imports so the build does not crash on
    // references that are only meaningful inside the Figma Make environment.
    {
      name: 'mock-figma-assets',
      enforce: 'pre',
      resolveId(source: string) {
        if (source.startsWith('figma:asset/')) {
          return source
        }
        return null
      },
      load(id: string) {
        if (id.startsWith('figma:asset/')) {
          // Transparent 1×1 PNG — safe fallback for any image reference
          return `export default "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";`
        }
        return null
      },
    },

    getCloudflarePlugin(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files here.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // Target modern browsers — smaller, faster bundles
    target: ['es2020', 'chrome79', 'firefox67', 'safari13'],
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    reportCompressedSize: false, // Faster builds
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