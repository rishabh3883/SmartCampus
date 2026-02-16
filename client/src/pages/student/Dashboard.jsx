import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import ChatbotWidget from '../../components/ChatbotWidget';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, FileText, BookOpen, Calendar, Settings, LogOut,
    Menu, Bell, User, ChevronRight, Camera, XCircle, CheckCircle,
    Clock, Plus, Flame, Trophy, AlertTriangle, MapPin, Search
} from 'lucide-react';
import StudentEvents from './StudentEvents';
import StudentLibrary from './StudentLibrary';

const StudentDashboard = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [complaints, setComplaints] = useState([]);
    const [library, setLibrary] = useState({ totalSeats: 100, occupiedSeats: 0 });

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newComplaint, setNewComplaint] = useState({ type: 'Leakage', title: '', description: '', image: null });

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchLibrary, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [compRes, libRes] = await Promise.all([
                API.get('/complaints'),
                API.get('/library')
            ]);
            setComplaints(compRes.data);
            setLibrary(libRes.data);
        } catch (err) { console.error(err); }
    };

    const fetchLibrary = async () => {
        try {
            const { data } = await API.get('/library');
            setLibrary(data);
        } catch (err) { console.error(err); }
    };

    const handleLogoutClick = () => {
        handleLogout();
        navigate('/login');
    };

    // --- Components ---

    const SidebarItem = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
        >
            <Icon size={20} />
            <span className={`${!isSidebarOpen && 'hidden md:hidden lg:inline'}`}>{label}</span>
        </button>
    );

    const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
        <div className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group`}>
            <div className={`p-3 rounded-xl ${color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="text-2xl font-black text-slate-800 leading-none">{value}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">{label}</p>
                {subtext && <p className="text-[10px] text-slate-400 mt-0.5">{subtext}</p>}
            </div>
        </div>
    );

    // --- Action Handlers ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('type', newComplaint.type);
        formData.append('title', newComplaint.title);
        formData.append('description', newComplaint.description);
        if (newComplaint.image) formData.append('image', newComplaint.image);

        try {
            await API.post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setNewComplaint({ type: 'Leakage', title: '', description: '', image: null });
            setShowForm(false);
            fetchData();
            alert("Complaint Logged Successfully!");
        } catch (err) { alert('Failed to submit complaint'); }
        finally { setLoading(false); }
    };

    const handleEmergency = async () => {
        if (!window.confirm("⚠️ CONFIRM EMERGENCY ALARM?")) return;
        try {
            const formData = new FormData();
            formData.append('type', 'Emergency');
            formData.append('title', 'SECURITY ALERT');
            formData.append('description', 'Emergency assistance required immediately!');
            await API.post('/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert('🚨 ALARM SENT! Staff notified.');
            fetchData();
        } catch (err) { alert('Alarm Failed'); }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-slate-200 fixed lg:static inset-y-0 left-0 z-40 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 flex flex-col`}>
                <div className="h-20 flex items-center px-6 border-b border-slate-100">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold mr-3 shadow-indigo-200 shadow-lg">S</div>
                    <span className="text-xl font-bold text-slate-800">SmartCampus</span>
                </div>

                <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <div className="text-xs font-bold text-slate-400 uppercase px-4 mb-2">Menu</div>
                    <SidebarItem id="home" label="Home" icon={LayoutDashboard} />
                    <SidebarItem id="complaints" label="My Complaints" icon={FileText} />
                    <SidebarItem id="library" label="Library" icon={BookOpen} />
                    <SidebarItem id="events" label="Events" icon={Calendar} />

                    <div className="mt-8 text-xs font-bold text-slate-400 uppercase px-4 mb-2">Account</div>
                    <SidebarItem id="profile" label="Profile" icon={User} />
                    <SidebarItem id="settings" label="Settings" icon={Settings} />
                </div>

                <div className="p-4 border-t border-slate-100">
                    <button onClick={handleLogoutClick} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 font-medium transition-colors">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Topbar */}
                <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h1>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Search Bar (Hidden on Mobile) */}
                        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all">
                            <Search size={16} className="text-slate-400 mr-2" />
                            <input type="text" placeholder="Search..." className="bg-transparent text-sm w-full outline-none text-slate-700 placeholder:text-slate-400" />
                        </div>

                        <button className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-bold text-slate-800">{user?.name}</div>
                                <div className="text-xs text-slate-500">{user?.role}</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard View */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto">

                    {activeTab === 'home' && (
                        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                            {/* Welcome Banner */}
                            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <div className="relative z-10 max-w-2xl">
                                    <h2 className="text-3xl font-bold mb-2">Hello, {user?.name}! 👋</h2>
                                    <p className="text-indigo-100 mb-6 text-lg">Your campus dashboard is ready. You have <span className="font-bold text-white underline decoration-wavy underline-offset-4">{complaints.filter(c => c.status !== 'Resolved').length} active</span> tasks requiring attention.</p>
                                    <button onClick={() => setShowForm(true)} className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                        <Plus size={20} /> Raise Complaint
                                    </button>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard icon={Flame} label="Daily Streak" value={user?.contributionStreak || 0} color="bg-amber-500" subtext="In a row" />
                                <StatCard icon={Trophy} label="Total Badges" value={user?.badges?.length || 0} color="bg-violet-500" subtext="Earned" />
                                <StatCard icon={CheckCircle} label="Solved Issues" value={complaints.filter(c => c.status === 'Resolved').length} color="bg-emerald-500" subtext="All time" />
                                <StatCard icon={AlertTriangle} label="Pending" value={complaints.filter(c => c.status !== 'Resolved').length} color="bg-rose-500" subtext="Active Issues" />
                            </div>

                            {/* Achievements Section */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <Trophy size={18} className="text-amber-500" /> My Achievements ({user?.badges?.length || 0})
                                </h3>
                                <div className="flex flex-wrap gap-4">
                                    {user?.badges && user.badges.length > 0 ? (
                                        user.badges.map((badge, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-amber-700 shadow-sm">
                                                    <Trophy size={16} />
                                                </div>
                                                <span className="font-bold text-slate-700 text-sm">{badge}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="w-full text-center text-slate-400 py-4 italic">No badges yet. Solve issues to earn them!</div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Recent Activity */}
                                <div className="lg:col-span-2 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Clock size={18} /> Recent Activity</h3>
                                        <button onClick={() => setActiveTab('complaints')} className="text-sm font-bold text-indigo-600 hover:underline">View All</button>
                                    </div>

                                    {complaints.length === 0 ? (
                                        <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-300">
                                            <p className="text-slate-500">No activity yet. Things look quiet!</p>
                                        </div>
                                    ) : (
                                        complaints.slice(0, 3).map(c => (
                                            <div key={c._id} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                                <div className={`p-3 rounded-full ${c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                                    {c.status === 'Resolved' ? <CheckCircle size={20} /> : <Clock size={20} />}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-800 text-sm">{c.title}</h4>
                                                    <p className="text-xs text-slate-500 line-clamp-1">{c.description}</p>
                                                </div>
                                                <span className="text-xs font-bold px-2 py-1 bg-slate-50 text-slate-500 rounded border border-slate-200">{c.status}</span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Library Quick View */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><BookOpen size={18} /> Library Status</h3>
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-colors cursor-pointer" onClick={() => setActiveTab('library')}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
                                        <div className="relative z-10">
                                            <p className="text-sm font-medium text-slate-500 mb-1">Seats Available</p>
                                            <div className="flex items-end gap-2 mb-3">
                                                <span className="text-5xl font-black text-emerald-600">{library.totalSeats - library.occupiedSeats}</span>
                                                <span className="text-lg font-bold text-slate-400 mb-1">/ {library.totalSeats}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(library.occupiedSeats / library.totalSeats) * 100}%` }}></div>
                                            </div>
                                            <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Live Updates
                                            </p>
                                        </div>
                                    </div>

                                    <button onClick={handleEmergency} className="w-full py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold border border-rose-200 flex items-center justify-center gap-2 transition-colors">
                                        <AlertTriangle size={20} /> Emergency SOS
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'complaints' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-0 z-20">
                                <h2 className="text-xl font-bold text-slate-800">My Complaints</h2>
                                <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-indigo-200 shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                    <Plus size={18} /> New Report
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {complaints.map(c => (
                                    <div key={c._id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-md transition-all group">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${c.type === 'Emergency' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>{c.type}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                                                c.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {c.status === 'Resolved' ? <CheckCircle size={10} /> : <Clock size={10} />}
                                                {c.status}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 mb-1">{c.title}</h3>
                                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{c.description}</p>
                                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                                            <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                            {c.adminComment && <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded">Admin Replied</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}



                    {activeTab === 'library' && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <StudentLibrary isEmbedded={true} />
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <StudentEvents isEmbedded={true} />
                        </div>
                    )}

                    {/* Placeholder Views for Profile/Settings */}
                    {['profile', 'settings'].includes(activeTab) && (
                        <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400 animate-in fade-in duration-500">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                {activeTab === 'profile' && <User size={32} />}
                                {activeTab === 'settings' && <Settings size={32} />}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-600 capitalize">{activeTab}</h2>
                            <p>This module is coming soon...</p>
                            <button onClick={() => setActiveTab('home')} className="mt-4 text-indigo-600 font-bold hover:underline">Return Home</button>
                        </div>
                    )}
                </main>
            </div >

            {/* Modal Form */}
            {
                showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2"><Camera size={20} /> Report Issue</h3>
                                <button onClick={() => setShowForm(false)} className="text-white/80 hover:text-white"><XCircle size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Issue Type</label>
                                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={newComplaint.type} onChange={e => setNewComplaint({ ...newComplaint, type: e.target.value })}>
                                        <option>Leakage</option><option>Electricity</option><option>Cleanliness</option><option>WiFi / Network</option><option>Furniture</option><option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                                    <input type="text" placeholder="e.g. Room 302, BH-1" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={newComplaint.title} onChange={e => setNewComplaint({ ...newComplaint, title: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                                    <textarea placeholder="Describe the problem..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                                        value={newComplaint.description} onChange={e => setNewComplaint({ ...newComplaint, description: e.target.value })}></textarea>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Attach Photo (Optional)</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
                                            onChange={(e) => setNewComplaint({ ...newComplaint, image: e.target.files[0] })}
                                        />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-70">
                                        {loading ? 'Submitting...' : 'Submit Report'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            <ChatbotWidget />
        </div >
    );
};

export default StudentDashboard;
