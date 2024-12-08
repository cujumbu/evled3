import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  define: {
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY)
  }
});