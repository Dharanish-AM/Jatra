import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { Train, Bus, Building2, MapPin, Trash2, Edit2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ItineraryPanel() {
    const { searchParams, selectedRoutes, selectedHotels, actions, nights } = useTrip();
    const navigate = useNavigate();
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tripTitle, setTripTitle] = useState(`${searchParams.from} to ${searchParams.to} Trip`);

    return (
        <div className="flex-1">
            <div className="flex items-center gap-3 mb-8">
                {isEditingTitle ? (
                    <input
                        type="text"
                        value={tripTitle}
                        onChange={(e) => setTripTitle(e.target.value)}
                        onBlur={() => setIsEditingTitle(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                        autoFocus
                        className="text-3xl font-extrabold bg-transparent border-b-2 border-accent-orange text-white focus:outline-none w-full max-w-md"
                    />
                ) : (
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3 group">
                        {tripTitle}
                        <button onClick={() => setIsEditingTitle(true)} className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent-orange transition-opacity">
                            <Edit2 className="w-5 h-5" />
                        </button>
                    </h1>
                )}
            </div>

            <div className="relative border-l-2 border-border-light/50 ml-4 md:ml-6 space-y-12">
                {selectedRoutes.length === 0 ? (
                    <div className="ml-8 text-text-muted font-bold tracking-wide italic">No routes added to your trip yet.</div>
                ) : (
                    selectedRoutes.map((route, idx) => {
                        const hotelsForDest = selectedHotels.filter(h => h.city.toLowerCase() === route.to.toLowerCase());

                        return (
                            <div key={`${route.id}-${idx}`} className="relative pl-8 md:pl-10">
                                <div className="absolute -left-[11px] top-6 w-5 h-5 rounded-full bg-accent-orange border-[4px] border-primary-bg z-10 shadow-[0_0_15px_rgba(249,115,22,0.6)] animate-pulse"></div>

                                <div className="glass-card p-6 group hover:border-accent-orange/30 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-5">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-primary-bg/50 p-2.5 rounded-xl border border-border-light text-accent-orange shadow-inner">
                                                {route.type === 'train' ? <Train className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-xl text-white tracking-wide">{route.from} ➔ {route.to}</h3>
                                                <p className="text-sm text-text-muted font-bold">{route.operator} <span className="text-border-light mx-1">•</span> {route.name}</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => actions.removeRoute(route.id)}
                                            className="text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2 bg-primary-bg/50 border border-transparent hover:border-red-500/30 rounded-lg hover:bg-red-500/10 shadow-sm"
                                            title="Remove Leg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-5 text-sm font-bold items-center bg-primary-bg/30 p-4 rounded-xl mb-2 border border-border-light shadow-inner">
                                        <div className="flex flex-col">
                                            <span className="text-text-muted text-[10px] uppercase tracking-widest mb-0.5">Departs</span>
                                            <span className="text-white text-base">{route.departure}</span>
                                        </div>
                                        <div className="w-px h-8 bg-border-light"></div>
                                        <div className="flex flex-col">
                                            <span className="text-text-muted text-[10px] uppercase tracking-widest mb-0.5">Arrives</span>
                                            <span className="text-white text-base">{route.arrival}</span>
                                        </div>
                                        <div className="w-px h-8 bg-border-light hidden sm:block"></div>
                                        <div className="flex flex-col">
                                            <span className="text-text-muted text-[10px] uppercase tracking-widest mb-0.5">Duration</span>
                                            <span className="text-white text-base">{route.duration}</span>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <span className="text-accent-orange font-black text-xl tracking-tight">₹{route.fare}</span>
                                            <span className="text-text-muted text-[10px] font-black uppercase tracking-widest ml-1.5 opacity-80">× {searchParams.passengers} pax</span>
                                        </div>
                                    </div>
                                </div>

                                {hotelsForDest.length > 0 && (
                                    <div className="mt-6 ml-6 space-y-4">
                                        {hotelsForDest.map(hotel => (
                                            <div key={hotel.id} className="glass-card p-4 border-l-4 border-l-accent-teal flex justify-between items-center group hover:bg-white/[0.02] hover:border-accent-teal/50 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-accent-teal/10 text-accent-teal flex items-center justify-center shrink-0 border border-accent-teal/20 shadow-inner">
                                                        <Building2 className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-extrabold text-white leading-tight tracking-wide">{hotel.name}</h4>
                                                        <p className="text-xs text-text-muted font-bold mt-1.5 flex items-center gap-1.5">
                                                            <span className="text-yellow-500">{hotel.stars}★</span>
                                                            <span className="w-1 h-1 bg-border-light rounded-full"></span>
                                                            ₹{hotel.pricePerNight}/night × {nights} nights
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            actions.setSearch({ ...searchParams, to: hotel.city });
                                                            navigate('/hotels');
                                                        }}
                                                        className="text-xs font-bold text-accent-teal hover:text-white px-3 py-2 bg-accent-teal/10 hover:bg-accent-teal/20 border border-accent-teal/20 rounded-md transition-colors shadow-sm"
                                                    >
                                                        Change
                                                    </button>
                                                    <button
                                                        onClick={() => actions.removeHotel(hotel.id)}
                                                        className="text-xs font-bold text-text-muted hover:text-red-400 px-2 py-2 bg-primary-bg border border-border-light rounded-md hover:bg-red-500/10 hover:border-red-500/30 transition-colors shadow-sm"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {hotelsForDest.length === 0 && (
                                    <div className="mt-4 ml-6">
                                        <button
                                            onClick={() => {
                                                actions.setSearch({ ...searchParams, to: route.to });
                                                navigate('/hotels');
                                            }}
                                            className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-accent-teal border border-dashed border-border-light px-4 py-2.5 rounded-xl hover:border-accent-teal/50 hover:bg-accent-teal/10 transition-all w-max shadow-sm"
                                        >
                                            <Plus className="w-4 h-4" /> Add hotel in {route.to}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}

                <div className="relative pl-8 md:pl-10 pb-4">
                    <div className="absolute -left-[11px] top-6 w-5 h-5 rounded-full bg-border-light border-[4px] border-primary-bg z-10"></div>
                    <button
                        onClick={() => {
                            const lastRoute = selectedRoutes[selectedRoutes.length - 1];
                            if (lastRoute) {
                                actions.setSearch({ ...searchParams, from: lastRoute.to, to: '' });
                            }
                            navigate('/');
                        }}
                        className="mt-2 flex items-center gap-2 text-white font-bold bg-white/5 border border-white/10 px-6 py-3.5 rounded-xl hover:border-accent-orange/50 hover:bg-white/10 transition-all shadow-md group hover-lift"
                    >
                        <MapPin className="w-5 h-5 text-accent-orange group-hover:scale-110 transition-transform" /> Add Another Leg
                    </button>
                </div>
            </div>
        </div>
    );
}
