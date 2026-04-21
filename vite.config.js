import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['alpinejs', 'flowbite', 'navigo'],
          charts: ['apexcharts'],
          tables: ['gridjs'],
          i18n: ['i18next'],
          query: ['@tanstack/query-core', 'axios'],
        },
      },
    },
  },
  assetsInclude: ['**/*.html'],
});
