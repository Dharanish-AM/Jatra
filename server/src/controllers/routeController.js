import { Route } from '../models/Route.js';

export async function getRoutes(req, res, next) {
  try {
    const { from, to, type } = req.query;

    const query = {};
    if (from) query.from = new RegExp(`^${from}$`, 'i');
    if (to) query.to = new RegExp(`^${to}$`, 'i');
    if (type && type.toLowerCase() !== 'both') query.type = type.toLowerCase();

    const routes = await Route.find(query).sort({ fare: 1 }).lean();
    res.status(200).json({ success: true, count: routes.length, data: routes });
  } catch (error) {
    next(error);
  }
}
