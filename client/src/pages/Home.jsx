import React from 'react';
import SearchForm from '../components/SearchForm';
import { MapPin, ArrowRight, Sparkles, History, X, Trash2 } from 'lucide-react';
import { useTrip } from '../context/TripContext';

const TOMORROW_DATE = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
})();

const popularRoutes = [
    { from: 'Delhi', to: 'Varanasi' },
    { from: 'Mumbai', to: 'Pune' },
    { from: 'Bengaluru', to: 'Chennai' },
    { from: 'Delhi', to: 'Agra' },
    { from: 'Kolkata', to: 'Bhubaneswar' },
    { from: 'Mumbai', to: 'Goa' },
];

export default function Home() {
    const { actions, recentSearches, searchParams } = useTrip();

    const handlePopularClick = (route) => {
        actions.setSearch({
            from: route.from,
            to: route.to,
            date: TOMORROW_DATE,
            passengers: 1,
            type: 'Both',
        });
    };

    return (
        <div className="min-h-screen flex flex-col pt-20 bg-primary-bg relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 inset-x-0 h-full w-full opacity-30 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent-orange/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10s]"></div>
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent-teal/10 rounded-full blur-[100px] mix-blend-screen"></div>
            </div>

            <div className="relative flex-1 flex flex-col py-12 px-4 sm:px-6 lg:px-8 z-10">

                <div className="w-full mx-auto flex-1 flex flex-col justify-center pb-20 mt-10 transition-all duration-1000 opacity-100 translate-y-0">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-orange/30 bg-accent-orange/10 text-accent-orange text-sm font-semibold mb-6 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                            <Sparkles className="w-4 h-4" /> The New Standard in Travel
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight text-text-primary">
                            Journey Across <br className="md:hidden" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange via-accent-orange-light to-accent-teal drop-shadow-[0_0_25px_rgba(249,115,22,0.4)]">
                                India
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto font-medium leading-relaxed">
                            Plan your end-to-end trip with trains, buses, and hotels all in one place, beautifully.
                        </p>
                    </div>

                    <div className="premium-panel p-6 md:p-8 relative z-20 animate-slide-up transform-gpu mx-auto w-full max-w-4xl shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent-orange/25 to-accent-teal/20 rounded-[var(--radius-card)] blur opacity-45 z-[-1]"></div>
                        <SearchForm key={`${searchParams.from}-${searchParams.to}-${searchParams.date}-${searchParams.passengers}-${searchParams.type}`} />
                    </div>

                    <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <p className="text-sm text-text-muted mb-6 uppercase tracking-[0.2em] font-bold">Trending Destinations</p>
                        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                            {popularRoutes.map((route, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handlePopularClick(route)}
                                    className="group flex items-center gap-3 px-6 py-3 rounded-full border border-border-light bg-card-bg/70 backdrop-blur-md hover:bg-card-bg hover:border-accent-orange/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.18)] hover:-translate-y-1"
                                >
                                    <MapPin className="w-4 h-4 text-accent-orange group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-semibold text-text-primary tracking-wide">{route.from}</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary transition-colors" />
                                    <span className="text-sm font-semibold text-text-muted group-hover:text-text-primary transition-colors tracking-wide">{route.to}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {recentSearches.length > 0 && (
                        <div className="mt-10 max-w-4xl mx-auto w-full animate-fade-in" style={{ animationDelay: '0.5s' }}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-text-muted">
                                    <History className="w-4 h-4 text-accent-teal" />
                                    <span className="text-xs font-black uppercase tracking-[0.15em]">Recent Searches</span>
                                </div>
                                <button
                                    onClick={actions.clearRecentSearches}
                                    className="text-xs font-bold text-text-muted hover:text-text-primary border border-border-light rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Clear
                                </button>
                            </div>

                            <div className="space-y-2">
                                {recentSearches.map((item) => (
                                    <div key={item.savedAt} className="flex items-center gap-2 bg-card-bg/60 border border-border-light rounded-xl px-4 py-3">
                                        <button
                                            onClick={() => actions.setSearch(item)}
                                            className="flex-1 text-left"
                                        >
                                            <div className="text-sm font-bold text-text-primary">
                                                {item.from} <span className="text-text-muted">to</span> {item.to}
                                            </div>
                                            <div className="text-xs text-text-muted mt-0.5">
                                                {item.date} • {item.passengers} passenger{item.passengers > 1 ? 's' : ''} • {item.type}
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => actions.removeRecentSearch(item.savedAt)}
                                            aria-label={`Remove recent search ${item.from} to ${item.to}`}
                                            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-primary-bg/50 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-primary-bg/80 backdrop-blur-xl border-t border-border-light py-5 px-4 text-center text-text-muted shrink-0 text-sm md:text-base font-medium tracking-wide flex justify-center gap-6">
                <span><span className="text-accent-orange mr-1">•</span> Government & Private</span>
                <span><span className="text-accent-orange mr-1">•</span> Trains & Buses</span>
                <span><span className="text-accent-orange mr-1">•</span> Hotels Included</span>
            </div>
        </div>
    );
}
