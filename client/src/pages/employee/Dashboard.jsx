import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import {
    LayoutDashboard,
    ClipboardList,
    History,
    Newspaper,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    User,
    ChevronRight,
    Home,
    Droplets,
    Zap,
    Trash2,
    UploadCloud,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Play,
    Megaphone,
    ArrowRight,
    Users,
    GraduationCap,
    ChefHat,
    HeartHandshake
} from 'lucide-react';

// --- Sub-Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 group relative ${active
            ? 'text-white bg-indigo-600 shadow-md shadow-indigo-200'
            : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
            } ${collapsed ? 'justify-center' : ''}`}
    >
        <Icon size={20} className={`${active ? 'text-white' : 'group-hover:text-indigo-600'} transition-colors`} />
        {!collapsed && <span className="font-medium text-sm">{label}</span>}
        {collapsed && active && (
            <div className="absolute left-14 bg-indigo-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                {label}
            </div>
        )}
    </button>
);

const StatCard = ({ title, value, icon: Icon, color, subValue }) => {
    const colorClasses = {
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100"
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h3>
                    <div className="text-3xl font-black text-slate-800">{value}</div>
                </div>
                <div className={`p-3 rounded-xl border ${colorClasses[color]} group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
            </div>
            {subValue && <div className="text-xs text-slate-400 font-medium">{subValue}</div>}
        </div>
    );
};

