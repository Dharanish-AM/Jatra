import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { decodeItinerary } from '../utils/itineraryEncoder';
import { Plane, Train, Bus, Building2, ExternalLink } from 'lucide-react';

export default function SharedTrip() {
    const [searchParamsUrl] = useSearchParams();
    const dataParam = searchParamsUrl.get('data');

    const tripData = useMemo(() => {
        if (!dataParam) return null;
        return decodeItinerary(dataParam);
    }, [dataParam]);

    if (!tripData) {
        return (
            <div className="pt-24 flex justify-center items-center h-[60vh] px-4">
                <div className="text-center glass-card max-w-md w-full p-8 border border-border-light shadow-2xl">
                    <div className="w-16 h-16 bg-primary-bg/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-border-light">
                        <div className="text-3xl opacity-50 grayscale">🔗</div>
                    </div>
                    <h2 className="text-2xl font-black text-white mb-3 tracking-wide">Invalid Trip Link</h2>
                    <p className="text-text-muted font-medium mb-8">This shared link appears to be broken or expired.</p>
                    <Link to="/" className="w-full bg-gradient-to-r from-accent-orange to-accent-orange-light text-primary-bg font-black py-3.5 rounded-xl flex items-center justify-center shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_25px_rgba(249,115,22,0.5)] transition-all hover-lift">
                        Plan Your Own Trip
                    </Link>
                </div>
            </div>
        );
    }

    const { searchParams, selectedRoutes, selectedHotels, nights, derived } = tripData;

    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 fade-in">

            <div className="bg-gradient-to-r from-blue-600/10 to-accent-teal/10 border border-blue-500/20 rounded-2xl p-5 mb-8 flex items-center gap-4 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                <div className="bg-blue-500/20 p-2.5 rounded-xl hidden sm:block border border-blue-500/30 shadow-inner">
                    <Plane className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <h3 className="font-extrabold text-white text-lg flex items-center gap-2 tracking-wide">Shared by a fellow traveler ✈️</h3>
                    <p className="text-sm text-blue-200/60 font-medium">You're viewing a read-only itinerary.</p>
                </div>
            </div>

            <div className="glass-card border border-border-light overflow-hidden shadow-2xl">
                <div className="bg-card-bg/50 border-b border-border-light p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-end gap-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent-orange/10 blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="text-xs uppercase tracking-widest font-bold text-text-muted mb-2">Trip Overview</div>
                        <h1 className="text-3xl md:text-5xl font-black text-white">
                            {searchParams.from} <span className="text-accent-orange text-2xl md:text-4xl px-2">➔</span> {searchParams.to}
                        </h1>
                        <div className="flex gap-4 mt-3 text-sm font-medium text-text-muted">
                            <span>{new Date(searchParams.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span>•</span>
                            <span>{searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    <div className="relative z-10 bg-primary-bg/80 backdrop-blur-xl px-6 py-5 border border-border-light rounded-2xl shadow-inner">
                        <div className="text-[10px] uppercase tracking-widest font-black text-text-muted mb-1.5">Total Estimated Cost</div>
                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-orange-light tracking-tight">₹{derived.grandTotal}</div>
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-8 relative">

                    <div className="text-lg font-bold text-white border-b border-border/50 pb-2 flex justify-between">
                        <span>Itinerary Details</span>
                    </div>

                    <div className="border-l-2 border-border/60 ml-3 md:ml-4 space-y-8 pb-4">
                        {selectedRoutes.map((route, idx) => {
                            const hotelsForDest = selectedHotels.filter(h => h.city.toLowerCase() === route.to.toLowerCase());

                            return (
                                <div key={`${route.id}-${idx}`} className="relative pl-8 md:pl-10">
                                    <div className="absolute -left-[11px] top-4 w-5 h-5 rounded-full bg-border border-4 border-card-bg z-10"></div>

                                    <div className="glass-card border-border-light p-5 border-l-4 border-l-accent-orange">
                                        <div className="flex justify-between items-start mb-5 gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-primary-bg/50 p-2.5 rounded-xl border border-border-light text-accent-orange shadow-inner">
                                                    {route.type === 'train' ? <Train className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h3 className="font-extrabold text-white text-lg tracking-wide">{route.from} ➔ {route.to}</h3>
                                                    <p className="text-sm text-text-muted font-bold">{route.operator} <span className="text-border-light mx-1">•</span> {route.name}</p>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="font-black text-accent-orange text-xl tracking-tight">₹{route.fare}</div>
                                                <div className="text-[10px] uppercase tracking-widest text-text-muted font-black opacity-80 mt-0.5">per pax</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-5 text-sm bg-primary-bg/30 px-4 py-3 rounded-xl border border-border-light shadow-inner">
                                            <div className="font-bold text-white tracking-wide">{route.departure}</div>
                                            <div className="flex-1 border-t-2 border-dashed border-border-light flex justify-center">
                                                <span className="-mt-3.5 bg-card-bg px-3 py-0.5 text-[10px] font-black tracking-widest text-text-muted uppercase rounded-full border border-border-light shadow-sm">{route.duration}</span>
                                            </div>
                                            <div className="font-bold text-white tracking-wide">{route.arrival}</div>
                                        </div>
                                    </div>

                                    {hotelsForDest.length > 0 && (
                                        <div className="mt-4 space-y-3">
                                            {hotelsForDest.map(hotel => (
                                                <div key={hotel.id} className="bg-teal-900/10 border border-teal-500/20 border-l-4 border-l-teal-500 rounded-lg p-3 flex justify-between items-center ml-4 md:ml-8">
                                                    <div className="flex items-center gap-3">
                                                        <Building2 className="w-5 h-5 text-teal-500 shrink-0" />
                                                        <div>
                                                            <h4 className="font-bold text-white text-sm">{hotel.name} <span className="text-yellow-500 font-normal">({hotel.stars}★)</span></h4>
                                                            <p className="text-xs text-text-muted mt-0.5">₹{hotel.pricePerNight}/night • {nights} nights</p>
                                                        </div>
                                                    </div>
                                                    <div className="font-bold text-white text-sm shrink-0 pl-2">
                                                        ₹{hotel.pricePerNight * nights}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            <div className="text-center mt-16 mb-10">
                <h3 className="text-2xl font-black text-white mb-6 tracking-wide">Inspired to travel?</h3>
                <Link to="/" className="inline-flex items-center gap-3 bg-gradient-to-r from-accent-orange to-accent-orange-light text-primary-bg font-black px-10 py-4 rounded-xl hover-lift shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_25px_rgba(249,115,22,0.5)] transition-all">
                    Plan Your Own Trip <ExternalLink className="w-5 h-5" />
                </Link>
            </div>

        </div>
    );
}
