import { connectDatabase } from '../config/db.js';
import { env } from '../config/env.js';
import { Route } from '../models/Route.js';
import { Hotel } from '../models/Hotel.js';
import { readSeedFiles } from './readSeedFiles.js';

async function seedDatabase() {
  await connectDatabase(env.mongoUri);

  const { routes, hotels } = await readSeedFiles();

  await Promise.all([Route.deleteMany({}), Hotel.deleteMany({})]);

  await Promise.all([Route.insertMany(routes), Hotel.insertMany(hotels)]);

  console.log(`✅ Seed complete: ${routes.length} routes, ${hotels.length} hotels`);
  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error('❌ Seed failed', error);
  process.exit(1);
});
