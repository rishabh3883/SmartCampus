import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, Home, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
                {/* Background Ambient Glows */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl text-center relative z-10 animate-enter">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-6">
                        <Compass size={14} className="animate-spin" />
                        <span>Page Not Found • 404</span>
                    </div>

                    <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 tracking-tight mb-4">
                        404
                    </h1>

                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
                        Lost in the Smart Campus?
                    </h2>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                        The requested route does not exist or has been relocated within the campus directory.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                            <ArrowLeft size={16} /> Go Back
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                            <Home size={16} /> Campus Portal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
