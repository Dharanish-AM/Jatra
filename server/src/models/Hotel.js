import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    city: { type: String, required: true, index: true },
    name: { type: String, required: true },
    stars: { type: Number, required: true, min: 0, max: 5 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviewCount: { type: Number, required: true, min: 0 },
    pricePerNight: { type: Number, required: true, min: 0 },
    distanceFromStation: { type: String, required: true },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    tag: { type: String, default: '' },
    affiliateUrl: { type: String, default: '#' },
    description: { type: String, default: '' },
  },
  { timestamps: true, versionKey: false },
);

hotelSchema.index({ city: 1, stars: -1, pricePerNight: 1 });

export const Hotel = mongoose.model('Hotel', hotelSchema);
