import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesPath = path.resolve(__dirname, '../../../client/src/data/routes.json');
const hotelsPath = path.resolve(__dirname, '../../../client/src/data/hotels.json');

export async function readSeedFiles() {
  const [routesRaw, hotelsRaw] = await Promise.all([
    fs.readFile(routesPath, 'utf-8'),
    fs.readFile(hotelsPath, 'utf-8'),
  ]);

  return {
    routes: JSON.parse(routesRaw),
    hotels: JSON.parse(hotelsRaw),
  };
}
