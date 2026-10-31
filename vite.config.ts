import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { handleAskApiRoute } from './src/server/askHandler.ts';

function geminiServerRoutePlugin(): Plugin {
  return {
    name: 'gemini-server-route',
    configureServer(server) {
      server.middlewares.use('/api/ask', (req, res) => {
        handleAskApiRoute(req, res);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/ask', (req, res) => {
        handleAskApiRoute(req, res);
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), geminiServerRoutePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname ?? '.', '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      chunkSizeWarningLimit: 1600,
    },
  };
});
