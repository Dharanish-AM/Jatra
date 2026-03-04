import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Map, Menu, X } from 'lucide-react';
import { useTrip } from '../context/TripContext';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { selectedRoutes, selectedHotels } = useTrip();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const itemCount = selectedRoutes.length + selectedHotels.length;

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Routes', path: '/results' },
        { name: 'Hotels', path: '/hotels' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled ? 'glass border-border-light py-3 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'bg-transparent border-transparent py-5'
                }`}
        >
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <Map className="w-8 h-8 text-accent-orange flex-shrink-0 transition-transform duration-300 group-hover:rotate-[-10deg] group-hover:scale-110 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                    <span className="text-2xl font-extrabold tracking-tight text-text-primary group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-orange group-hover:to-accent-orange-light transition-all duration-300">
                        Jatra
                    </span>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `relative font-semibold text-sm tracking-wide transition-all duration-300 group ${isActive ? 'text-accent-orange' : 'text-text-muted hover:text-text-primary'}`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {link.name}
                                    <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-accent-orange transition-all duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 opacity-50'}`}></span>
                                </>
                            )}
                        </NavLink>
                    ))}

                    <NavLink
                        to="/itinerary"
                        className={({ isActive }) =>
                            `relative px-5 py-2.5 rounded-[var(--radius-btn)] font-semibold text-sm tracking-wide transition-all duration-300 hover-lift ${isActive
                                ? 'bg-gradient-to-r from-accent-orange to-accent-orange-light text-primary-bg shadow-[0_0_20px_rgba(249,115,22,0.4)] border-none'
                                : 'bg-card-bg/80 text-text-primary border border-border-light hover:border-accent-orange/50 hover:bg-card-bg shadow-sm'
                            }`
                        }
                    >
                        My Trip
                        {itemCount > 0 && (
                            <span className="absolute -top-2.5 -right-2.5 bg-accent-orange text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-[0_0_10px_rgba(249,115,22,0.6)] border-2 border-primary-bg">
                                {itemCount}
                            </span>
                        )}
                    </NavLink>
                </div>

                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-text-muted hover:text-text-primary p-2 transition-colors duration-200"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden absolute w-full left-0 top-full glass border-t border-border-light transition-all duration-300 origin-top overflow-hidden ${mobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}>
                <div className="px-4 pt-4 pb-6 space-y-2">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={({ isActive }) =>
                                `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActive ? 'bg-accent-orange/15 text-accent-orange border border-accent-orange/20' : 'text-text-muted hover:text-text-primary hover:bg-card-bg/80'
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                    <NavLink
                        to="/itinerary"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                            `block mt-4 px-4 py-3 rounded-lg text-base font-semibold flex justify-between items-center transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-accent-orange to-accent-orange-light text-primary-bg' : 'text-text-primary bg-card-bg/80 hover:bg-card-bg border border-border-light'
                            }`
                        }
                    >
                        My Trip
                        {itemCount > 0 && (
                            <span className="bg-primary-bg text-white text-xs font-bold px-2 py-1 rounded-md border border-accent-orange/30">
                                {itemCount} items
                            </span>
                        )}
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}
