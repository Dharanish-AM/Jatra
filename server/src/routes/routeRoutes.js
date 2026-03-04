import { Router } from 'express';
import { getRoutes } from '../controllers/routeController.js';

const router = Router();

router.get('/', getRoutes);

export default router;
