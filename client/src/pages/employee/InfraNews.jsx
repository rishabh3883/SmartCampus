import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { Newspaper, Megaphone, CheckCircle, Clock, Check, ArrowRight } from 'lucide-react';

const InfraNews = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const { data } = await API.get('/environment/tasks?role=Employee');
            setNews(data);
        } catch (err) {
            console.error("Failed to fetch news", err);
        }
    };

    const acknowledgeUpdate = async (id) => {
        if (!window.confirm("Acknowledge this update?")) return;
        try {
            await API.put(`/environment/tasks/${id}`, { status: 'Completed' });
            fetchNews();
        } catch (err) {
            alert("Update Failed");
        }
    };

    // Separate active news from archived
    const activeNews = news.filter(n => n.status === 'Published' || n.status === 'In Progress');
    const archivedNews = news.filter(n => n.status === 'Completed');

    return (
        <div className="min-h-screen pb-10 bg-slate-50">
            <Navbar />

            <div className="page-container max-w-5xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mb-4 border border-amber-200 shadow-sm">
                        <Newspaper size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                        Infra<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">News</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Real-time updates on campus infrastructure, maintenance tasks, and sustainability initiatives.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Active News Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-rose-50 rounded-lg text-rose-600 border border-rose-100">
                                <Megaphone className="animate-pulse" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Active Bulletins</h2>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                                {activeNews.length} Active
                            </span>
                        </div>

                        <div className="space-y-6">
                            {activeNews.length === 0 ? (
                                <div className="card border-dashed border-slate-300 bg-slate-50 text-center py-16">
                                    <CheckCircle className="mx-auto text-emerald-500 mb-4 opacity-50" size={48} />
                                    <h3 className="text-xl font-bold text-slate-700">All Systems Nominal</h3>
                                    <p className="text-slate-500 mt-2">No pending infrastructure alerts or maintenance tasks.</p>
                                </div>
                            ) : (
                                activeNews.map(item => (
                                    <div key={item._id} className="card group hover:border-amber-300 transition-all duration-300 bg-white border-slate-200 shadow-sm hover:shadow-md">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Date Box */}
                                            <div className="hidden md:flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 min-w-[100px] text-center">
                                                <span className="text-xs text-slate-500 uppercase font-bold">Priority</span>
                                                <span className={`text-lg font-black mt-1 ${item.priority === 'High' ? 'text-rose-600' :
                                                    item.priority === 'Medium' ? 'text-amber-500' : 'text-blue-600'
                                                    }`}>
                                                    {item.priority}
                                                </span>
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="md:hidden mb-2">
                                                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${item.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                            item.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                                                            }`}>
                                                            {item.priority} Priority
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-slate-500 flex items-center bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                                        <Clock size={12} className="mr-1" />
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-amber-600 transition-colors">
                                                    {item.title}
                                                </h3>

                                                <p className="text-slate-600 leading-relaxed mb-6">
                                                    {item.description}
                                                </p>

                                                <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-slate-100">
                                                    <div className="flex items-center text-xs text-slate-500 font-mono">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                                                        AI Environmental Observer
                                                    </div>

                                                    <button
                                                        onClick={() => acknowledgeUpdate(item._id)}
                                                        className="btn btn-primary bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 px-6 shadow-sm"
                                                    >
                                                        <CheckCircle size={18} className="mr-2" /> Mark as Complete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Archived News */}
                    {archivedNews.length > 0 && (
                        <div className="pt-8 border-t border-slate-200">
                            <h2 className="text-lg font-bold text-slate-500 flex items-center mb-6">
                                <Clock className="mr-2" size={20} /> Past Updates
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {archivedNews.map(item => (
                                    <div key={item._id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center hover:bg-white hover:shadow-sm transition-all">
                                        <div className="pr-4">
                                            <h4 className="font-medium text-slate-400 line-through text-sm mb-1">{item.title}</h4>
                                            <span className="text-[10px] text-emerald-600 font-mono uppercase bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">Completed</span>
                                        </div>
                                        <span className="text-xs text-slate-400 whitespace-nowrap">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InfraNews;
