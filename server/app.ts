// ONLY FOR EXPRESS WEB SERVER

import 'react-router';
import { createRequestHandler } from '@react-router/express';
import express from 'express';

declare module 'react-router' {
  interface AppLoadContext {
    VALUE_FROM_EXPRESS: string;
  }
}

const app = express();

app.use(
  createRequestHandler({
    build: () => import('virtual:react-router/server-build'),
    getLoadContext() {
      return {
        VALUE_FROM_EXPRESS: 'Hello from Express',
      };
    },
  })
);

export { app };
