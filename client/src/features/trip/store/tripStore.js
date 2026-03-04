import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useTripStore = create(
  persist(
    (set) => ({
      selectedRoutes: [],
      selectedHotels: [],
      nights: 1,
      addRoute: (route) =>
        set((state) => {
          const exists = state.selectedRoutes.some((item) => item.id === route.id);
          if (exists) return state;
          return { selectedRoutes: [...state.selectedRoutes, route] };
        }),
      removeRoute: (routeId) =>
        set((state) => ({
          selectedRoutes: state.selectedRoutes.filter((route) => route.id !== routeId),
        })),
      addHotel: (hotel) =>
        set((state) => {
          const exists = state.selectedHotels.some((item) => item.id === hotel.id);
          if (exists) return state;
          return { selectedHotels: [...state.selectedHotels, hotel] };
        }),
      removeHotel: (hotelId) =>
        set((state) => ({
          selectedHotels: state.selectedHotels.filter((hotel) => hotel.id !== hotelId),
        })),
      setNights: (nights) => set({ nights }),
      clearTripItems: () => set({ selectedRoutes: [], selectedHotels: [], nights: 1 }),
      hydrateTrip: (payload) =>
        set({
          selectedRoutes: payload?.selectedRoutes ?? [],
          selectedHotels: payload?.selectedHotels ?? [],
          nights: payload?.nights ?? 1,
        }),
    }),
    {
      name: 'jatra-trip-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        selectedRoutes: state.selectedRoutes,
        selectedHotels: state.selectedHotels,
        nights: state.nights,
      }),
    },
  ),
);
