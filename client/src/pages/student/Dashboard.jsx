import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import ChatbotWidget from '../../components/ChatbotWidget';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import socket from '../../services/socket';
import {
    LayoutDashboard, FileText, BookOpen, Calendar, Settings, LogOut,
    Menu, Bell, User, ChevronRight, Camera, XCircle, CheckCircle,
    Clock, Plus, Flame, Trophy, AlertTriangle, MapPin, Search,
    MessageSquare, Users, Megaphone, Radio, ShieldCheck, Tag
} from 'lucide-react';
import StudentEvents from './StudentEvents';
import StudentLibrary from './StudentLibrary';
import SocialFeed from './SocialFeed';
import ChatApp from './ChatApp';
import ProjectVideoPlayer from '../../components/ProjectVideoPlayer';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { RoleBadge } from '../../components/ui/Badge';

const StudentDashboard = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [complaints, setComplaints] = useState([]);
    const [library, setLibrary] = useState({ totalSeats: 100, occupiedSeats: 0 });
    const [broadcasts, setBroadcasts] = useState([]);
    const [broadcastSearch, setBroadcastSearch] = useState('');
    const [broadcastFilter, setBroadcastFilter] = useState('All');

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newComplaint, setNewComplaint] = useState({ type: 'Leakage', title: '', description: '', image: null });

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchLibrary();
            fetchBroadcasts();
        }, 15000);

        const handleNewBroadcast = (newMsg) => {
            setBroadcasts(prev => [newMsg, ...prev.filter(m => m._id !== newMsg._id)]);
        };

        const handleUpdateBroadcast = (updatedMsg) => {
            setBroadcasts(prev => prev.map(m => m._id === updatedMsg._id ? updatedMsg : m));
        };

        const handleDeleteBroadcast = ({ id }) => {
            setBroadcasts(prev => prev.filter(m => m._id !== id));
        };

        socket.on('new-broadcast', handleNewBroadcast);
        socket.on('update-broadcast', handleUpdateBroadcast);
        socket.on('delete-broadcast', handleDeleteBroadcast);

        return () => {
            clearInterval(interval);
            socket.off('new-broadcast', handleNewBroadcast);
            socket.off('update-broadcast', handleUpdateBroadcast);
            socket.off('delete-broadcast', handleDeleteBroadcast);
        };
    }, []);

    const fetchData = async () => {
        try {
            const [compRes, libRes, msgRes] = await Promise.all([
                API.get('/complaints'),
                API.get('/library'),
                API.get('/messages')
            ]);
            setComplaints(compRes.data || []);
            setLibrary(libRes.data || { totalSeats: 100, occupiedSeats: 0 });
            setBroadcasts(msgRes.data || []);
        } catch (err) { console.error(err); }
    };

    const fetchBroadcasts = async () => {
        try {
            const { data } = await API.get('/messages');
            setBroadcasts(data || []);
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

    const SidebarItem = ({ id, label, icon: Icon, count }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${activeTab === id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                }`}
        >
            <div className="flex items-center gap-3">
                <Icon size={20} />
                <span className={`${!isSidebarOpen && 'hidden md:hidden lg:inline'}`}>{label}</span>
            </div>
            {count > 0 && (
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${activeTab === id ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                    {count}
                </span>
            )}
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

    const filteredBroadcasts = broadcasts.filter(b => {
        const matchesText = b.content?.toLowerCase().includes(broadcastSearch.toLowerCase()) ||
            b.senderId?.name?.toLowerCase().includes(broadcastSearch.toLowerCase());
        const matchesRole = broadcastFilter === 'All' || b.receiverRole === broadcastFilter || (b.receiverRole === 'All');
        return matchesText && matchesRole;
    });

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans relative overflow-x-hidden">
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside className={`bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed lg:static inset-y-0 left-0 z-40 w-64 shrink-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 flex flex-col shadow-xl lg:shadow-none`}>
                <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800 gap-3">
                    <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20 shrink-0">
                        S
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-base font-black text-slate-900 dark:text-white leading-tight truncate">
                            Smart<span className="text-emerald-500">Campus</span>
                        </span>
                        <div className="mt-0.5"><RoleBadge role="Student" /></div>
                    </div>
                </div>

                <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <div className="text-xs font-bold text-slate-400 uppercase px-4 mb-2">Menu</div>
                    <SidebarItem id="home" label="Home" icon={LayoutDashboard} />
                    <SidebarItem id="broadcast" label="Broadcasts" icon={Megaphone} count={broadcasts.length} />
                    <SidebarItem id="chat" label="Chat / Messenger" icon={MessageSquare} />
                    <SidebarItem id="complaints" label="My Complaints" icon={FileText} />
                    <SidebarItem id="library" label="Library" icon={BookOpen} />
                    <SidebarItem id="events" label="Events" icon={Calendar} />
                    <SidebarItem id="social" label="Campus Social" icon={Users} />

                    <div className="mt-8 text-xs font-bold text-slate-400 uppercase px-4 mb-2">Account</div>
                    <SidebarItem id="profile" label="Profile" icon={User} />
                    <SidebarItem id="settings" label="Settings" icon={Settings} />
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <button onClick={handleLogoutClick} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 font-medium transition-colors cursor-pointer">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                {/* Topbar */}
                <header className="h-20 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
                            title="Toggle Menu"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 capitalize">
                            {activeTab === 'broadcast' ? 'Campus Broadcasts & Announcements' : activeTab.replace('-', ' ')}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 md:gap-5">
                        <ThemeToggle />
                        <button 
                            onClick={() => setActiveTab('broadcast')}
                            className="relative p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer"
                            title="View Broadcasts"
                        >
                            <Bell size={20} />
                            {broadcasts.length > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 ring-2 ring-white animate-pulse">
                                    {broadcasts.length}
                                </span>
                            )}
                        </button>

                        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{user?.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-bold text-sm shadow-xs">
                                {user?.name?.charAt(0) || 'S'}
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
                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={() => setShowForm(true)} className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                                            <Plus size={20} /> Raise Complaint
                                        </button>
                                        <button onClick={() => setActiveTab('chat')} className="bg-indigo-700/60 text-white px-5 py-3 rounded-xl font-bold border border-indigo-400/40 hover:bg-indigo-700 transition-all flex items-center gap-2">
                                            <MessageSquare size={18} /> Open Campus Chat
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Live Campus Announcements / Broadcast Banner */}
                            {broadcasts.length > 0 && (
                                <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/80 to-pink-50/80 border border-indigo-100/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4 min-w-0">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-200">
                                            <Megaphone size={22} className="animate-pulse" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 bg-indigo-600 text-white rounded-md">
                                                    Official Announcement
                                                </span>
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {new Date(broadcasts[0].date || broadcasts[0].createdAt || Date.now()).toLocaleDateString()}
                                                </span>
                                                <span className="text-[10px] font-bold text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded-full">
                                                    By {broadcasts[0].senderId?.name || 'Administration'}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-relaxed">
                                                {broadcasts[0].content}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setActiveTab('broadcast')}
                                        className="text-xs font-bold text-indigo-600 bg-white border border-indigo-200 px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors shadow-xs shrink-0 flex items-center gap-1.5"
                                    >
                                        View All ({broadcasts.length}) <ChevronRight size={14} />
                                    </button>
                                </div>
                            )}

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
                                    {(() => {
                                        const totSeats = Array.isArray(library) 
                                            ? library.reduce((acc, l) => acc + (l.totalSeats || 0), 0) || 12 
                                             : (library?.totalSeats || 100);
                                        const occSeats = Array.isArray(library) 
                                            ? library.reduce((acc, l) => acc + (l.bookedSeats || l.occupiedSeats || 0), 0) 
                                            : (library?.occupiedSeats || 0);
                                        const availSeats = Math.max(0, totSeats - occSeats);
                                        const percent = Math.min(100, Math.round((occSeats / totSeats) * 100));

                                        return (
                                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-200 transition-colors cursor-pointer" onClick={() => setActiveTab('library')}>
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
                                                <div className="relative z-10">
                                                    <p className="text-sm font-medium text-slate-500 mb-1">Seats Available</p>
                                                    <div className="flex items-end gap-2 mb-3">
                                                        <span className="text-5xl font-black text-emerald-600">{availSeats}</span>
                                                        <span className="text-lg font-bold text-slate-400 mb-1">/ {totSeats}</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                        <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                                                    </div>
                                                    <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Live Updates • Click to Open Library
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    <button onClick={handleEmergency} className="w-full py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold border border-rose-200 flex items-center justify-center gap-2 transition-colors">
                                        <AlertTriangle size={20} /> Emergency SOS
                                    </button>
                                </div>
                            </div>

                            {/* Project Video Showcase */}
                            <ProjectVideoPlayer
                                title="Campus Walkthrough & Features Guide"
                                subtitle="Watch the full system demo explaining student features, library bookings, incident reporting, and real-time alerts."
                            />
                        </div>
                    )}

                    {/* Broadcast / Announcements Tab */}
                    {activeTab === 'broadcast' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                                        <Megaphone size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Campus Broadcasts & Notices</h2>
                                        <p className="text-xs text-slate-500">Official circulars, urgent announcements, and updates from Campus Administration.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search announcements..."
                                            value={broadcastSearch}
                                            onChange={e => setBroadcastSearch(e.target.value)}
                                            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 w-56 text-slate-700"
                                        />
                                    </div>
                                    <button 
                                        onClick={fetchBroadcasts} 
                                        className="px-3.5 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-colors"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            {filteredBroadcasts.length === 0 ? (
                                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 space-y-3">
                                    <div className="w-16 h-16 bg-indigo-50 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
                                        <Megaphone size={32} />
                                    </div>
                                    <h3 className="text-base font-bold text-slate-700">No broadcasts found</h3>
                                    <p className="text-xs text-slate-400 max-w-sm mx-auto">There are currently no active public announcements broadcasted to students.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredBroadcasts.map((b, idx) => (
                                        <div key={b._id || idx} className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full blur-2xl -mr-6 -mt-6"></div>
                                            <div>
                                                <div className="flex items-center justify-between gap-2 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                                                            {b.senderId?.name?.charAt(0) || 'A'}
                                                        </span>
                                                        <div>
                                                            <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                                                {b.senderId?.name || 'Administrator'}
                                                                <ShieldCheck size={14} className="text-indigo-600" />
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 capitalize">{b.senderId?.role || 'Admin'}</div>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 flex items-center gap-1">
                                                        <Radio size={10} className="text-indigo-600 animate-pulse" />
                                                        {b.receiverRole === 'All' ? 'Broadcast: Everyone' : `Audience: ${b.receiverRole}`}
                                                    </span>
                                                </div>

                                                <p className="text-slate-800 text-sm font-medium leading-relaxed my-3 whitespace-pre-wrap">
                                                    {b.content}
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
                                                <span className="flex items-center gap-1 font-medium">
                                                    <Clock size={12} />
                                                    {new Date(b.date || b.createdAt || Date.now()).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                </span>
                                                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 text-[10px]">
                                                    <CheckCircle size={10} /> Verified Notice
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <ChatApp isEmbedded={true} />
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

                    {activeTab === 'social' && (
                        <div className="animate-in fade-in zoom-in-95 duration-300 h-[calc(100vh-120px)]">
                            <SocialFeed isEmbedded={true} />
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