// --- Main Dashboard Component ---

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ totalStudents: 0, hostelers: 0, dayScholars: 0 });
    const [taskCount, setTaskCount] = useState(0);

    // Data States
    const [hostels, setHostels] = useState([]);
    const [dailyLogs, setDailyLogs] = useState({});
    const [submittingLog, setSubmittingLog] = useState(false);
    const [recentLogs, setRecentLogs] = useState([]);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // News State
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetchData();
        fetchHostels();
        fetchRecentLogs();
        fetchNews();
        fetchStats();
    }, []);

    const fetchData = async () => API.get('/auth/me').then(res => setUser(res.data)).catch(console.error);
    const fetchStats = async () => API.get('/resources/stats').then(res => setStats(res.data)).catch(console.error);
    const fetchNews = async () => API.get('/environment/tasks?role=Employee').then(res => setNews(res.data)).catch(console.error);

    const fetchHostels = async () => {
        try {
            const { data } = await API.get('/resources/hostels');
            setHostels(data);
            const initialLogs = {};
            data.forEach(h => { initialLogs[h._id] = { water: '', electricity: '', foodWaste: '' }; });
            setDailyLogs(initialLogs);
        } catch (err) { console.error(err); }
    };

    const fetchRecentLogs = async () => API.get('/resources/my-logs').then(res => setRecentLogs(res.data)).catch(console.error);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}>
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-center border-b border-slate-100">
                    <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        {sidebarOpen && <span className="tracking-tight text-slate-900">Staff<span className="text-indigo-600">Portal</span></span>}
                    </div>
                </div>

                {/* Nav Items */}
                <div className="flex-1 py-6 space-y-2 px-2 overflow-y-auto">
                    <SidebarItem icon={LayoutDashboard} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} collapsed={!sidebarOpen} />
                    <SidebarItem icon={ClipboardList} label="Daily Logs" active={activeTab === 'logging'} onClick={() => setActiveTab('logging')} collapsed={!sidebarOpen} />
                    <SidebarItem icon={ChefHat} label="Food Control" active={activeTab === 'food'} onClick={() => setActiveTab('food')} collapsed={!sidebarOpen} />
                    <SidebarItem icon={History} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} collapsed={!sidebarOpen} />
                    <SidebarItem icon={Newspaper} label="Campus News" active={activeTab === 'news'} onClick={() => setActiveTab('news')} collapsed={!sidebarOpen} />
                </div>

                {/* Profile & Logout */}
                <div className="border-t border-slate-100 p-4">
                    <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors ${!sidebarOpen ? 'justify-center' : ''}`}>
                        <LogOut size={20} />
                        {sidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Topbar */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                            <Menu size={20} />
                        </button>
                        <h2 className="font-bold text-slate-800 text-lg hidden md:block">
                            {activeTab === 'overview' ? 'Dashboard Overview' :
                                activeTab === 'logging' ? 'Daily Resource Log' :
                                    activeTab === 'food' ? 'Food Safety & Donation' :
                                        activeTab === 'history' ? 'Submission History' : 'Campus InfraNews'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200 focus-within:ring-2 ring-indigo-100 transition-all w-64">
                            <Search size={16} className="text-slate-400 mr-2" />
                            <input type="text" placeholder="Search..." className="bg-transparent text-sm w-full outline-none text-slate-700 placeholder:text-slate-400" />
                        </div>
                        <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-bold text-slate-800">{user?.name || 'Staff Member'}</div>
                                <div className="text-xs text-slate-500 font-medium">{user?.role || 'Employee'}</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold shadow-sm">
                                {user?.name?.charAt(0) || 'S'}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* --- VIEW: OVERVIEW --- */}
                    {activeTab === 'overview' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="indigo" subValue="Campus Population" />
                                <StatCard title="Hostelers" value={stats.hostelers} icon={Home} color="emerald" subValue="In-Residence" />
                                <StatCard title="Day Scholars" value={stats.dayScholars} icon={GraduationCap} color="blue" subValue="Commuters" />
                                <StatCard title="Active Tasks" value={taskCount} icon={AlertTriangle} color="rose" subValue="Action Required" />
                            </div>

                            <ActionableTasks onCountChange={setTaskCount} />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="card bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                            <Newspaper size={18} className="text-indigo-500" /> Latest Bulletins
                                        </h3>
                                        <button onClick={() => setActiveTab('news')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center">
                                            View All <ChevronRight size={14} />
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {news.slice(0, 3).map(n => (
                                            <div key={n._id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${n.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                                                        }`}>{n.priority}</span>
                                                    <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <h4 className="font-bold text-slate-800 text-sm mt-2">{n.title}</h4>
                                            </div>
                                        ))}
                                        {news.length === 0 && <p className="text-center text-slate-400 text-sm py-4">No recent bulletins.</p>}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* --- VIEW: LOGGING --- */}
                    {activeTab === 'logging' && (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                            <ClipboardList className="text-indigo-600" /> Daily Resource Log
                                        </h2>
                                        <p className="text-slate-500 mt-1">Record consumption metrics for all hostels.</p>
                                    </div>
                                    <div className="bg-slate-50 p-1 rounded-lg border border-slate-200 flex items-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase px-3">Date:</span>
                                        <input type="date" id="log-date-picker" defaultValue={new Date().toISOString().split('T')[0]} className="bg-white border text-sm border-slate-200 rounded px-2 py-1 outline-none text-slate-700" />
                                    </div>
                                </div>

                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    setSubmittingLog(true);
                                    const selectedDate = document.getElementById('log-date-picker').value;
                                    const logsPayload = hostels.map(h => ({
                                        hostelId: h._id,
                                        date: selectedDate,
                                        ...dailyLogs[h._id]
                                    })).filter(l => l.water || l.electricity || l.foodWaste);

                                    API.post('/resources/daily-log', { logs: logsPayload })
                                        .then(({ data }) => {
                                            alert(data.insights?.length ? "🔍 Analysis:\n" + data.insights.join("\n") : "Logs saved successfully!");
                                            setDailyLogs(prev => {
                                                const reset = { ...prev };
                                                Object.keys(reset).forEach(k => reset[k] = { water: '', electricity: '', foodWaste: '' });
                                                return reset;
                                            });
                                            fetchRecentLogs();
                                        })
                                        .catch(err => alert('Failed: ' + (err.response?.data?.message || err.message)))
                                        .finally(() => setSubmittingLog(false));
                                }} className="space-y-6">

                                    <div className="grid grid-cols-1 gap-6">
                                        {hostels.map(hostel => (
                                            <div key={hostel._id} className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                                                        <Home size={16} />
                                                    </div>
                                                    <h3 className="font-bold text-slate-800">{hostel.name}</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Water (L)</label>
                                                        <input type="number" placeholder="0" className="w-full p-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                            value={dailyLogs[hostel._id]?.water || ''}
                                                            onChange={e => setDailyLogs(prev => ({ ...prev, [hostel._id]: { ...prev[hostel._id], water: e.target.value } }))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Electricity (kWh)</label>
                                                        <input type="number" placeholder="0" className="w-full p-2 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
                                                            value={dailyLogs[hostel._id]?.electricity || ''}
                                                            onChange={e => setDailyLogs(prev => ({ ...prev, [hostel._id]: { ...prev[hostel._id], electricity: e.target.value } }))}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Waste (kg)</label>
                                                        <input type="number" placeholder="0" className="w-full p-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
                                                            value={dailyLogs[hostel._id]?.foodWaste || ''}
                                                            onChange={e => setDailyLogs(prev => ({ ...prev, [hostel._id]: { ...prev[hostel._id], foodWaste: e.target.value } }))}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button type="submit" disabled={submittingLog} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70 flex items-center gap-2">
                                            {submittingLog ? <span className="animate-spin">⏳</span> : <CheckCircle size={20} />}
                                            {submittingLog ? 'Processing...' : 'Submit Daily Logs'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* --- VIEW: HISTORY --- */}
                    {activeTab === 'history' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Bulk Upload */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                                <h2 className="text-2xl font-bold mb-2 relative z-10 flex items-center gap-2">
                                    <UploadCloud size={24} /> Bulk Data Upload
                                </h2>
                                <p className="text-indigo-100 mb-8 relative z-10 opacity-90">Upload Excel sheets for historical data entry.</p>

                                <div className="bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:bg-white/20 transition-all cursor-pointer relative group">
                                    <input type="file" accept=".xlsx,.xls" onChange={e => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                                    <FileText size={48} className="mx-auto mb-4 text-indigo-200 group-hover:scale-110 transition-transform" />
                                    <p className="font-bold text-lg">{file ? file.name : 'Drop Excel File Here'}</p>
                                    <p className="text-sm text-indigo-200 mt-1">or click to browse</p>
                                </div>

                                <button onClick={() => {
                                    if (!file) return;
                                    setUploading(true);
                                    const formData = new FormData();
                                    formData.append('file', file);
                                    API.post('/resources/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
                                        .then(() => { alert("Upload success!"); setFile(null); fetchRecentLogs(); })
                                        .catch(err => alert('Upload failed: ' + err.message))
                                        .finally(() => setUploading(false));
                                }} disabled={!file || uploading} className="mt-6 w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50">
                                    {uploading ? 'Uploading...' : 'Start Upload'}
                                </button>
                            </div>

                            {/* Recent Logs List */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px]">
                                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <History className="text-slate-400" /> Recent Submissions
                                    </h3>
                                    <button onClick={fetchRecentLogs} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg"><History size={18} /></button>
                                </div>
                                <div className="overflow-y-auto p-4 space-y-3 flex-1">
                                    {recentLogs.map(log => (
                                        <div key={log._id} className="p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-sm transition-all bg-slate-50/50">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="font-bold text-slate-700">{log.hostelId?.name}</div>
                                                <div className="text-xs text-slate-400">{new Date(log.date).toLocaleDateString()}</div>
                                            </div>
                                            <div className="flex gap-4 text-xs font-mono text-slate-500">
                                                <span className="flex items-center gap-1"><Droplets size={12} className="text-blue-500" /> {log.water}L</span>
                                                <span className="flex items-center gap-1"><Zap size={12} className="text-amber-500" /> {log.electricity}kWh</span>
                                            </div>
                                        </div>
                                    ))}
                                    {recentLogs.length === 0 && <p className="text-center text-slate-400 py-10">No logs found.</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- VIEW: FOOD CONTROL --- */}
                    {activeTab === 'food' && (
                        <FoodManagement user={user} hostels={hostels} />
                    )}

                    {/* --- VIEW: NEWS --- */}
                    {activeTab === 'news' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-slate-800">Operational Bulletins</h2>
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">{news.length} Active</span>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {news.map(item => (
                                    <div key={item._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="hidden md:flex flex-col items-center justify-center w-24 bg-slate-50 rounded-xl border border-slate-100 p-2 text-center">
                                                <span className="text-xs font-bold text-slate-400 uppercase">Priority</span>
                                                <span className={`text-lg font-black ${item.priority === 'High' ? 'text-rose-600' : 'text-indigo-600'
                                                    }`}>{item.priority}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="md:hidden text-xs font-bold bg-slate-100 px-2 py-1 rounded mb-2 inline-block">{item.priority}</span>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {new Date(item.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{item.title}</h3>
                                                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{item.description}</p>
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm("Mark as complete?")) {
                                                                API.put(`/environment/tasks/${item._id}`, { status: 'Completed' })
                                                                    .then(() => fetchNews())
                                                                    .catch(err => alert("Update failed"));
                                                            }
                                                        }}
                                                        className="text-sm font-bold text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-emerald-100"
                                                    >
                                                        <CheckCircle size={16} /> Mark Complete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {news.length === 0 && (
                                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                                        <CheckCircle size={48} className="mx-auto text-emerald-200 mb-4" />
                                        <p className="text-slate-500 font-medium">All caught up! No active bulletins.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

// --- Sub-Component: Actionable Tasks ---
const ActionableTasks = ({ onCountChange }) => {
    const [tasks, setTasks] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        API.get('/auth/me').then(res => setUserId(res.data._id)).catch(console.error);
        fetchTasks();
        const interval = setInterval(fetchTasks, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await API.get('/complaints');
            const urgent = data.filter(c => c.status === 'Approved' || c.status === 'On The Way');
            setTasks(urgent);
            if (onCountChange) onCountChange(urgent.length);
        } catch (err) { console.error(err); }
    };

    if (tasks.length === 0) return null;

    return (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 relative overflow-hidden ring-4 ring-indigo-100/50 animate-pulse-slow">
            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="bg-indigo-600 text-white p-2 rounded-lg animate-bounce">
                    <ClipboardList size={24} />
                </div>
                <h2 className="text-xl font-bold text-indigo-700">Assigned Actions & Requests</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {tasks.map(task => {
                    const isAssignedToMe = task.assignedTo === userId || (task.assignedTo?._id === userId);
                    const isUnassigned = task.status === 'Approved';

                    if (!isUnassigned && !isAssignedToMe) return null;

                    return (
                        <div key={task._id} className="bg-white p-4 rounded-xl border-l-4 border-rose-500 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-1">{task.title}</h3>
                            <p className="text-xs text-slate-500 mb-3">{task.description}</p>
                            <div className="flex justify-between items-center">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded ${task.type === 'Emergency' ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-indigo-100 text-indigo-700'}`}>{task.type === 'Emergency' ? 'URGENT' : 'ASSIGNED'}</span>
                                {isUnassigned && (
                                    <button onClick={() => API.post(`/complaints/${task._id}/assign`).then(() => { alert("Accepted!"); fetchTasks(); })} className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-rose-700 transition-colors">
                                        ACCEPT
                                    </button>
                                )}
                                {task.status === 'On The Way' && isAssignedToMe && (
                                    <button onClick={() => {
                                        if (window.confirm("Mark resolved?")) API.put(`/complaints/${task._id}/status`, { status: 'Resolved' }).then(() => { alert("Resolved!"); fetchTasks(); });
                                    }} className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-emerald-700 transition-colors">
                                        MARK RESOLVED
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Sub-Component: Food Management ---
const FoodManagement = ({ user, hostels }) => {
    const [foodLogs, setFoodLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        hostelId: '',
        date: new Date().toISOString().split('T')[0],
        mealType: 'Lunch',
        prepared: '',
        served: '',
        cookedAt: '',
        storedAt: '',
        edibility: 'Edible',
        itemName: ''
    });

    useEffect(() => {
        fetchFoodLogs();
    }, []);

    const fetchFoodLogs = async () => {
        try {
            const { data } = await API.get('/food');
            setFoodLogs(data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                hostelId: formData.hostelId,
                date: formData.date,
                mealType: formData.mealType,
                items: [{ name: formData.itemName || 'Meal Items', quantity: formData.prepared }],
                quantities: { prepared: formData.prepared, served: formData.served },
                timings: {
                    cookedAt: `${formData.date}T${formData.cookedAt}:00`,
                    storedAt: `${formData.date}T${formData.storedAt}:00`
                },
                edibility: formData.edibility
            };

            await API.post('/food', payload);
            alert("Food log submitted and analyzed!");
            setFormData({ ...formData, prepared: '', served: '', itemName: '', cookedAt: '', storedAt: '' });
            fetchFoodLogs();
        } catch (err) {
            alert("Error: " + (err.response?.data?.message || err.message));
        } finally { setLoading(false); }
    };

    const handleAction = async (id, action) => {
        try {
            await API.put(`/food/${id}/action`, { action });
            alert(`Marked as ${action}`);
            fetchFoodLogs();
        } catch (err) {
            alert(err.response?.data?.message || "Action failed");
        }
    };

    // Real-time Safety Check for UI
    const getSafetyStatus = () => {
        if (!formData.cookedAt || !formData.storedAt) return null;
        const [cHours, cMins] = formData.cookedAt.split(':');
        const [sHours, sMins] = formData.storedAt.split(':');
        const cooked = new Date(0, 0, 0, cHours, cMins);
        const stored = new Date(0, 0, 0, sHours, sMins);
        const diffHours = (stored - cooked) / (1000 * 60 * 60);
        return diffHours > 4 ? 'Unsafe' : 'Safe';
    };

    const safety = getSafetyStatus();

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <ChefHat className="text-indigo-600" /> New Food Safety Log
                            </h3>
                            {safety && (
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${safety === 'Safe' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                    }`}>
                                    {safety === 'Safe' ? '✓ SAFETY VALIDATED' : '⚠ SAFETY VIOLATION'}
                                </span>
                            )}
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Hostel / Zone</label>
                                    <select
                                        className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 ring-indigo-100 transition-all text-sm"
                                        value={formData.hostelId}
                                        onChange={e => setFormData({ ...formData, hostelId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Hostel</option>
                                        {hostels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Meal Type</label>
                                    <div className="flex bg-slate-100 p-1 rounded-xl">
                                        {['Breakfast', 'Lunch', 'Dinner'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, mealType: type })}
                                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${formData.mealType === type ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Cooking Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="time"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 ring-indigo-100 text-sm"
                                            value={formData.cookedAt}
                                            onChange={e => setFormData({ ...formData, cookedAt: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Storage Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="time"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 ring-indigo-100 text-sm"
                                            value={formData.storedAt}
                                            onChange={e => setFormData({ ...formData, storedAt: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Prepared Quantity (kg)</label>
                                    <input
                                        type="number"
                                        placeholder="0.0"
                                        step="0.1"
                                        className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 ring-indigo-100 text-sm"
                                        value={formData.prepared}
                                        onChange={e => setFormData({ ...formData, prepared: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Served Quantity (kg)</label>
                                    <input
                                        type="number"
                                        placeholder="0.0"
                                        step="0.1"
                                        className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 ring-indigo-100 text-sm"
                                        value={formData.served}
                                        onChange={e => setFormData({ ...formData, served: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-xl flex items-center justify-between border-2 border-dashed border-slate-200">
                                <span className="text-sm font-bold text-slate-600">Leftover: {(formData.prepared - formData.served).toFixed(1)} kg</span>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="radio" checked={formData.edibility === 'Edible'} onChange={() => setFormData({ ...formData, edibility: 'Edible' })} className="hidden" />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.edibility === 'Edible' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`}>
                                            {formData.edibility === 'Edible' && <CheckCircle size={12} className="text-white" />}
                                        </div>
                                        <span className={`text-xs font-bold ${formData.edibility === 'Edible' ? 'text-emerald-600' : 'text-slate-400'}`}>Edible</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="radio" checked={formData.edibility === 'Non-Edible'} onChange={() => setFormData({ ...formData, edibility: 'Non-Edible' })} className="hidden" />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.edibility === 'Non-Edible' ? 'border-rose-500 bg-rose-500' : 'border-slate-300'}`}>
                                            {formData.edibility === 'Non-Edible' && <XCircle size={12} className="text-white" />}
                                        </div>
                                        <span className={`text-xs font-bold ${formData.edibility === 'Non-Edible' ? 'text-rose-600' : 'text-slate-400'}`}>Non-Edible</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? 'Analyzing...' : <>Submit Log & Validate Safety</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Status Column */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                        <HeartHandshake className="mb-4 opacity-50" size={32} />
                        <h4 className="text-xl font-bold mb-2">Impact Goal</h4>
                        <p className="text-indigo-100 text-sm leading-relaxed">Your data helps us feed local communities and reduce campus carbon footprint. Always ensure food is stored within 4 hours to qualify for donation.</p>
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span>Weekly Target</span>
                                <span>65% Saved</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 w-[65%] shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6">
                        <h4 className="font-bold text-slate-800 text-sm mb-4">Donation Status Legend</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-xs">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-slate-600 font-medium">Safe & Edible (Eligible for NGO)</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                <span className="text-slate-600 font-medium">Safety Violation (Compost Only)</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                <span className="text-slate-600 font-medium">Pending NGO Pickup</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <History className="text-slate-400" /> Recent Actions & NGO Updates
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                                <th className="px-6 py-4">Meal / Date</th>
                                <th className="px-6 py-4">Leftover</th>
                                <th className="px-6 py-4">Safety</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {foodLogs.map(log => (
                                <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-800">{log.mealType}</div>
                                        <div className="text-[10px] text-slate-400 font-medium">{new Date(log.date).toLocaleDateString()} • {log.hostelId?.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-700">{log.quantities.leftover}kg</div>
                                        <div className="text-[10px] text-slate-400">{log.edibility}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${log.safetyStatus === 'Safe' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                            {log.safetyStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${log.action === 'Donated' ? 'bg-indigo-100 text-indigo-600' :
                                            log.action === 'Composted' ? 'bg-emerald-100 text-emerald-600' :
                                                log.action === 'Discarded' ? 'bg-slate-100 text-slate-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {log.action === 'Pending' && (
                                                <>
                                                    {log.safetyStatus === 'Safe' && log.edibility === 'Edible' ? (
                                                        <button onClick={() => handleAction(log._id, 'Donated')} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-100" title="Request Donation">
                                                            <HeartHandshake size={16} />
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleAction(log._id, 'Composted')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-100" title="Compost">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleAction(log._id, 'Discarded')} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100" title="Discard">
                                                        <XCircle size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {foodLogs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 text-sm">No food safety records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
