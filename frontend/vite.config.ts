import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  const config = {
    base: '/',
    plugins: [react(), viteTsconfigPaths()],
    server: {
      host: true,
      proxy:{
        '/api/auth': {
          target: 'http://localhost:9998',
          secure: false,
          changeOrigin: true,
        },
        '/api/user': {
          target: 'http://localhost:9998',
          secure: false,
          changeOrigin: true,
        },
        '/api/listing': {
          target: 'http://localhost:9997',
          secure: false,
          changeOrigin: true,
        },
        '/api/comment': {
          target: 'http://localhost:9997',
          secure: false,
          changeOrigin: true,
        },
        '/api/bid': {
          target: 'http://localhost:9996',
          secure: false,
          changeOrigin: true,
        },
        '/api/media': {
          target: 'http://localhost:9999',
          secure: false,
          changeOrigin: true,
        },
      },
      // this ensures that the browser opens upon server start
      open: true,
      port: parseInt(env.VITE_PORT, 10) || 3000,
    },
    preview: {
      headers:{
        'Content-Security-Policy': 'upgrade-insecure-requests',
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block"
      },
      port: parseInt(env.VITE_PORT, 10) || 3000,
    },
    test: {
      environment: 'jsdom',
      include: ['**/*.test.tsx'],
      globals: true,
    },
  };

  return config;
});
