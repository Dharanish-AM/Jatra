import { Hotel } from "../models/Hotel.js";

export async function getHotels(req, res, next) {
  try {
    const { city } = req.query;

    const query = {};
    if (city) query.city = new RegExp(`^${city}$`, "i");

    const hotels = await Hotel.find(query)
      .sort({ stars: -1, pricePerNight: 1 })
      .lean();
    res.status(200).json({ success: true, count: hotels.length, data: hotels });
  } catch (error) {
    next(error);
  }
}
