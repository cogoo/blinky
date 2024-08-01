import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from '@hono/node-server/serve-static';
import {
  ActionGetRequest,
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
} from '@solana/actions';

const app = new Hono();

app.use('*', cors());

app.use(
  '/actions.json',
  serveStatic({
    path: './actions.json',
  }),
);

app.get<any, ActionGetRequest>('/', (c) => {
  return c.json<ActionGetResponse>({
    icon: 'https://arweave.net/_xAKprLrFovVXL_3vzbbQjxRib16dQfkkNHYlymBdB8',
    title: 'WBA Blink demo',
    description: 'My First Blink',
    label: 'Do Something',
  });
});

app.post('/', async (c) => {
  const { account } = await c.req.json<ActionPostRequest>();
  console.log('user account:', account);
  return c.json<ActionPostResponse>({
    message: 'Trying to Rugg',
    transaction: createMemoTransaction(account),
  });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
