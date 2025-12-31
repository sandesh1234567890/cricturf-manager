import { MapPin, Clock, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { TURFS, SLOTS, PERIODS } from '../constants';
import Calendar from '../components/Calendar';
import React from 'react';

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

    const isSlotInPast = (slotLabel: string) => {
        const now = new Date();
        const getTodayStr = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const todayStr = getTodayStr(now);

        if (selectedDate > todayStr) return false;
        if (selectedDate < todayStr) return true;

        // Same day, check time
        // Label format: "06:00 AM - 07:00 AM"
        const startTimeStr = slotLabel.split(' - ')[0]; // "06:00 AM"
        const [time, modifier] = startTimeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);

        // 30-minute grace period (30 * 60 * 1000 = 1,800,000ms)
        const graceTime = new Date(slotTime.getTime() + 30 * 60 * 1000);

        return now > graceTime;
    };

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

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-emerald-800 text-white">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <MapPin size={20} /> Select Date
                            </h3>
                        </div>
                        <div className="p-4">
                            <Calendar
                                selectedDate={selectedDate}
                                onSetDate={onSetDate}
                            />
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
                                    <CalendarIcon size={10} strokeWidth={3} /> {new Date(selectedDate).toLocaleDateString('en-US', { dateStyle: 'full' })}
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
                                            const isPast = isSlotInPast(slot.label);
                                            const isDisabled = isBooked || isPast;

                                            return (
                                                <button
                                                    key={slot.id}
                                                    disabled={isDisabled}
                                                    onClick={() => onInitBooking(slot.id)}
                                                    className={`group relative p-5 rounded-2xl border-2 text-left transition-all ${isDisabled
                                                        ? 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-60'
                                                        : 'bg-white border-gray-100 hover:border-emerald-500 hover:bg-emerald-50/30'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <span className={`block font-black text-xl mb-0.5 tracking-tight ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                                                                {slot.label}
                                                            </span>
                                                            <span className={`text-sm font-semibold flex items-center gap-1 ${isDisabled ? 'text-gray-300' : 'text-emerald-600'}`}>
                                                                {isBooked ? 'Already Booked' : isPast ? 'Not Available' : 'Available Now'}
                                                            </span>
                                                        </div>
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isDisabled ? 'bg-gray-100 text-gray-300' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
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
