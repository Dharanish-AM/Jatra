import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import hotelsData from '../data/hotels.json';
import HotelCard from '../components/HotelCard';
import { Building2, Navigation, IndianRupee, MapPin } from 'lucide-react';

export default function Hotels() {
    const { searchParams, derived, nights } = useTrip();
    const navigate = useNavigate();

    const destination = searchParams.to;

    const [maxPrice, setMaxPrice] = useState(25000);
    const [minStars, setMinStars] = useState(0);
    const [selectedAmenities, setSelectedAmenities] = useState([]);

    const amenitiesList = ['AC', 'WiFi', 'Breakfast', 'Pool', 'Parking'];

    const filteredHotels = useMemo(() => {
        if (!destination) return [];

        let result = hotelsData.filter(h => h.city.toLowerCase() === destination.toLowerCase());

        result = result.filter(h => h.pricePerNight <= maxPrice);

        if (minStars > 0) {
            result = result.filter(h => h.stars >= minStars);
        }

        if (selectedAmenities.length > 0) {
            result = result.filter(h =>
                selectedAmenities.every(am => h.amenities.some(ham => ham.toLowerCase().includes(am.toLowerCase())))
            );
        }

        return result;
    }, [destination, maxPrice, minStars, selectedAmenities]);

    const handleAmenityToggle = (am) => {
        setSelectedAmenities(prev =>
            prev.includes(am) ? prev.filter(x => x !== am) : [...prev, am]
        );
    };

    if (!destination) {
        return (
            <div className="pt-24 flex justify-center items-center h-[50vh]">
                <div className="text-center">
                    <Building2 className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-50" />
                    <h2 className="text-xl font-bold text-white mb-2">No destination selected</h2>
                    <p className="text-text-muted mb-6">Search for a route first to find hotels.</p>
                    <button onClick={() => navigate('/')} className="px-6 py-2 bg-accent-orange text-white rounded-md hover:bg-[#ea580c] font-medium">
                        Go to Search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 fade-in">

            <div className="relative h-48 md:h-64 rounded-[var(--radius-card)] overflow-hidden mb-8 flex items-end p-6 md:p-8">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#1e293b]/80 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>

                <div className="relative z-20 w-full flex justify-between items-end">
                    <div>
                        <div className="flex items-center gap-2 text-accent-orange font-bold text-sm mb-2 uppercase tracking-widest bg-black/30 w-max px-3 py-1 rounded-full backdrop-blur-md">
                            <MapPin className="w-4 h-4" /> Destination
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white">Hotels in {destination}</h1>
                    </div>
                </div>
            </div>

            <div className="glass-card p-5 mb-8 flex flex-col md:flex-row gap-6 md:items-center">

                <div className="flex-1 min-w-[200px]">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[11px] uppercase tracking-widest font-black text-text-muted">Max Price/Night</span>
                        <span className="text-sm font-black text-accent-orange bg-accent-orange/10 px-2 py-0.5 rounded border border-accent-orange/20">₹{maxPrice}+</span>
                    </div>
                    <input
                        type="range"
                        min="500" max="25000" step="500"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                        className="w-full accent-accent-orange h-2 bg-primary-bg border border-border-light rounded-lg appearance-none cursor-pointer focus:outline-none"
                    />
                </div>

                <div className="w-px h-12 bg-border-light hidden md:block"></div>

                <div>
                    <span className="text-[11px] uppercase tracking-widest font-black text-text-muted block mb-3">Min Rating</span>
                    <div className="flex bg-primary-bg/50 rounded-xl p-1.5 border border-border-light shadow-inner">
                        {[0, 3, 4, 5].map(stars => (
                            <button
                                key={stars}
                                onClick={() => setMinStars(stars)}
                                className={`px-4 py-1.5 text-sm rounded-lg transition-all ${minStars === stars ? 'bg-gradient-to-r from-accent-orange to-accent-orange-light text-primary-bg font-black shadow-[0_2px_10px_rgba(249,115,22,0.3)]' : 'text-text-muted hover:text-white hover:bg-white/5 font-bold'}`}
                            >
                                {stars === 0 ? 'All' : `${stars}★`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-px h-12 bg-border-light hidden md:block"></div>

                <div className="flex-1">
                    <span className="text-[11px] uppercase tracking-widest font-black text-text-muted block mb-3">Amenities</span>
                    <div className="flex flex-wrap gap-2.5">
                        {amenitiesList.map(am => (
                            <label key={am} className="flex items-center gap-2 bg-primary-bg/50 px-3 py-2 rounded-xl border border-border-light cursor-pointer hover:border-accent-orange/50 transition-colors group shadow-sm">
                                <input
                                    type="checkbox"
                                    checked={selectedAmenities.includes(am)}
                                    onChange={() => handleAmenityToggle(am)}
                                    className="rounded border-border-light bg-card-bg text-accent-orange focus:ring-1 focus:ring-accent-orange focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer shadow-inner transition-colors"
                                />
                                <span className={`text-xs select-none transition-colors ${selectedAmenities.includes(am) ? 'text-white font-bold' : 'text-text-muted font-medium group-hover:text-white'}`}>{am}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {filteredHotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHotels.map(hotel => (
                        <HotelCard key={hotel.id} hotel={hotel} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 px-4 glass-card border-dashed border-2 border-border-light">
                    <Building2 className="w-16 h-16 text-text-muted/30 mx-auto mb-5" />
                    <h3 className="text-2xl font-black text-white mb-2 tracking-wide">No hotels found</h3>
                    <p className="text-text-muted mb-8 font-medium">Try adjusting your filters to see more options.</p>
                    <button
                        onClick={() => { setMaxPrice(25000); setMinStars(0); setSelectedAmenities([]); }}
                        className="bg-primary-bg/50 border border-border-light font-bold text-white px-8 py-3 rounded-xl hover:bg-white/5 transition-colors shadow-sm"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 md:bottom-8 md:left-auto md:right-8 md:w-80 glass-card p-5 md:rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40 transition-transform border border-border-light/50 backdrop-blur-xl bg-card-bg/90">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-border-light">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg border border-emerald-500/20 shadow-inner"><IndianRupee className="w-4 h-4" /></span>
                        <span className="font-extrabold text-white tracking-wide">Trip Subtotal</span>
                    </div>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-orange-light">₹{derived.totalFare + derived.totalHotelCost}</span>
                </div>

                <div className="space-y-2.5 mb-5 text-sm font-medium">
                    <div className="flex justify-between text-text-muted/80">
                        <span>Transport ({searchParams.passengers} pax)</span>
                        <span className="text-white/90">₹{derived.totalFare}</span>
                    </div>
                    <div className="flex justify-between text-text-muted/80">
                        <span>Hotels ({nights} night{nights > 1 ? 's' : ''})</span>
                        <span className="text-white/90">₹{derived.totalHotelCost}</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/itinerary')}
                    className="w-full bg-gradient-to-r from-accent-orange to-accent-orange-light text-primary-bg font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_25px_rgba(249,115,22,0.5)] hover-lift hover:scale-[1.02]"
                >
                    View Itinerary <Navigation className="w-4 h-4 ml-1" />
                </button>
            </div>

        </div>
    );
}
