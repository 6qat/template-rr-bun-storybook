import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { reactRouterHonoServer } from 'react-router-hono-server/dev';

// https://github.com/remix-run/react-router/issues/12568

export default defineConfig(({ isSsrBuild }) => ({
  build:
    process.env.WEB_SERVER === 'express'
      ? {
          rollupOptions: isSsrBuild
            ? {
                input: './server/app.ts',
              }
            : undefined,
        }
      : undefined,
  resolve:
    process.env.NODE_ENV === 'development'
      ? {}
      : {
          alias: {
            'react-dom/server': 'react-dom/server.node',
          },
        },
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    process.env.WEB_SERVER === 'hono' &&
      reactRouterHonoServer({
        dev: {
          exclude: [/^\/(resources)\/.+/],
        },
      }),
  ],
}));
