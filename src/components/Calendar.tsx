import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
    selectedDate: string;
    onSetDate: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSetDate }) => {
    const [currentMonth, setCurrentMonth] = React.useState(new Date(selectedDate));

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

    const days = [];
    // Padding for start day
    for (let i = 0; i < startDay; i++) {
        days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    const getLocalDateString = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    for (let d = 1; d <= totalDays; d++) {
        const currentIterDate = new Date(year, month, d);
        const dateStr = getLocalDateString(currentIterDate);
        const isSelected = selectedDate === dateStr;
        const isToday = getLocalDateString(new Date()) === dateStr;
        const todayNoTime = new Date();
        todayNoTime.setHours(0, 0, 0, 0);
        const isPast = currentIterDate < todayNoTime;

        days.push(
            <button
                key={d}
                onClick={() => !isPast && onSetDate(dateStr)}
                disabled={isPast}
                className={`p-2 w-full aspect-square rounded-xl text-sm font-bold transition-all flex flex-col items-center justify-center relative ${isSelected
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                    : isPast
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
            >
                {d}
                {isToday && !isSelected && (
                    <span className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full"></span>
                )}
            </button>
        );
    }

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <div className="bg-white rounded-2xl p-4">
            <div className="flex justify-between items-center mb-6">
                <h4 className="font-black text-gray-900 tracking-tight">
                    {monthNames[month]} {year}
                </h4>
                <div className="flex gap-1">
                    <button
                        onClick={prevMonth}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-[10px] uppercase font-black text-gray-400 tracking-widest py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days}
            </div>
        </div>
    );
};

export default Calendar;
