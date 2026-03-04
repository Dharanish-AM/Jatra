import { useMemo } from 'react';

export function calculateTripCost({ selectedRoutes = [], selectedHotels = [], nights = 1, passengers = 1 }) {
  const totalFare = selectedRoutes.reduce((acc, route) => acc + route.fare * passengers, 0);
  const totalHotelCost = selectedHotels.reduce((acc, hotel) => acc + hotel.pricePerNight * nights, 0);
  const grandTotal = totalFare + totalHotelCost;

  return {
    totalFare,
    totalHotelCost,
    grandTotal,
  };
}

export default function useTripCost(input) {
  return useMemo(() => calculateTripCost(input), [input]);
}
