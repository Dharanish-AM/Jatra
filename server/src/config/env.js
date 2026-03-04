import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number.parseInt(process.env.PORT ?? '5050', 10),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/jatra',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
};
