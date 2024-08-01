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
import { getAddMemoInstruction } from '@solana-program/memo';
import {
  createSolanaRpc,
  mainnet,
  pipe,
  createTransactionMessage,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstruction,
  getBase64EncodedWireTransaction,
  setTransactionMessageFeePayer,
  address,
  compileTransaction,
} from '@solana/web3.js';

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
    label: 'Ruggg meee',
  });
});

app.post('/', async (c) => {
  const { account } = await c.req.json<ActionPostRequest>();
  console.log('user account:', account);
  return c.json<ActionPostResponse>({
    message: 'Trying to Rugg',
    transaction: await createMemoTransaction(account),
  });
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

async function createMemoTransaction(account: string) {
  const rpc = createSolanaRpc(mainnet('https://api.mainnet-beta.solana.com'));

  const { value: latestBlockhash } = await rpc
    .getLatestBlockhash({ commitment: 'confirmed' })
    .send();

  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (m) => setTransactionMessageFeePayer(address(account), m),
    (m) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, m),
    (m) =>
      appendTransactionMessageInstruction(
        getAddMemoInstruction({ memo: `${account} is trying to rug me` }),
        m,
      ),
  );

  return getBase64EncodedWireTransaction(compileTransaction(message));
}
