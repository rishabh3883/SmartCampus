import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, Globe, Zap, Shield, ChevronRight, BarChart3, Users } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <Navbar />

            {/* Hero Section */}
            <header className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden">
                <div className="page-container relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-enter">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm font-medium text-slate-600">Smart Campus v2.0 is Live</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 animate-enter" style={{ animationDelay: '0.1s' }}>
                        The Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Campus Management</span>
                    </h1>

                    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-enter" style={{ animationDelay: '0.2s' }}>
                        Streamline operations, enhance sustainability, and empower your university community with an AI-driven, unified dashboard experience.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-enter" style={{ animationDelay: '0.3s' }}>
                        <button
                            onClick={() => navigate('/signup')}
                            className="btn btn-primary text-lg px-8 py-4 rounded-full shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 w-full sm:w-auto"
                        >
                            Get Started <ArrowRight className="ml-2" size={20} />
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn btn-secondary text-lg px-8 py-4 rounded-full w-full sm:w-auto bg-white"
                        >
                            Live Demo
                        </button>
                    </div>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-emerald-50/50 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute top-40 -left-20 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-3xl opacity-60"></div>
                </div>
            </header>

            {/* Features Grid */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="page-container">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why SmartCampus?</h2>
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
                        <span className="font-bold text-slate-700">SmartCampus</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                        © 2024 SmartCampus Inc. All rights reserved.
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
