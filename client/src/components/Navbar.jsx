import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm transition-all">
            <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => navigate('/')}
            >
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20 transform group-hover:scale-105 transition-transform">
                    S
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-800 leading-tight">Smart<span className="text-emerald-600">Campus</span></span>
                    {user && (
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                            {user.role} Portal
                        </span>
                    )}
                </div>
            </div>

            {user ? (
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="hidden md:flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                            <User size={16} />
                        </div>
                        <span className="text-sm font-medium text-slate-700 pr-2 max-w-[150px] truncate">{user.name}</span>
                    </div>
                    <button
                        onClick={() => { handleLogout(); navigate('/login'); }}
                        className="p-2.5 hover:bg-rose-50 rounded-full text-slate-400 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100 active:scale-95"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors px-3 py-2">
                        Log In
                    </button>
                    <button onClick={() => navigate('/signup')} className="btn btn-primary text-sm py-2 px-5 rounded-full shadow-emerald-200 transform hover:scale-105 transition-all">
                        Sign Up
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
