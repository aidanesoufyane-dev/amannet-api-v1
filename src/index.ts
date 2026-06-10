import { createServer } from 'http';

import { app } from './app';
import { env } from './config/env';
import { connectMongo } from './db/mongoose';
import { initSocketIO } from './modules/chat/socket';

async function startServer() {
  await connectMongo();

  const server = createServer(app);

  // Initialize Socket.IO
  initSocketIO(server);

  server.listen(env.port, () => {
    console.log(`API listening on ${env.baseUrl}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
