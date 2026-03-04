import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routeRoutes from './routes/routeRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

export const app = express();

app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
  }),
);

app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

app.use('/api/routes', routeRoutes);
app.use('/api/hotels', hotelRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
