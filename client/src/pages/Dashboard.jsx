import React, { useEffect, useState } from 'react';
import KPICard from '../components/KPICard';
import Navbar from '../components/Navbar';
import { Zap, Trash2, Leaf, AlertTriangle, TrendingUp, TrendingDown, Activity, PieChart as PieIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import API from '../services/api';
import socket from '../services/socket';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalWaste: 0,
        totalEnergy: 0,
        sustainabilityScore: 0,
        totalEmissions: 0
    });
    const [alerts, setAlerts] = useState([]);

    // Mock data for charts if API fails or is empty initially
    const energyMockData = [
        { name: 'Mon', kwh: 400 },
        { name: 'Tue', kwh: 300 },
        { name: 'Wed', kwh: 550 },
        { name: 'Thu', kwh: 450 },
        { name: 'Fri', kwh: 600 },
        { name: 'Sat', kwh: 200 },
        { name: 'Sun', kwh: 150 },
    ];

    const wasteMockData = [
        { name: 'Plastic', value: 400 },
        { name: 'Paper', value: 300 },
        { name: 'Food', value: 300 },
        { name: 'Glass', value: 200 },
    ];

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#f43f5e'];

    useEffect(() => {
        fetchStats();
        fetchAlerts();

        // Listen for real-time alerts
        socket.on('new-alert', (alert) => {
            setAlerts(prev => [alert, ...prev]);
        });

        return () => socket.off('new-alert');
    }, []);

    const fetchStats = async () => {
        try {
            const res = await API.get('/dashboard/stats');
            setStats(res.data);
        } catch (err) {
            console.error("Failed to fetch dashboard stats", err);
        }
    };

    const fetchAlerts = async () => {
        try {
            const res = await API.get('/alerts');
            setAlerts(res.data);
        } catch (err) {
            console.error("Failed to fetch alerts", err);
        }
    };

    return (
        <div className="min-h-screen pb-10">
            <Navbar />
            <div className="page-container max-w-7xl">
                <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Campus Overview</h1>
                        <p className="text-slate-400 mt-1">Real-time sustainability metrics & operational status</p>
                    </div>
                    <div className="flex space-x-4">
                        <div className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 flex items-center text-sm text-slate-300 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                            Simulating live data
                        </div>
                    </div>
                </header>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KPICard
                        title="Sustainability Score"
                        value={stats.sustainabilityScore}
                        unit="/ 100"
                        icon={Leaf}
                        color={stats.sustainabilityScore > 70 ? "emerald" : "amber"}
                        trend={2.4}
                    />
                    <KPICard
                        title="Total Energy"
                        value={stats.totalEnergy}
                        unit="kWh"
                        icon={Zap}
                        color="blue"
                        trend={-1.2}
                    />
                    <KPICard
                        title="Total Waste"
                        value={stats.totalWaste}
                        unit="kg"
                        icon={Trash2}
                        color="rose"
                        trend={5.0}
                    />
                    <KPICard
                        title="Emissions (CO2e)"
                        value={stats.totalEmissions}
                        unit="kg"
                        icon={AlertTriangle}
                        color="amber"
                        trend={0.5}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Energy Chart */}
                    <div className="lg:col-span-2 card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center"><Activity className="mr-2 text-blue-500" /> Weekly Energy Consumption</h3>
                        </div>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={energyMockData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                                    <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={{ stroke: '#475569' }} />
                                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={{ stroke: '#475569' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', borderRadius: '0.5rem' }}
                                        itemStyle={{ color: '#f1f5f9' }}
                                    />
                                    <Line type="monotone" dataKey="kwh" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#1e293b' }} activeDot={{ r: 6, fill: '#3b82f6' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Waste Distribution */}
                    <div className="card flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center"><PieIcon className="mr-2 text-emerald-500" /> Waste Composition</h3>
                        </div>
                        <div className="h-64 w-full flex-1 flex justify-center items-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={wasteMockData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {wasteMockData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', borderRadius: '0.5rem' }}
                                        itemStyle={{ color: '#f1f5f9' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text Overlap */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <span className="text-2xl font-bold text-white">1.2T</span>
                                    <p className="text-[10px] text-slate-400 uppercase">Total</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-6">
                            {wasteMockData.map((entry, index) => (
                                <div key={index} className="flex items-center text-xs text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                                    <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                    <span className="flex-1">{entry.name}</span>
                                    <span className="font-bold text-slate-300">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Alerts */}
                <div className="card border-l-4 border-l-rose-500">
                    <h3 className="text-lg font-bold mb-4 text-white flex items-center">
                        <AlertTriangle className="mr-2 text-rose-500 animate-pulse" size={20} />
                        Recent Critical Alerts
                    </h3>
                    <div className="space-y-3">
                        {alerts.length === 0 ? (
                            <p className="text-slate-500 italic text-center py-4">No active alerts.</p>
                        ) : (
                            alerts.map((alert, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-rose-500/30 transition-colors">
                                    <div className="mb-2 md:mb-0">
                                        <h4 className="font-bold text-rose-400 flex items-center gap-2">
                                            {alert.type}
                                            {idx === 0 && <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full">NEW</span>}
                                        </h4>
                                        <p className="text-sm text-slate-400 mt-1">{alert.message}</p>
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono flex items-center bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                                        <Clock size={12} className="mr-1.5" />
                                        {new Date(alert.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
