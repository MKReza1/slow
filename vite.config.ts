import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        home: path.resolve(__dirname, 'index.html'),
        services: path.resolve(__dirname, 'services.html'),
        pricing: path.resolve(__dirname, 'pricing.html'),
        portfolio: path.resolve(__dirname, 'portfolio.html'),
        about: path.resolve(__dirname, 'about.html'),
        contact: path.resolve(__dirname, 'contact.html'),
        order: path.resolve(__dirname, 'order.html'),
      },
    },
  },
});
