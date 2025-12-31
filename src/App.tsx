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

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('cricturf_admin_logged') === 'true';
  });
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('cricturf_bookings');
    return saved ? JSON.parse(saved) : [
      {
        id: 1698745,
        turfId: 'main',
        date: new Date().toISOString().split('T')[0],
        timeSlotId: '18-19',
        customerName: 'Rahul Dravid',
        phone: '9876543210',
        email: 'thewall@india.com',
        status: 'Confirmed',
        amount: 1200,
        paymentMethod: 'UPI'
      }
    ];
  });

  const [selectedTurf, setSelectedTurf] = useState('main');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
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
    localStorage.setItem('cricturf_bookings', JSON.stringify(bookings));
  }, [bookings]);

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

  const handleConfirmBooking = (details: Partial<Booking>) => {
    const newBooking: Booking = {
      id: Date.now(),
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

    setBookings(prev => [...prev, newBooking]);
    showNotification(`Success! Booking confirmed via ${details.paymentMethod}`);
    if (isAdminLoggedIn) {
      setView('admin');
    } else {
      setView('home');
    }
  };

  const handleCancelBooking = (id: number) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      setBookings(prev => prev.filter(b => b.id !== id));
      showNotification('Booking cancelled successfully', 'error');
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
