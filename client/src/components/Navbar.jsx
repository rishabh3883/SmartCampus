import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine home dashboard path based on role
    const getHomePath = () => {
        if (!user) return '/';
        if (user.role === 'Admin') return '/admin';
        if (user.role === 'Student') return '/student';
        if (user.role === 'Employee') return '/employee';
        if (user.role === 'Security') return '/security';
        return '/';
    };

    const isDashboardRoot = ['/admin', '/student', '/employee', '/security', '/'].includes(location.pathname);

    return (
        <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3.5 flex justify-between items-center sticky top-0 z-50 shadow-xs transition-all font-sans">
            <div className="flex items-center gap-3">
                {/* Back Button if not on main root */}
                {!isDashboardRoot && (
                    <button
                        onClick={() => navigate(getHomePath())}
                        className="mr-1 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all flex items-center gap-1 text-xs font-bold border border-slate-200 active:scale-95"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={16} />
                        <span className="hidden sm:inline">Back to Dashboard</span>
                    </button>
                )}

                {/* Brand Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate(getHomePath())}
                >
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-emerald-500/20 transform group-hover:scale-105 transition-transform">
                        S
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-slate-900 leading-tight">
                            Campus<span className="text-emerald-600">Management</span>
                        </span>
                        {user && (
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                                {user.role} Portal
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {user ? (
                <div className="flex items-center gap-3 md:gap-4">
                    <button
                        onClick={() => navigate(getHomePath())}
                        className="hidden sm:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border border-slate-200"
                    >
                        <LayoutDashboard size={14} className="text-emerald-600" />
                        <span>Dashboard</span>
                    </button>

                    <div className="hidden md:flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200 shadow-xs">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center justify-center font-bold text-xs">
                            {user.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                        </div>
                        <span className="text-xs font-bold text-slate-800 pr-2 max-w-[140px] truncate">{user.name}</span>
                    </div>

                    <button
                        onClick={() => { handleLogout(); navigate('/login'); }}
                        className="p-2.5 hover:bg-rose-50 rounded-full text-slate-400 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100 active:scale-95"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/login')} className="text-xs font-bold text-slate-600 hover:text-emerald-600 transition-colors px-3 py-2">
                        Log In
                    </button>
                    <button onClick={() => navigate('/signup')} className="btn btn-primary text-xs py-2 px-4 rounded-full shadow-emerald-200 transform hover:scale-105 transition-all">
                        Sign Up
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
