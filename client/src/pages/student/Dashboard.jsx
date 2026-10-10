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

    // --- Dynamic Time Greeting Helper ---
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    // --- Components ---

    const SidebarItem = ({ id, label, icon: Icon, count }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-semibold text-xs group ${activeTab === id
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm shadow-indigo-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-white/5 hover:text-slate-900 dark:text-slate-300'
                }`}
        >
            <div className="flex items-center gap-2.5">
                <Icon size={16} className={activeTab === id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
                <span className={`${!isSidebarOpen && 'hidden md:hidden lg:inline'}`}>{label}</span>
            </div>
            {count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === id ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'}`}>
                    {count}
                </span>
            )}
        </button>
    );

    const StatCard = ({ icon: Icon, label, value, colorScheme = 'blue', subtext }) => {
        const schemeMap = {
            amber: {
                border: 'border-slate-200/80 dark:border-white/10 hover:border-amber-300 dark:hover:border-amber-500/30',
                icon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                glow: 'from-amber-500/[0.07] to-transparent',
            },
            violet: {
                border: 'border-slate-200/80 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-500/30',
                icon: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
                glow: 'from-violet-500/[0.07] to-transparent',
            },
            emerald: {
                border: 'border-slate-200/80 dark:border-white/10 hover:border-emerald-300 dark:hover:border-emerald-500/30',
                icon: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                glow: 'from-emerald-500/[0.07] to-transparent',
            },
            rose: {
                border: 'border-slate-200/80 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-500/30',
                icon: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
                glow: 'from-rose-500/[0.07] to-transparent',
            },
        };
        const current = schemeMap[colorScheme] || schemeMap.blue;

        return (
            <div className={`bg-white dark:bg-slate-900/90 p-5 rounded-2xl border ${current.border} shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-md transition-all group relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl ${current.glow} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}></div>
                <div className="flex items-start justify-between gap-3 mb-2.5 relative z-10">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</span>
                    <div className={`p-2 rounded-xl border ${current.icon} shadow-2xs group-hover:scale-105 transition-transform`}>
                        <Icon size={16} />
                    </div>
                </div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight leading-none mb-1">{value}</h3>
                    {subtext && <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{subtext}</p>}
                </div>
            </div>
        );
    };

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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans relative overflow-x-hidden">
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-30 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-r border-slate-200/70 dark:border-white/10 fixed lg:static inset-y-0 left-0 z-40 w-64 shrink-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 flex flex-col shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] lg:shadow-none`}>
                <div className="h-16 flex items-center px-5 border-b border-slate-200/50 dark:border-white/5 gap-3">
                    <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20 shrink-0">
                        S
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-black text-slate-900 dark:text-white leading-tight truncate">
                            Smart<span className="text-emerald-500">Campus</span>
                        </span>
                        <div className="mt-0.5"><RoleBadge role="Student" /></div>
                    </div>
                </div>

                <div className="flex-1 px-3 py-5 space-y-1 overflow-y-auto custom-scrollbar">
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-3 mb-2 tracking-wider">Navigation</div>
                    <SidebarItem id="home" label="Home" icon={LayoutDashboard} />
                    <SidebarItem id="broadcast" label="Broadcasts" icon={Megaphone} count={broadcasts.length} />
                    <SidebarItem id="chat" label="Chat / Messenger" icon={MessageSquare} />
                    <SidebarItem id="complaints" label="My Complaints" icon={FileText} />
                    <SidebarItem id="library" label="Library" icon={BookOpen} />
                    <SidebarItem id="events" label="Events" icon={Calendar} />
                    <SidebarItem id="social" label="Campus Social" icon={Users} />

                    <div className="mt-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-3 mb-2 tracking-wider">Account</div>
                    <SidebarItem id="profile" label="Profile" icon={User} />
                    <SidebarItem id="settings" label="Settings" icon={Settings} />
                </div>

                <div className="p-3 border-t border-slate-200/50 dark:border-white/5">
                    <button onClick={handleLogoutClick} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer">
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
                {/* Topbar */}
                <header className="h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
                            title="Toggle Menu"
                        >
                            <Menu size={18} />
                        </button>
                        <h1 className="text-base font-bold text-slate-900 dark:text-white capitalize tracking-tight">
                            {activeTab === 'broadcast' ? 'Campus Broadcasts & Announcements' : activeTab.replace('-', ' ')}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button 
                            onClick={() => setActiveTab('broadcast')}
                            className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-200/70 dark:border-white/10 shadow-2xs cursor-pointer"
                            title="View Broadcasts"
                        >
                            <Bell size={18} />
                            {broadcasts.length > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 ring-2 ring-white dark:ring-slate-900 animate-pulse">
                                    {broadcasts.length}
                                </span>
                            )}
                        </button>

                        <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200/60 dark:border-white/10">
                            <div className="text-right hidden sm:block">
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{user?.name}</div>
                                <div className="text-[10px] text-slate-400 capitalize">{user?.role}</div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                {user?.name?.charAt(0) || 'S'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard View */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-7xl mx-auto pb-24">

                    {activeTab === 'home' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-400">
                            {/* Apple Cupertino Ambient Welcome Banner */}
                            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-900 dark:via-indigo-950/80 dark:to-slate-900 rounded-2xl p-7 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-indigo-500/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
                                <div className="relative z-10 max-w-2xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">
                                            Student Portal
                                        </span>
                                        <span className="text-xs text-slate-400">• Active Session</span>
                                    </div>
                                    <h2 className="text-2xl font-bold tracking-tight mb-2">
                                        {getGreeting()}, {user?.name}! 👋
                                    </h2>
                                    <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                                        Your campus overview is live with <strong className="text-white font-semibold underline decoration-indigo-400/60 underline-offset-4">{complaints.filter(c => c.status !== 'Resolved').length} active</strong> pending tasks and real-time alerts.
                                    </p>
                                    <div className="flex flex-wrap gap-2.5">
                                        <button onClick={() => setShowForm(true)} className="bg-white text-slate-900 hover:bg-slate-100 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
                                            <Plus size={16} /> Raise Issue
                                        </button>
                                        <button onClick={() => setActiveTab('chat')} className="backdrop-blur-md bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-xl font-semibold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer">
                                            <MessageSquare size={15} /> Campus Chat
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Live Campus Announcements / Broadcast Banner */}
                            {broadcasts.length > 0 && (
                                <div className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-3.5 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                            <Megaphone size={18} className="animate-pulse" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-indigo-600 text-white rounded-md">
                                                    Official Circular
                                                </span>
                                                <span className="text-[11px] text-slate-400">
                                                    {new Date(broadcasts[0].date || broadcasts[0].createdAt || Date.now()).toLocaleDateString()}
                                                </span>
                                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                                                    By {broadcasts[0].senderId?.name || 'Administration'}
                                                </span>
                                            </div>
                                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-relaxed">
                                                {broadcasts[0].content}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setActiveTab('broadcast')}
                                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3.5 py-2 rounded-xl transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                                    >
                                        View All ({broadcasts.length}) <ChevronRight size={13} />
                                    </button>
                                </div>
                            )}

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard icon={Flame} label="Daily Streak" value={user?.contributionStreak || 0} colorScheme="amber" subtext="Consecutive days" />
                                <StatCard icon={Trophy} label="Total Badges" value={user?.badges?.length || 0} colorScheme="violet" subtext="Earned achievements" />
                                <StatCard icon={CheckCircle} label="Solved Issues" value={complaints.filter(c => c.status === 'Resolved').length} colorScheme="emerald" subtext="All time contributions" />
                                <StatCard icon={AlertTriangle} label="Pending" value={complaints.filter(c => c.status !== 'Resolved').length} colorScheme="rose" subtext="Active tickets" />
                            </div>

                            {/* Achievements Section */}
                            <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] relative overflow-hidden">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Trophy size={16} className="text-amber-500" /> Student Achievements ({user?.badges?.length || 0})
                                    </h3>
                                    <span className="text-[11px] text-slate-400 font-medium">Auto-rewarded on resolution</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {user?.badges && user.badges.length > 0 ? (
                                        user.badges.map((badge, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5 px-3 py-1.5 rounded-xl">
                                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-2xs">
                                                    <Trophy size={14} />
                                                </div>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{badge}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="w-full text-center text-slate-400 text-xs py-3 italic">
                                            No badges earned yet. Solve community tasks or submit verified issues to unlock!
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Recent Activity */}
                                <div className="lg:col-span-2 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Clock size={16} /> Recent Ticket Activity
                                        </h3>
                                        <button onClick={() => setActiveTab('complaints')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">View All</button>
                                    </div>

                                    {complaints.length === 0 ? (
                                        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-8 text-center border border-slate-200/70 dark:border-white/10">
                                            <p className="text-xs text-slate-400">No recent ticket activity. Campus reports are up to date!</p>
                                        </div>
                                    ) : (
                                        complaints.slice(0, 3).map(c => (
                                            <div key={c._id} className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 flex items-center gap-3.5 shadow-2xs hover:shadow-md transition-shadow">
                                                <div className={`p-2.5 rounded-xl ${c.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'}`}>
                                                    {c.status === 'Resolved' ? <CheckCircle size={18} /> : <Clock size={18} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">{c.title}</h4>
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{c.description}</p>
                                                </div>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'}`}>
                                                    {c.status}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Library Quick View */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <BookOpen size={16} /> Library Occupancy
                                    </h3>
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
                                            <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-500/30 transition-colors cursor-pointer" onClick={() => setActiveTab('library')}>
                                                <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/[0.07] rounded-full blur-2xl pointer-events-none"></div>
                                                <div className="relative z-10">
                                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Available Seats</span>
                                                    <div className="flex items-baseline gap-2 my-2">
                                                        <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{availSeats}</span>
                                                        <span className="text-sm font-bold text-slate-400">/ {totSeats}</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                                        <div className="bg-emerald-500 h-full transition-all duration-1000 rounded-full" style={{ width: `${percent}%` }}></div>
                                                    </div>
                                                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2.5 flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                        Live Updates • Click to Open
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    <button onClick={handleEmergency} className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 rounded-2xl font-bold text-xs border border-rose-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:scale-[1.01] active:scale-[0.99]">
                                        <AlertTriangle size={16} /> Emergency SOS Broadcast
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
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-300">
                            <div className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center shadow-2xs">
                                        <Megaphone size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Campus Circulars & Official Notices</h2>
                                        <p className="text-xs text-slate-400">Verified announcements broadcasted by Campus Administration</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                                        <input
                                            type="text"
                                            placeholder="Search circulars..."
                                            value={broadcastSearch}
                                            onChange={e => setBroadcastSearch(e.target.value)}
                                            className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-white/10 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 w-52 text-slate-700 dark:text-slate-200"
                                        />
                                    </div>
                                    <button 
                                        onClick={fetchBroadcasts} 
                                        className="px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-xl font-semibold text-xs hover:bg-indigo-500/20 transition-colors cursor-pointer"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            {filteredBroadcasts.length === 0 ? (
                                <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-12 text-center border border-slate-200/70 dark:border-white/10 space-y-2.5">
                                    <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/20">
                                        <Megaphone size={22} />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">No Circulars Found</h3>
                                    <p className="text-xs text-slate-400 max-w-sm mx-auto">There are currently no active public announcements broadcasted to students.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredBroadcasts.map((b, idx) => (
                                        <div key={b._id || idx} className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between gap-2 mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-[11px] flex items-center justify-center shadow-xs">
                                                            {b.senderId?.name?.charAt(0) || 'A'}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                                                {b.senderId?.name || 'Administrator'}
                                                                <ShieldCheck size={13} className="text-indigo-600 dark:text-indigo-400" />
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 capitalize">{b.senderId?.role || 'Admin'}</div>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-500/20 flex items-center gap-1">
                                                        <Radio size={9} className="text-indigo-600 animate-pulse" />
                                                        {b.receiverRole === 'All' ? 'Everyone' : b.receiverRole}
                                                    </span>
                                                </div>

                                                <p className="text-slate-800 dark:text-slate-200 text-xs font-medium leading-relaxed my-3 whitespace-pre-wrap">
                                                    {b.content}
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-[11px] text-slate-400">
                                                <span className="flex items-center gap-1 font-medium">
                                                    <Clock size={11} />
                                                    {new Date(b.date || b.createdAt || Date.now()).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                </span>
                                                <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px]">
                                                    <CheckCircle size={10} /> Verified
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
                        <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-300">
                            <div className="flex justify-between items-center bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs sticky top-0 z-20">
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">Ticket Management</h2>
                                <button onClick={() => setShowForm(true)} className="bg-indigo-600 dark:bg-indigo-500 text-white px-3.5 py-2 rounded-xl font-semibold text-xs shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer">
                                    <Plus size={16} /> New Report
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {complaints.map(c => (
                                    <div key={c._id} className="bg-white dark:bg-slate-900/90 p-5 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2.5">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${c.type === 'Emergency' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5'}`}>
                                                    {c.type}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border ${c.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                                                    c.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                                                    }`}>
                                                    {c.status === 'Resolved' ? <CheckCircle size={10} /> : <Clock size={10} />}
                                                    {c.status}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-xs mb-1">{c.title}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{c.description}</p>
                                        </div>
                                        <div className="pt-2.5 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-[11px] text-slate-400">
                                            <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                                            {c.adminComment && <span className="text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">Admin Replied</span>}
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
                        <div className="flex flex-col items-center justify-center h-[45vh] text-slate-400 animate-in fade-in duration-500">
                            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-3">
                                {activeTab === 'profile' && <User size={26} />}
                                {activeTab === 'settings' && <Settings size={26} />}
                            </div>
                            <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 capitalize">{activeTab}</h2>
                            <p className="text-xs text-slate-400 mt-1">This module is syncing with the campus network.</p>
                            <button onClick={() => setActiveTab('home')} className="mt-4 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Return to Dashboard</button>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200/80 dark:border-white/10">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Camera size={18} className="text-indigo-600 dark:text-indigo-400" /> Report Campus Issue
                            </h3>
                            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                                <XCircle size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 tracking-wider">Issue Category</label>
                                <select className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 rounded-xl font-semibold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={newComplaint.type} onChange={e => setNewComplaint({ ...newComplaint, type: e.target.value })}>
                                    <option>Leakage</option><option>Electricity</option><option>Cleanliness</option><option>WiFi / Network</option><option>Furniture</option><option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 tracking-wider">Location / Room</label>
                                <input type="text" placeholder="e.g. Room 302, BH-1" required className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                                    value={newComplaint.title} onChange={e => setNewComplaint({ ...newComplaint, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 tracking-wider">Description</label>
                                <textarea placeholder="Describe the problem in detail..." className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 min-h-[90px] text-slate-800 dark:text-slate-200"
                                    value={newComplaint.description} onChange={e => setNewComplaint({ ...newComplaint, description: e.target.value })}></textarea>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1.5 tracking-wider">Attach Photo (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-600 dark:file:text-indigo-400 hover:file:bg-indigo-500/20 transition-colors"
                                    onChange={(e) => setNewComplaint({ ...newComplaint, image: e.target.files[0] })}
                                />
                            </div>
                            <div className="pt-2">
                                <button type="submit" disabled={loading} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all active:scale-98 disabled:opacity-70 cursor-pointer">
                                    {loading ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ChatbotWidget />
        </div>
    );
};

export default StudentDashboard;
