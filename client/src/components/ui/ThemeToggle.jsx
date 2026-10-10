import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = "" }) => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer ${className}`}
        >
            {isDark ? (
                <Sun size={18} className="text-amber-400 transition-transform rotate-0 hover:rotate-45" />
            ) : (
                <Moon size={18} className="text-slate-600 transition-transform -rotate-12 hover:rotate-0" />
            )}
        </button>
    );
};

export default ThemeToggle;
