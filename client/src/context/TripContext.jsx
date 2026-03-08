import React, { createContext, useContext } from 'react';
import { useSearchStore } from '../features/search/store/searchStore';
import { useTripStore } from '../features/trip/store/tripStore';
import { useAIStore } from '../features/ai/store/aiStore';
import { calculateTripCost } from '../hooks/useTripCost';

const TripContext = createContext(null);

export function TripProvider({ children }) {
    const searchParams = useSearchStore((state) => state.searchParams);
    const recentSearches = useSearchStore((state) => state.recentSearches);
    const setSearch = useSearchStore((state) => state.setSearch);
    const addRecentSearch = useSearchStore((state) => state.addRecentSearch);
    const removeRecentSearch = useSearchStore((state) => state.removeRecentSearch);
    const clearRecentSearches = useSearchStore((state) => state.clearRecentSearches);

    const selectedRoutes = useTripStore((state) => state.selectedRoutes);
    const selectedHotels = useTripStore((state) => state.selectedHotels);
    const nights = useTripStore((state) => state.nights);
    const itineraryDetails = useTripStore((state) => state.itineraryDetails);
    const addRoute = useTripStore((state) => state.addRoute);
    const removeRoute = useTripStore((state) => state.removeRoute);
    const addHotel = useTripStore((state) => state.addHotel);
    const removeHotel = useTripStore((state) => state.removeHotel);
    const setNights = useTripStore((state) => state.setNights);
    const setTripTitle = useTripStore((state) => state.setTripTitle);
    const setTripNotes = useTripStore((state) => state.setTripNotes);
    const setDayPlanTitle = useTripStore((state) => state.setDayPlanTitle);
    const setDayPlanBudget = useTripStore((state) => state.setDayPlanBudget);
    const setDayPlanNotes = useTripStore((state) => state.setDayPlanNotes);
    const upsertDayPlan = useTripStore((state) => state.upsertDayPlan);
    const addDayActivity = useTripStore((state) => state.addDayActivity);
    const removeDayActivity = useTripStore((state) => state.removeDayActivity);
    const moveDayActivity = useTripStore((state) => state.moveDayActivity);
    const moveDayActivityAcrossDays = useTripStore((state) => state.moveDayActivityAcrossDays);
    const clearTripItems = useTripStore((state) => state.clearTripItems);
    const hydrateTrip = useTripStore((state) => state.hydrateTrip);

    const aiPickedRouteId = useAIStore((state) => state.aiPickedRouteId);
    const setAiPick = useAIStore((state) => state.setAiPick);

    const derived = calculateTripCost({
        selectedRoutes,
        selectedHotels,
        nights,
        passengers: searchParams.passengers,
    });

    const actions = {
        setSearch,
        addRecentSearch,
        removeRecentSearch,
        clearRecentSearches,
        addRoute,
        removeRoute,
        addHotel,
        removeHotel,
        setNights,
        setTripTitle,
        setTripNotes,
        setDayPlanTitle,
        setDayPlanBudget,
        setDayPlanNotes,
        upsertDayPlan,
        addDayActivity,
        removeDayActivity,
        moveDayActivity,
        moveDayActivityAcrossDays,
        setAiPick,
        clearTrip: clearTripItems,
        hydrate: hydrateTrip,
    };

    const value = {
        searchParams,
        recentSearches,
        selectedRoutes,
        selectedHotels,
        nights,
        itineraryDetails,
        aiPickedRouteId,
        actions,
        derived,
    };

    return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTrip() {
    const context = useContext(TripContext);
    if (!context) {
        throw new Error('useTrip must be used within a TripProvider');
    }
    return context;
}
