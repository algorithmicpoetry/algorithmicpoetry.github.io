import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.jsx', '.web.js', '.jsx', '.js'],
  },
  define: {
    global: 'window',
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    process: { env: {} },
  },
  optimizeDeps: {
    include: ['react-native-web', '@react-native-async-storage/async-storage'],
    esbuildOptions: {
      resolveExtensions: ['.web.js', '.web.ts', '.web.tsx', '.js', '.ts', '.tsx'],
      loader: {
        '.js': 'jsx',
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
