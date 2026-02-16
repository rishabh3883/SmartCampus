import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Lightbulb, AlertTriangle, CheckCircle, TrendingUp, Info, Zap, Droplets, Leaf } from 'lucide-react';

const InsightsWidget = () => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            const res = await API.get('/insights');
            setInsights(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch insights", err);
            setLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Critical': return 'bg-rose-50 border-rose-200 text-rose-800 hover:border-rose-300';
            case 'Warning': return 'bg-amber-50 border-amber-200 text-amber-800 hover:border-amber-300';
            case 'Optimization': return 'bg-sky-50 border-sky-200 text-sky-800 hover:border-sky-300';
            default: return 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:border-emerald-300';
        }
    };

    const getIcon = (status) => {
        switch (status) {
            case 'Critical': return <AlertTriangle className="w-5 h-5 text-rose-600" />;
            case 'Warning': return <TrendingUp className="w-5 h-5 text-amber-600" />;
            case 'Optimization': return <Zap className="w-5 h-5 text-sky-600" />;
            default: return <Leaf className="w-5 h-5 text-emerald-600" />;
        }
    };

    if (loading) return (
        <div className="w-full h-48 bg-slate-50 rounded-xl animate-pulse flex items-center justify-center border border-slate-200">
            <span className="text-slate-400 font-medium flex items-center gap-2">
                <Lightbulb className="animate-bounce" /> Generating AI Insights...
            </span>
        </div>
    );

    return (
        <div className="w-full mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="p-1.5 bg-yellow-100 rounded-lg text-yellow-600">
                    <Lightbulb size={20} fill="currentColor" />
                </div>
                AI Predictive Insights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {insights.map((item, index) => (
                    <div
                        key={index}
                        className={`p-5 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 ${getStatusStyles(item.status)}`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-70 px-2 py-0.5 bg-white/50 rounded-full border border-black/5">
                                {item.resource}
                            </span>
                            {getIcon(item.status)}
                        </div>

                        <h3 className="text-lg font-bold mb-2 leading-snug">{item.headline}</h3>
                        <p className="text-sm opacity-80 mb-4 font-medium leading-relaxed">{item.insight}</p>

                        <div className="mt-auto pt-3 border-t border-black/5 text-xs font-medium">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="opacity-60">Impact:</span>
                                <span>{item.impact}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="opacity-60">Action:</span>
                                <span className="font-bold underline decoration-dotted underline-offset-2">
                                    {item.suggestedAction}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {insights.length === 0 && (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500">No new insights available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default InsightsWidget;
