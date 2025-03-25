import { Elysia } from 'elysia';
import { reactRouter } from 'elysia-react-router';

// Only working on development node
// TODO: make it work on production
new Elysia()
  .use(
    await reactRouter({
      mode: 'production',
    })
  )
  .get('/some', 'Hello, world!')
  .listen(3000, console.log);
