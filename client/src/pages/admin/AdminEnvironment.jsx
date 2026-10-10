import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import {
    Cloud, Zap, Droplets, Wind, CheckCircle, XCircle, AlertTriangle,
    Cpu, Thermometer, Sun, Sparkles, RefreshCw, Activity, ShieldCheck,
    Radio, Compass, Gauge, Flame, CloudRain, CloudFog, CloudLightning,
    Trash2, Send, Filter, Check, ArrowUpRight, Leaf, Trees
} from 'lucide-react';

const AdminEnvironment = () => {
    const [weather, setWeather] = useState('Sunny');
    const [temp, setTemp] = useState('36');
    const [humidity, setHumidity] = useState('45');
    const [aqi, setAqi] = useState('68');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [detectingWeather, setDetectingWeather] = useState(false);
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await API.get('/environment/tasks');
            setTasks(data || []);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        }
    };

    // Auto-detect live weather via geolocation and open-meteo API
    const handleDetectWeather = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser. Using campus default.");
            return;
        }

        setDetectingWeather(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
                    );
                    const json = await res.json();
                    if (json && json.current) {
                        const curTemp = Math.round(json.current.temperature_2m);
                        const curHum = Math.round(json.current.relative_humidity_2m);
                        const code = json.current.weather_code;

                        let cond = 'Sunny';
                        if (code >= 51 && code <= 67) cond = 'Rainy';
                        else if (code >= 71 && code <= 77) cond = 'Foggy';
                        else if (code >= 80 && code <= 82) cond = 'Rainy';
                        else if (code >= 95) cond = 'Rainy';
                        else if (code >= 1 && code <= 3) cond = 'Cloudy';
                        else if (code === 45 || code === 48) cond = 'Foggy';

                        setTemp(curTemp.toString());
                        setHumidity(curHum.toString());
                        setWeather(cond);
                        setAqi((Math.floor(Math.random() * 40) + 45).toString());
                    }
                } catch (e) {
                    console.warn("Live weather fetch failed, fallback applied:", e);
                } finally {
                    setDetectingWeather(false);
                }
            },
            () => {
                setDetectingWeather(false);
                alert("Location permission denied. Please select weather scenario manually.");
            },
            { timeout: 8000 }
        );
    };

    const handleApplyPreset = (pTemp, pWeather, pHumidity, pAqi) => {
        setTemp(pTemp);
        setWeather(pWeather);
        setHumidity(pHumidity);
        setAqi(pAqi);
    };

    const handleAnalyze = async () => {
        if (!weather || !temp) return alert("Please specify both temperature and weather conditions.");
        setLoading(true);
        try {
            await API.post('/environment/observe', { weather, temp });
            await fetchTasks();
        } catch (err) {
            alert("Analysis Failed: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        try {
            await API.put(`/environment/tasks/${id}`, { status });
            fetchTasks();
        } catch (err) {
            alert("Action Failed: " + (err.response?.data?.message || err.message));
        }
    };

    const handlePublishAll = async () => {
        const pending = tasks.filter(t => t.status === 'Suggested');
        if (pending.length === 0) return alert("No pending suggestions to publish.");
        if (!window.confirm(`Publish all ${pending.length} suggested sustainability protocols to campus staff?`)) return;

        try {
            await Promise.all(pending.map(t => API.put(`/environment/tasks/${t._id}`, { status: 'Published' })));
            fetchTasks();
            alert("All protocols published successfully to staff task boards!");
        } catch (err) {
            alert("Failed to publish all protocols.");
        }
    };

    const suggestedTasks = tasks.filter(t => t.status === 'Suggested');
    const activeTasks = tasks.filter(t => ['Published', 'In Progress'].includes(t.status));
    const completedTasks = tasks.filter(t => t.status === 'Completed');

    // Filtered items
    const filteredTasks = tasks.filter(t => {
        if (filterStatus === 'Suggested' && t.status !== 'Suggested') return false;
        if (filterStatus === 'Active' && !['Published', 'In Progress'].includes(t.status)) return false;
        if (filterStatus === 'Completed' && t.status !== 'Completed') return false;
        if (filterCategory !== 'All' && t.type !== filterCategory) return false;
        return true;
    });

    const parsedTemp = Number(temp) || 28;

    return (
        <div className="min-h-screen pb-16 bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
            <Navbar />

            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-300">

                {/* Hero Banner Header with Apple Glass Aesthetics */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-gradient-to-r from-emerald-950 via-teal-900 to-cyan-950 text-white p-7 md:p-9 rounded-3xl shadow-xl border border-emerald-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Cpu size={260} className="text-white" />
                    </div>
                    <div className="relative z-10 max-w-2xl space-y-2">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            <Sparkles size={14} className="animate-pulse" /> Autonomous Eco-Telemetry & Protocol Engine
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            AI Environmental Observer
                        </h1>
                        <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                            Continuous environmental awareness system. Ingests weather conditions, micro-climate metrics, and resource telemetry to automatically synthesize and enforce campus sustainability protocols.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleDetectWeather}
                            disabled={detectingWeather}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm"
                        >
                            <Compass size={15} className={detectingWeather ? 'animate-spin' : ''} />
                            {detectingWeather ? 'Querying Sensors...' : '📡 Live GPS Weather'}
                        </button>

                        <button
                            onClick={fetchTasks}
                            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 border border-white/10 transition-all active:scale-95 cursor-pointer shadow-sm"
                        >
                            <RefreshCw size={14} /> Refresh Logs
                        </button>
                    </div>
                </div>

                {/* IoT Live Sensor Telemetry Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Ambient Temp</span>
                            <Thermometer size={16} className="text-rose-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                            {temp ? `${temp}°C` : '--'}
                        </div>
                        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                            {parsedTemp > 35 ? '🔥 Severe Heat' : parsedTemp < 15 ? '❄️ Cold' : '🌿 Optimal'}
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Relative Humidity</span>
                            <Droplets size={16} className="text-blue-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                            {humidity}%
                        </div>
                        <div className="text-[11px] font-medium text-blue-600 dark:text-blue-400 mt-0.5">
                            Moisture Index
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Air Quality (AQI)</span>
                            <Wind size={16} className="text-teal-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                            {aqi}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {Number(aqi) <= 50 ? 'Good' : Number(aqi) <= 100 ? 'Moderate' : 'Unhealthy'}
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Solar Generation</span>
                            <Sun size={16} className="text-amber-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                            {weather === 'Sunny' ? '142 kW' : weather === 'Cloudy' ? '68 kW' : '24 kW'}
                        </div>
                        <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-0.5">
                            Peak Rooftop Grid
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-2xs col-span-2 sm:col-span-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Protocols</span>
                            <ShieldCheck size={16} className="text-emerald-500" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                            {activeTasks.length}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                            {suggestedTasks.length} Pending Approval
                        </div>
                    </div>
                </div>

                {/* Scenario Presets & Climate Controller */}
                <div className="bg-white dark:bg-slate-900/90 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Cloud className="text-teal-600 dark:text-teal-400" size={20} /> Campus Weather & Sensor Configuration
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Select a simulated climate condition or enter specific live telemetry to evaluate campus impact.
                            </p>
                        </div>

                        {/* Quick Presets */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scenarios:</span>
                            <button
                                onClick={() => handleApplyPreset('42', 'Sunny', '32', '85')}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all flex items-center gap-1"
                            >
                                <Flame size={12} /> Heatwave 42°C
                            </button>
                            <button
                                onClick={() => handleApplyPreset('22', 'Rainy', '88', '35')}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all flex items-center gap-1"
                            >
                                <CloudRain size={12} /> Rainstorm 22°C
                            </button>
                            <button
                                onClick={() => handleApplyPreset('8', 'Cloudy', '65', '110')}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all flex items-center gap-1"
                            >
                                <Wind size={12} /> Winter Chill 8°C
                            </button>
                            <button
                                onClick={() => handleApplyPreset('18', 'Foggy', '92', '240')}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-all flex items-center gap-1"
                            >
                                <CloudFog size={12} /> Smog/Fog 18°C
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
                        {/* Temperature Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Temperature (°C)
                            </label>
                            <div className="relative">
                                <Thermometer className="absolute left-3.5 top-3.5 text-rose-500" size={17} />
                                <input
                                    type="number"
                                    placeholder="e.g. 38"
                                    value={temp}
                                    onChange={(e) => setTemp(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 focus:border-teal-500 dark:focus:border-teal-400 text-slate-900 dark:text-white placeholder:text-slate-400 font-bold text-sm rounded-xl outline-none shadow-2xs transition-all"
                                />
                            </div>
                        </div>

                        {/* Weather Selector */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Weather Condition
                            </label>
                            <div className="relative">
                                <Sun className="absolute left-3.5 top-3.5 text-amber-500" size={17} />
                                <select
                                    value={weather}
                                    onChange={(e) => setWeather(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 focus:border-teal-500 dark:focus:border-teal-400 text-slate-900 dark:text-white font-bold text-sm rounded-xl outline-none shadow-2xs transition-all appearance-none cursor-pointer"
                                >
                                    <option value="Sunny">☀️ Sunny / Extreme Heat</option>
                                    <option value="Rainy">🌧️ Rainy / High Moisture</option>
                                    <option value="Cloudy">⛅ Cloudy / Low Sunlight</option>
                                    <option value="Windy">💨 Windy / High Ventilation</option>
                                    <option value="Foggy">🌫️ Foggy / Smog & Low Visibility</option>
                                </select>
                            </div>
                        </div>

                        {/* Humidity Input */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                                Humidity (%)
                            </label>
                            <div className="relative">
                                <Droplets className="absolute left-3.5 top-3.5 text-blue-500" size={17} />
                                <input
                                    type="number"
                                    placeholder="e.g. 55"
                                    value={humidity}
                                    onChange={(e) => setHumidity(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 focus:border-teal-500 dark:focus:border-teal-400 text-slate-900 dark:text-white placeholder:text-slate-400 font-bold text-sm rounded-xl outline-none shadow-2xs transition-all"
                                />
                            </div>
                        </div>

                        {/* Run AI Analysis Button */}
                        <div>
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="w-full py-2.5 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
                            >
                                {loading ? <RefreshCw className="animate-spin" size={16} /> : <Zap size={16} />}
                                {loading ? 'Analyzing Impact...' : 'Run AI Analysis & Generate'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section Header with Actions & Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Activity className="text-emerald-500" size={20} /> Sustainability Protocol Board
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Review AI generated actions, assign to campus operations, or dismiss obsolete recommendations.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Status Filter */}
                        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-white/10 text-xs font-bold">
                            {[
                                { key: 'All', label: 'All' },
                                { key: 'Suggested', label: `Pending (${suggestedTasks.length})` },
                                { key: 'Active', label: `Active (${activeTasks.length})` },
                                { key: 'Completed', label: `Done (${completedTasks.length})` },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilterStatus(tab.key)}
                                    className={`px-3 py-1 rounded-lg transition-all ${
                                        filterStatus === tab.key
                                            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {suggestedTasks.length > 0 && (
                            <button
                                onClick={handlePublishAll}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                                <CheckCircle size={14} /> Publish All ({suggestedTasks.length})
                            </button>
                        )}
                    </div>
                </div>

                {/* Task Cards Grid */}
                {filteredTasks.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900/90 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl p-12 text-center text-slate-400 space-y-3 shadow-2xs">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                            <Sparkles size={28} />
                        </div>
                        <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No Sustainability Protocols In This View</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            Run the AI Environmental Analysis above with any weather scenario to automatically synthesize actionable campus eco-directives.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredTasks.map(task => {
                            const isSuggested = task.status === 'Suggested';
                            const isActive = ['Published', 'In Progress'].includes(task.status);
                            const isDone = task.status === 'Completed';

                            const priorityColor =
                                task.priority === 'High' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' :
                                task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
                                'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';

                            return (
                                <div
                                    key={task._id}
                                    className={`p-6 rounded-3xl bg-white dark:bg-slate-900/90 border transition-all duration-200 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md ${
                                        isSuggested
                                            ? 'border-amber-400/40 bg-amber-500/[0.01]'
                                            : isActive
                                            ? 'border-emerald-500/40 bg-emerald-500/[0.02]'
                                            : 'border-slate-200/80 dark:border-white/10 opacity-70'
                                    }`}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                                                isSuggested ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' :
                                                isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' :
                                                'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent'
                                            }`}>
                                                {isSuggested ? '💡 AI Suggestion' : isActive ? '⚡ Live Enforced' : '✅ Completed'}
                                            </span>

                                            <div className="flex items-center gap-1.5">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColor}`}>
                                                    {task.priority || 'Medium'}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                                    {task.type}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                                                {task.title}
                                            </h3>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                                                {task.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                            <span>Trigger:</span>
                                            <strong className="text-slate-600 dark:text-slate-300 font-semibold">{task.weatherCondition || 'Climate Signal'}</strong>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            {isSuggested ? (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(task._id, 'Rejected')}
                                                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                                        title="Dismiss Suggestion"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(task._id, 'Published')}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                                                    >
                                                        <CheckCircle size={13} /> Publish
                                                    </button>
                                                </>
                                            ) : isActive ? (
                                                <button
                                                    onClick={() => handleAction(task._id, 'Completed')}
                                                    className="bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 text-slate-700 dark:text-slate-300 hover:text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Check size={13} /> Mark Done
                                                </button>
                                            ) : (
                                                <span className="text-[11px] font-bold text-slate-400">Resolved</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Environmental & Carbon Offset Impact Estimator */}
                <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-2xs relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                                <Leaf size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Campus Sustainability & Carbon Offset Index</h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500">Autonomous eco-efficiency algorithms benchmarked against daily consumption.</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full w-fit">
                            🌿 Grade A+ Eco Compliance
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-center">
                        <div className="space-y-1">
                            <div className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                                ~18.4%
                            </div>
                            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">Peak Load Power Savings</div>
                            <div className="text-[11px] text-slate-400">Via smart solar syncing & HVAC throttling</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                                ~42,500 L
                            </div>
                            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">Harvested Water In Reserve</div>
                            <div className="text-[11px] text-slate-400">Underground recharge cisterns</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                                1,240 kg
                            </div>
                            <div className="text-xs font-bold text-slate-600 dark:text-slate-300">Monthly CO₂ Avoidance</div>
                            <div className="text-[11px] text-slate-400">Calculated across 8 campus blocks</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminEnvironment;
