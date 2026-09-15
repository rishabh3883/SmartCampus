import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { Cloud, Zap, Droplets, Wind, CheckCircle, XCircle, AlertTriangle, Cpu, Thermometer, Sun, Sparkles, RefreshCw, Activity } from 'lucide-react';

const AdminEnvironment = () => {
    const [weather, setWeather] = useState('');
    const [temp, setTemp] = useState('');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await API.get('/environment/tasks');
            setTasks(data);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        }
    };

    const handleAnalyze = async () => {
        if (!weather || !temp) return alert("Please enter both temperature and weather condition.");
        setLoading(true);
        try {
            await API.post('/environment/observe', { weather, temp });
            await fetchTasks();
            alert("✨ AI Environmental Analysis Complete! New sustainability protocols generated.");
        } catch (err) {
            alert("Analysis Failed");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        try {
            await API.put(`/environment/tasks/${id}`, { status });
            fetchTasks();
        } catch (err) {
            alert("Action Failed");
        }
    };

    const suggestedTasks = tasks.filter(t => t.status === 'Suggested');
    const activeTasks = tasks.filter(t => ['Published', 'In Progress'].includes(t.status));

    return (
        <div className="min-h-screen pb-12 bg-slate-50 font-sans text-slate-900">
            <Navbar />

            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-300">

                {/* Hero Banner Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-emerald-950 via-teal-900 to-cyan-950 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Cpu size={220} className="text-white" />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles size={14} /> Autonomous Eco Intelligence
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            AI Environmental Observer
                        </h1>
                        <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                            Input live weather and temperature metrics to trigger automated, eco-friendly energy and water conservation protocols for your campus.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <button
                            onClick={fetchTasks}
                            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 border border-white/10 transition-all"
                        >
                            <RefreshCw size={14} /> Refresh AI Logs
                        </button>
                    </div>
                </div>

                {/* Input Card with High Contrast Crystal White Inputs */}
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <Cloud className="text-cyan-600" /> Environmental Weather Input
                        </h2>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            Campus Climate Sensor
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        {/* Temperature Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Temperature (°C)
                            </label>
                            <div className="relative">
                                <Thermometer className="absolute left-3.5 top-3.5 text-rose-500" size={18} />
                                <input
                                    type="number"
                                    placeholder="e.g. 38"
                                    value={temp}
                                    onChange={(e) => setTemp(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 focus:border-cyan-500 text-slate-900 placeholder:text-slate-400 font-bold text-sm rounded-xl outline-none shadow-xs transition-all focus:ring-4 focus:ring-cyan-500/10"
                                />
                            </div>
                        </div>

                        {/* Weather Selector */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Weather Condition
                            </label>
                            <div className="relative">
                                <Sun className="absolute left-3.5 top-3.5 text-amber-500" size={18} />
                                <select
                                    value={weather}
                                    onChange={(e) => setWeather(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 focus:border-cyan-500 text-slate-900 font-bold text-sm rounded-xl outline-none shadow-xs transition-all focus:ring-4 focus:ring-cyan-500/10 appearance-none"
                                >
                                    <option value="">Select Climate Condition</option>
                                    <option value="Sunny">Sunny / Extreme Heat</option>
                                    <option value="Rainy">Rainy / High Moisture</option>
                                    <option value="Cloudy">Cloudy / Low Sunlight</option>
                                    <option value="Windy">Windy / High Ventilation</option>
                                    <option value="Foggy">Foggy / Low Visibility</option>
                                </select>
                            </div>
                        </div>

                        {/* Run AI Analysis Button */}
                        <div>
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                            >
                                {loading ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
                                {loading ? 'Analyzing Environmental Impact...' : 'Run AI Sustainability Analysis'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Suggestions & Active Protocols Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* AI Suggestions Column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <Zap className="text-amber-500" /> AI Suggestions ({suggestedTasks.length})
                            </h2>
                            <span className="text-xs text-slate-500 font-semibold">Pending Approval</span>
                        </div>

                        {suggestedTasks.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 space-y-2">
                                <Zap size={36} className="mx-auto opacity-30 text-amber-500" />
                                <p className="font-bold text-slate-600">No new suggestions generated.</p>
                                <p className="text-xs text-slate-400">Run environmental analysis above to compute sustainability tasks.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {suggestedTasks.map(task => (
                                    <div key={task._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 relative group">
                                        <div className="flex justify-between items-start">
                                            <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-md uppercase">
                                                AI RECOMMENDATION
                                            </span>
                                            <span className="text-xs font-mono font-bold text-slate-400">{task.type}</span>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 leading-tight">{task.title}</h3>
                                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{task.description}</p>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                            <span className="text-[11px] font-bold text-slate-500">Trigger: {task.weatherCondition || 'Climate'}</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleAction(task._id, 'Rejected')}
                                                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                    title="Dismiss Suggestion"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(task._id, 'Published')}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                                                >
                                                    <CheckCircle size={14} /> Publish Protocol
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Active Campus Protocols Column */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <Droplets className="text-emerald-600" /> Active Campus Protocols ({activeTasks.length})
                            </h2>
                            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-md">LIVE ENFORCEMENT</span>
                        </div>

                        {activeTasks.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 space-y-2">
                                <Activity size={36} className="mx-auto opacity-30 text-emerald-500" />
                                <p className="font-bold text-slate-600">No active protocols live right now.</p>
                                <p className="text-xs text-slate-400">Publish AI suggestions to activate eco protocols on campus.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activeTasks.map(task => (
                                    <div key={task._id} className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-xs relative space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase">
                                                ACTIVE PROTOCOL
                                            </span>
                                            <span className="text-xs font-bold text-emerald-700">Enforced</span>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 leading-tight">{task.title}</h3>
                                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{task.description}</p>
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono pt-2 border-t border-slate-100">
                                            <span>Type: {task.type}</span>
                                            <span>•</span>
                                            <span>Condition: {task.weatherCondition}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AdminEnvironment;
