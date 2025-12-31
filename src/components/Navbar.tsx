import React from 'react';
import { Trophy, Menu, X } from 'lucide-react';
import type { View } from '../types';

interface NavbarProps {
    currentView: View;
    onNavigate: (view: View) => void;
    isAdminLoggedIn?: boolean;
    onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, isAdminLoggedIn, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const navItems = [
        { label: 'Home', view: 'home' as View },
        { label: 'Book Slot', view: 'booking' as View },
        { label: isAdminLoggedIn ? 'Dashboard' : 'Admin', view: 'admin' as View },
    ];

    return (
        <nav className="bg-emerald-900 text-white sticky top-0 z-40 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => onNavigate('home')}
                    >
                        <Trophy className="text-yellow-400 w-6 h-6" />
                        <span className="font-bold text-xl tracking-wide">
                            CricTurf<span className="text-emerald-400">Manager</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => (
                            <button
                                key={item.view}
                                onClick={() => onNavigate(item.view)}
                                className={`px-4 py-2 rounded-md transition-colors ${currentView === item.view
                                    ? 'bg-emerald-800 text-white'
                                    : 'hover:bg-emerald-800/50 text-emerald-100'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                        {isAdminLoggedIn && onLogout && (
                            <button
                                onClick={onLogout}
                                className="ml-2 px-4 py-2 rounded-md bg-red-600/20 text-red-100 hover:bg-red-600 hover:text-white transition-all text-sm font-bold border border-red-500/30"
                            >
                                Logout
                            </button>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-emerald-100 hover:text-white"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-emerald-800 px-4 pt-2 pb-4 space-y-2 fade-in">
                    {navItems.map((item) => (
                        <button
                            key={item.view}
                            onClick={() => {
                                onNavigate(item.view);
                                setIsMenuOpen(false);
                            }}
                            className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${currentView === item.view
                                ? 'bg-emerald-700 text-white font-semibold'
                                : 'hover:bg-emerald-700/50 text-emerald-100'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                    {isAdminLoggedIn && onLogout && (
                        <button
                            onClick={() => {
                                onLogout();
                                setIsMenuOpen(false);
                            }}
                            className="block w-full text-left px-3 py-2 rounded-md bg-red-600/20 text-red-100 font-bold"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
