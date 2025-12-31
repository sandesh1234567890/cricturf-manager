import React, { useState } from 'react';
import { X, User, Phone, Mail, ChevronRight, Smartphone, QrCode, CreditCard, Banknote, ShieldCheck, CheckCircle2, Loader2, Lock } from 'lucide-react';
import type { Turf, BookingSlot, Booking } from '../types';
import Button from './Button';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    turf: Turf;
    slot: BookingSlot;
    date: string;
    onConfirm: (details: Partial<Booking>) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose,
    turf,
    slot,
    date,
    onConfirm
}) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [paymentMethod, setPaymentMethod] = useState<'upi' | 'qr' | 'card' | 'cash'>('upi');
    const [selectedUpiApp, setSelectedUpiApp] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [processStatus, setProcessStatus] = useState<string>('');

    if (!isOpen) return null;

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setProcessStatus('Connecting to secure gateway...');

        // Step 1: Secure Connection
        setTimeout(() => {
            setProcessStatus('Verifying transaction details...');

            // Step 2: Verification
            setTimeout(() => {
                setProcessStatus(paymentMethod === 'cash' ? 'Finalizing booking...' : 'Processing secure payment...');

                // Step 3: Success
                setTimeout(() => {
                    let payString = 'Card';
                    if (paymentMethod === 'cash') payString = 'Cash at Venue';
                    if (paymentMethod === 'qr') payString = 'QR Scan';
                    if (paymentMethod === 'upi') payString = selectedUpiApp || 'UPI ID';

                    onConfirm({
                        ...formData,
                        customerName: formData.name,
                        paymentMethod: payString,
                        amount: turf.price,
                        status: 'Confirmed'
                    });

                    setIsSubmitting(false);
                    setProcessStatus('');
                    onClose();
                    setStep(1);
                    setFormData({ name: '', phone: '', email: '' });
                }, 1500);
            }, 1500);
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ring-1 ring-black/5">
                {/* Modal Header */}
                <div className="bg-emerald-900 px-8 py-6 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-2xl font-black tracking-tight">Complete Booking</h3>
                        <p className="text-emerald-300 text-sm font-bold uppercase tracking-widest mt-1">
                            Step {step} of 2: {step === 1 ? 'Your Details' : 'Payment'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {/* Summary Card */}
                    <div className="bg-emerald-50 rounded-2xl p-6 mb-8 border border-emerald-100 flex justify-between items-center">
                        <div>
                            <h4 className="font-black text-emerald-900 text-lg">{turf.name}</h4>
                            <p className="text-sm text-emerald-700 font-semibold">{new Date(date).toDateString()} • {slot.label}</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-[10px] text-emerald-600 uppercase font-black tracking-widest">Total Amount</span>
                            <span className="block text-3xl font-black text-emerald-900">₹{turf.price}</span>
                        </div>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleDetailsSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-semibold"
                                        placeholder="e.g. MS Dhoni"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-semibold"
                                        placeholder="e.g. 98765 43210"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all font-semibold"
                                        placeholder="e.g. captain@cool.com"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3">
                                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                                <Button type="submit" className="gap-2">
                                    Continue <ChevronRight size={18} />
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handlePaymentSubmit} className="space-y-6">
                            {/* Payment Tabs */}
                            <div className="grid grid-cols-4 gap-2 bg-gray-100 p-2 rounded-2xl border border-gray-200">
                                {[
                                    { id: 'upi', icon: <Smartphone size={16} />, label: 'UPI' },
                                    { id: 'qr', icon: <QrCode size={16} />, label: 'Scan' },
                                    { id: 'card', icon: <CreditCard size={16} />, label: 'Card' },
                                    { id: 'cash', icon: <Banknote size={16} />, label: 'Cash' }
                                ].map(method => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setPaymentMethod(method.id as any)}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${paymentMethod === method.id
                                            ? 'bg-white text-emerald-800 shadow-md ring-1 ring-black/5'
                                            : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        {method.icon}
                                        <span className="text-[10px] font-black uppercase tracking-tighter mt-1">{method.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Payment Content */}
                            <div className="min-h-[220px]">
                                {paymentMethod === 'upi' && (
                                    <div className="space-y-4 fade-in">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Select App</p>
                                        <div className="space-y-3">
                                            {['PhonePe', 'Google Pay', 'Paytm'].map(app => (
                                                <div
                                                    key={app}
                                                    onClick={() => setSelectedUpiApp(app)}
                                                    className={`cursor-pointer p-4 border-2 rounded-2xl flex items-center justify-between transition-all ${selectedUpiApp === app ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-emerald-900 text-white flex items-center justify-center font-black">
                                                            {app[0]}
                                                        </div>
                                                        <span className="font-bold text-gray-800">{app}</span>
                                                    </div>
                                                    {selectedUpiApp === app && <CheckCircle2 className="text-emerald-600" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'qr' && (
                                    <div className="flex flex-col items-center justify-center py-6 space-y-4 fade-in">
                                        <div className="bg-white p-6 rounded-3xl border-4 border-emerald-50 shadow-inner">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=cricturf@upi&am=${turf.price}`}
                                                alt="Payment QR"
                                                className="w-32 h-32"
                                            />
                                        </div>
                                        <p className="text-sm font-bold text-gray-500">Scan with any UPI App</p>
                                    </div>
                                )}

                                {paymentMethod === 'card' && (
                                    <div className="space-y-4 fade-in">
                                        <input
                                            type="text"
                                            className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-semibold"
                                            placeholder="Card Number (0000 0000 0000 0000)"
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-semibold"
                                                placeholder="MM/YY"
                                            />
                                            <input
                                                type="password"
                                                className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none font-semibold"
                                                placeholder="CVV"
                                            />
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'cash' && (
                                    <div className="text-center py-10 fade-in">
                                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                            <Banknote size={40} />
                                        </div>
                                        <h4 className="text-xl font-black text-gray-900 mb-2">Pay at Venue</h4>
                                        <p className="text-gray-500 font-medium px-10">Pay at the counter when you arrive for your match.</p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 flex justify-between items-center border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-gray-400 font-bold hover:text-emerald-700 transition-colors uppercase text-xs tracking-widest"
                                >
                                    Back to Details
                                </button>
                                <Button
                                    type="submit"
                                    isLoading={isSubmitting}
                                    className="min-w-[160px] gap-2"
                                >
                                    <ShieldCheck size={20} />
                                    {paymentMethod === 'cash' ? 'Confirm Booking' : `Secure Pay ₹${turf.price}`}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Processing Overlay */}
                {isSubmitting && (
                    <div className="absolute inset-0 z-[60] bg-emerald-900/95 backdrop-blur-sm flex flex-col items-center justify-center text-white p-10 text-center animate-in zoom-in duration-300">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping scale-150 opacity-0 group-hover:opacity-100"></div>
                            <div className="relative bg-white text-emerald-900 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl">
                                <Loader2 size={48} className="animate-spin" />
                            </div>
                        </div>
                        <h4 className="text-2xl font-black mb-2 tracking-tight">Hang Tight!</h4>
                        <p className="text-emerald-300 font-bold uppercase tracking-widest text-xs mb-8">{processStatus}</p>

                        <div className="bg-white/10 px-6 py-3 rounded-full flex items-center gap-3">
                            <Lock size={16} className="text-emerald-400" />
                            <span className="text-xs font-bold text-white/80">AES-256 Bit Secured Connection</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default BookingModal;
