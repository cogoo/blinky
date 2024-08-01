import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from '@hono/node-server/serve-static';
import { ActionGetResponse } from '@solana/actions';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: ['*'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept-Encoding'],
    exposeHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400,
  }),
);

app.use(
  '/actions.json',
  serveStatic({
    path: './actions.json',
  }),
);

app.get('/', (c) => {
  return c.json<ActionGetResponse>({
    icon: 'https://cdn-icons-png.flaticon.com/512/3610/3610624.png',
    title: 'WBA Blink demo',
    description: 'My First Blink',
    label: 'Do Something',
  });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
