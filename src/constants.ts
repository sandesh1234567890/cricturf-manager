import type { Turf, BookingSlot } from './types';

export const TURFS: Record<string, Turf> = {
    'main': {
        id: 'main',
        name: 'Main Stadium Ground',
        type: 'Full Pitch',
        price: 1200,
        img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1000'
    },
    'nets': {
        id: 'nets',
        name: 'Pro Practice Nets',
        type: 'Nets',
        price: 400,
        img: 'https://images.unsplash.com/photo-1593341646271-ec60d00552b9?auto=format&fit=crop&q=80&w=1000'
    }
};

export const SLOTS: BookingSlot[] = [
    { id: '06-07', label: '06:00 AM - 07:00 AM', period: 'Morning' },
    { id: '07-08', label: '07:00 AM - 08:00 AM', period: 'Morning' },
    { id: '08-09', label: '08:00 AM - 09:00 AM', period: 'Morning' },
    { id: '16-17', label: '04:00 PM - 05:00 PM', period: 'Evening' },
    { id: '17-18', label: '05:00 PM - 06:00 PM', period: 'Evening' },
    { id: '18-19', label: '06:00 PM - 07:00 PM', period: 'Night' },
    { id: '19-20', label: '07:00 PM - 08:00 PM', period: 'Night' },
    { id: '20-21', label: '08:00 PM - 09:00 PM', period: 'Night' }
];

export const PERIODS = ['Morning', 'Evening', 'Night'] as const;
