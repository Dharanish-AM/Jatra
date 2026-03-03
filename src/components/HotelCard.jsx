import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, CheckSquare, Wifi, Airplay, Coffee, Car } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import toast from 'react-hot-toast';

export default function HotelCard({ hotel }) {
    const { actions } = useTrip();
    const navigate = useNavigate();

    const handleSelect = () => {
        actions.addHotel(hotel);
        toast.success("Hotel selected 🏨");
        navigate('/itinerary');
    };

    const getAmenityIcon = (name) => {
        const n = name.toLowerCase();
        if (n.includes('wifi')) return <Wifi className="w-3.5 h-3.5" />;
        if (n.includes('ac')) return <Airplay className="w-3.5 h-3.5" />;
        if (n.includes('breakfast') || n.includes('meal')) return <Coffee className="w-3.5 h-3.5" />;
        if (n.includes('parking')) return <Car className="w-3.5 h-3.5" />;
        return <CheckSquare className="w-3.5 h-3.5" />;
    };

    const getTagColor = (tag) => {
        switch (tag) {
            case 'BUDGET': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
            case 'RECOMMENDED': return 'bg-accent-orange/20 text-accent-orange border border-accent-orange/30';
            case 'LUXURY': return 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
            default: return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
        }
    };

    const gradientColors = [
        'from-[#1e3a8a] to-[#0f172a]',
        'from-[#064e3b] to-[#0f172a]',
        'from-[#7c2d12] to-[#0f172a]',
        'from-[#4c1d95] to-[#0f172a]',
    ];
    const colorIndex = hotel.name.length % gradientColors.length;

    return (
        <div className="glass-card overflow-hidden flex flex-col hover-lift h-full group border-border-light relative">
            <div className={`h-52 bg-gradient-to-br ${gradientColors[colorIndex]} relative flex items-center justify-center overflow-hidden`}>
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]"></div>

                {/* Image zoom effect container */}
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                    <span className="text-7xl font-black text-white/10 drop-shadow-2xl mix-blend-overlay">{hotel.name.charAt(0)}</span>
                </div>

                {hotel.tag && (
                    <span className={`absolute top-4 right-4 text-[10px] font-black tracking-widest px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-md ${getTagColor(hotel.tag)} text-white uppercase`}>
                        {hotel.tag}
                    </span>
                )}

                {/* Inner shadow at bottom of image area */}
                <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-card-bg to-transparent"></div>
            </div>

            <div className="p-6 flex flex-col flex-1 relative z-10 bg-card-bg/50 backdrop-blur-md">
                <div className="flex justify-between items-start mb-3 gap-3">
                    <h3 className="font-extrabold text-xl text-white leading-tight tracking-wide group-hover:text-accent-orange transition-colors">{hotel.name}</h3>
                    <div className="flex bg-yellow-500/10 px-2.5 py-1 rounded-md text-yellow-500 text-sm font-black items-center gap-1.5 shrink-0 border border-yellow-500/20 shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-current" /> {hotel.rating}
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-yellow-500 mb-3 drop-shadow-sm">
                    {Array(hotel.stars).fill(0).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <span className="text-text-muted text-xs font-bold ml-1.5 bg-primary-bg/50 px-2 py-0.5 rounded-md border border-border-light">{hotel.reviewCount} reviews</span>
                </div>

                <div className="flex items-center gap-2 text-text-muted text-sm mb-5 font-medium bg-primary-bg/20 p-2 rounded-lg border border-border-light">
                    <MapPin className="w-4 h-4 shrink-0 text-accent-teal" />
                    <span className="truncate">{hotel.distanceFromStation} from station</span>
                </div>

                <p className="text-sm text-text-muted/90 mb-6 line-clamp-2 flex-1 leading-relaxed font-medium">
                    {hotel.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {hotel.amenities.slice(0, 3).map(am => (
                        <span key={am} className="flex items-center gap-1.5 bg-primary-bg/80 px-2.5 py-1.5 rounded-lg text-xs font-medium text-text-muted border border-border-light shadow-inner">
                            {getAmenityIcon(am)} {am}
                        </span>
                    ))}
                    {hotel.amenities.length > 3 && (
                        <span className="flex items-center text-xs font-bold text-text-muted px-2 bg-white/5 rounded-lg border border-transparent">
                            +{hotel.amenities.length - 3} more
                        </span>
                    )}
                </div>

                <div className="flex items-end justify-between mt-auto pt-5 border-t border-border-light">
                    <div>
                        <p className="text-[10px] text-text-muted font-black tracking-widest uppercase mb-1">Price</p>
                        <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                            ₹{hotel.pricePerNight}<span className="text-sm font-bold text-text-muted/60 tracking-normal ml-1">/ night</span>
                        </p>
                    </div>

                    <button
                        onClick={handleSelect}
                        className="bg-card-bg border border-accent-orange/50 text-accent-orange hover:bg-gradient-to-r hover:from-accent-orange hover:to-accent-orange-light hover:text-primary-bg px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:border-transparent"
                    >
                        Select
                    </button>
                </div>
            </div>
        </div>
    );
}
