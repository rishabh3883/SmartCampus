import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { SERVER_URL } from '../../config';
import socket from '../../services/socket';
import {
    AlertTriangle, Droplets, Zap, PieChart as PieIcon, CheckCircle, XCircle,
    Clock, FileText, Send, BookOpen, Calendar, Activity, Shield, Users,
    UserMinus, UserCheck, Cpu, TrendingUp, LayoutDashboard, Radio, LogOut,
    FileSpreadsheet, Scan, Edit2, Trash2, Megaphone, Search, X, ShieldCheck,
    ChevronRight, Sparkles, SlidersHorizontal, ArrowUpRight, MessageSquare,
    Heart, Image as ImageIcon, Pin, CornerDownRight, ExternalLink
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InsightsWidget from '../../components/InsightsWidget';
import ProjectVideoPlayer from '../../components/ProjectVideoPlayer';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { RoleBadge } from '../../components/ui/Badge';
import { useNavigate, Link } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab, complaintsCount, usersCount, broadcastsCount, socialCount }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            navigate('/login');
        }
    };

    return (
        <aside className="w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl h-screen border-r border-slate-200/70 dark:border-white/10 flex flex-col fixed left-0 top-0 z-50 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] font-sans">
            {/* Logo / App Header */}
            <div className="p-5 border-b border-slate-200/50 dark:border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0">
                    <LayoutDashboard size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight leading-tight truncate">
                        Smart<span className="text-indigo-600 dark:text-indigo-400">Campus</span>
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Admin Console</span>
                </div>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1 custom-scrollbar">
                <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Main Menu</p>
                <SidebarItem id="overview" label="Overview" icon={LayoutDashboard} activeTab={activeTab} setActiveTab={setActiveTab} />
                <SidebarItem id="social" label="Campus Social" icon={MessageSquare} activeTab={activeTab} setActiveTab={setActiveTab} count={socialCount} />
                <SidebarItem id="broadcasts" label="Broadcasts" icon={Megaphone} activeTab={activeTab} setActiveTab={setActiveTab} count={broadcastsCount} />
                <SidebarItem id="analytics" label="Analytics" icon={Activity} activeTab={activeTab} setActiveTab={setActiveTab} />
                <SidebarItem id="operations" label="Operations" icon={Radio} activeTab={activeTab} setActiveTab={setActiveTab} count={complaintsCount} />
                <SidebarItem id="users" label="User Mgmt" icon={Users} activeTab={activeTab} setActiveTab={setActiveTab} count={usersCount} />

                <div className="my-5 border-t border-slate-200/50 dark:border-white/5 mx-2"></div>

                <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Quick Access</p>
                <QuickLink href="/admin/library" icon={BookOpen} label="Library & Seat QRs" />
                <QuickLink href="/admin/events" icon={Calendar} label="Events & Gate Pass" />
                <QuickLink href="/scan-seat" icon={Scan} label="Live QR Scanner" />
                <QuickLink href="/admin/timetable" icon={Clock} label="Timetable" />
                <QuickLink href="/admin/attendance-reports" icon={FileSpreadsheet} label="Attendance Excel" />
                <QuickLink href="/admin/reports" icon={FileText} label="Reports" />
                <QuickLink href="/admin/environment" icon={Cpu} label="AI Observer" />
            </div>

            {/* Logout & Profile */}
            <div className="p-3 border-t border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] space-y-2">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5 shadow-2xs">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        A
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Administrator</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">System Admin</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

const SidebarItem = ({ id, label, icon: Icon, activeTab, setActiveTab, count }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 group ${activeTab === id
            ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm shadow-indigo-500/25'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
            }`}
    >
        <div className="flex items-center gap-2.5">
            <Icon size={16} className={`transition-colors ${activeTab === id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
            <span>{label}</span>
        </div>
        {count > 0 && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === id ? 'bg-white/20 text-white' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                }`}>
                {count}
            </span>
        )}
    </button>
);

const QuickLink = ({ href, icon: Icon, label }) => (
    <Link to={href} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-all duration-200 group">
        <Icon size={16} className="text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
        <span>{label}</span>
    </Link>
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
    const [message, setMessage] = useState({ content: '', role: 'All' });
    
    // Broadcast Management State
    const [broadcastsList, setBroadcastsList] = useState([]);
    const [editingBroadcast, setEditingBroadcast] = useState(null);
    const [broadcastSearch, setBroadcastSearch] = useState('');
    const [broadcastFilter, setBroadcastFilter] = useState('All');
    const [broadcastSubmitting, setBroadcastSubmitting] = useState(false);

    // Campus Social Management State
    const [socialPostsList, setSocialPostsList] = useState([]);
    const [socialLoading, setSocialLoading] = useState(false);
    const [socialSearch, setSocialSearch] = useState('');
    const [socialFilter, setSocialFilter] = useState('All');
    const [newSocialPost, setNewSocialPost] = useState({ content: '', isImportant: true, isAnonymous: false, image: null, tags: 'Official,Campus' });
    const [socialSubmitting, setSocialSubmitting] = useState(false);
    const [activeCommentsPost, setActiveCommentsPost] = useState(null);
    const [commentsList, setCommentsList] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newAdminComment, setNewAdminComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        fetchInitialData();
        const interval = setInterval(() => {
            fetchInitialData();
            fetchAnalytics();
        }, 30000);

        const handleNewBroadcast = (newMsg) => {
            setBroadcastsList(prev => [newMsg, ...prev.filter(b => b._id !== newMsg._id)]);
        };
        const handleUpdateBroadcastSocket = (updatedMsg) => {
            setBroadcastsList(prev => prev.map(b => b._id === updatedMsg._id ? updatedMsg : b));
        };
        const handleDeleteBroadcastSocket = ({ id }) => {
            setBroadcastsList(prev => prev.filter(b => b._id !== id));
        };

        socket.on('new-broadcast', handleNewBroadcast);
        socket.on('update-broadcast', handleUpdateBroadcastSocket);
        socket.on('delete-broadcast', handleDeleteBroadcastSocket);

        return () => {
            clearInterval(interval);
            socket.off('new-broadcast', handleNewBroadcast);
            socket.off('update-broadcast', handleUpdateBroadcastSocket);
            socket.off('delete-broadcast', handleDeleteBroadcastSocket);
        };
    }, [selectedHostel, selectedDate]);

    useEffect(() => {
        fetchAnalytics();
    }, [selectedHostel, selectedDate]);

    useEffect(() => {
        if (activeTab === 'users') fetchAllUsers();
        if (activeTab === 'broadcasts') fetchBroadcasts();
        if (activeTab === 'social') fetchSocialPosts();
    }, [activeTab, userTab]);

    const fetchInitialData = async () => {
        try {
            const [alertsRes, complaintsRes, hostelsRes, usersRes, statsRes, msgRes] = await Promise.all([
                API.get('/alerts'),
                API.get('/complaints'),
                API.get('/resources/hostels'),
                API.get('/users/pending'),
                API.get('/resources/stats'),
                API.get('/messages')
            ]);
            setAlerts(alertsRes.data || []);
            setComplaints(complaintsRes.data || []);
            setHostels(hostelsRes.data || []);
            if (usersRes?.data) setPendingUsers(usersRes.data);
            if (hostelsRes.data?.length > 0 && !selectedHostel) setSelectedHostel(hostelsRes.data[0]._id);
            if (statsRes?.data) setImpactStats(statsRes.data);
            if (msgRes?.data) setBroadcastsList(msgRes.data);
            fetchSocialPosts();
        } catch (err) { console.error("Dashboard Fetch Error:", err); }
    };

    const fetchSocialPosts = async () => {
        setSocialLoading(true);
        try {
            const { data } = await API.get('/social/feed?limit=50&loadAuthor=true');
            setSocialPostsList(data || []);
        } catch (err) {
            console.error("Error fetching social feed:", err);
        } finally {
            setSocialLoading(false);
        }
    };

    const handleDeleteSocialPost = async (postId) => {
        if (!window.confirm("⚠️ Are you sure you want to permanently delete this social post and all its comments?")) return;
        try {
            await API.delete(`/social/posts/${postId}`);
            setSocialPostsList(prev => prev.filter(p => p._id !== postId));
            if (activeCommentsPost?._id === postId) setActiveCommentsPost(null);
            alert("Social post deleted successfully.");
        } catch (err) {
            alert("Failed to delete post: " + (err.response?.data?.message || err.message));
        }
    };

    const handleCreateAdminSocialPost = async (e) => {
        e.preventDefault();
        if (!newSocialPost.content.trim()) return alert("Please enter post content.");
        setSocialSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('content', newSocialPost.content);
            formData.append('visibility', 'Campus');
            formData.append('isImportant', newSocialPost.isImportant);
            formData.append('isAnonymous', newSocialPost.isAnonymous);
            if (newSocialPost.tags) {
                const tagsArray = newSocialPost.tags.split(',').map(t => t.trim()).filter(Boolean);
                formData.append('tags', JSON.stringify(tagsArray));
            }
            if (newSocialPost.image) {
                formData.append('images', newSocialPost.image);
            }

            await API.post('/social/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Official Campus Social update published!");
            setNewSocialPost({ content: '', isImportant: true, isAnonymous: false, image: null, tags: 'Official,Campus' });
            fetchSocialPosts();
        } catch (err) {
            alert("Failed to publish social post: " + (err.response?.data?.message || err.message));
        } finally {
            setSocialSubmitting(false);
        }
    };

    const handleViewComments = async (post) => {
        setActiveCommentsPost(post);
        setLoadingComments(true);
        try {
            const { data } = await API.get(`/social/comments/${post._id}`);
            setCommentsList(data || []);
        } catch (err) {
            console.error("Error loading comments:", err);
            setCommentsList([]);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleAddAdminComment = async (e) => {
        e.preventDefault();
        if (!newAdminComment.trim() || !activeCommentsPost) return;
        setSubmittingComment(true);
        try {
            const { data } = await API.post('/social/comments', {
                postId: activeCommentsPost._id,
                content: newAdminComment
            });
            setNewAdminComment('');
            handleViewComments(activeCommentsPost);
            fetchSocialPosts();
        } catch (err) {
            alert("Failed to submit comment: " + (err.response?.data?.message || err.message));
        } finally {
            setSubmittingComment(false);
        }
    };

    const fetchBroadcasts = async () => {
        try {
            const { data } = await API.get('/messages');
            setBroadcastsList(data || []);
        } catch (err) { console.error("Error fetching broadcasts:", err); }
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
        if (!message.content.trim()) return alert("Please enter announcement content");
        setBroadcastSubmitting(true);
        try {
            await API.post('/messages', { content: message.content, receiverRole: message.role });
            alert('Broadcast Announcement published successfully!');
            setMessage({ ...message, content: '' });
            fetchBroadcasts();
        } catch (err) { alert('Failed to send broadcast.'); }
        finally { setBroadcastSubmitting(false); }
    };

    const handleUpdateBroadcast = async (e) => {
        if (e) e.preventDefault();
        if (!editingBroadcast || !editingBroadcast.content.trim()) return;
        try {
            await API.put(`/messages/${editingBroadcast._id}`, {
                content: editingBroadcast.content,
                receiverRole: editingBroadcast.receiverRole
            });
            alert('Broadcast announcement updated successfully!');
            setEditingBroadcast(null);
            fetchBroadcasts();
        } catch (err) {
            alert('Failed to update broadcast: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteBroadcast = async (id) => {
        if (!window.confirm("⚠️ Are you sure you want to delete this broadcast post permanently?")) return;
        try {
            await API.delete(`/messages/${id}`);
            setBroadcastsList(prev => prev.filter(b => b._id !== id));
            alert('Broadcast post deleted successfully.');
        } catch (err) {
            alert('Failed to delete broadcast: ' + (err.response?.data?.message || err.message));
        }
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
    const StatCard = ({ title, value, icon: Icon, color, subtext = "Live telemetry" }) => {
        const themeMap = {
            rose: {
                bg: 'from-rose-500/[0.07] to-transparent',
                iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
                border: 'border-slate-200/80 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-500/30',
                badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            },
            blue: {
                bg: 'from-blue-500/[0.07] to-transparent',
                iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
                border: 'border-slate-200/80 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/30',
                badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
            },
            amber: {
                bg: 'from-amber-500/[0.07] to-transparent',
                iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                border: 'border-slate-200/80 dark:border-white/10 hover:border-amber-300 dark:hover:border-amber-500/30',
                badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            },
            emerald: {
                bg: 'from-emerald-500/[0.07] to-transparent',
                iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                border: 'border-slate-200/80 dark:border-white/10 hover:border-emerald-300 dark:hover:border-emerald-500/30',
                badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            },
        };
        const currentTheme = themeMap[color] || themeMap.blue;

        return (
            <div className={`p-5 rounded-2xl bg-white dark:bg-slate-900/90 border ${currentTheme.border} shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] dark:shadow-none hover:shadow-lg transition-all duration-300 relative overflow-hidden group`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${currentTheme.bg} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}></div>
                
                <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {title}
                    </span>
                    <div className={`p-2.5 rounded-xl border ${currentTheme.iconBg} shadow-2xs group-hover:scale-105 transition-transform`}>
                        <Icon size={18} />
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums mb-1">
                        {value}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>{subtext}</span>
                    </div>
                </div>
            </div>
        );
    };

    const ComparisonPill = ({ label, diff }) => {
        const isUp = diff > 0;
        return (
            <div className="bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/5 rounded-xl px-3 py-1.5 flex items-center gap-2">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{label}</span>
                <div className={`flex items-center text-xs font-bold ${isUp ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    <TrendingUp size={12} className={`mr-0.5 ${!isUp && 'rotate-180'}`} />
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

        const ForecastCard = ({ label, value, unit, icon: Icon, color }) => (
            <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-white/10 p-4 rounded-2xl text-center shadow-2xs hover:shadow-md transition-all">
                <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{value}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider mt-1">{label}</div>
                <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{unit}</div>
            </div>
        );

        return (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/[0.04] dark:bg-indigo-500/[0.08] rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col lg:flex-row gap-8 items-center">
                    <div className="lg:w-1/3 w-full">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <Cpu size={16} />
                            </div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Resource Forecaster</h2>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-xs mb-5">Simulate campus infrastructure load based on student enrollment projection.</p>
                        
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/60 dark:border-white/5">
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Projected Enrollment</label>
                                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{students.toLocaleString()} Students</span>
                            </div>
                            <input
                                type="range" min="100" max="10000" step="100" value={students}
                                onChange={e => setStudents(Number(e.target.value))}
                                className="w-full mt-3 accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                    <div className="lg:w-2/3 w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <ForecastCard label="Hostel Rooms" value={forecast.rooms.toLocaleString()} unit="Units" />
                        <ForecastCard label="Daily Water" value={forecast.water.toLocaleString()} unit="Liters/Day" />
                        <ForecastCard label="Daily Food" value={forecast.food.toLocaleString()} unit="kg/Day" />
                        <ForecastCard label="Library Seats" value={forecast.lib.toLocaleString()} unit="Capacity" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                complaintsCount={complaints.filter(c => c.status === 'Pending').length}
                usersCount={pendingUsers.length}
                broadcastsCount={broadcastsList.length}
                socialCount={socialPostsList.length}
            />

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto relative ml-64 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
                {/* Header */}
                <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-200/60 dark:border-white/10 px-8 py-4 flex justify-between items-center shadow-2xs">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {activeTab === 'overview' && 'Executive Overview'}
                            {activeTab === 'social' && 'Campus Social & Feed Moderation'}
                            {activeTab === 'broadcasts' && 'Campus Broadcasts & Circulars'}
                            {activeTab === 'analytics' && 'Analytics & Resource Reports'}
                            {activeTab === 'operations' && 'Campus Operations & Dispatches'}
                            {activeTab === 'users' && 'User Directory & Access Control'}
                        </h1>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium tracking-wide">
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <div className="flex items-center gap-2 bg-emerald-500/10 dark:bg-emerald-500/15 px-3 py-1.5 rounded-full border border-emerald-500/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Live Telemetry</span>
                        </div>
                    </div>
                </header>

                <div className="p-8 pb-24 space-y-8 max-w-7xl mx-auto">
                    {/* Image Modal */}
                    {viewImage && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" onClick={() => setViewImage(null)}>
                            <button className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"><XCircle size={28} /></button>
                            <img src={`${SERVER_URL}/${viewImage}`} alt="Evidence" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 border border-white/10" onClick={e => e.stopPropagation()} />
                        </div>
                    )}

                    {/* TAB 1: OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="animate-in fade-in slide-in-from-bottom-3 duration-400 space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <StatCard title="Active Alerts" value={alerts.length} icon={AlertTriangle} color="rose" subtext={`${alerts.filter(a => a.severity === 'High').length} high severity`} />
                                <StatCard title="Water Consumption" value={`${stats.water} L`} icon={Droplets} color="blue" subtext="Across registered zones" />
                                <StatCard title="Electricity Load" value={`${stats.elec} kWh`} icon={Zap} color="amber" subtext="Real-time campus grid" />
                            </div>

                            <InsightsWidget />

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                {/* Analytics Summary Chart */}
                                <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <Activity size={18} className="text-indigo-600 dark:text-indigo-400" /> Campus Resource Baseline
                                            </h3>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">10-day trending analysis</p>
                                        </div>
                                        <button onClick={() => setActiveTab('analytics')} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 transition-colors">
                                            <span>Deep Dive</span> <TrendingUp size={13} />
                                        </button>
                                    </div>
                                    <div className="h-72 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="colorElec" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                                                <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                                                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }} />
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
                                                <Area type="monotone" dataKey="Water" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWater)" strokeWidth={2.5} />
                                                <Area type="monotone" dataKey="Electricity" stroke="#f59e0b" fillOpacity={1} fill="url(#colorElec)" strokeWidth={2.5} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* AI Insights & Critical Alerts */}
                                <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)] flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            <Zap className="text-amber-500" size={18} /> Automated Signals
                                        </h3>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{alerts.length} Events</span>
                                    </div>
                                    <div className="overflow-y-auto space-y-2.5 pr-1 flex-1 max-h-[290px] custom-scrollbar">
                                        {alerts.filter(a => a.type.includes('AI') || a.severity === 'Low').map(a => (
                                            <div key={a._id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">OPTIMIZED</span>
                                                    <span className="text-[10px] text-slate-400">{new Date(a.timestamp).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{a.message.split('Stats:')[0]}</p>
                                            </div>
                                        ))}
                                        {alerts.length === 0 && (
                                            <div className="text-center text-slate-400 text-xs py-12 flex flex-col items-center justify-center gap-2">
                                                <Sparkles className="text-slate-300 dark:text-slate-600 animate-pulse" size={24} />
                                                <span>Telemetry analysis in progress...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <ForecasterSection />

                            <ProjectVideoPlayer
                                title="System Walkthrough & Architecture Tour"
                                subtitle="Interactive overview of Smart Campus operational modules, AI forecasting, and emergency dispatch."
                            />
                        </div>
                    )}

                    {/* TAB: CAMPUS SOCIAL MANAGEMENT (Moderation & Publisher) */}
                    {activeTab === 'social' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            {/* Top Stats Overview */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-2xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Feed Posts</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{socialPostsList.length}</p>
                                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">Live campus stream</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                                        <MessageSquare size={22} />
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-2xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pinned Notices</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                            {socialPostsList.filter(p => p.isImportant).length}
                                        </p>
                                        <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">High priority</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
                                        <Pin size={22} />
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-2xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Reactions</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                            {socialPostsList.reduce((acc, p) => acc + (p.likes?.length || 0), 0)}
                                        </p>
                                        <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-0.5">Student engagement</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center">
                                        <Heart size={22} />
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 shadow-2xs flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Comments & Replies</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                            {socialPostsList.reduce((acc, p) => acc + (p.comments?.length || p.commentsCount || 0), 0)}
                                        </p>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">Active discussions</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                                        <Activity size={22} />
                                    </div>
                                </div>
                            </div>

                            {/* Official Campus Social Publisher */}
                            <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-indigo-700/40 relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
                                            <Sparkles size={20} className="animate-pulse" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white tracking-tight">Publish Official Campus Social Update</h3>
                                            <p className="text-xs text-indigo-200">Post announcements, stories, or notices directly into the Campus Social feed with media support.</p>
                                        </div>
                                    </div>
                                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                        <ShieldCheck size={14} /> Admin Verified Post
                                    </span>
                                </div>

                                <form onSubmit={handleCreateAdminSocialPost} className="space-y-4 pt-2">
                                    <div>
                                        <textarea
                                            value={newSocialPost.content}
                                            onChange={e => setNewSocialPost({ ...newSocialPost, content: e.target.value })}
                                            rows={3}
                                            placeholder="What's happening on campus? Write an official announcement, news, or discussion prompt..."
                                            className="w-full text-sm p-3.5 bg-indigo-950/60 border border-indigo-700/60 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-indigo-300/50 resize-y"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-indigo-200 uppercase tracking-wider mb-1.5">
                                                Tags (Comma separated)
                                            </label>
                                            <input
                                                type="text"
                                                value={newSocialPost.tags}
                                                onChange={e => setNewSocialPost({ ...newSocialPost, tags: e.target.value })}
                                                placeholder="e.g. Official, ExamUpdate, Hackathon, Notice"
                                                className="w-full text-xs p-2.5 bg-indigo-950/60 border border-indigo-700/60 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-indigo-300/40"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-indigo-200 uppercase tracking-wider mb-1.5">
                                                Attach Image / Banner
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="admin-social-file"
                                                    onChange={e => setNewSocialPost({ ...newSocialPost, image: e.target.files[0] || null })}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="admin-social-file"
                                                    className="cursor-pointer flex-1 flex items-center justify-center gap-2 p-2 rounded-xl bg-indigo-950/60 border border-indigo-700/60 hover:bg-indigo-900/60 text-xs font-semibold text-indigo-200 transition-colors truncate"
                                                >
                                                    <ImageIcon size={15} />
                                                    <span className="truncate">{newSocialPost.image ? newSocialPost.image.name : 'Choose Image File...'}</span>
                                                </label>
                                                {newSocialPost.image && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setNewSocialPost({ ...newSocialPost, image: null })}
                                                        className="p-2 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded-xl border border-rose-500/30 text-xs"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-indigo-700/30">
                                        <div className="flex items-center gap-5 w-full sm:w-auto">
                                            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-indigo-200 hover:text-white">
                                                <input
                                                    type="checkbox"
                                                    checked={newSocialPost.isImportant}
                                                    onChange={e => setNewSocialPost({ ...newSocialPost, isImportant: e.target.checked })}
                                                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-500"
                                                />
                                                <span>📌 Pin to Top (Important Notice)</span>
                                            </label>

                                            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-indigo-200 hover:text-white">
                                                <input
                                                    type="checkbox"
                                                    checked={newSocialPost.isAnonymous}
                                                    onChange={e => setNewSocialPost({ ...newSocialPost, isAnonymous: e.target.checked })}
                                                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-500"
                                                />
                                                <span>🎭 Post Anonymously</span>
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={socialSubmitting || !newSocialPost.content.trim()}
                                            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                                                socialSubmitting || !newSocialPost.content.trim()
                                                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                                    : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]'
                                            }`}
                                        >
                                            <Send size={15} />
                                            {socialSubmitting ? 'Publishing...' : 'Publish to Campus Social'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Search, Filter & Action Bar */}
                            <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="relative w-full md:w-80">
                                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by text, author, or tag..."
                                        value={socialSearch}
                                        onChange={e => setSocialSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
                                    />
                                    {socialSearch && (
                                        <button onClick={() => setSocialSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">Filter:</span>
                                    {[
                                        { key: 'All', label: 'All Posts' },
                                        { key: 'Pinned', label: '📌 Pinned' },
                                        { key: 'Anonymous', label: '🎭 Anonymous' },
                                        { key: 'Media', label: '🖼️ With Media' },
                                    ].map(f => (
                                        <button
                                            key={f.key}
                                            onClick={() => setSocialFilter(f.key)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                                socialFilter === f.key
                                                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                    <button
                                        onClick={fetchSocialPosts}
                                        disabled={socialLoading}
                                        className="p-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-colors ml-1"
                                        title="Refresh Social Feed"
                                    >
                                        {socialLoading ? 'Refreshing...' : '🔄 Refresh'}
                                    </button>
                                </div>
                            </div>

                            {/* Feed List Grid */}
                            <div className="space-y-4">
                                {(() => {
                                    const filtered = socialPostsList.filter(p => {
                                        if (socialFilter === 'Pinned' && !p.isImportant) return false;
                                        if (socialFilter === 'Anonymous' && !p.isAnonymous) return false;
                                        if (socialFilter === 'Media' && (!p.images || p.images.length === 0)) return false;

                                        const q = socialSearch.toLowerCase();
                                        if (!q) return true;

                                        const authorName = (p.authorId?.name || (p.isAnonymous ? 'Anonymous' : '')).toLowerCase();
                                        const content = (p.content || '').toLowerCase();
                                        const tagsMatch = Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q));

                                        return authorName.includes(q) || content.includes(q) || tagsMatch;
                                    });

                                    if (filtered.length === 0) {
                                        return (
                                            <div className="bg-white dark:bg-slate-900/90 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-white/10 shadow-2xs">
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
                                                    <MessageSquare size={28} />
                                                </div>
                                                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">No Social Posts Found</h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                                    {socialSearch || socialFilter !== 'All'
                                                        ? 'No posts match your current search or filter criteria. Try resetting the filters.'
                                                        : 'No campus social posts have been published yet. Use the publisher card above to create the first one!'}
                                                </p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="grid grid-cols-1 gap-5">
                                            {filtered.map(post => {
                                                const authorRole = post.isAnonymous ? 'Student' : (post.authorId?.role || 'Student');
                                                const authorName = post.isAnonymous ? 'Anonymous Member' : (post.authorId?.name || 'Campus User');
                                                const hasImages = post.images && post.images.length > 0;

                                                return (
                                                    <div
                                                        key={post._id}
                                                        className={`p-6 rounded-3xl bg-white dark:bg-slate-900/90 border transition-all duration-200 shadow-2xs hover:shadow-md ${
                                                            post.isImportant
                                                                ? 'border-amber-400/40 bg-amber-500/[0.02] dark:border-amber-500/30'
                                                                : 'border-slate-200/80 dark:border-white/10'
                                                        }`}
                                                    >
                                                        {/* Post Header */}
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs ${
                                                                    post.isAnonymous
                                                                        ? 'bg-slate-800 text-slate-300'
                                                                        : authorRole === 'Admin'
                                                                        ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white'
                                                                        : authorRole === 'Security'
                                                                        ? 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white'
                                                                        : 'bg-gradient-to-tr from-blue-500 to-cyan-600 text-white'
                                                                }`}>
                                                                    {post.isAnonymous ? '🎭' : authorName.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                                            {authorName}
                                                                        </span>
                                                                        <RoleBadge role={authorRole} />
                                                                        {post.isImportant && (
                                                                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                                                                                <Pin size={11} /> PINNED
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-2 mt-0.5">
                                                                        <Clock size={12} />
                                                                        <span>{new Date(post.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                                        <span>•</span>
                                                                        <span>Visibility: {post.visibility || 'Campus'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Actions */}
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleViewComments(post)}
                                                                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
                                                                >
                                                                    <MessageSquare size={14} />
                                                                    <span>Discussion ({post.comments?.length || post.commentsCount || 0})</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteSocialPost(post._id)}
                                                                    className="p-1.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold transition-all flex items-center gap-1.5"
                                                                    title="Delete post permanently as Admin"
                                                                >
                                                                    <Trash2 size={14} />
                                                                    <span className="hidden sm:inline">Delete</span>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Post Content */}
                                                        <div className="py-4 space-y-3">
                                                            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-medium">
                                                                {post.content}
                                                            </p>

                                                            {/* Image Attachments */}
                                                            {hasImages && (
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                                                    {post.images.map((img, idx) => {
                                                                        const imgUrl = img.startsWith('http') ? img : `${SERVER_URL}${img.startsWith('/') ? img : '/' + img}`;
                                                                        return (
                                                                            <div
                                                                                key={idx}
                                                                                onClick={() => setViewImage(img.startsWith('/') ? img.slice(1) : img)}
                                                                                className="cursor-pointer group relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-slate-100 dark:bg-slate-800 max-h-64 flex items-center justify-center"
                                                                            >
                                                                                <img
                                                                                    src={imgUrl}
                                                                                    alt={`Post attachment ${idx + 1}`}
                                                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                                                />
                                                                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                                                                                    <ExternalLink size={16} /> View Fullscreen
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}

                                                            {/* Tags */}
                                                            {Array.isArray(post.tags) && post.tags.length > 0 && (
                                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                                    {post.tags.map((tag, tIdx) => (
                                                                        <span
                                                                            key={tIdx}
                                                                            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5"
                                                                        >
                                                                            #{tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Post Footer Stats */}
                                                        <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                                            <div className="flex items-center gap-4">
                                                                <span className="flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400">
                                                                    <Heart size={14} className="fill-rose-500/20" /> {post.likes?.length || 0} Likes
                                                                </span>
                                                                <span className="flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
                                                                    <MessageSquare size={14} /> {post.comments?.length || post.commentsCount || 0} Comments
                                                                </span>
                                                            </div>
                                                            <span className="text-[11px] text-slate-400">Post ID: {post._id}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    {/* TAB: BROADCAST MANAGEMENT (Full Admin Control) */}
                    {activeTab === 'broadcasts' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            {/* Create New Broadcast Announcement */}
                            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-indigo-700/40 relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
                                            <Megaphone size={22} className="animate-pulse" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white tracking-tight">Create Official Campus Broadcast</h3>
                                            <p className="text-xs text-indigo-200">Publish instant announcements to students, faculty, or all campus members.</p>
                                        </div>
                                    </div>
                                    <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Sync Enabled
                                    </span>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-indigo-200 mb-1.5">Target Audience</label>
                                            <select
                                                value={message.role}
                                                onChange={e => setMessage({ ...message, role: e.target.value })}
                                                className="w-full text-sm font-semibold p-2.5 bg-indigo-950/60 border border-indigo-700/60 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 text-white"
                                            >
                                                <option value="All" className="bg-slate-900 text-white">📢 Everyone (Students & Staff)</option>
                                                <option value="Student" className="bg-slate-900 text-white">🎓 Students Only</option>
                                                <option value="Staff" className="bg-slate-900 text-white">🛠️ Staff / Employees Only</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-semibold text-indigo-200 mb-1.5">Announcement Content</label>
                                            <textarea
                                                className="w-full text-sm p-3 bg-indigo-950/60 border border-indigo-700/60 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 text-white placeholder-indigo-300/50 min-h-[90px] resize-y"
                                                placeholder="Write the official broadcast message here... (e.g. Campus schedule update, holiday notice, emergency alert)"
                                                value={message.content}
                                                onChange={e => setMessage({ ...message, content: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-1">
                                        <p className="text-xs text-indigo-300/80 italic">
                                            💡 Broadcasts appear immediately on student notifications & feeds without needing a page refresh.
                                        </p>
                                        <button
                                            onClick={sendMessage}
                                            disabled={broadcastSubmitting || !message.content.trim()}
                                            className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all ${
                                                broadcastSubmitting || !message.content.trim()
                                                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                                    : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]'
                                            }`}
                                        >
                                            <Send size={16} />
                                            {broadcastSubmitting ? 'Publishing...' : 'Publish Broadcast'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Search & Filter Bar */}
                            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="relative w-full md:w-80">
                                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search broadcasts..."
                                        value={broadcastSearch}
                                        onChange={e => setBroadcastSearch(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
                                    />
                                    {broadcastSearch && (
                                        <button onClick={() => setBroadcastSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Filter Audience:</span>
                                    {['All', 'Student', 'Staff'].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setBroadcastFilter(f)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                                broadcastFilter === f
                                                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                        >
                                            {f === 'All' ? '📢 All' : f === 'Student' ? '🎓 Students' : '🛠️ Staff'}
                                        </button>
                                    ))}
                                    <span className="ml-2 text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
                                        Total: {broadcastsList.length}
                                    </span>
                                </div>
                            </div>

                            {/* Broadcasts List */}
                            <div className="space-y-4">
                                {(() => {
                                    const filtered = broadcastsList.filter(b => {
                                        const matchesFilter = broadcastFilter === 'All' ? true : (b.receiverRole || 'All') === broadcastFilter;
                                        const q = broadcastSearch.toLowerCase();
                                        const matchesSearch = !q || (b.content && b.content.toLowerCase().includes(q)) || (b.receiverRole && b.receiverRole.toLowerCase().includes(q));
                                        return matchesFilter && matchesSearch;
                                    });

                                    if (filtered.length === 0) {
                                        return (
                                            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                                    <Megaphone size={28} />
                                                </div>
                                                <h4 className="text-lg font-bold text-slate-800 mb-1">No Broadcasts Found</h4>
                                                <p className="text-sm text-slate-500 max-w-md mx-auto">
                                                    {broadcastSearch || broadcastFilter !== 'All'
                                                        ? 'No announcements match your search or filter criteria. Try clearing search filters.'
                                                        : 'No campus broadcast announcements have been published yet. Use the form above to post one!'}
                                                </p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="grid grid-cols-1 gap-4">
                                            {filtered.map(item => {
                                                const targetRole = item.receiverRole || 'All';
                                                const badgeColors =
                                                    targetRole === 'Student' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    targetRole === 'Staff' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-purple-50 text-purple-700 border-purple-200';

                                                return (
                                                    <div
                                                        key={item._id}
                                                        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group relative"
                                                    >
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeColors}`}>
                                                                    {targetRole === 'Student' && '🎓 Students Only'}
                                                                    {targetRole === 'Staff' && '🛠️ Staff / Employees Only'}
                                                                    {targetRole === 'All' && '📢 Campus-Wide (Everyone)'}
                                                                </span>
                                                                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                                                                    <ShieldCheck size={13} /> {item.senderRole || 'Admin'}
                                                                </span>
                                                                {item.senderId?.name && (
                                                                    <span className="text-xs text-slate-500 font-medium">
                                                                        by <strong className="text-slate-700">{item.senderId.name}</strong>
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                                    <Clock size={13} /> {new Date(item.createdAt).toLocaleString()}
                                                                </span>
                                                                <div className="flex items-center gap-1.5 ml-2">
                                                                    <button
                                                                        onClick={() => setEditingBroadcast({ ...item })}
                                                                        className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200 transition-colors flex items-center gap-1 text-xs font-bold"
                                                                        title="Edit Broadcast Post"
                                                                    >
                                                                        <Edit2 size={14} />
                                                                        <span className="hidden sm:inline">Edit</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteBroadcast(item._id)}
                                                                        className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors flex items-center gap-1 text-xs font-bold"
                                                                        title="Delete Broadcast Permanently"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                        <span className="hidden sm:inline">Delete</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="pt-4">
                                                            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
                                                                {item.content}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}
                            </div>
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
                                        <Send className="mr-2 text-indigo-500" size={20} /> Broadcast Announcement
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 mb-1">Target Audience</label>
                                            <select
                                                value={message.role}
                                                onChange={e => setMessage({ ...message, role: e.target.value })}
                                                className="w-full text-xs font-bold p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                                            >
                                                <option value="All">📢 Everyone (Students & Staff)</option>
                                                <option value="Student">🎓 Students Only</option>
                                                <option value="Staff">🛠️ Staff / Employees Only</option>
                                            </select>
                                        </div>
                                        <textarea
                                            className="input-field min-h-[80px]"
                                            placeholder="Type announcement to broadcast..."
                                            value={message.content}
                                            onChange={e => setMessage({ ...message, content: e.target.value })}
                                        />
                                        <button onClick={sendMessage} className="btn btn-primary w-full py-2 flex items-center justify-center gap-2">
                                            <Send size={16} /> Send Broadcast
                                        </button>
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
                                                            src={`${SERVER_URL}/${c.imageUrl}`}
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

                    {/* EDIT BROADCAST MODAL */}
                    {editingBroadcast && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-2 text-indigo-600">
                                        <div className="p-2 bg-indigo-50 rounded-xl">
                                            <Edit2 size={18} />
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-lg">Edit Campus Broadcast</h3>
                                    </div>
                                    <button
                                        onClick={() => setEditingBroadcast(null)}
                                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <form onSubmit={handleUpdateBroadcast} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                                            Target Audience
                                        </label>
                                        <select
                                            value={editingBroadcast.receiverRole || 'All'}
                                            onChange={e => setEditingBroadcast({ ...editingBroadcast, receiverRole: e.target.value })}
                                            className="w-full text-sm font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                                        >
                                            <option value="All">📢 Everyone (Students & Staff)</option>
                                            <option value="Student">🎓 Students Only</option>
                                            <option value="Staff">🛠️ Staff / Employees Only</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                                            Broadcast Message
                                        </label>
                                        <textarea
                                            value={editingBroadcast.content}
                                            onChange={e => setEditingBroadcast({ ...editingBroadcast, content: e.target.value })}
                                            rows={5}
                                            required
                                            className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 resize-y"
                                            placeholder="Edit your announcement message..."
                                        />
                                    </div>

                                    <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => setEditingBroadcast(null)}
                                            className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle size={16} /> Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* SOCIAL COMMENTS MODERATION MODAL */}
                    {activeCommentsPost && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 dark:border-white/10 space-y-4 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                                {/* Header */}
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5">
                                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl">
                                            <MessageSquare size={18} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-base">Thread Discussion Moderation</h3>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                                Post by {activeCommentsPost.isAnonymous ? 'Anonymous' : (activeCommentsPost.authorId?.name || 'Campus User')}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveCommentsPost(null)}
                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Original Post Snippet */}
                                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/5 text-xs text-slate-700 dark:text-slate-300">
                                    <p className="line-clamp-3 font-medium">{activeCommentsPost.content}</p>
                                </div>

                                {/* Comments List */}
                                <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1 custom-scrollbar min-h-[160px] max-h-[300px]">
                                    {loadingComments ? (
                                        <div className="text-center py-8 text-xs text-slate-400 font-semibold">
                                            Loading discussion comments...
                                        </div>
                                    ) : commentsList.length === 0 ? (
                                        <div className="text-center py-8 text-xs text-slate-400 font-medium">
                                            No comments yet on this post.
                                        </div>
                                    ) : (
                                        commentsList.map(comment => (
                                            <div
                                                key={comment._id}
                                                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5 space-y-1"
                                            >
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-bold text-slate-800 dark:text-slate-200">
                                                            {comment.authorId?.name || 'Campus Member'}
                                                        </span>
                                                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                                                            {comment.authorId?.role || 'Student'}
                                                        </span>
                                                    </div>
                                                    <span className="text-slate-400 text-[10px]">
                                                        {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                                                    {comment.content}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Post Official Admin Remark / Reply */}
                                <form onSubmit={handleAddAdminComment} className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newAdminComment}
                                            onChange={e => setNewAdminComment(e.target.value)}
                                            placeholder="Write an official admin comment or moderation note..."
                                            className="flex-1 text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-white"
                                        />
                                        <button
                                            type="submit"
                                            disabled={submittingComment || !newAdminComment.trim()}
                                            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all ${
                                                submittingComment || !newAdminComment.trim()
                                                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                            }`}
                                        >
                                            <Send size={13} />
                                            <span>Reply</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
