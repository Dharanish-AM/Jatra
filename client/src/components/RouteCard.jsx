import React, { memo } from 'react';
import { Bus, Train, Clock, Star, Wifi, Zap, Coffee, ChevronRight, Check } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import toast from 'react-hot-toast';

function RouteCard({ route, isRecommended, isAiPick, onCompare, isComparing, canCompare, insightBadges = [] }) {
    const { actions, selectedRoutes } = useTrip();

    const isAdded = selectedRoutes.some(r => r.id === route.id);

    const handleAdd = () => {
        if (isAdded) {
            actions.removeRoute(route.id);
            toast.success("Route removed from trip 🗑️");
        } else {
            actions.addRoute(route);
            toast.success("Route added to trip ✅");
        }
    };

    const getAmenityIcon = (name) => {
        const n = name.toLowerCase();
        if (n.includes('wifi')) return <Wifi className="w-4 h-4" />;
        if (n.includes('charging') || n.includes('ac')) return <Zap className="w-4 h-4" />;
        if (n.includes('meal') || n.includes('breakfast') || n.includes('water') || n.includes('pantry') || n.includes('snack')) return <Coffee className="w-4 h-4" />;
        return <Check className="w-4 h-4" />;
    };

    return (
        <div id={`route-${route.id}`} className={`glass rounded-[var(--radius-card)] p-4 sm:p-5 hover-lift relative overflow-hidden transition-all duration-300 ${isAiPick ? 'border-accent-orange/80 shadow-[0_0_25px_rgba(249,115,22,0.4)] ring-1 ring-accent-orange' : isRecommended ? 'border-accent-orange/50 shadow-[0_0_15px_rgba(249,115,22,0.15)]' : ''}`}>
            {isAiPick && (
                <div className="absolute top-0 left-0 bg-accent-orange text-white text-xs font-bold px-4 py-2 rounded-br-lg shadow-lg z-20 flex items-center gap-1 animate-pulse">
                    AI Pick 🤖
                </div>
            )}
            {isRecommended && !isAiPick && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-accent-orange to-amber-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg shadow-md z-10 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> RECOMMENDED
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <div className={`p-1.5 rounded-lg ${route.type === 'train' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                            {route.type === 'train' ? <Train className="w-5 h-5" /> : <Bus className="w-5 h-5" />}
                        </div>
                        <h3 className="font-bold text-lg text-text-primary">{route.operator}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${route.isGovernment ? 'bg-gov-badge/20 text-gov-badge border border-gov-badge/30' : 'bg-private-badge/20 text-blue-400 border border-private-badge/30'}`}>
                            {route.isGovernment ? 'GOVT' : 'PRIVATE'}
                        </span>
                    </div>
                    <p className="text-text-muted text-sm mb-4 font-medium">{route.name} • {route.classes.join(', ')}</p>

                    <div className="flex items-center gap-4 text-text-primary">
                        <div className="text-center">
                            <p className="text-2xl font-bold">{route.departure}</p>
                            <p className="text-xs text-text-muted font-medium">{route.from}</p>
                        </div>

                        <div className="flex-1 flex flex-col items-center min-w-[80px]">
                            <div className="text-xs text-text-muted font-medium mb-1"><Clock className="w-3 h-3 inline mr-1" />{route.duration}</div>
                            <div className="w-full h-px bg-border relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-border"></div>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-2xl font-bold">{route.arrival}</p>
                            <p className="text-xs text-text-muted font-medium">{route.to}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row sm:flex-col justify-between items-end sm:border-l sm:border-border sm:pl-4 pt-4 sm:pt-0 border-t sm:border-t-0 mt-4 sm:mt-0">
                    <div className="text-left sm:text-right">
                        <p className="text-3xl font-extrabold text-accent-orange">₹{route.fare}</p>
                        <p className="text-xs text-text-muted font-medium mt-1">{route.availableSeats} seats left</p>

                        <div className="flex items-center sm:justify-end gap-1 mt-2 text-yellow-400">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="text-sm font-bold text-text-primary">{route.rating}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleAdd}
                        aria-label={isAdded ? `Remove ${route.name} from trip` : `Add ${route.name} to trip`}
                        className={`px-5 py-2.5 rounded-[var(--radius-btn)] font-semibold flex items-center gap-1 transition-all ${isAdded
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-accent-orange text-white hover:bg-[#ea580c] shadow-[0_0_10px_rgba(249,115,22,0.2)]'
                            }`}
                    >
                        {isAdded ? 'Added' : 'Add to Trip'}
                        {!isAdded && <ChevronRight className="w-4 h-4 ml-1" />}
                    </button>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-text-muted">
                {insightBadges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {insightBadges.map((badge) => (
                            <span key={badge} className="px-2 py-1 rounded-full bg-primary-bg border border-border-light text-[10px] font-black tracking-wide text-text-primary">
                                {badge}
                            </span>
                        ))}
                    </div>
                )}
                <div className="flex flex-wrap gap-2">
                    {route.amenities.map(am => (
                        <span key={am} className="flex items-center gap-1 bg-primary-bg px-2 py-1 rounded-md border border-border">
                            {getAmenityIcon(am)} {am}
                        </span>
                    ))}
                </div>
                {onCompare && (
                    <button
                        onClick={onCompare}
                        disabled={!canCompare}
                        aria-label={isComparing ? `Remove ${route.name} from compare` : `Compare ${route.name}`}
                        className={`flex justify-center items-center gap-1.5 px-4 py-2 w-full sm:w-auto rounded-full border shadow-sm transition-all duration-300 ${isComparing
                            ? 'bg-accent-orange border-accent-orange text-white'
                            : 'bg-primary-bg/80 border-border-light text-text-muted hover:border-accent-orange/50 hover:text-white'
                            } ${!canCompare && !isComparing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className={`flex items-center justify-center w-4 h-4 rounded-full transition-all ${isComparing ? 'bg-white text-accent-orange' : 'bg-transparent border border-text-muted/50 text-current'}`}>
                            {isComparing ? <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>}
                        </div>
                        <span className="text-xs font-bold tracking-wide">{isComparing ? 'Added to Compare' : 'Compare'}</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default memo(RouteCard);
