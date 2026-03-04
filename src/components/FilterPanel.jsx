import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

export default function FilterPanel({ filters, setFilters, onClose }) {

    const handleTypeChange = (type) => {
        setFilters(prev => {
            const active = prev.types.includes(type);
            return {
                ...prev,
                types: active ? prev.types.filter(t => t !== type) : [...prev.types, type]
            };
        });
    };

    const handleOperatorChange = (op) => {
        setFilters(prev => {
            const active = prev.operators.includes(op);
            return {
                ...prev,
                operators: active ? prev.operators.filter(o => o !== op) : [...prev.operators, op]
            };
        });
    };

    const handleTimeChange = (timeId) => {
        setFilters(prev => {
            const active = prev.times.includes(timeId);
            return {
                ...prev,
                times: active ? prev.times.filter(t => t !== timeId) : [...prev.times, timeId]
            };
        });
    };

    return (
        <div className="glass-card p-6 sticky top-24 border-border-light/50">
            <div className="flex justify-between items-center mb-6 border-b border-border-light pb-4">
                <h2 className="text-xl font-black tracking-wide text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-accent-orange" />
                    Filters
                </h2>

                {onClose && (
                    <button onClick={onClose} className="md:hidden p-1.5 bg-primary-bg/50 rounded-md text-text-muted hover:text-white transition-colors border border-border-light">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="space-y-8">
                <div>
                    <h3 className="text-xs font-black text-text-muted mb-4 uppercase tracking-widest pl-1">Transport Type</h3>
                    <div className="space-y-3">
                        {['Bus', 'Train'].map(t => (
                            <label key={t} className={`flex items-center gap-3 cursor-pointer group p-3 rounded-xl transition-all duration-300 border ${filters.types.includes(t) ? 'bg-accent-orange/10 border-accent-orange/30 shadow-[inset_0_0_15px_rgba(249,115,22,0.1)]' : 'bg-primary-bg/30 border-transparent hover:bg-primary-bg/60 hover:border-border-light'}`}>
                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${filters.types.includes(t) ? 'bg-accent-orange border-accent-orange text-white' : 'bg-card-bg border-border-light text-transparent'}`}>
                                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={filters.types.includes(t)}
                                    onChange={() => handleTypeChange(t)}
                                    className="sr-only"
                                />
                                <span className={`text-sm font-bold transition-colors ${filters.types.includes(t) ? 'text-white' : 'text-text-muted group-hover:text-white/80'}`}>{t}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-black text-text-muted mb-4 uppercase tracking-widest pl-1">Operator</h3>
                    <div className="space-y-3">
                        {['Government', 'Private'].map(op => (
                            <label key={op} className={`flex items-center gap-3 cursor-pointer group p-3 rounded-xl transition-all duration-300 border ${filters.operators.includes(op) ? 'bg-accent-teal/10 border-accent-teal/30 shadow-[inset_0_0_15px_rgba(13,148,136,0.1)]' : 'bg-primary-bg/30 border-transparent hover:bg-primary-bg/60 hover:border-border-light'}`}>
                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${filters.operators.includes(op) ? 'bg-accent-teal border-accent-teal text-white' : 'bg-card-bg border-border-light text-transparent'}`}>
                                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={filters.operators.includes(op)}
                                    onChange={() => handleOperatorChange(op)}
                                    className="sr-only"
                                />
                                <span className={`text-sm font-bold transition-colors ${filters.operators.includes(op) ? 'text-white' : 'text-text-muted group-hover:text-white/80'}`}>{op}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-black text-text-muted mb-4 uppercase tracking-widest pl-1">Departure Time</h3>
                    <div className="space-y-3">
                        {[
                            { id: 'morning', label: 'Morning (06:00 - 12:00)' },
                            { id: 'afternoon', label: 'Afternoon (12:00 - 18:00)' },
                            { id: 'night', label: 'Night (18:00 - 06:00)' }
                        ].map(time => (
                            <label key={time.id} className={`flex items-center gap-3 cursor-pointer group p-3 rounded-xl transition-all duration-300 border ${filters.times.includes(time.id) ? 'bg-blue-500/10 border-blue-500/30 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]' : 'bg-primary-bg/30 border-transparent hover:bg-primary-bg/60 hover:border-border-light'}`}>
                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${filters.times.includes(time.id) ? 'bg-blue-500 border-blue-500 text-white' : 'bg-card-bg border-border-light text-transparent'}`}>
                                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={filters.times.includes(time.id)}
                                    onChange={() => handleTimeChange(time.id)}
                                    className="sr-only"
                                />
                                <span className={`text-sm font-bold transition-colors ${filters.times.includes(time.id) ? 'text-white' : 'text-text-muted group-hover:text-white/80'}`}>{time.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-xs font-black text-text-muted uppercase tracking-widest">Max Fare</h3>
                        <span className="text-accent-orange font-black text-sm bg-accent-orange/10 px-2 py-0.5 rounded border border-accent-orange/20">₹{filters.maxFare}</span>
                    </div>
                    <div className="px-1">
                        <input
                            type="range"
                            min="0"
                            max="5000"
                            step="100"
                            value={filters.maxFare}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxFare: parseInt(e.target.value) }))}
                            className="w-full accent-accent-orange h-2 bg-primary-bg border border-border-light rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-orange/50 transition-all"
                        />
                        <div className="flex justify-between mt-3 text-[10px] font-bold text-text-muted/60 uppercase tracking-wider">
                            <span>₹0</span>
                            <span>₹5000</span>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setFilters({ types: ['Bus', 'Train'], operators: ['Government', 'Private'], times: [], maxFare: 5000 })}
                className="w-full mt-8 py-3.5 text-sm font-bold text-text-muted bg-primary-bg/50 border border-border-light rounded-xl hover:text-primary-bg hover:bg-white transition-all shadow-sm hover:shadow-md"
            >
                Reset Filters
            </button>
        </div>
    );
}
