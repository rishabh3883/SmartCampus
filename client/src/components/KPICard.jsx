import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KPICard = ({ title, value, unit, trend, icon: Icon, color = "emerald" }) => {
    const isPositive = trend >= 0;

    // Dynamic color classes based on props - Light Theme
    const colorMap = {
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
        blue: "text-blue-600 bg-blue-50 border-blue-200",
        amber: "text-amber-600 bg-amber-50 border-amber-200",
        rose: "text-rose-600 bg-rose-50 border-rose-200",
    };

    const iconBgMap = {
        emerald: "bg-emerald-100 text-emerald-600",
        blue: "bg-blue-100 text-blue-600",
        amber: "bg-amber-100 text-amber-600",
        rose: "bg-rose-100 text-rose-600",
    };

    const theme = colorMap[color] || colorMap.emerald;
    const iconTheme = iconBgMap[color] || iconBgMap.emerald;

    return (
        <div className={`p-6 rounded-xl border shadow-sm hover:shadow-md transition-all bg-white`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">{title}</h3>
                    <div className="mt-2 flex items-baseline">
                        <span className="text-3xl font-bold text-slate-800">{value}</span>
                        <span className="ml-2 text-sm text-slate-500 font-medium">{unit}</span>
                    </div>
                </div>
                <div className={`p-3 rounded-xl ${iconTheme}`}>
                    {Icon && <Icon size={24} />}
                </div>
            </div>

            {trend !== undefined && (
                <div className="mt-4 flex items-center text-xs font-medium">
                    <span className={`flex items-center ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                        {Math.abs(trend)}%
                    </span>
                    <span className="ml-2 text-slate-400">vs last month</span>
                </div>
            )}
        </div>
    );
};

export default KPICard;
