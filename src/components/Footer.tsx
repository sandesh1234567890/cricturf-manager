import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 py-12 text-center mt-auto">
            <div className="max-w-7xl mx-auto px-4">
                <p className="mb-2 text-emerald-500 font-bold text-xl">CricTurf Manager</p>
                <div className="flex justify-center gap-6 mb-4">
                    <a href="#" className="hover:text-emerald-400 transition-colors">About Us</a>
                    <a href="#" className="hover:text-emerald-400 transition-colors">Contact</a>
                    <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
                </div>
                <p className="text-sm">
                    © {new Date().getFullYear()} Turf Management Systems. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
