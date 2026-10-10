import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Sparkles, AlertTriangle, TrendingUp, Zap, Droplets, Leaf, ArrowUpRight, Cpu } from 'lucide-react';

const InsightsWidget = () => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            const res = await API.get('/insights');
            setInsights(res.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch insights", err);
            setLoading(false);
        }
    };

    const getStatusTheme = (status) => {
        switch (status) {
            case 'Critical':
                return {
                    card: 'bg-rose-500/[0.04] dark:bg-rose-500/[0.08] border-rose-200/80 dark:border-rose-500/20 hover:border-rose-300',
                    badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20',
                    iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                    action: 'text-rose-700 dark:text-rose-300 hover:text-rose-800',
                    dot: 'bg-rose-500',
                };
            case 'Warning':
                return {
                    card: 'bg-amber-500/[0.04] dark:bg-amber-500/[0.08] border-amber-200/80 dark:border-amber-500/20 hover:border-amber-300',
                    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
                    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                    action: 'text-amber-700 dark:text-amber-300 hover:text-amber-800',
                    dot: 'bg-amber-500',
                };
            case 'Optimization':
                return {
                    card: 'bg-blue-500/[0.04] dark:bg-blue-500/[0.08] border-blue-200/80 dark:border-blue-500/20 hover:border-blue-300',
                    badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
                    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                    action: 'text-blue-700 dark:text-blue-300 hover:text-blue-800',
                    dot: 'bg-blue-500',
                };
            default:
                return {
                    card: 'bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08] border-emerald-200/80 dark:border-emerald-500/20 hover:border-emerald-300',
                    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
                    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                    action: 'text-emerald-700 dark:text-emerald-300 hover:text-emerald-800',
                    dot: 'bg-emerald-500',
                };
        }
    };

    const getIcon = (status) => {
        switch (status) {
            case 'Critical': return <AlertTriangle className="w-4 h-4" />;
            case 'Warning': return <TrendingUp className="w-4 h-4" />;
            case 'Optimization': return <Zap className="w-4 h-4" />;
            default: return <Leaf className="w-4 h-4" />;
        }
    };

    if (loading) return (
        <div className="w-full h-40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl animate-pulse flex items-center justify-center border border-slate-200/60 dark:border-white/10">
            <span className="text-slate-400 text-sm font-medium flex items-center gap-2">
                <Sparkles className="animate-spin text-indigo-500" size={16} /> Analyzing campus telemetry...
            </span>
        </div>
    );

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Sparkles size={16} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            Predictive Intelligence & Telemetry
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Real-time resource modeling and baseline anomalies</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    Continuous AI Evaluation
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {insights.map((item, index) => {
                    const theme = getStatusTheme(item.status);
                    return (
                        <div
                            key={index}
                            className={`p-5 rounded-2xl border backdrop-blur-sm transition-all duration-300 flex flex-col justify-between group hover:shadow-md ${theme.card}`}
                        >
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
                                        {item.resource}
                                    </span>
                                    <div className={`p-1.5 rounded-lg ${theme.iconBg}`}>
                                        {getIcon(item.status)}
                                    </div>
                                </div>

                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {item.headline}
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 font-normal leading-relaxed">
                                    {item.insight}
                                </p>
                            </div>

                            <div className="mt-auto pt-3 border-t border-slate-200/50 dark:border-white/5 space-y-1.5 text-xs">
                                <div className="flex items-start justify-between gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                                    <span className="font-medium">Impact:</span>
                                    <span className="text-right text-slate-700 dark:text-slate-300 font-medium">{item.impact}</span>
                                </div>
                                <div className="flex items-center justify-between gap-2 text-[11px]">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Action:</span>
                                    <span className={`font-semibold flex items-center gap-0.5 ${theme.action}`}>
                                        {item.suggestedAction} <ArrowUpRight size={12} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {insights.length === 0 && (
                <div className="text-center py-8 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-white/10">
                    <p className="text-xs text-slate-400 font-medium">All campus parameters operating within nominal baselines.</p>
                </div>
            )}
        </div>
    );
};

export default InsightsWidget;
