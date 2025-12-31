export interface Turf {
    id: string;
    name: string;
    type: string;
    price: number;
    img: string;
}

export interface BookingSlot {
    id: string;
    label: string;
    period: 'Morning' | 'Evening' | 'Night';
}

export interface Booking {
    id: number;
    turfId: string;
    date: string;
    timeSlotId: string;
    customerName: string;
    phone: string;
    email: string;
    status: 'Confirmed' | 'Cancelled';
    amount: number;
    paymentMethod: string;
}

export type View = 'home' | 'booking' | 'admin';
