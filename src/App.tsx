import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './views/Home';
import BookingView from './views/Booking';
import Admin from './views/Admin';
import AdminLogin from './views/AdminLogin';
import BookingModal from './components/BookingModal';
import type { View, Booking } from './types';
import { TURFS, SLOTS } from './constants';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('cricturf_admin_logged') === 'true';
  });
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [selectedTurf, setSelectedTurf] = useState('main');
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    slotId: string | null;
  }>({
    isOpen: false,
    slotId: null
  });

  const [notification, setNotification] = useState<{
    msg: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    // 1. Fetch initial bookings
    const fetchBookings = async () => {
      // Optimize: Only fetch bookings from the last 2 days onwards to save bandwidth
      const start = new Date();
      start.setDate(start.getDate() - 2);
      const dateStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .gte('date', dateStr);

      if (data) setBookings(data);
      if (error) console.error('Error fetching bookings:', error);
    };

    fetchBookings();

    // 2. Subscribe to real-time changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookings(prev => [...prev, payload.new as Booking]);
          } else if (payload.eventType === 'DELETE') {
            console.log('Real-time DELETE received:', payload.old);
            if (payload.old && payload.old.id) {
              setBookings(prev => prev.filter(b => b.id !== payload.old.id));
            } else {
              console.warn('Real-time DELETE received but missing ID. Ensure REPLICA IDENTITY FULL is set.');
            }
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev => prev.map(b => b.id === payload.new.id ? (payload.new as Booking) : b));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleNavigate = (newView: View) => {
    setView(newView);
    window.scrollTo(0, 0);
  };

  const checkBooked = (slotId: string) => {
    return bookings.some(b =>
      b.turfId === selectedTurf &&
      b.date === selectedDate &&
      b.timeSlotId === slotId &&
      b.status === 'Confirmed'
    );
  };

  const handleInitBooking = (slotId: string) => {
    setModalState({ isOpen: true, slotId });
  };

  const handleConfirmBooking = async (details: Partial<Booking>) => {
    const newBooking = {
      turfId: selectedTurf,
      date: selectedDate,
      timeSlotId: modalState.slotId!,
      customerName: details.customerName!,
      phone: (details as any).phone!,
      email: (details as any).email!,
      status: 'Confirmed',
      amount: details.amount!,
      paymentMethod: details.paymentMethod!
    };

    const { error } = await supabase
      .from('bookings')
      .insert([newBooking]);

    if (error) {
      if (error.code === '23505') {
        showNotification('Oops! This slot was just booked by someone else.', 'error');
      } else {
        showNotification('Error saving booking. Please try again.', 'error');
      }
      console.error('Supabase error:', error);
      return;
    }

    showNotification(`Success! Booking confirmed via ${details.paymentMethod}`);
    if (isAdminLoggedIn) {
      setView('admin');
    } else {
      setView('home');
    }
  };

  const handleCancelBooking = async (id: number) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        showNotification('Error cancelling booking.', 'error');
        console.error('Supabase error:', error);
      } else {
        showNotification('Booking cancelled successfully', 'error');
      }
    }
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('cricturf_admin_logged', 'true');
    showNotification('Welcome back, Admin!');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('cricturf_admin_logged');
    setView('home');
    showNotification('Logged out successfully');
  };

  const currentSlot = SLOTS.find(s => s.id === modalState.slotId);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar
        currentView={view}
        onNavigate={handleNavigate}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleAdminLogout}
      />

      <main className="flex-grow">
        {view === 'home' && (
          <Home onStartBooking={() => handleNavigate('booking')} />
        )}
        {view === 'booking' && (
          <BookingView
            selectedTurf={selectedTurf}
            selectedDate={selectedDate}
            onSetTurf={setSelectedTurf}
            onSetDate={setSelectedDate}
            onInitBooking={handleInitBooking}
            checkBooked={checkBooked}
          />
        )}
        {view === 'admin' && (
          isAdminLoggedIn ? (
            <Admin
              bookings={bookings}
              onCancelBooking={handleCancelBooking}
            />
          ) : (
            <AdminLogin onLogin={handleAdminLogin} />
          )
        )}
      </main>

      <Footer />

      {/* Booking Modal */}
      {modalState.isOpen && currentSlot && (
        <BookingModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ isOpen: false, slotId: null })}
          turf={TURFS[selectedTurf]}
          slot={currentSlot}
          date={selectedDate}
          onConfirm={handleConfirmBooking}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 px-8 py-4 rounded-2xl shadow-2xl text-white transform transition-all duration-500 fade-in flex items-center gap-3 ${notification.type === 'error' ? 'bg-red-500' : 'bg-emerald-600'
          }`}>
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            {notification.type === 'success' ? '✓' : '!'}
          </div>
          <p className="font-bold tracking-tight">{notification.msg}</p>
        </div>
      )}
    </div>
  );
};

export default App;
