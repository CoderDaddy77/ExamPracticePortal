import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — tiny, cached forever
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Firebase — large but rarely changes
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          // Supabase — only used in admin/storage
          'vendor-supabase': ['@supabase/supabase-js'],
          // Tiptap editor — only used in AdminPanel
          'vendor-tiptap': [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-image',
            '@tiptap/extension-placeholder',
            '@tiptap/extension-underline',
            '@tiptap/extension-table',
            '@tiptap/extension-table-cell',
            '@tiptap/extension-table-header',
            '@tiptap/extension-table-row',
          ],
          // Quill editor — only used in study material
          'vendor-quill': ['react-quill'],
        },
      },
    },
  },
});
