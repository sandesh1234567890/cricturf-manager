import React, { useState } from 'react';
import { Lock, User, ShieldAlert } from 'lucide-react';
import Button from '../components/Button';

interface AdminLoginProps {
    onLogin: (password: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would be a server-side check
        // For this prototype, we'll use a hardcoded admin password
        if (password === 'admin123') {
            onLogin(password);
        } else {
            setError(true);
            setTimeout(() => setError(false), 3000);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-gray-100 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-emerald-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Lock size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Admin Portal</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Authorized Personnel Only</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admin Password</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900 group-focus-within:text-emerald-500 transition-colors">
                                <ShieldAlert size={20} />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-lg"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs font-black uppercase tracking-widest text-center animate-bounce">
                            Invalid Access Key
                        </p>
                    )}

                    <Button type="submit" className="w-full py-5 text-lg shadow-emerald-200">
                        Login to Dashboard
                    </Button>
                </form>

                <p className="text-center mt-10 text-xs text-gray-300 font-bold uppercase tracking-tighter">
                    CricTurf Manager Secure Access Layer
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
