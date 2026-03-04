import 'dotenv/config';
import { app } from './app.js';
import { connectDatabase } from './config/db.js';

const port = Number.parseInt(process.env.PORT ?? '5050', 10);
const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/jatra';

async function startServer() {
  await connectDatabase(mongoUri);

  app.listen(port, () => {
    console.log(`🚀 Jatra server running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('❌ Failed to start server', error);
  process.exit(1);
});
