import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTrip } from '../context/TripContext';
import ItineraryPanel from '../components/ItineraryPanel';
import ShareModal from '../components/ShareModal';
import { Share2 } from 'lucide-react';

export default function Itinerary() {
    const { searchParams, derived, actions, nights, selectedRoutes, selectedHotels } = useTrip();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const chartData = [
        { name: 'Transport', value: derived.totalFare, color: '#f97316' },
        { name: 'Hotels', value: derived.totalHotelCost, color: '#14b8a6' },
    ].filter(d => d.value > 0);

    const isTripEmpty = selectedRoutes.length === 0 && selectedHotels.length === 0;

    return (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 fade-in flex flex-col lg:flex-row gap-8 lg:items-start">

            <ItineraryPanel />

            <div className="lg:w-96 shrink-0 lg:sticky lg:top-24 mt-8 lg:mt-0">
                <div className="glass-card p-6 border-border-light relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-accent-orange/10 blur-[60px] rounded-full pointer-events-none"></div>

                    <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2 tracking-wide">
                        Trip Summary
                    </h2>

                    <div className="space-y-4 mb-6 relative z-10">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-text-muted">Transport ({searchParams.passengers} pax)</span>
                            <span className="text-white">₹{derived.totalFare}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm font-bold">
                            <div className="flex items-center gap-2">
                                <span className="text-text-muted">Hotels</span>
                                <select
                                    value={nights}
                                    onChange={(e) => actions.setNights(Number(e.target.value))}
                                    className="bg-primary-bg/80 border border-border-light text-text-muted hover:text-white text-xs rounded-md px-2 py-1 outline-none focus:border-accent-orange shadow-inner transition-colors cursor-pointer"
                                >
                                    {Array.from({ length: 14 }, (_, i) => i + 1).map(n => (
                                        <option key={n} value={n}>{n} night{n > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>
                            <span className="text-white">₹{derived.totalHotelCost}</span>
                        </div>

                        <div className="w-full h-px bg-border-light/50 my-4"></div>

                        <div className="flex justify-between items-end">
                            <span className="text-text-muted font-black uppercase tracking-widest text-[10px]">Estimated Total</span>
                            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-orange-light drop-shadow-sm tracking-tight">
                                ₹{derived.grandTotal}
                            </span>
                        </div>
                    </div>

                    {!isTripEmpty && chartData.length > 0 && (
                        <div className="h-48 mb-6 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => `₹${value}`}
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col mt-[-20px]">
                                <span className="text-xs text-text-muted font-bold">Total</span>
                                <span className="text-sm font-extrabold text-white">₹{derived.grandTotal}</span>
                            </div>
                        </div>
                    )}

                    <button
                        disabled={isTripEmpty}
                        onClick={() => setIsShareModalOpen(true)}
                        className="w-full bg-gradient-to-r from-accent-orange to-accent-orange-light text-primary-bg font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:shadow-[0_4px_25px_rgba(249,115,22,0.5)] hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none hover:scale-[1.02]"
                    >
                        <Share2 className="w-5 h-5" /> Save & Share Trip
                    </button>
                </div>
            </div>

            {isShareModalOpen && (
                <ShareModal onClose={() => setIsShareModalOpen(false)} />
            )}
        </div>
    );
}
