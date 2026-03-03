import React, { createContext, useReducer, useEffect, useContext } from 'react';

const TripContext = createContext(null);

const initialState = {
    searchParams: { from: '', to: '', date: '', passengers: 1, type: 'Both' },
    selectedRoutes: [],
    selectedHotels: [],
    nights: 1,
    aiPickedRouteId: null,
};

function tripReducer(state, action) {
    switch (action.type) {
        case 'SET_SEARCH':
            return { ...state, searchParams: { ...state.searchParams, ...action.payload } };
        case 'ADD_ROUTE':
            return { ...state, selectedRoutes: [...state.selectedRoutes, action.payload] };
        case 'REMOVE_ROUTE':
            return { ...state, selectedRoutes: state.selectedRoutes.filter(r => r.id !== action.payload) };
        case 'ADD_HOTEL':
            return { ...state, selectedHotels: [...state.selectedHotels, action.payload] };
        case 'REMOVE_HOTEL':
            return { ...state, selectedHotels: state.selectedHotels.filter(h => h.id !== action.payload) };
        case 'SET_NIGHTS':
            return { ...state, nights: action.payload };
        case 'SET_AI_PICK':
            return { ...state, aiPickedRouteId: action.payload };
        case 'CLEAR_TRIP':
            return { ...initialState, searchParams: state.searchParams };
        case 'HYDRATE':
            return { ...action.payload };
        default:
            return state;
    }
}

export function TripProvider({ children }) {
    const [state, dispatch] = useReducer(tripReducer, initialState, (initial) => {
        try {
            const persisted = sessionStorage.getItem('jatra_trip_state');
            return persisted ? JSON.parse(persisted) : initial;
        } catch {
            return initial;
        }
    });

    useEffect(() => {
        sessionStorage.setItem('jatra_trip_state', JSON.stringify(state));
    }, [state]);

    const totalFare = state.selectedRoutes.reduce((acc, route) => acc + (route.fare * state.searchParams.passengers), 0);
    const totalHotelCost = state.selectedHotels.reduce((acc, hotel) => acc + (hotel.pricePerNight * state.nights), 0);
    const grandTotal = totalFare + totalHotelCost;

    const actions = {
        setSearch: (params) => dispatch({ type: 'SET_SEARCH', payload: params }),
        addRoute: (route) => dispatch({ type: 'ADD_ROUTE', payload: route }),
        removeRoute: (routeId) => dispatch({ type: 'REMOVE_ROUTE', payload: routeId }),
        addHotel: (hotel) => dispatch({ type: 'ADD_HOTEL', payload: hotel }),
        removeHotel: (hotelId) => dispatch({ type: 'REMOVE_HOTEL', payload: hotelId }),
        setNights: (nights) => dispatch({ type: 'SET_NIGHTS', payload: nights }),
        setAiPick: (routeId) => dispatch({ type: 'SET_AI_PICK', payload: routeId }),
        clearTrip: () => dispatch({ type: 'CLEAR_TRIP' }),
    };

    const value = {
        ...state,
        actions,
        derived: {
            totalFare,
            totalHotelCost,
            grandTotal,
        }
    };

    return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
    const context = useContext(TripContext);
    if (!context) {
        throw new Error('useTrip must be used within a TripProvider');
    }
    return context;
}
