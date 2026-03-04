import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrip } from '../context/TripContext';
import { MapPin, Calendar, Users, Bus, Train, ArrowRightLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const CITIES = [
    'Delhi', 'Varanasi', 'Agra', 'Mumbai', 'Pune',
    'Bengaluru', 'Chennai', 'Kolkata', 'Bhubaneswar', 'Goa'
];

export default function SearchForm() {
    const { searchParams, actions } = useTrip();
    const navigate = useNavigate();

    const [from, setFrom] = useState(searchParams.from || '');
    const [to, setTo] = useState(searchParams.to || '');
    const [date, setDate] = useState(searchParams.date || new Date().toISOString().split('T')[0]);
    const [passengers, setPassengers] = useState(searchParams.passengers || 1);
    const [type, setType] = useState(searchParams.type || 'Both');

    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [showFromSuggestions, setShowFromSuggestions] = useState(false);
    const [showToSuggestions, setShowToSuggestions] = useState(false);

    useEffect(() => {
        setFrom(searchParams.from);
        setTo(searchParams.to);
        setDate(searchParams.date || new Date().toISOString().split('T')[0]);
        setPassengers(searchParams.passengers);
        setType(searchParams.type);
    }, [searchParams]);

    const handleFromChange = (e) => {
        const val = e.target.value;
        setFrom(val);
        if (val.length > 0) {
            setFromSuggestions(CITIES.filter(c => c.toLowerCase().includes(val.toLowerCase())));
            setShowFromSuggestions(true);
        } else {
            setShowFromSuggestions(false);
        }
    };

    const handleToChange = (e) => {
        const val = e.target.value;
        setTo(val);
        if (val.length > 0) {
            setToSuggestions(CITIES.filter(c => c.toLowerCase().includes(val.toLowerCase()) && c !== from));
            setShowToSuggestions(true);
        } else {
            setShowToSuggestions(false);
        }
    };

    const handleSwap = () => {
        const temp = from;
        setFrom(to);
        setTo(temp);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!from || !to) {
            toast.error("Please enter both Origin and Destination");
            return;
        }
        if (from === to) {
            toast.error("Origin and Destination cannot be the same");
            return;
        }
        if (!date) {
            toast.error("Please select a date");
            return;
        }

        actions.setSearch({ from, to, date, passengers, type });
        navigate('/results');
    };

    const transportTypes = [
        { id: 'Bus', icon: <Bus className="w-5 h-5" />, label: 'Bus' },
        { id: 'Train', icon: <Train className="w-5 h-5" />, label: 'Train' },
        { id: 'Both', icon: <div className="flex -space-x-1"><Bus className="w-4 h-4" /><Train className="w-4 h-4 ml-1" /></div>, label: 'Both' }
    ];

    return (
        <form onSubmit={handleSearch} className="flex flex-col gap-5 relative z-10 w-full">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-border-light pb-5">
                <div className="flex bg-primary-bg/50 p-1.5 rounded-xl border border-white/5 shadow-inner w-full md:w-auto overflow-x-auto">
                    {transportTypes.map(t => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setType(t.id)}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${type === t.id
                                ? 'bg-gradient-to-r from-accent-orange to-accent-orange-light text-primary-bg shadow-[0_4px_15px_rgba(249,115,22,0.3)]'
                                : 'text-text-muted hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {t.icon} <span>{t.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-accent-teal/80" />
                        </div>
                        <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-primary-bg border border-border-light text-text-primary rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all shadow-inner font-medium text-sm"
                        />
                    </div>

                    <div className="relative w-36 shrink-0">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Users className="h-5 w-5 text-accent-teal/80" />
                        </div>
                        <input
                            type="number"
                            min="1"
                            max="9"
                            value={passengers}
                            onChange={(e) => setPassengers(parseInt(e.target.value))}
                            className="w-full bg-primary-bg border border-border-light text-text-primary rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-accent-teal focus:ring-1 focus:ring-accent-teal transition-all shadow-inner font-medium text-sm text-center"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 relative pt-2 pb-2">
                <div className="w-full flex-1 relative group">
                    <label className="block text-[11px] text-text-muted mb-1.5 font-bold tracking-widest pl-2">FROM</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="h-6 w-6 text-accent-orange group-focus-within:scale-110 transition-transform duration-300" />
                        </div>
                        <input
                            type="text"
                            placeholder="Leaving from"
                            value={from}
                            onChange={handleFromChange}
                            onFocus={() => from && setFromSuggestions(CITIES.filter(c => c.toLowerCase().includes(from.toLowerCase())))}
                            onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                            className="w-full bg-primary-bg border-2 border-border-light text-text-primary rounded-[14px] pl-12 pr-4 py-4 md:py-5 text-lg font-bold focus:outline-none focus:border-accent-orange focus:bg-primary-bg shadow-inner transition-all placeholder:font-medium placeholder:text-text-muted"
                        />
                        {showFromSuggestions && fromSuggestions.length > 0 && (
                            <ul className="absolute z-50 mt-2 w-full glass-card border-border-light rounded-xl overflow-hidden py-2 animate-fade-in shadow-2xl">
                                {fromSuggestions.map((city) => (
                                    <li
                                        key={city}
                                        onClick={() => { setFrom(city); setShowFromSuggestions(false); }}
                                        className="px-5 py-3 hover:bg-accent-orange/20 cursor-pointer text-white font-medium transition-colors border-l-2 border-transparent hover:border-accent-orange"
                                    >
                                        {city}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="absolute left-[50%] top-[65%] md:static md:top-auto md:left-auto md:mt-6 -translate-x-[50%] md:translate-x-0 -translate-y-[50%] md:translate-y-0 z-20">
                    <button
                        type="button"
                        onClick={handleSwap}
                        className="p-3 bg-card-bg text-accent-orange hover:bg-accent-orange hover:text-white rounded-full transition-all border border-border flex items-center justify-center hover-lift shadow-[0_0_20px_rgba(0,0,0,0.5)] group"
                    >
                        <ArrowRightLeft className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                </div>

                <div className="w-full flex-1 relative group mt-4 md:mt-0">
                    <label className="block text-[11px] text-text-muted mb-1.5 font-bold tracking-widest pl-2">TO</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MapPin className="h-6 w-6 text-accent-teal group-focus-within:scale-110 transition-transform duration-300" />
                        </div>
                        <input
                            type="text"
                            placeholder="Going to"
                            value={to}
                            onChange={handleToChange}
                            onFocus={() => to && setToSuggestions(CITIES.filter(c => c.toLowerCase().includes(to.toLowerCase()) && c !== from))}
                            onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                            className="w-full bg-primary-bg border-2 border-border-light text-text-primary rounded-[14px] pl-12 pr-4 py-4 md:py-5 text-lg font-bold focus:outline-none focus:border-accent-teal focus:bg-primary-bg shadow-inner transition-all placeholder:font-medium placeholder:text-text-muted"
                        />
                        {showToSuggestions && toSuggestions.length > 0 && (
                            <ul className="absolute z-50 mt-2 w-full glass-card border-border-light rounded-xl overflow-hidden py-2 animate-fade-in shadow-2xl">
                                {toSuggestions.map((city) => (
                                    <li
                                        key={city}
                                        onClick={() => { setTo(city); setShowToSuggestions(false); }}
                                        className="px-5 py-3 hover:bg-accent-teal/20 cursor-pointer text-white font-medium transition-colors border-l-2 border-transparent hover:border-accent-teal"
                                    >
                                        {city}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full md:w-auto mt-6 md:mt-6 font-extrabold bg-gradient-to-r from-accent-orange to-accent-orange-light text-primary-bg md:px-10 py-4 md:py-5 rounded-[14px] text-lg h-full hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all hover-lift"
                >
                    Search Routes
                </button>
            </div>
        </form>
    );
}
