import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { AlertTriangle, Droplets, Zap, PieChart as PieIcon, CheckCircle, XCircle, Clock, FileText, Send, BookOpen, Calendar, Activity, Shield, Users, UserMinus, UserCheck, Cpu, TrendingUp, LayoutDashboard, Radio, LogOut } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InsightsWidget from '../../components/InsightsWidget';


import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab, complaintsCount, usersCount }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            navigate('/login');
        }
    };

    return (
        <div className="w-64 bg-white h-screen border-r border-slate-200 flex flex-col fixed left-0 top-0 z-50 shadow-sm font-sans">
            {/* Logo */}
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                    <LayoutDashboard className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">SmartCampus</h1>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Admin Console</p>
                </div>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>
                <SidebarItem id="overview" label="Overview" icon={LayoutDashboard} activeTab={activeTab} setActiveTab={setActiveTab} />
                <SidebarItem id="analytics" label="Analytics" icon={Activity} activeTab={activeTab} setActiveTab={setActiveTab} />
                <SidebarItem id="operations" label="Operations" icon={Radio} activeTab={activeTab} setActiveTab={setActiveTab} count={complaintsCount} />
                <SidebarItem id="users" label="User Mgmt" icon={Users} activeTab={activeTab} setActiveTab={setActiveTab} count={usersCount} />

                <div className="my-6 border-t border-slate-100 mx-2"></div>

                <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Access</p>
                <QuickLink href="/admin/library" icon={BookOpen} label="Library" />
                <QuickLink href="/admin/events" icon={Calendar} label="Events" />
                <QuickLink href="/admin/reports" icon={FileText} label="Reports" />
                <QuickLink href="/admin/environment" icon={Cpu} label="AI Observer" />
            </div>

            {/* Logout & Profile */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
                <div className="flex items-center gap-3 pt-2 border-t border-slate-200/50">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shadow-sm ring-2 ring-white">A</div>
                    <div className="flex-1">
                        <div className="text-sm font-bold text-slate-800">Administrator</div>
                        <div className="text-xs text-slate-500">System Admin</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SidebarItem = ({ id, label, icon: Icon, activeTab, setActiveTab, count }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${activeTab === id
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
    >
        <div className="flex items-center gap-3">
            <Icon size={18} className={`transition-colors ${activeTab === id ? 'text-indigo-200' : 'text-slate-400 group-hover:text-slate-600'}`} />
            {label}
        </div>
        {count > 0 && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === id ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
                }`}>
                {count}
            </span>
        )}
    </button>
);

const QuickLink = ({ href, icon: Icon, label }) => (
    <a href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 group">
        <Icon size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
        {label}
    </a>
);

const AdminDashboard = () => {
    const [viewImage, setViewImage] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [alerts, setAlerts] = useState([]);
    const [stats, setStats] = useState({ water: 0, elec: 0, food: 0 });
    const [complaints, setComplaints] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [userTab, setUserTab] = useState('Student');
    const [hostels, setHostels] = useState([]);
    const [selectedHostel, setSelectedHostel] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [comparison, setComparison] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [impactStats, setImpactStats] = useState({ foodDonated: 0, foodComposted: 0 });
    const [message, setMessage] = useState({ content: '', role: 'Staff' });

    useEffect(() => {
        fetchInitialData();
        const interval = setInterval(() => {
            fetchInitialData();
            fetchAnalytics();
        }, 30000);
        return () => clearInterval(interval);
    }, [selectedHostel, selectedDate]);

    useEffect(() => {
        fetchAnalytics();
    }, [selectedHostel, selectedDate]);

    useEffect(() => {
        if (activeTab === 'users') fetchAllUsers();
    }, [activeTab, userTab]);

    const fetchInitialData = async () => {
        try {
            const [alertsRes, complaintsRes, hostelsRes, usersRes, statsRes] = await Promise.all([
                API.get('/alerts'),
                API.get('/complaints'),
                API.get('/resources/hostels'),
                API.get('/users/pending'),
                API.get('/resources/stats')
            ]);
            setAlerts(alertsRes.data);
            setComplaints(complaintsRes.data);
            setHostels(hostelsRes.data);
            if (usersRes?.data) setPendingUsers(usersRes.data);
            if (hostelsRes.data.length > 0 && !selectedHostel) setSelectedHostel(hostelsRes.data[0]._id);
            if (statsRes?.data) setImpactStats(statsRes.data);
        } catch (err) { console.error("Dashboard Fetch Error:", err); }
    };

    const fetchAnalytics = async () => {
        try {
            const query = selectedHostel ? `?hostelId=${selectedHostel}&date=${selectedDate}` : `?date=${selectedDate}`;
            const { data } = await API.get(`/resources/analytics${query}`);

            // Chart Data: Last 7-10 Days
            const valid = data.history.slice(0, 10).reverse();
            setChartData(valid.map(item => ({
                name: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                Water: item.water,
                Electricity: item.electricity,
                Food: item.foodWaste
            })));
            setComparison(data.comparison);

            // Stats Card: Show usage for SELECTED DATE (Aggregate or Specific)
            const selectedStats = data.history.find(item => item.date.startsWith(selectedDate));
            if (selectedStats) {
                setStats({ water: selectedStats.water, elec: selectedStats.electricity, food: selectedStats.foodWaste });
            } else {
                setStats({ water: 0, elec: 0, food: 0 });
            }
        } catch (err) { console.error(err); }
    };

    const handleExport = async () => {
        try {
            const response = await API.get('/resources/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Campus_Resource_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) { alert("Failed to download report"); }
    };

    const sendMessage = async () => {
        try {
            await API.post('/messages', { content: message.content, receiverRole: message.role });
            alert('Message sent!');
            setMessage({ ...message, content: '' });
        } catch (err) { alert('Failed to send message.'); }
    };

    const handleAction = async (id, status) => {
        try {
            await API.put(`/complaints/${id}/status`, { status });
            fetchInitialData();
        } catch (err) { alert('Failed to update status'); }
    };

    const handleUserApproval = async (userId, status, role) => {
        try {
            await API.put(`/users/${userId}/status`, { status, role });
            setPendingUsers(prev => prev.filter(u => u._id !== userId));
            alert(`User ${status}`);
        } catch (err) { alert('Action failed'); }
    };

    const fetchAllUsers = async () => {
        try {
            const { data } = await API.get(`/users?role=${userTab}`);
            setAllUsers(data);
        } catch (err) { console.error(err); }
    };

    const handleUserAccess = async (userId, action, currentReason) => {
        const reason = prompt("Enter reason (optional):", currentReason || "Violation");
        if (reason === null) return;
        try {
            await API.put(`/users/${userId}/access`, { action, reason });
            alert("User updated successfully");
            fetchAllUsers();
        } catch (err) { alert("Failed to update user"); }
    };

    // Components
    const StatCard = ({ title, value, icon: Icon, color }) => {
        const colorClasses = {
            rose: "bg-rose-50 text-rose-600",
            blue: "bg-blue-50 text-blue-600",
            amber: "bg-amber-50 text-amber-600",
            emerald: "bg-emerald-50 text-emerald-600",
        };
        return (
            <div className="card flex items-center justify-between group hover:border-slate-300 transition-colors bg-white">
                <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
            </div>
        );
    };

    const ComparisonPill = ({ label, diff }) => {
        const isUp = diff > 0;
        return (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-bold uppercase">{label}</span>
                <div className={`flex items-center text-sm font-bold ${isUp ? 'text-rose-600' : 'text-emerald-600'}`}>
                    <TrendingUp size={14} className={`mr-1 ${!isUp && 'rotate-180'}`} />
                    {Math.abs(diff).toFixed(1)}%
                </div>
            </div>
        );
    };

    const ForecasterSection = () => {
        const [students, setStudents] = useState(1000);
        const [forecast, setForecast] = useState({ rooms: 0, water: 0, food: 0, lib: 0 });

        useEffect(() => {
            setForecast({
                rooms: Math.ceil(students / 2),
                water: students * 135,
                food: students * 0.5,
                lib: Math.ceil(students * 0.1)
            });
        }, [students]);

        const ForecastCard = ({ label, value, unit }) => (
            <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm">
                <div className="text-2xl font-bold text-indigo-600">{value}</div>
                <div className="text-xs text-slate-500 uppercase font-bold mt-1">{label}</div>
                <div className="text-[10px] text-slate-400">{unit}</div>
            </div>
        );

        return (
            <div className="card relative overflow-hidden bg-white mt-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="md:w-1/3">
                        <h2 className="text-xl font-bold text-slate-900 mb-2">🚀 Resource AI Forecaster</h2>
                        <p className="text-slate-500 text-sm mb-6">Simulate infrastructure needs based on projected student intake.</p>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Projected Students</label>
                            <div className="flex items-end gap-2 mt-2">
                                <span className="text-3xl font-black text-slate-900">{students}</span>
                                <span className="text-sm text-slate-500 mb-1">students</span>
                            </div>
                            <input
                                type="range" min="100" max="10000" step="100" value={students}
                                onChange={e => setStudents(Number(e.target.value))}
                                className="w-full mt-4 accent-indigo-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                    <div className="md:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ForecastCard label="Hostel Rooms" value={forecast.rooms} unit="Units" />
                        <ForecastCard label="Daily Water" value={forecast.water.toLocaleString()} unit="Liters" />
                        <ForecastCard label="Daily Food" value={forecast.food} unit="kg" />
                        <ForecastCard label="Library Seats" value={forecast.lib} unit="Seats" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} complaintsCount={complaints.filter(c => c.status === 'Pending').length} usersCount={pendingUsers.length} />

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto relative ml-64">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 px-8 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                            {activeTab === 'overview' && 'Dashboard Overview'}
                            {activeTab === 'analytics' && 'Analytics & Reports'}
                            {activeTab === 'operations' && 'Campus Operations'}
                            {activeTab === 'users' && 'User Management'}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-indigo-700">Live Monitoring</span>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
                            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
                            <Activity size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-8 pb-20 space-y-8">
                    {/* Image Modal */}
                    {viewImage && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setViewImage(null)}>
                            <button className="absolute top-4 right-4 text-white hover:text-rose-400 transition-colors"><XCircle size={32} /></button>
                            <img src={`http://localhost:5000/${viewImage}`} alt="Evidence" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()} />
                        </div>
                    )}

                    {/* TAB 1: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard title="Active Alerts" value={alerts.length} icon={AlertTriangle} color="rose" />
                                <StatCard title="Water Usage" value={`${stats.water} L`} icon={Droplets} color="blue" />
                                <StatCard title="Elec Usage" value={`${stats.elec} kWh`} icon={Zap} color="amber" />
                            </div>

                            <InsightsWidget />

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Analytics Summary Chart */}
                                <div className="lg:col-span-8 card bg-white">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                            <Activity size={20} className="text-indigo-600" /> Campus Overview
                                        </h3>
                                        <button onClick={() => setActiveTab('analytics')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center">
                                            View Detailed Analysis <TrendingUp size={14} className="ml-1" />
                                        </button>
                                    </div>
                                    <div className="h-80 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorAll" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                                                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                                <Area type="monotone" dataKey="Water" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAll)" strokeWidth={2} />
                                                <Area type="monotone" dataKey="Electricity" stroke="#f59e0b" fillOpacity={1} fill="url(#colorAll)" strokeWidth={2} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* AI Insights & Critical Alerts */}
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="card h-96 flex flex-col bg-white">
                                        <h3 className="text-lg font-bold mb-4 flex items-center text-teal-600">
                                            <Zap className="mr-2" size={20} /> AI Insights
                                        </h3>
                                        <div className="overflow-y-auto space-y-3 pr-2 scrollbar-hide flex-1">
                                            {alerts.filter(a => a.type.includes('AI') || a.severity === 'Low').map(a => (
                                                <div key={a._id} className="p-3 rounded-lg bg-teal-50 border border-teal-100">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-xs font-bold text-teal-600">OPTIMIZED</span>
                                                        <span className="text-[10px] text-slate-400">{new Date(a.timestamp).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-700">{a.message.split('Stats:')[0]}</p>
                                                </div>
                                            ))}
                                            {alerts.length === 0 && <p className="text-center text-slate-400 mt-10">Analysis in progress...</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <ForecasterSection />
                        </div>
                    )}

                    {/* TAB 2: ANALYTICS (Graph Analysis) */}
                    {activeTab === 'analytics' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            {/* Controls */}
                            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Activity size={20} className="text-indigo-600" /> Detailed Resource Analysis
                                </h3>
                                <div className="flex gap-3">
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg flex items-center px-3 py-1">
                                        <Calendar size={14} className="text-slate-500 mr-2" />
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="bg-transparent text-sm text-slate-700 outline-none w-32"
                                        />
                                    </div>
                                    <select
                                        className="bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 px-3 py-1 outline-none"
                                        value={selectedHostel}
                                        onChange={e => setSelectedHostel(e.target.value)}
                                    >
                                        <option value="">All Zones</option>
                                        {hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                                    </select>
                                    <button onClick={handleExport} className="btn text-xs px-3 py-1 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 bg-white">
                                        Export Report
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* GRAPH 1: WATER */}
                                <div className="card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600"><Droplets size={16} /></div>
                                            Water Consumption Analysis
                                        </h4>
                                        {comparison && <ComparisonPill label="Vs Yesterday" diff={comparison.waterDiff} />}
                                    </div>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorWaterOnly" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} unit=" L" />
                                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                <Area type="monotone" dataKey="Water" stroke="#3b82f6" fill="url(#colorWaterOnly)" strokeWidth={3} activeDot={{ r: 6 }} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* GRAPH 2: ELECTRICITY */}
                                <div className="card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600"><Zap size={16} /></div>
                                            Electricity Usage Trends
                                        </h4>
                                        {comparison && <ComparisonPill label="Vs Yesterday" diff={comparison.elecDiff} />}
                                    </div>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorElecOnly" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} unit=" kWh" />
                                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                <Area type="monotone" dataKey="Electricity" stroke="#f59e0b" fill="url(#colorElecOnly)" strokeWidth={3} activeDot={{ r: 6 }} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* GRAPH 3: FOOD WASTE */}
                                <div className="card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600"><PieIcon size={16} /></div>
                                            Food Waste Analysis
                                        </h4>
                                        {comparison && <ComparisonPill label="Vs Yesterday" diff={comparison.wasteDiff} />}
                                    </div>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorFoodOnly" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} unit=" kg" />
                                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                <Area type="monotone" dataKey="Food" stroke="#10b981" fill="url(#colorFoodOnly)" strokeWidth={3} activeDot={{ r: 6 }} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* CRITICAL LOSS ANALYSIS */}
                            <div className="card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="bg-rose-100 p-2 rounded-lg text-rose-600">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">Critical Loss / Leakage Zones</h3>
                                        <p className="text-xs text-slate-500">Areas exceeding 30% of expected baseline.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Hostel Zone */}
                                    <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                                        <div className="flex justify-between mb-3">
                                            <h4 className="font-bold text-slate-700 text-sm">Hostel Zones</h4>
                                            <span className="text-[10px] font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">High Leakage</span>
                                        </div>
                                        <div className="space-y-3">
                                            {hostels.slice(0, 3).map((h, i) => (
                                                <div key={h._id} className="relative pt-1">
                                                    <div className="flex mb-1 items-center justify-between">
                                                        <div>
                                                            <span className="text-xs font-semibold inline-block text-slate-600">
                                                                {h.name}
                                                            </span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xs font-semibold inline-block text-rose-600">
                                                                {35 - i * 5}% Loss
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-slate-200">
                                                        <div style={{ width: `${35 - i * 5}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-rose-500"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Academic Zone (Simulated) */}
                                    <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                                        <div className="flex justify-between mb-3">
                                            <h4 className="font-bold text-slate-700 text-sm">Academic Zones</h4>
                                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Optimal</span>
                                        </div>
                                        <div className="space-y-3">
                                            {['Main Block', 'Library', 'Labs'].map((name, i) => (
                                                <div key={name} className="relative pt-1">
                                                    <div className="flex mb-1 items-center justify-between">
                                                        <div>
                                                            <span className="text-xs font-semibold inline-block text-slate-600">
                                                                {name}
                                                            </span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xs font-semibold inline-block text-emerald-600">
                                                                {5 + i * 2}% Loss
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-slate-200">
                                                        <div style={{ width: `${5 + i * 2}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: OPERATIONS */}
                    {activeTab === 'operations' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* HOSTEL MANAGEMENT & ALERTS COLUMN */}
                            <div className="space-y-8">
                                {/* Smart Infrastructure (Hostel Mgmt) */}
                                <div className="card bg-white">
                                    <h3 className="text-lg font-bold mb-4 flex items-center text-slate-800">
                                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 mr-3">
                                            <LayoutDashboard size={20} />
                                        </div>
                                        Smart Infrastructure
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="New Hostel Name (e.g., BH-1)"
                                                className="input-field flex-1"
                                                id="newHostelInput"
                                            />
                                            <button
                                                onClick={async () => {
                                                    const input = document.getElementById('newHostelInput');
                                                    if (!input.value) return alert("Enter name");
                                                    try {
                                                        await API.post('/resources/hostels', { name: input.value });
                                                        input.value = '';
                                                        fetchInitialData();
                                                        alert("Hostel Added");
                                                    } catch (e) { alert("Failed"); }
                                                }}
                                                className="btn btn-primary whitespace-nowrap"
                                            >
                                                + Add Zone
                                            </button>
                                        </div>

                                        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                            {hostels.map(h => (
                                                <div key={h._id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:border-indigo-200 transition-colors">
                                                    <span className="font-medium text-slate-700">{h.name}</span>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm(`Delete ${h.name}?`)) {
                                                                try {
                                                                    await API.delete(`/resources/hostels/${h._id}`);
                                                                    fetchInitialData();
                                                                } catch (e) { alert("Failed to delete"); }
                                                            }
                                                        }}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Delete Zone"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Critical Alerts */}
                                <div className="card flex flex-col bg-white">
                                    <h3 className="text-lg font-bold mb-4 flex items-center text-rose-600">
                                        <AlertTriangle className="mr-2" size={20} /> Critical Alerts
                                    </h3>
                                    <div className="overflow-y-auto space-y-3 pr-2 scrollbar-hide flex-1 max-h-[300px]">
                                        {alerts.filter(a => a.severity === 'High').map(a => (
                                            <div key={a._id} className="p-3 rounded-lg bg-rose-50 border border-rose-100">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="font-bold text-rose-600 text-sm">{a.type}</span>
                                                    <span className="text-[10px] text-rose-400/80">{a.hostelId?.name}</span>
                                                </div>
                                                <p className="text-xs text-slate-600">{a.message}</p>
                                            </div>
                                        ))}
                                        {alerts.filter(a => a.severity === 'High').length === 0 && <p className="text-center text-slate-400 mt-10">System Nominal.</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Broadcast */}
                                <div className="card bg-white h-auto">
                                    <h3 className="text-lg font-bold mb-3 flex items-center text-slate-800">
                                        <Send className="mr-2 text-indigo-500" size={20} /> Broadcast
                                    </h3>
                                    <div className="space-y-3">
                                        <textarea
                                            className="input-field min-h-[80px]"
                                            placeholder="Type announcement..."
                                            value={message.content}
                                            onChange={e => setMessage({ ...message, content: e.target.value })}
                                        />
                                        <button onClick={sendMessage} className="btn btn-primary w-full py-2">Send Notification</button>
                                    </div>
                                </div>

                                {/* Recent Complaints */}
                                <div className="card h-[380px] flex flex-col bg-white">
                                    <h3 className="text-lg font-bold mb-4 flex items-center text-slate-800">
                                        <Clock className="mr-2 text-amber-500" size={20} /> Live Feed
                                    </h3>
                                    <div className="overflow-y-auto space-y-3 pr-2 flex-1">
                                        {complaints.map(c => (
                                            <div key={c._id} className={`p-3 rounded-lg border transition-all ${c.type === 'Emergency' ? 'bg-rose-50 border-rose-200 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${c.type === 'Emergency' ? 'bg-rose-600 text-white animate-pulse' : 'bg-white border border-slate-200 text-slate-600'}`}>{c.type}</span>
                                                    <span className="text-[10px] text-slate-400">{new Date(c.createdAt || Date.now()).toLocaleTimeString()}</span>
                                                </div>

                                                {/* Report Details */}
                                                <h4 className="font-bold text-sm text-slate-800 mt-1">{c.title}</h4>
                                                <p className="text-xs text-slate-600 line-clamp-1 mb-2">{c.description}</p>

                                                {/* Evidence Photo */}
                                                {c.imageUrl && (
                                                    <div className="mb-3">
                                                        <img
                                                            src={`http://localhost:5000/${c.imageUrl}`}
                                                            alt="Evidence"
                                                            className="h-16 w-16 object-cover rounded-lg border border-slate-200 cursor-pointer hover:scale-105 transition-transform"
                                                            onClick={() => setViewImage(c.imageUrl)}
                                                        />
                                                    </div>
                                                )}

                                                {/* Student Identity Badge */}
                                                <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded border border-slate-100 mb-2">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${c.studentId?.gender === 'Female' ? 'bg-pink-400' : 'bg-blue-400'}`}>
                                                        {c.studentId?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-700">{c.studentId?.name || 'Unknown Student'}</div>
                                                        <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                                            <span className="font-semibold">{c.studentId?.hostelId?.name || 'Academic'}</span>
                                                            {c.studentId?.roomNumber && <span>• Room {c.studentId.roomNumber}</span>}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end gap-2">
                                                    {c.status === 'Pending' && (
                                                        <>
                                                            {c.type === 'Emergency' ? (
                                                                <button
                                                                    onClick={() => handleAction(c._id, 'Approved')}
                                                                    className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded shadow-rose-200 hover:bg-rose-700 flex items-center"
                                                                >
                                                                    <Send size={12} className="mr-1" /> Broadcast
                                                                </button>
                                                            ) : (
                                                                <>
                                                                    <button onClick={() => handleAction(c._id, 'Approved')} className="p-1 rounded hover:bg-blue-50 text-blue-600" title="Approve for Staff"><Send size={14} /></button>
                                                                    <button onClick={() => handleAction(c._id, 'Resolved')} className="p-1 rounded hover:bg-emerald-50 text-emerald-600"><CheckCircle size={14} /></button>
                                                                </>
                                                            )}
                                                            <button onClick={() => handleAction(c._id, 'Rejected')} className="p-1 rounded hover:bg-rose-50 text-rose-600"><XCircle size={14} /></button>
                                                        </>
                                                    )}
                                                    {c.status === 'Approved' && (
                                                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 flex items-center">
                                                            <CheckCircle size={10} className="mr-1" /> {c.type === 'Emergency' ? 'Broadcasted to Staff' : 'Sent to Staff Dashboard'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 4: USER MANAGEMENT */}
                    {activeTab === 'users' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Pending Approvals */}
                            <div className="card flex flex-col bg-white">
                                <h3 className="text-lg font-bold mb-4 flex items-center text-slate-800">
                                    <Shield className="mr-2 text-indigo-500" size={20} />
                                    Pending Approvals
                                </h3>
                                <div className="overflow-y-auto space-y-3 pr-2 flex-1 max-h-[300px]">
                                    {pendingUsers.length === 0 ? <p className="text-slate-500 text-center py-4 bg-slate-50 rounded-lg">No pending approvals.</p> :
                                        pendingUsers.map(u => (
                                            <div key={u._id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex justify-between items-center">
                                                <div>
                                                    <div className="font-medium text-slate-800 text-sm">{u.name}</div>
                                                    <div className="text-xs text-slate-500">{u.email}</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleUserApproval(u._id, 'Approved', 'Student')} className="bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 text-slate-600 text-xs px-3 py-1.5 rounded transition-colors font-bold">Student</button>
                                                    <button onClick={() => handleUserApproval(u._id, 'Approved', 'Employee')} className="bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-xs px-3 py-1.5 rounded transition-colors font-bold">Staff</button>
                                                    <button onClick={() => handleUserApproval(u._id, 'Rejected')} className="px-2 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded transition-colors"><XCircle size={14} /></button>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>

                            {/* All Users Table */}
                            <div className="card overflow-hidden bg-white">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center">
                                        <Users className="mr-2 text-slate-500" size={20} /> User Directory
                                    </h3>
                                    <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                                        {['Student', 'Employee', 'Security'].map(role => (
                                            <button
                                                key={role}
                                                onClick={() => setUserTab(role)}
                                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${userTab === role ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="text-xs uppercase text-slate-500 border-b border-slate-200 bg-slate-50/50">
                                            <tr>
                                                <th className="px-4 py-3">User</th>
                                                <th className="px-4 py-3">Email</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3">Violations</th>
                                                <th className="px-4 py-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {allUsers.map(user => (
                                                <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-slate-800">{user.name}</td>
                                                    <td className="px-4 py-3 text-slate-500 text-sm">{user.email}</td>
                                                    <td className="px-4 py-3">
                                                        {user.isBlocked ?
                                                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-100">Suspended</span> :
                                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">Active</span>}
                                                    </td>
                                                    <td className="px-4 py-3 text-slate-600 text-sm">{user.violationCount}</td>
                                                    <td className="px-4 py-3 text-right space-x-2">
                                                        <button onClick={() => handleUserAccess(user._id, 'warn')} className="text-amber-500 hover:text-amber-600 p-1 hover:bg-amber-50 rounded" title="Warn"><AlertTriangle size={16} /></button>
                                                        {!user.isBlocked ? (
                                                            <button onClick={() => handleUserAccess(user._id, 'block_temp')} className="text-rose-500 hover:text-rose-600 p-1 hover:bg-rose-50 rounded" title="Suspend"><UserMinus size={16} /></button>
                                                        ) : (
                                                            <button onClick={() => handleUserAccess(user._id, 'unblock')} className="text-emerald-500 hover:text-emerald-600 p-1 hover:bg-emerald-50 rounded" title="Activate"><UserCheck size={16} /></button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
