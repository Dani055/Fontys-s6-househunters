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
          target: env.VITE_AUTHMS_URL,
          secure: false,
          changeOrigin: true,
        },
        '/api/user': {
          target: env.VITE_AUTHMS_URL,
          secure: false,
          changeOrigin: true,
        },
        '/api/listing': {
          target: env.VITE_LISTINGMS_URL,
          secure: false,
          changeOrigin: true,
        },
        '/api/comment': {
          target: env.VITE_LISTINGMS_URL,
          secure: false,
          changeOrigin: true,
        },
        '/api/bid': {
          target: env.VITE_BIDMS_URL,
          secure: false,
          changeOrigin: true,
        },
        '/api/media': {
          target: env.VITE_MEDIAMS_URL,
          secure: false,
          changeOrigin: true,
        },
      },
      // this ensures that the browser opens upon server start
      open: true,
      port: parseInt(env.PORT, 10) || 3000,
    },
    preview: {
      port: parseInt(env.PORT, 10) || 3000,
    },
    test: {
      environment: 'jsdom',
      include: ['**/*.test.tsx'],
      globals: true,
    },
  };

  return config;
});
