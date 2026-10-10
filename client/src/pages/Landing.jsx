import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProjectVideoPlayer from '../components/ProjectVideoPlayer';
import { ArrowRight, Globe, Zap, Shield, ChevronRight, BarChart3, Users, Play, Sparkles } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    const scrollToDemo = () => {
        const el = document.getElementById('project-video-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <Navbar />

            {/* Hero Section */}
            <header className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
                <div className="page-container relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-enter">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm font-medium text-slate-600">Smart Campus Management System</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 animate-enter" style={{ animationDelay: '0.1s' }}>
                        The Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Campus Management</span>
                    </h1>

                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-enter" style={{ animationDelay: '0.2s' }}>
                        Streamline operations, enhance sustainability, and empower your university community with a role-based, unified campus dashboard experience.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto animate-enter" style={{ animationDelay: '0.3s' }}>
                        {/* Button 1: Smart Campus Main */}
                        <button
                            onClick={() => navigate('/signup')}
                            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 active:scale-95 transition-all flex items-center justify-center gap-2 border border-emerald-400/30 group"
                        >
                            <span>Get Started</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Button 2: Watch Project Video */}
                        <button
                            onClick={scrollToDemo}
                            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white text-slate-800 font-bold hover:bg-slate-50 hover:text-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-2 border border-slate-200 shadow-sm group"
                        >
                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <Play size={12} className="ml-0.5" />
                            </div>
                            <span>Watch Project Video</span>
                        </button>

                        {/* Button 3: Live Demo / Login */}
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-800/90 text-slate-100 font-bold hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2 border border-slate-700/80 shadow-md group"
                        >
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                            <span>Sign In / Portal</span>
                        </button>
                    </div>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-emerald-50/50 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute top-40 -left-20 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-60"></div>
                </div>
            </header>

            {/* Project Video & Live Demo Showcase Section */}
            <section id="project-video-section" className="py-16 bg-gradient-to-b from-slate-50 via-slate-900 to-slate-950 text-white relative">
                <div className="page-container max-w-5xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                            <Sparkles size={14} className="animate-pulse" />
                            <span>Experience The System In Action</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
                            Watch Smart Campus Walkthrough
                        </h2>
                        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
                            Take an interactive video tour demonstrating automated resource forecasting, IoT incident reports, real-time broadcasts, and student safety response.
                        </p>
                    </div>

                    {/* Reusable Video Player */}
                    <ProjectVideoPlayer
                        title="Smart Campus - Full Video Presentation"
                        subtitle="Detailed walkthrough and system demonstration by DEEPAK JAT"
                    />
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="page-container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why SmartCampusManagement?</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to manage a modern educational institution, all in one place.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Zap, title: "Real-time Operations", desc: "Monitor energy, waste, and resources live.", color: "text-amber-500", bg: "bg-amber-50" },
                            { icon: Shield, title: "Advanced Security", desc: "Integrated emergency response system.", color: "text-rose-500", bg: "bg-rose-50" },
                            { icon: Globe, title: "Sustainability First", desc: "AI-driven eco-friendly protocols.", color: "text-emerald-500", bg: "bg-emerald-50" },
                            { icon: Users, title: "Student Centric", desc: "Seamless portal for academic life.", color: "text-blue-500", bg: "bg-blue-50" },
                            { icon: BarChart3, title: "Data Analytics", desc: "Insightful reports for administration.", color: "text-purple-500", bg: "bg-purple-50" },
                            { icon: Zap, title: "IoT Integration", desc: "Connect smart devices effortlessly.", color: "text-cyan-500", bg: "bg-cyan-50" }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                                <div className={`w-14 h-14 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 py-12 border-t border-slate-200">
                <div className="page-container flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-emerald-600 rounded-md flex items-center justify-center text-white font-bold text-xs">S</div>
                        <span className="font-bold text-slate-700">SmartCampusManagement</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                        © 2024 SmartCampusManagement Inc. All rights reserved.
                    </div>
                    <div className="flex gap-6 text-slate-400">
                        <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
                        <a href="#" className="hover:text-emerald-600 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
