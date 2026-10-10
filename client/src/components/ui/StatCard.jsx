import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({
    title,
    value,
    unit = "",
    icon: Icon,
    trend = null,
    trendLabel = "vs last period",
    color = "brand",
    subtext = "",
    className = ""
}) => {
    const colorThemes = {
        brand: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    };

    const activeColor = colorThemes[color] || colorThemes.brand;

    return (
        <div className={`sc-card p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs hover:shadow-md transition-all group ${className}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {title}
                </span>
                {Icon && (
                    <div className={`p-2.5 rounded-xl border ${activeColor} group-hover:scale-110 transition-transform`}>
                        <Icon size={18} />
                    </div>
                )}
            </div>

            <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white tabular-nums">
                    {value}
                </span>
                {unit && (
                    <span className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                        {unit}
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
                {trend !== null ? (
                    <div className={`flex items-center gap-1 font-bold ${trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : trend < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
                        {trend > 0 ? <TrendingUp size={13} /> : trend < 0 ? <TrendingDown size={13} /> : <Minus size={13} />}
                        <span className="tabular-nums">{trend > 0 ? `+${trend}%` : `${trend}%`}</span>
                        <span className="font-normal text-slate-400 dark:text-slate-500 ml-1">{trendLabel}</span>
                    </div>
                ) : (
                    subtext && <span className="text-slate-400 dark:text-slate-500">{subtext}</span>
                )}
            </div>
        </div>
    );
};

export default StatCard;
