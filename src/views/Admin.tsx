import React from 'react';
import { BadgeIndianRupee, CheckCircle2, Trash2, Calendar, User } from 'lucide-react';
import type { Booking } from '../types';
import { TURFS, SLOTS } from '../constants';

interface AdminProps {
    bookings: Booking[];
    onCancelBooking: (id: number) => void;
}

const Admin: React.FC<AdminProps> = ({ bookings, onCancelBooking }) => {
    const totalRevenue = bookings
        .filter(b => b.status === 'Confirmed')
        .reduce((sum, b) => sum + b.amount, 0);

    const stats = [
        {
            label: 'Total Revenue',
            value: `₹${totalRevenue.toLocaleString()}`,
            icon: <BadgeIndianRupee size={24} />,
            color: 'bg-emerald-600 text-white'
        },
        {
            label: 'Active Bookings',
            value: bookings.length.toString(),
            icon: <CheckCircle2 size={24} />,
            color: 'bg-white border border-gray-200 text-emerald-600'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 fade-in">
            <div className="mb-10 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 font-medium">Manage your turf operations and bookings.</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className={`flex-1 sm:flex-none px-8 py-5 rounded-2xl shadow-sm flex items-center gap-5 ${stat.color}`}
                        >
                            <div className="opacity-80">{stat.icon}</div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider opacity-70">{stat.label}</p>
                                <p className="text-2xl font-black">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-black text-gray-800 uppercase tracking-widest text-sm">Recent Bookings</h3>
                    <span className="text-xs font-bold px-3 py-1 bg-gray-200 text-gray-600 rounded-full">
                        REAL-TIME DATA
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/80 text-gray-400 font-bold text-[10px] uppercase tracking-widest border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-4">Booking Info</th>
                                <th className="px-8 py-4">Customer Details</th>
                                <th className="px-8 py-4">Turf/Venue</th>
                                <th className="px-8 py-4">Payment</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {bookings.map(b => {
                                const turf = TURFS[b.turfId];
                                const slot = SLOTS.find(s => s.id === b.timeSlotId);
                                return (
                                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                                    <Calendar size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-lg text-emerald-900 leading-tight">{slot?.label}</p>
                                                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">{b.date}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                                    <User size={14} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800">{b.customerName}</p>
                                                    <p className="text-xs font-medium text-gray-400">{b.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700">
                                                {turf?.name}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                                                {b.paymentMethod}
                                            </div>
                                            <div className="text-sm font-black text-emerald-600">
                                                ₹{b.amount}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => onCancelBooking(b.id)}
                                                className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                title="Cancel Booking"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-20">
                                        <div className="mb-4 text-gray-200">
                                            <BadgeIndianRupee size={64} className="mx-auto" />
                                        </div>
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No bookings found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin;
