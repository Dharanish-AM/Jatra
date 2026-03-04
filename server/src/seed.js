import 'dotenv/config';
import { connectDatabase } from './config/db.js';
import { Hotel } from './models/Hotel.js';
import { Route } from './models/Route.js';
import hotels from './data/hotels.json' with { type: 'json' };
import routes from './data/routes.json' with { type: 'json' };

const mongoUri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/jatra';

async function seedDatabase() {
  await connectDatabase(mongoUri);

  const [deletedHotels, deletedRoutes] = await Promise.all([
    Hotel.deleteMany({}),
    Route.deleteMany({}),
  ]);

  const [insertedHotels, insertedRoutes] = await Promise.all([
    Hotel.insertMany(hotels, { ordered: true }),
    Route.insertMany(routes, { ordered: true }),
  ]);

  console.log(
    `✅ Seed complete: ${insertedHotels.length} hotels, ${insertedRoutes.length} routes`,
  );
  console.log(
    `🧹 Removed old data: ${deletedHotels.deletedCount} hotels, ${deletedRoutes.deletedCount} routes`,
  );
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Seed failed', error);
    process.exit(1);
  });
