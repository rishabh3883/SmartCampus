import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, ArrowLeft, LayoutDashboard, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ui/ThemeToggle';
import { RoleBadge } from './ui/Badge';

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
    const isLanding = location.pathname === '/';

    const handleAnchorClick = (id) => {
        if (!isLanding) {
            navigate(`/#${id}`);
        } else {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="glass-nav sticky top-0 z-50 px-4 md:px-8 py-3 flex justify-between items-center transition-all font-sans bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center gap-4 lg:gap-8">
                {/* Back Button if not on main root */}
                {!isDashboardRoot && (
                    <button
                        onClick={() => navigate(getHomePath())}
                        className="p-2 sm:px-3 sm:py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 active:scale-95 shadow-xs cursor-pointer"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft size={15} />
                        <span className="hidden sm:inline">Dashboard</span>
                    </button>
                )}

                {/* Brand Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer group select-none"
                    onClick={() => navigate(getHomePath())}
                >
                    <div className="w-9 h-9 bg-gradient-to-br from-[#e2725b] via-[#c75b3c] to-[#883a23] rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-[#e2725b]/25 transform group-hover:scale-105 transition-transform shrink-0">
                        <Sparkles size={18} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-lg font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                            Smart<span className="text-[#e2725b]">Campus</span>
                        </span>
                        {user ? (
                            <div className="flex items-center gap-1 mt-0.5">
                                <RoleBadge role={user.role} />
                            </div>
                        ) : (
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">
                                Unified System
                            </span>
                        )}
                    </div>
                </div>

                {/* Landing Page Navigation Links */}
                {isLanding && !user && (
                    <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
                        <button onClick={() => handleAnchorClick('features')} className="hover:text-[#e2725b] transition-colors cursor-pointer">
                            Features
                        </button>
                        <button onClick={() => handleAnchorClick('portals')} className="hover:text-[#e2725b] transition-colors cursor-pointer">
                            Portals
                        </button>
                        <button onClick={() => handleAnchorClick('how-it-works')} className="hover:text-[#e2725b] transition-colors cursor-pointer">
                            How It Works
                        </button>
                        <button onClick={() => handleAnchorClick('security')} className="hover:text-[#e2725b] transition-colors cursor-pointer">
                            Security
                        </button>
                        <button onClick={() => handleAnchorClick('faq')} className="hover:text-[#e2725b] transition-colors cursor-pointer">
                            FAQ
                        </button>
                    </div>
                )}
            </div>

            {/* Right Action Items */}
            <div className="flex items-center gap-3">
                <ThemeToggle />

                {user ? (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(getHomePath())}
                            className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
                        >
                            <LayoutDashboard size={14} className="text-[#e2725b]" />
                            <span>My Portal</span>
                        </button>

                        <div className="hidden md:flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-xs">
                            <div className="w-7 h-7 rounded-full bg-[#faede5] dark:bg-[#3c160b] text-[#c75b3c] dark:text-[#f5dacb] border border-[#e29b7f] dark:border-[#883a23] flex items-center justify-center font-bold text-xs">
                                {user.name ? user.name.charAt(0).toUpperCase() : <User size={14} />}
                            </div>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 pr-1 max-w-[130px] truncate">{user.name}</span>
                        </div>

                        <button
                            onClick={() => { handleLogout(); navigate('/login'); }}
                            className="p-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl text-slate-400 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900 active:scale-95 cursor-pointer"
                            title="Logout"
                            aria-label="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#e2725b] px-3 py-2 transition-colors cursor-pointer"
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="btn btn-primary text-xs py-2 px-4 rounded-xl shadow-md cursor-pointer"
                        >
                            Sign Up
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
