import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const createDefaultItineraryDetails = () => ({
  tripTitle: '',
  tripNotes: '',
  dayPlans: [],
});

const createDefaultDayPlan = (day) => ({
  day,
  title: '',
  dayNotes: '',
  activities: [],
  estimatedBudget: 0,
});

const normalizeDayPlan = (plan, day) => ({
  ...createDefaultDayPlan(day),
  ...(plan ?? {}),
  day,
  activities: Array.isArray(plan?.activities) ? plan.activities : [],
});

export const useTripStore = create(
  persist(
    (set) => ({
      selectedRoutes: [],
      selectedHotels: [],
      nights: 1,
      itineraryDetails: createDefaultItineraryDetails(),
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
      setTripTitle: (tripTitle) =>
        set((state) => ({
          itineraryDetails: {
            ...state.itineraryDetails,
            tripTitle,
          },
        })),
      setTripNotes: (tripNotes) =>
        set((state) => ({
          itineraryDetails: {
            ...state.itineraryDetails,
            tripNotes,
          },
        })),
      setDayPlanTitle: (day, title) =>
        set((state) => {
          const existing = state.itineraryDetails.dayPlans.find((plan) => plan.day === day);
          const nextDayPlans = existing
            ? state.itineraryDetails.dayPlans.map((plan) =>
                plan.day === day ? { ...plan, title } : plan,
              )
            : [...state.itineraryDetails.dayPlans, { ...createDefaultDayPlan(day), title }];

          return {
            itineraryDetails: {
              ...state.itineraryDetails,
              dayPlans: nextDayPlans,
            },
          };
        }),
      setDayPlanBudget: (day, estimatedBudget) =>
        set((state) => {
          const existing = state.itineraryDetails.dayPlans.find((plan) => plan.day === day);
          const nextDayPlans = existing
            ? state.itineraryDetails.dayPlans.map((plan) =>
                plan.day === day ? { ...plan, estimatedBudget } : plan,
              )
            : [...state.itineraryDetails.dayPlans, { ...createDefaultDayPlan(day), estimatedBudget }];

          return {
            itineraryDetails: {
              ...state.itineraryDetails,
              dayPlans: nextDayPlans,
            },
          };
        }),
      setDayPlanNotes: (day, dayNotes) =>
        set((state) => {
          const existing = state.itineraryDetails.dayPlans.find((plan) => plan.day === day);
          const nextDayPlans = existing
            ? state.itineraryDetails.dayPlans.map((plan) =>
                plan.day === day ? { ...plan, dayNotes } : plan,
              )
            : [...state.itineraryDetails.dayPlans, { ...createDefaultDayPlan(day), dayNotes }];

          return {
            itineraryDetails: {
              ...state.itineraryDetails,
              dayPlans: nextDayPlans,
            },
          };
        }),
      upsertDayPlan: (day, payload) =>
        set((state) => {
          const existing = state.itineraryDetails.dayPlans.find((plan) => plan.day === day);
          const nextPlan = normalizeDayPlan({ ...(existing ?? {}), ...(payload ?? {}) }, day);
          const nextDayPlans = existing
            ? state.itineraryDetails.dayPlans.map((plan) => (plan.day === day ? nextPlan : plan))
            : [...state.itineraryDetails.dayPlans, nextPlan];

          return {
            itineraryDetails: {
              ...state.itineraryDetails,
              dayPlans: nextDayPlans,
            },
          };
        }),
      addDayActivity: (day, activity) =>
        set((state) => {
          const trimmed = (activity || '').trim();
          if (!trimmed) return state;

          const existing = state.itineraryDetails.dayPlans.find((plan) => plan.day === day);
          const nextDayPlans = existing
            ? state.itineraryDetails.dayPlans.map((plan) =>
                plan.day === day
                  ? { ...plan, activities: [...plan.activities, trimmed] }
                  : plan,
              )
            : [
                ...state.itineraryDetails.dayPlans,
                { ...createDefaultDayPlan(day), activities: [trimmed] },
              ];

          return {
            itineraryDetails: {
              ...state.itineraryDetails,
              dayPlans: nextDayPlans,
            },
          };
        }),
      removeDayActivity: (day, activityIndex) =>
        set((state) => ({
          itineraryDetails: {
            ...state.itineraryDetails,
            dayPlans: state.itineraryDetails.dayPlans.map((plan) =>
              plan.day === day
                ? {
                    ...plan,
                    activities: plan.activities.filter((_, index) => index !== activityIndex),
                  }
                : plan,
            ),
          },
        })),
      moveDayActivity: (day, fromIndex, toIndex) =>
        set((state) => ({
          itineraryDetails: {
            ...state.itineraryDetails,
            dayPlans: state.itineraryDetails.dayPlans.map((plan) => {
              if (plan.day !== day) return plan;

              const total = plan.activities.length;
              if (fromIndex < 0 || toIndex < 0 || fromIndex >= total || toIndex >= total) {
                return plan;
              }

              const nextActivities = [...plan.activities];
              const [moved] = nextActivities.splice(fromIndex, 1);
              nextActivities.splice(toIndex, 0, moved);

              return {
                ...plan,
                activities: nextActivities,
              };
            }),
          },
        })),
      moveDayActivityAcrossDays: (fromDay, fromIndex, toDay, toIndex = -1) =>
        set((state) => {
          const fromPlan = state.itineraryDetails.dayPlans.find((plan) => plan.day === fromDay);
          if (!fromPlan || fromIndex < 0 || fromIndex >= fromPlan.activities.length) {
            return state;
          }

          const movedItem = fromPlan.activities[fromIndex];
          const existingToPlan = state.itineraryDetails.dayPlans.find((plan) => plan.day === toDay);
          const toPlan = normalizeDayPlan(existingToPlan, toDay);

          const toActivities = [...toPlan.activities];
          const insertionIndex =
            toIndex >= 0 && toIndex <= toActivities.length ? toIndex : toActivities.length;
          toActivities.splice(insertionIndex, 0, movedItem);

          const nextPlansWithoutTo = state.itineraryDetails.dayPlans
            .map((plan) => {
              if (plan.day === fromDay) {
                return {
                  ...plan,
                  activities: plan.activities.filter((_, index) => index !== fromIndex),
                };
              }
              if (plan.day === toDay) {
                return {
                  ...toPlan,
                  activities: toActivities,
                };
              }
              return plan;
            });

          const hasToPlan = state.itineraryDetails.dayPlans.some((plan) => plan.day === toDay);
          const nextDayPlans = hasToPlan
            ? nextPlansWithoutTo
            : [...nextPlansWithoutTo, { ...toPlan, activities: toActivities }];

          return {
            itineraryDetails: {
              ...state.itineraryDetails,
              dayPlans: nextDayPlans,
            },
          };
        }),
      clearTripItems: () =>
        set({
          selectedRoutes: [],
          selectedHotels: [],
          nights: 1,
          itineraryDetails: createDefaultItineraryDetails(),
        }),
      hydrateTrip: (payload) =>
        set({
          selectedRoutes: payload?.selectedRoutes ?? [],
          selectedHotels: payload?.selectedHotels ?? [],
          nights: payload?.nights ?? 1,
          itineraryDetails: {
            ...createDefaultItineraryDetails(),
            ...(payload?.itineraryDetails ?? {}),
            dayPlans: (payload?.itineraryDetails?.dayPlans ?? []).map((plan) =>
              normalizeDayPlan(plan, plan?.day ?? 1),
            ),
          },
        }),
    }),
    {
      name: 'jatra-trip-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        selectedRoutes: state.selectedRoutes,
        selectedHotels: state.selectedHotels,
        nights: state.nights,
        itineraryDetails: state.itineraryDetails,
      }),
    },
  ),
);
