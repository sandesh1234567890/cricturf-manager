import React from 'react';
import { Calendar, CheckCircle2, MapPin, Clock } from 'lucide-react';
import { TURFS, SLOTS, PERIODS } from '../constants';

interface BookingProps {
    selectedTurf: string;
    selectedDate: string;
    onSetTurf: (id: string) => void;
    onSetDate: (date: string) => void;
    onInitBooking: (slotId: string) => void;
    checkBooked: (slotId: string) => boolean;
}

const Booking: React.FC<BookingProps> = ({
    selectedTurf,
    selectedDate,
    onSetTurf,
    onSetDate,
    onInitBooking,
    checkBooked
}) => {
    const currentTurf = TURFS[selectedTurf];

    // Generate next 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            fullDate: d.toISOString().split('T')[0],
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNum: d.getDate()
        };
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 fade-in">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Selection */}
                <aside className="w-full lg:w-1/3 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-emerald-800">
                            <MapPin size={20} /> Select Turf
                        </h3>
                        <div className="space-y-3">
                            {Object.values(TURFS).map(t => (
                                <div
                                    key={t.id}
                                    onClick={() => onSetTurf(t.id)}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${selectedTurf === t.id
                                        ? 'border-emerald-500 bg-emerald-50'
                                        : 'border-gray-100 hover:border-emerald-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-gray-800">{t.name}</span>
                                        {selectedTurf === t.id && <CheckCircle2 className="text-emerald-600 w-5 h-5" />}
                                    </div>
                                    <div className="text-sm flex justify-between text-gray-500">
                                        <span>{t.type}</span>
                                        <span className="text-emerald-700 font-bold">₹{t.price}/hr</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-emerald-800">
                            <Calendar size={20} /> Select Date
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                            {dates.map(d => (
                                <button
                                    key={d.fullDate}
                                    onClick={() => onSetDate(d.fullDate)}
                                    className={`flex flex-col items-center p-3 rounded-xl border transition-all ${selectedDate === d.fullDate
                                        ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-200'
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-400'
                                        }`}
                                >
                                    <span className="text-[10px] uppercase font-bold opacity-80">{d.dayName}</span>
                                    <span className="text-lg font-bold">{d.dayNum}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Slot Grid */}
                <main className="w-full lg:w-2/3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{currentTurf.name}</h2>
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                                    <Calendar size={10} strokeWidth={3} /> {new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'full' })}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Rate</p>
                                <p className="text-3xl font-black text-emerald-600">₹{currentTurf.price}</p>
                            </div>
                        </div>

                        <div className="p-8 space-y-10">
                            {PERIODS.map(period => (
                                <div key={period}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest">{period} Slots</h4>
                                        <div className="flex-grow border-t border-gray-100" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {SLOTS.filter(s => s.period === period).map(slot => {
                                            const isBooked = checkBooked(slot.id);
                                            return (
                                                <button
                                                    key={slot.id}
                                                    disabled={isBooked}
                                                    onClick={() => onInitBooking(slot.id)}
                                                    className={`group relative p-5 rounded-2xl border-2 text-left transition-all ${isBooked
                                                        ? 'bg-gray-50 border-gray-100 cursor-not-allowed'
                                                        : 'bg-white border-gray-100 hover:border-emerald-500 hover:bg-emerald-50/30'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <span className={`block font-black text-xl mb-0.5 tracking-tight ${isBooked ? 'text-gray-400' : 'text-gray-900'}`}>
                                                                {slot.label}
                                                            </span>
                                                            <span className={`text-sm font-semibold flex items-center gap-1 ${isBooked ? 'text-gray-300' : 'text-emerald-600'}`}>
                                                                {isBooked ? 'Already Booked' : 'Available Now'}
                                                                {!isBooked && <CheckCircle2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                                                            </span>
                                                        </div>
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isBooked ? 'bg-gray-100 text-gray-300' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
                                                            }`}>
                                                            <Clock size={20} />
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Booking;
