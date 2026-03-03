import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useTrip } from '../context/TripContext';

const popularRoutes = [
    { from: 'Delhi', to: 'Varanasi' },
    { from: 'Mumbai', to: 'Pune' },
    { from: 'Bengaluru', to: 'Chennai' },
    { from: 'Delhi', to: 'Agra' },
    { from: 'Kolkata', to: 'Bhubaneswar' },
    { from: 'Mumbai', to: 'Goa' },
];

export default function Home() {
    const navigate = useNavigate();
    const { actions } = useTrip();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handlePopularClick = (route) => {
        actions.setSearch({
            from: route.from,
            to: route.to,
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
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

                <div className={`max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center pb-20 mt-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-orange/30 bg-accent-orange/10 text-accent-orange text-sm font-semibold mb-6 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                            <Sparkles className="w-4 h-4" /> The New Standard in Travel
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight text-white drop-shadow-2xl">
                            Journey Across <br className="md:hidden" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange via-accent-orange-light to-accent-teal drop-shadow-[0_0_25px_rgba(249,115,22,0.4)]">
                                India
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto font-medium leading-relaxed">
                            Plan your end-to-end trip with trains, buses, and hotels all in one place, beautifully.
                        </p>
                    </div>

                    <div className="glass-card p-6 md:p-8 relative z-20 animate-slide-up transform-gpu mx-auto w-full max-w-4xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent-orange/30 to-accent-teal/30 rounded-[var(--radius-card)] blur opacity-50 z-[-1]"></div>
                        <SearchForm />
                    </div>

                    <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <p className="text-sm text-text-muted mb-6 uppercase tracking-[0.2em] font-bold">Trending Destinations</p>
                        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                            {popularRoutes.map((route, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handlePopularClick(route)}
                                    className="group flex items-center gap-3 px-6 py-3 rounded-full border border-border-light bg-card-bg/40 backdrop-blur-md hover:bg-white/5 hover:border-accent-orange/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:-translate-y-1"
                                >
                                    <MapPin className="w-4 h-4 text-accent-orange group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-semibold text-white tracking-wide">{route.from}</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-white transition-colors" />
                                    <span className="text-sm font-semibold text-text-muted group-hover:text-white transition-colors tracking-wide">{route.to}</span>
                                </button>
                            ))}
                        </div>
                    </div>
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
