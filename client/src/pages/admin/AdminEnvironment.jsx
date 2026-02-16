import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { Cloud, Zap, Droplets, Wind, CheckCircle, XCircle, AlertTriangle, Cpu, Thermometer, Sun } from 'lucide-react';

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
        if (!weather || !temp) return alert("Please enter weather conditions");
        setLoading(true);
        try {
            await API.post('/environment/observe', { weather, temp });
            await fetchTasks();
            alert("AI Analysis Complete! Suggestions Generated.");
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
        <div className="min-h-screen pb-10 bg-slate-50">
            <Navbar />

            <div className="page-container max-w-6xl">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 mb-2 flex items-center justify-center">
                        <Cpu className="mr-3 text-emerald-600" /> AI Environmental Observer
                    </h1>
                    <p className="text-slate-500 text-lg">Input environmental data to generate AI-driven sustainability protocols.</p>
                </div>

                {/* Input Section */}
                <div className="card mb-10 relative overflow-hidden bg-white border-slate-200">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10"></div>

                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                        <Cloud className="mr-2 text-blue-600" /> Environmental Input
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="label text-slate-700">Temperature (°C)</label>
                            <div className="relative">
                                <Thermometer className="absolute left-3 top-2.5 text-rose-500" size={20} />
                                <input
                                    type="number"
                                    placeholder="e.g. 38"
                                    className="input-field pl-10 bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500"
                                    value={temp}
                                    onChange={(e) => setTemp(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label text-slate-700">Weather Condition</label>
                            <div className="relative">
                                <Sun className="absolute left-3 top-2.5 text-amber-500" size={20} />
                                <select
                                    className="input-field pl-10 appearance-none bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500"
                                    value={weather}
                                    onChange={(e) => setWeather(e.target.value)}
                                >
                                    <option value="" className="bg-white text-slate-500">Select Condition</option>
                                    <option value="Sunny" className="bg-white text-slate-900">Sunny / Clear</option>
                                    <option value="Rainy" className="bg-white text-slate-900">Rainy / Storm</option>
                                    <option value="Cloudy" className="bg-white text-slate-900">Cloudy</option>
                                    <option value="Windy" className="bg-white text-slate-900">Windy</option>
                                    <option value="Foggy" className="bg-white text-slate-900">Foggy / Haze</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className={`btn w-full h-[42px] font-bold text-white shadow-lg ${loading ? 'opacity-75 cursor-not-allowed bg-slate-400' : 'btn-primary bg-gradient-to-r from-indigo-600 to-purple-600 border-none hover:shadow-indigo-200'}`}
                            >
                                {loading ? 'Analyzing...' : <><Zap className="mr-2" size={18} /> Run AI Analysis</>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Suggestions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* AI Suggestions Column */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                            <Zap className="mr-2 text-amber-500" /> AI Suggestions ({suggestedTasks.length})
                        </h2>
                        {suggestedTasks.length === 0 ? (
                            <div className="card border-dashed bg-slate-50 border-slate-300 text-center py-12 text-slate-500">
                                <p>No new suggestions. Run analysis to generate protocols.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {suggestedTasks.map(task => (
                                    <div key={task._id} className="card bg-white border-slate-200 relative group hover:border-amber-300 transition-colors shadow-sm">
                                        <div className="absolute top-0 right-0 bg-amber-100 text-amber-600 text-[10px] font-bold px-2 py-1 rounded-bl-lg border-b border-l border-amber-200">SUGGESTION</div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 pr-12">{task.title}</h3>
                                        <p className="text-sm text-slate-600 mb-4 h-16 overflow-y-auto custom-scrollbar">{task.description}</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">{task.type}</span>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleAction(task._id, 'Rejected')} className="p-2 rounded hover:bg-rose-50 text-rose-500 transition-colors"><XCircle size={20} /></button>
                                                <button onClick={() => handleAction(task._id, 'Published')} className="btn btn-primary text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200">
                                                    <CheckCircle size={16} /> Publish
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Active Protocols Column */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                            <Droplets className="mr-2 text-emerald-600" /> Active Campus Protocols
                        </h2>
                        {activeTasks.length === 0 ? (
                            <div className="card border-dashed bg-slate-50 border-slate-300 text-center py-12 text-slate-500">
                                <p>No active protocols. Publish suggestions to activate them.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activeTasks.map(task => (
                                    <div key={task._id} className="card bg-white border-slate-200 relative border-l-4 border-l-emerald-500 shadow-sm">
                                        <div className="absolute top-4 right-4 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">LIVE</div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1 pr-12">{task.title}</h3>
                                        <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                                            <span>Type: {task.type}</span>
                                            <span className="text-slate-300">|</span>
                                            <span>Trigger: {task.weatherCondition}</span>
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
