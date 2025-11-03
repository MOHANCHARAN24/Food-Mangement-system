import dotenv from 'dotenv';
import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { connectDB } from '../src/config/db.js';
import Restaurant from '../src/models/Restaurant.js';
import { restaurantSeedData } from '../src/data/restaurantSeed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const run = async () => {
  try {
    await connectDB();

    const count = await Restaurant.countDocuments();
    if (count > 0) {
      // eslint-disable-next-line no-console
      console.log(`⚠️  Database already has ${count} restaurants. Aborting seed to avoid duplicates.`);
      process.exit(0);
    }

    await Restaurant.insertMany(restaurantSeedData);

    // eslint-disable-next-line no-console
    console.log(`✅ Seeded ${restaurantSeedData.length} restaurants.`);
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Seed failed', error);
    process.exit(1);
  }
};

run();
