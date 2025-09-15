import { defineConfig } from 'rollup';
import terser from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

// Minimal production build config (ESM, code-splitting enabled)
export default defineConfig({
  input: {
    'main-es6': 'js/main-es6.js',
  },
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: !isProduction, // Pas de sourcemap en production
    entryFileNames: '[name]-[hash].js',
    chunkFileNames: 'chunks/[name]-[hash].js',
    assetFileNames: 'assets/[name]-[hash][extname]',
  },
  plugins: [
    isProduction &&
      terser({
        compress: {
          drop_console: true, // Supprimer console.log en prod
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.debug'],
        },
        mangle: {
          safari10: true, // Support Safari 10
        },
      }),
  ].filter(Boolean),
  treeshake: true,
  onwarn(warning, warn) {
    // Silence circular dependency warnings for now, but keep others
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    warn(warning);
  },
});
