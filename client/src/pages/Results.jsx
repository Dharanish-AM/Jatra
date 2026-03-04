import React, { useState, useMemo, useEffect } from 'react';
import { useTrip } from '../context/TripContext';
import FilterPanel from '../components/FilterPanel';
import RouteCard from '../components/RouteCard';
import SkeletonCard from '../components/common/SkeletonCard';
import useFestivalAlert from '../hooks/useFestivalAlert';
import useRouteFilters from '../hooks/useRouteFilters';
import { computeRouteInsights } from '../features/routes/utils/routeInsights';
import RouteMap from '../features/routes/components/RouteMap';
import { AlertTriangle, Filter, Bot, Layers, Star } from 'lucide-react';
import { fetchRoutes } from '../services/travelApi';

export default function Results() {
    const { searchParams, aiPickedRouteId } = useTrip();
    const [routesData, setRoutesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [compareList, setCompareList] = useState([]);
    const [showCompareModal, setShowCompareModal] = useState(false);

    const [filters, setFilters] = useState({
        types: searchParams.type === 'Both' ? ['Bus', 'Train'] : [searchParams.type],
        operators: ['Government', 'Private'],
        times: [],
        maxFare: 5000,
    });

    const [sortBy, setSortBy] = useState('Cheapest');

    const festivalAlert = useFestivalAlert(searchParams.date);
    const filteredAndSorted = useRouteFilters(routesData, searchParams, filters, sortBy);
    const routeInsights = useMemo(() => computeRouteInsights(filteredAndSorted), [filteredAndSorted]);

    useEffect(() => {
        if (!searchParams.from || !searchParams.to) {
            setRoutesData([]);
            return;
        }

        const loadRoutes = async () => {
            setIsLoading(true);
            try {
                const routes = await fetchRoutes({ from: searchParams.from, to: searchParams.to });
                setRoutesData(routes);
            } catch {
                setRoutesData([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadRoutes();
    }, [searchParams.from, searchParams.to]);

    const handleCompareToggle = (route) => {
        if (compareList.find(r => r.id === route.id)) {
            setCompareList(prev => prev.filter(r => r.id !== route.id));
        } else {
            if (compareList.length >= 3) return;
            setCompareList(prev => [...prev, route]);
        }
    };

    if (!searchParams.from || !searchParams.to) {
        return (
            <div className="pt-24 flex justify-center items-center h-[60vh] px-4">
                <div className="premium-panel max-w-md w-full p-8 text-center shadow-[0_24px_50px_rgba(15,23,42,0.12)]">
                    <div className="w-16 h-16 bg-primary-bg/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-border-light">
                        <Filter className="w-8 h-8 text-accent-orange opacity-80" />
                    </div>
                    <h2 className="text-2xl font-black text-text-primary mb-3 tracking-wide">No Route Selected</h2>
                    <p className="text-text-muted font-medium mb-8">Please search for a route from the Home page to see available options.</p>
                    <button onClick={() => window.location.href = '/'} className="w-full bg-gradient-to-r from-accent-orange to-accent-orange-light text-primary-bg font-black py-3.5 rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_25px_rgba(249,115,22,0.5)] transition-all hover-lift">
                        Go to Search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 fade-in">

            {festivalAlert && (
                <div className="mb-8 premium-panel bg-yellow-500/10 border-yellow-500/20 p-5 flex items-start gap-4 text-yellow-600 shadow-[0_0_20px_rgba(234,179,8,0.1)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                    <div className="bg-yellow-500/20 p-2 rounded-lg shrink-0 mt-0.5 shadow-inner">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-extrabold text-lg flex items-center gap-2">
                            {festivalAlert.name} Season
                            <span className="bg-yellow-500 text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">High Demand</span>
                        </h4>
                        <p className="text-sm opacity-90 font-medium mt-1">{festivalAlert.warning}</p>
                    </div>
                </div>
            )}

            <div className="premium-panel p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-text-primary mb-1 tracking-tight">
                        {searchParams.from} to {searchParams.to}
                    </h1>
                    <p className="text-sm text-text-muted font-medium">
                        {new Date(searchParams.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} • {searchParams.passengers} passenger{searchParams.passengers > 1 ? 's' : ''} • {filteredAndSorted.length} results
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={() => window.dispatchEvent(new Event('open-ai-chat'))}
                        aria-label="Open AI assistant"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-teal to-blue-500 text-white font-bold rounded-[var(--radius-btn)] hover-lift shadow-lg shadow-accent-teal/20"
                    >
                        <Bot className="w-4 h-4" /> <span className="hidden sm:inline">Ask AI</span>
                    </button>

                    <button
                        aria-label="Toggle filters"
                        className="md:hidden p-2 bg-card-bg border border-border rounded-md text-text-muted"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <Filter className="w-5 h-5" />
                    </button>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        aria-label="Sort routes"
                        className="flex-1 sm:flex-none bg-card-bg border border-border text-text-primary text-sm rounded-[var(--radius-btn)] px-3 py-2.5 outline-none focus:border-accent-orange"
                    >
                        <option>Cheapest</option>
                        <option>Fastest</option>
                        <option>Earliest</option>
                        <option>Latest</option>
                        <option>Best Value</option>
                    </select>
                </div>
            </div>

            {searchParams.from && searchParams.to && (
                <div className="mb-6">
                    <RouteMap from={searchParams.from} to={searchParams.to} />
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8 items-start relative">
                <div className={`md:w-72 shrink-0 md:block ${isFilterOpen ? 'block' : 'hidden'} w-full z-30`}>
                    <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setIsFilterOpen(false)} />
                </div>

                <div className="flex-1 w-full space-y-4">

                    {compareList.length > 0 && (
                        <div className="sticky top-20 z-40 premium-panel bg-card-bg/90 backdrop-blur-xl border-accent-orange/50 p-4 rounded-2xl flex justify-between items-center shadow-[0_10px_30px_rgba(15,23,42,0.18)] mb-6 animate-in slide-in-from-bottom flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-accent-orange/10 p-2 rounded-lg border border-accent-orange/20 shadow-inner">
                                    <Layers className="w-4 h-4 text-accent-orange" />
                                </div>
                                <span className="font-bold text-text-primary tracking-wide">
                                    <span className="text-accent-orange font-black mr-1">{compareList.length}/3</span>
                                    Routes Selected
                                </span>
                            </div>
                            <button
                                onClick={() => setShowCompareModal(true)}
                                className="bg-gradient-to-r from-accent-orange to-accent-orange-light text-primary-bg px-6 py-2.5 rounded-xl font-black shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_20px_rgba(249,115,22,0.4)] transition-all hover-lift"
                            >
                                Compare Now
                            </button>
                        </div>
                    )}

                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
                    ) : filteredAndSorted.length > 0 ? (
                        filteredAndSorted.map((route, idx) => {
                            const isComparing = compareList.some(r => r.id === route.id);
                            const canCompare = compareList.length < 3 || isComparing;

                            return (
                                <div key={route.id} className="relative group">
                                    <RouteCard
                                        route={route}
                                        isRecommended={sortBy === 'Cheapest' && idx === 0 || route.tags.includes('RECOMMENDED')}
                                        isAiPick={route.id === aiPickedRouteId}
                                        onCompare={() => handleCompareToggle(route)}
                                        isComparing={isComparing}
                                        canCompare={canCompare}
                                        insightBadges={[
                                            ...(route.id === routeInsights.bestValueId ? ['🏆 Best Value'] : []),
                                            ...(route.id === routeInsights.fastestId ? ['⚡ Fastest'] : []),
                                            ...(route.id === routeInsights.cheapestId ? ['💰 Cheapest'] : []),
                                            ...(route.id === routeInsights.bestRatedId ? ['⭐ Best Rated'] : []),
                                        ]}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-24 px-4 glass-card border-dashed border-2 border-border-light">
                            <div className="w-20 h-20 bg-primary-bg/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-border-light">
                                <div className="text-4xl opacity-50 grayscale">📭</div>
                            </div>
                            <h3 className="text-2xl font-black text-text-primary mb-2 tracking-wide">No routes found</h3>
                            <p className="text-text-muted mb-8 font-medium">Try adjusting your transport type or price range.</p>
                            <button
                                onClick={() => setFilters({ types: ['Bus', 'Train'], operators: ['Government', 'Private'], times: [], maxFare: 5000 })}
                                className="bg-primary-bg/50 border border-border-light font-bold text-text-primary px-8 py-3 rounded-xl hover:bg-card-bg transition-colors shadow-sm"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showCompareModal && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-md" role="presentation">
                    <div className="premium-panel w-full max-w-4xl border border-border-light/50 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95" role="dialog" aria-modal="true" aria-label="Compare selected routes">
                        <div className="flex justify-between items-center p-6 border-b border-border-light bg-card-bg/50">
                            <h2 className="text-2xl font-black text-text-primary tracking-wide flex items-center gap-3">
                                <Layers className="w-6 h-6 text-accent-orange" /> Compare Routes
                            </h2>
                            <button aria-label="Close compare modal" onClick={() => setShowCompareModal(false)} className="bg-primary-bg/50 border border-border-light p-2 rounded-lg text-text-muted hover:text-text-primary transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="p-2 overflow-x-auto flex-1 custom-scrollbar">
                            <table className="w-full text-left border-separate border-spacing-0 min-w-[700px]">
                                <thead>
                                    <tr>
                                        <th className="p-4 border-b border-border-light text-[11px] font-black uppercase text-text-muted tracking-widest bg-primary-bg/10 sticky top-0 z-10 w-1/4">Feature</th>
                                        {compareList.map(r => (
                                            <th key={r.id} className="p-4 border-b border-border-light font-bold text-text-primary w-1/4 text-center bg-primary-bg/10 sticky top-0 z-10">
                                                <div className="text-sm font-black truncate">{r.operator}</div>
                                                <div className="text-xs text-accent-orange bg-accent-orange/10 inline-block px-2 py-0.5 rounded border border-accent-orange/20 mt-1">{r.name}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-medium">
                                    {[
                                        { label: 'Type', render: (r) => <span className="px-2.5 py-1 bg-primary-bg rounded-md border border-border-light text-xs font-bold uppercase">{r.type}</span> },
                                        { label: 'Dep - Arr', render: (r) => <span className="font-mono bg-card-bg/50 px-2 py-1 rounded tracking-wide">{r.departure} - {r.arrival}</span> },
                                        { label: 'Duration', render: (r) => <span className="font-bold text-text-muted">{r.duration}</span> },
                                        { label: 'Fare', render: (r) => <span className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-orange-light">₹{r.fare}</span> },
                                        { label: 'Rating', render: (r) => <span className="flex items-center justify-center gap-1.5 text-yellow-500 font-black"><Star className="w-3.5 h-3.5 fill-current" /> {r.rating}</span> },
                                        { label: 'Amenities', render: (r) => <div className="text-xs text-text-muted/80 leading-relaxed whitespace-pre-wrap">{r.amenities.join(' • ')}</div> },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-4 border-b border-border-light/30 text-[11px] text-text-muted font-black tracking-widest uppercase group-hover:text-text-primary transition-colors">{row.label}</td>
                                            {compareList.map(r => (
                                                <td key={r.id} className="p-4 border-b border-border-light/30 text-center text-text-primary">
                                                    {row.render(r)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
