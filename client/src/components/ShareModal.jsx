import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { X, Copy, Check, Download, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTrip } from '../context/TripContext';
import { encodeItinerary } from '../utils/itineraryEncoder';

export default function ShareModal({ onClose }) {
    const { searchParams, selectedRoutes, selectedHotels, nights, derived } = useTrip();
    const [copied, setCopied] = useState(false);

    const slimRoutes = selectedRoutes.map(r => ({
        id: r.id, from: r.from, to: r.to, fare: r.fare,
        name: r.name, type: r.type, operator: r.operator,
        departure: r.departure, arrival: r.arrival, duration: r.duration
    }));
    const slimHotels = selectedHotels.map(h => ({
        id: h.id, city: h.city, name: h.name,
        stars: h.stars, pricePerNight: h.pricePerNight
    }));
    const slimData = {
        sp: { from: searchParams.from, to: searchParams.to, date: searchParams.date, passengers: searchParams.passengers, type: searchParams.type },
        r: slimRoutes,
        h: slimHotels,
        n: nights,
        t: derived.grandTotal
    };
    const encodedData = encodeItinerary(slimData);
    const shareUrl = `${window.location.origin}/trip?data=${encodedData}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Link copied! 📋');
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOnWhatsApp = () => {
        const text = `Check out my trip plan on Jatra!\nFrom: ${searchParams.from} to ${searchParams.to}\nTotal Cost: ₹${derived.grandTotal}\n\nView itinerary here: ${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const shareNatively = async () => {
        if (!navigator.share) {
            toast.error('Native sharing is not supported in this browser.');
            return;
        }

        try {
            await navigator.share({
                title: `Jatra Trip: ${searchParams.from} to ${searchParams.to}`,
                text: `Trip estimate: ₹${derived.grandTotal}`,
                url: shareUrl,
            });
        } catch (error) {
            if (error?.name !== 'AbortError') {
                toast.error('Unable to open native share dialog.');
            }
        }
    };

    const downloadText = () => {
        let content = `Jatra Trip Itinerary: ${searchParams.from} to ${searchParams.to}\n`;
        content += `=====================================\n\n`;

        selectedRoutes.forEach((route, idx) => {
            content += `Leg ${idx + 1}: ${route.from} -> ${route.to}\n`;
            content += `Transport: ${route.operator} ${route.name} (${route.type})\n`;
            content += `Time: ${route.departure} - ${route.arrival} (${route.duration})\n`;
            content += `Cost: ₹${route.fare} x ${searchParams.passengers} pax\n\n`;
        });

        if (selectedHotels.length > 0) {
            content += `Hotels:\n`;
            selectedHotels.forEach(hotel => {
                content += `- ${hotel.name} in ${hotel.city} (${hotel.stars}★)\n`;
                content += `  ₹${hotel.pricePerNight}/night x ${nights} nights\n\n`;
            });
        }

        content += `=====================================\n`;
        content += `Estimated Total: ₹${derived.grandTotal}\n`;
        content += `Link: ${shareUrl}\n`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Jatra_Itinerary_${searchParams.from}_${searchParams.to}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in" role="presentation">
            <div className="glass-card w-full max-w-2xl border border-border-light/50 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden" role="dialog" aria-modal="true" aria-label="Share your itinerary">

                <div className="flex justify-between items-center p-6 border-b border-border-light bg-card-bg/80 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-transparent to-accent-orange/10 pointer-events-none"></div>
                    <h2 className="text-2xl font-black text-white relative z-10 tracking-wide">Your trip is ready to share! 🎉</h2>
                    <button aria-label="Close share modal" onClick={onClose} className="text-text-muted hover:text-white bg-primary-bg/50 border border-border-light p-2 rounded-xl relative z-10 transition-colors shadow-sm">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto flex-1 flex flex-col md:flex-row gap-8 custom-scrollbar">

                    <div className="flex flex-col items-center md:w-1/3">
                        <div className="bg-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(255,255,255,0.1)] mb-4 hover:scale-105 transition-transform duration-300">
                            <QRCode
                                value={shareUrl}
                                size={180}
                                fgColor="#09090b"
                                bgColor="#ffffff"
                                level="L"
                                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                            />
                        </div>
                        <p className="text-[11px] text-text-muted font-black tracking-widest uppercase mb-6 text-center">Scan to open on mobile</p>

                        <div className="w-full bg-primary-bg/50 border border-border-light rounded-2xl p-5 flex flex-col justify-center relative overflow-hidden shadow-inner">
                            <div className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-3 border-b border-border-light/50 pb-2">Trip Preview</div>
                            <div className="text-white font-extrabold truncate text-lg tracking-wide">{searchParams.from} ➔ {searchParams.to}</div>
                            <div className="text-xs font-bold text-text-muted mt-1.5">{selectedRoutes.length} leg{selectedRoutes.length !== 1 ? 's' : ''}, {selectedHotels.length} hotel{selectedHotels.length !== 1 ? 's' : ''}</div>
                            <div className="mt-4 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-orange-light">₹{derived.grandTotal}</div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-6">

                        <div>
                            <label className="text-xs font-black tracking-widest uppercase text-text-muted mb-3 block">Share Link</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={shareUrl}
                                    className="flex-1 bg-card-bg/50 border border-border-light text-white font-medium text-sm rounded-xl px-4 py-3.5 w-full outline-none focus:border-accent-orange transition-colors shadow-inner"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    aria-label="Copy share link"
                                    className={`p-3.5 rounded-xl font-bold flex shrink-0 items-center justify-center transition-all shadow-md ${copied ? 'bg-emerald-500 text-white' : 'bg-primary-bg/50 border border-border-light text-text-muted hover:border-accent-orange hover:text-accent-orange'
                                        }`}
                                >
                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="w-full h-px bg-border-light"></div>

                        <div className="space-y-4">
                            <button
                                onClick={shareNatively}
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(59,130,246,0.3)]"
                            >
                                <Share2 className="w-5 h-5" /> Share via Device
                            </button>

                            <button
                                onClick={shareOnWhatsApp}
                                className="w-full bg-gradient-to-r from-[#25D366] to-[#1ebd5a] hover:opacity-90 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(37,211,102,0.3)] hover:shadow-[0_4px_25px_rgba(37,211,102,0.5)] hover-lift"
                            >
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766 0 1.05.275 2.072.798 2.973l-1.012 3.693 3.778-.991c.87.491 1.861.751 2.871.751h.001c3.18 0 5.767-2.586 5.767-5.766s-2.587-5.766-5.768-5.766m3.176 8.24c-.174.493-.895.918-1.353.96-.34.032-.793.12-2.277-.497-1.789-.742-2.92-2.56-3.007-2.678-.087-.116-.717-.954-.717-1.819s.45-1.288.618-1.463c.168-.175.362-.218.483-.218s.241 0 .341.004c.105.006.248-.039.388.297.145.348.496 1.21.54 1.298.043.087.072.188.014.305-.057.116-.087.188-.174.29-.086.101-.182.217-.255.298-.083.091-.17.186-.062.373.109.186.485.798.1037 1.296.551.498.913.784 1.107.876.195.093.308.077.423-.054.116-.131.498-.58.633-.78.135-.2.27-.166.449-.1.179.066 1.137.535 1.331.631.194.097.323.146.37.227.048.082.048.473-.126.966z M12 2C6.477 2 2 6.477 2 12c0 1.77.464 3.443 1.291 4.904L2 22l5.244-1.229C8.63 21.536 10.273 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" /></svg>
                                Share on WhatsApp
                            </button>

                            <button
                                onClick={downloadText}
                                className="w-full bg-primary-bg/50 border border-border-light text-white hover:text-accent-orange font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:border-accent-orange/50 hover-lift group shadow-sm"
                            >
                                <Download className="w-5 h-5 text-text-muted group-hover:text-accent-orange transition-colors" /> Download as Text
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
