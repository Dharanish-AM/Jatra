import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    from: { type: String, required: true, index: true },
    to: { type: String, required: true, index: true },
    type: { type: String, enum: ['bus', 'train'], required: true, index: true },
    operator: { type: String, required: true },
    name: { type: String, required: true },
    isGovernment: { type: Boolean, default: false },
    departure: { type: String, required: true },
    arrival: { type: String, required: true },
    duration: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    fare: { type: Number, required: true, min: 0 },
    classes: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    availableSeats: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

routeSchema.index({ from: 1, to: 1, type: 1 });

export const Route = mongoose.model('Route', routeSchema);
