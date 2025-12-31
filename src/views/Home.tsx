import React from 'react';
import { Clock, MapPin, BadgeIndianRupee } from 'lucide-react';
import Button from '../components/Button';

interface HomeProps {
    onStartBooking: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartBooking }) => {
    const features = [
        {
            icon: <Clock className="w-8 h-8 text-emerald-600" />,
            title: 'Real-time Availability',
            text: 'Check and book available slots instantly from anywhere.'
        },
        {
            icon: <MapPin className="w-8 h-8 text-emerald-600" />,
            title: 'Premium Venues',
            text: 'Top-tier turf facilities located at the heart of the city.'
        },
        {
            icon: <BadgeIndianRupee className="w-8 h-8 text-emerald-600" />,
            title: 'Best Pricing',
            text: 'Transparent and affordable hourly rates for all teams.'
        }
    ];

    return (
        <div className="fade-in">
            {/* Hero Section */}
            <section className="relative bg-emerald-900 text-white py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <img
                        src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=2000"
                        className="w-full h-full object-cover"
                        alt="Cricket Stadium"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/60 to-emerald-900" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
                        Play Like A <span className="text-yellow-400">Pro</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-emerald-100 mb-10 max-w-2xl mx-auto font-light">
                        Premium turf booking system with instant confirmation. Experience the best cricket pitches in the city.
                    </p>
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={onStartBooking}
                        className="text-emerald-900"
                    >
                        Book Your Slot Now
                    </Button>
                </div>
            </section>

            {/* Features Grid */}
            <section className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
                    <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full" />
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                        >
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.text}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
