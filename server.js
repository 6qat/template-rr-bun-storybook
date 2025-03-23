import compression from 'compression';
import express from 'express';
import morgan from 'morgan';

import { createServer as createViteServer } from 'vite';

// Short-circuit the type-checking of the built output.
const BUILD_PATH = './build/server/index.js';
const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PORT = Number.parseInt(process.env.PORT || '3000');

const app = express();

app.use(compression());
app.disable('x-powered-by');

/**
 * Handle source map requests by returning an empty source map
 * @param {express.Request} _req - Express request object
 * @param {express.Response} res - Express response object
 */
const handleSourceMap = (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send('{}'); // Return empty source map instead of 204
};

if (DEVELOPMENT) {
  console.log('Starting development server');

  const viteDevServer = await createViteServer({
    server: { middlewareMode: true },
  });

  // Use Vite's middleware
  app.use(viteDevServer.middlewares);

  // Handle specific source map requests that should be ignored
  // Placing these after Vite middleware to ensure they're not intercepted
  app.get('/installHook.js.map', handleSourceMap);
  app.get('/react_devtools_backend_compact.js.map', handleSourceMap);
  app.get('/%3Canonymous%20code%3E', handleSourceMap);

  /**
   * Catch-all route for development server
   * @param {express.Request} req - Express request object
   * @param {express.Response} res - Express response object
   * @param {express.NextFunction} next - Express next function
   */
  app.use(async (req, res, next) => {
    try {
      const source = await viteDevServer.ssrLoadModule('./server/app.ts');
      return await source.app(req, res, next);
    } catch (error) {
      if (typeof error === 'object' && error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error);
      }
      next(error);
    }
  });
} else {
  console.log('Starting production server');

  // Handle source map requests in production as well
  app.get('/installHook.js.map', handleSourceMap);
  app.get('/react_devtools_backend_compact.js.map', handleSourceMap);
  app.get('/%3Canonymous%20code%3E', handleSourceMap);

  app.use(
    '/assets',
    express.static('build/client/assets', { immutable: true, maxAge: '1y' })
  );
  app.use(express.static('build/client', { maxAge: '1h' }));
  app.use(await import(BUILD_PATH).then((mod) => mod.app));
}

app.use(morgan('tiny'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
