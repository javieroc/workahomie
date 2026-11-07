/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  // Monorepo: the legacy app hoists React 18 to the root node_modules.
  // Force every package to share this app's React 19 copy.
  resolve: { dedupe: ['react', 'react-dom', 'react-router', 'react/jsx-runtime'] },
  server: { port: 3000 },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-dom/client', 'react-router', '@tanstack/react-query', 'axios'],
          auth: ['@auth0/auth0-react'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
