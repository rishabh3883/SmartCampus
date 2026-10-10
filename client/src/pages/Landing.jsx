import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProjectVideoPlayer from '../components/ProjectVideoPlayer';
import {
    ArrowRight, Globe, Zap, Shield, ChevronRight, BarChart3, Users,
    Play, Sparkles, Droplets, BookOpen, Calendar, MessageSquare,
    Radio, ShieldCheck, Clock, FileSpreadsheet, CheckCircle2,
    Lock, Key, Server, Database, ChevronDown, Laptop, Smartphone,
    Activity, Flame, Award, AlertTriangle
} from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();
    const [activePortalTab, setActivePortalTab] = useState('student');
    const [openFaq, setOpenFaq] = useState(null);

    const scrollToDemo = () => {
        const el = document.getElementById('project-video-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const portalDetails = {
        student: {
            title: "Student Experience Hub",
            badge: "Role: Student",
            color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
            desc: "A centralized academic and campus life companion designed for seamless daily operations and engagement.",
            features: [
                "Raise maintenance complaints with photo evidence",
                "Reserve library seats with live occupancy and QR scan",
                "Generate digital QR gate passes for campus events",
                "Engage in real-time student chat & moderated community feed",
                "Emergency SOS instant trigger with live staff dispatch"
            ],
            previewTitle: "Student Overview",
            previewContent: (
                <div className="space-y-3 font-sans">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-xs">🎓</div>
                            <div>
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Daily Streak: 12 Days 🔥</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">Library Seat #A-14 Reserved</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">Checked In</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Active Issues</p>
                            <p className="text-lg font-black text-slate-800 dark:text-white">1 Pending</p>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Badges Earned</p>
                            <p className="text-lg font-black text-amber-500">4 Badges 🏆</p>
                        </div>
                    </div>
                </div>
            )
        },
        admin: {
            title: "Command & Control Center",
            badge: "Role: Admin",
            color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
            desc: "Executive visibility across resource telemetry, live broadcasts, department timetables, and campus security.",
            features: [
                "Real-time Water, Electricity, and Food Waste telemetry analytics",
                "Full CRUD broadcast manager with instant WebSocket dispatch",
                "Incident and grievance triage with evidence inspection",
                "Excel timetable and student section attendance bulk ingestion",
                "User verification, role provisioning, and account moderation"
            ],
            previewTitle: "Executive Telemetry",
            previewContent: (
                <div className="space-y-3 font-sans">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 rounded-xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-center">
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Water</p>
                            <p className="text-sm font-black text-blue-600 dark:text-blue-400">12.4k L</p>
                        </div>
                        <div className="p-2 rounded-xl bg-amber-50/50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900 text-center">
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Energy</p>
                            <p className="text-sm font-black text-amber-600 dark:text-amber-400">420 kWh</p>
                        </div>
                        <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-center">
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Waste</p>
                            <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">38 kg</p>
                        </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900 flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-700 dark:text-purple-300">📢 Campus Broadcast Live</span>
                        <span className="text-[10px] bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded font-bold">100% Synced</span>
                    </div>
                </div>
            )
        },
        employee: {
            title: "Staff & Operations Console",
            badge: "Role: Staff / Employee",
            color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
            desc: "Action-oriented workspace for facility managers, electricians, plumbers, and support staff.",
            features: [
                "Live feed of assigned complaints across campus zones & hostels",
                "Instant status transitions (Pending → Approved → In Progress → Resolved)",
                "Infrastructure news & emergency announcements feed",
                "Hostel leakage detection alerts and priority sorting"
            ],
            previewTitle: "Operations Triage Queue",
            previewContent: (
                <div className="space-y-3 font-sans">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded">High Priority</span>
                            <span className="text-[10px] text-slate-400">Hostel BH-2</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Main Pipe Water Leakage - 2nd Floor</p>
                        <div className="flex justify-end gap-2 pt-1">
                            <button className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-600 text-white shadow-xs">Mark Resolved</button>
                        </div>
                    </div>
                </div>
            )
        },
        security: {
            title: "Security & Gatehouse Terminal",
            badge: "Role: Security Guard",
            color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
            desc: "Fast digital gate pass scanner, campus access auditing, and emergency alert receiver.",
            features: [
                "Instant camera QR Scanner for participant event passes",
                "Real-time validation of approved vs expired gate passes",
                "Emergency dispatch audio & visual alarm receiver",
                "Direct communication hotline with campus administrators"
            ],
            previewTitle: "Live Gate Scanner",
            previewContent: (
                <div className="space-y-3 font-sans">
                    <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 text-center">
                        <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
                            <ShieldCheck size={24} />
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Camera QR Scanner Active</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Point at student event pass for instant check-in</p>
                    </div>
                </div>
            )
        }
    };

    const realFeatures = [
        {
            icon: Droplets,
            title: "Resource Sustainability Telemetry",
            desc: "Live daily tracking of water consumption, electricity usage, and food waste with zone leakage detection.",
            tag: "IoT & Analytics"
        },
        {
            icon: CheckCircle2,
            title: "Complaint & Incident Triage",
            desc: "End-to-end incident ticketing with student photo uploads, priority dispatch, and resolution verification.",
            tag: "Campus Ops"
        },
        {
            icon: BookOpen,
            title: "Library Seat QR Reservation",
            desc: "Interactive seat grid, real-time slot bookings, live capacity percentage, and physical QR check-in scanning.",
            tag: "Smart Library"
        },
        {
            icon: Calendar,
            title: "Events & Digital Gate Pass",
            desc: "Campus event registration with dynamic QR pass generation and instant downloadable PDF ticket passes.",
            tag: "Events & Access"
        },
        {
            icon: Radio,
            title: "Real-Time Broadcast Announcements",
            desc: "Instant campus notifications dispatched across Socket.io channels with targeted role delivery.",
            tag: "Live Sync"
        },
        {
            icon: MessageSquare,
            title: "Campus Social Feed & Real-time Chat",
            desc: "Peer collaboration channels, student social community feed, and automated AI content safety filtering.",
            tag: "Community"
        },
        {
            icon: FileSpreadsheet,
            title: "Excel Timetable & Attendance Ingestion",
            desc: "Bulk drag-and-drop Excel spreadsheet parser for departmental class schedules and attendance reports.",
            tag: "Data Automation"
        },
        {
            icon: Zap,
            title: "AI Observer & Predictive Insights",
            desc: "Rule-based and intelligent anomaly detection alerting staff to abnormal resource spikes and occupancy shifts.",
            tag: "AI Telemetry"
        }
    ];

    const faqs = [
        {
            q: "How does role-based access control (RBAC) work in SmartCampus?",
            a: "SmartCampus enforces strict JWT-based authentication with 4 dedicated roles: Admin, Student, Staff (Employee), and Security Guard. Routes, APIs, and navigation are locked to verified credentials approved by system administrators."
        },
        {
            q: "How does the Library Seat Booking and QR Check-in operate?",
            a: "Students can view live floor availability on their dashboard, pick their desired seat, and confirm a reservation. When arriving at the library, scanning the seat's unique QR code validates their check-in in real time."
        },
        {
            q: "Are broadcast announcements and emergency alarms instant?",
            a: "Yes. SmartCampus utilizes Socket.io WebSocket connections. When an Admin posts a broadcast or a student triggers an Emergency SOS, all connected client dashboards update immediately without requiring a manual refresh."
        },
        {
            q: "Can faculty or admins import timetables and attendance via Excel?",
            a: "Yes. The Admin timetable module provides a dedicated drag-and-drop Excel reader that parses spreadsheet schedules and persists section attendance analytics automatically."
        },
        {
            q: "What security measures are implemented across the platform?",
            a: "All passwords are cryptographically hashed using bcrypt. Requests utilize stateless JSON Web Tokens (JWT), form submissions validate file formats via Multer, and server endpoints enforce sanitized payloads."
        },
        {
            q: "Is the SmartCampus platform responsive across mobile, tablet, and desktop?",
            a: "Yes. Built with a responsive CSS grid, modular sidebar drawers, and high-contrast light/dark themes, SmartCampus delivers a fluid experience from 360px smartphones to 4K desktop displays."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-[#faede5] selection:text-[#c75b3c] transition-colors duration-200">
            <Navbar />

            {/* 1. HERO SECTION */}
            <header className="relative pt-16 pb-20 lg:pt-28 lg:pb-32 overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80">
                {/* Ambient Gradient Backgrounds */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-[#e2725b]/10 dark:bg-[#e2725b]/15 rounded-full blur-3xl"></div>
                    <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-[#c75b3c]/10 dark:bg-[#c75b3c]/15 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs mb-8 animate-enter">
                        <span className="flex h-2 w-2 rounded-full bg-[#e2725b] animate-pulse"></span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Award-Standard Smart Campus Operating System</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6 animate-enter">
                        The Future of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e2725b] via-[#c75b3c] to-[#883a23]">
                            Campus Management
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-medium animate-enter">
                        Unify student academic life, automated sustainability telemetry, instant facility maintenance, and digital gate security into one real-time role-based ecosystem.
                    </p>

                    {/* Dual Action CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-lg mx-auto mb-16 animate-enter">
                        <button
                            onClick={() => navigate('/signup')}
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#e2725b] via-[#c75b3c] to-[#a8482b] hover:from-[#e9826c] hover:to-[#c75b3c] text-white font-bold text-sm shadow-lg shadow-[#e2725b]/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                        >
                            <span>Get Started</span>
                            <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={scrollToDemo}
                            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer group"
                        >
                            <div className="w-6 h-6 rounded-full bg-[#faede5] dark:bg-[#3c160b] text-[#e2725b] dark:text-[#f5dacb] flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play size={12} className="ml-0.5" />
                            </div>
                            <span>Watch Project Video</span>
                        </button>

                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2 border border-slate-700 shadow-md cursor-pointer"
                        >
                            <span>Sign In / Portal</span>
                        </button>
                    </div>

                    {/* Floating CSS Browser Mockup (No external fake images) */}
                    <div className="relative mx-auto max-w-4xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden text-left animate-enter">
                        {/* Browser Window Chrome */}
                        <div className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                            </div>
                            <div className="px-4 py-1 rounded-md bg-white dark:bg-slate-900 text-[11px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                smartcampus.parul.edu/dashboard
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live
                            </div>
                        </div>

                        {/* Interactive Mockup Body */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-50/50 dark:bg-slate-950/50">
                            <div className="md:col-span-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-xs">SC</div>
                                    <span className="text-xs font-bold text-slate-800 dark:text-white">SmartCampus Engine</span>
                                </div>
                                <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                    <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold flex justify-between">
                                        <span>Live Sockets</span> <span>Connected</span>
                                    </div>
                                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/50 flex justify-between">
                                        <span>RBAC Portals</span> <span>4 Active</span>
                                    </div>
                                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/50 flex justify-between">
                                        <span>AI Telemetry</span> <span>Running</span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-8 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Real-Time Campus Telemetry</h4>
                                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full">Aggregated</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <p className="text-[10px] text-slate-400 font-bold">Water Flow</p>
                                        <p className="text-sm font-black text-blue-600 dark:text-blue-400">14.2k L</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <p className="text-[10px] text-slate-400 font-bold">Power Load</p>
                                        <p className="text-sm font-black text-amber-600 dark:text-amber-400">380 kWh</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <p className="text-[10px] text-slate-400 font-bold">Seat Status</p>
                                        <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">84% Free</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. TRUST STRIP */}
            <div className="py-6 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> 4 Role-Based Portals</span>
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Real-Time WebSocket Sync</span>
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> JWT & bcrypt Encrypted</span>
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Full MERN Architecture</span>
                </div>
            </div>

            {/* 3. PROBLEM -> SOLUTION SECTION */}
            <section className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Architectural Paradigm</h2>
                        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            From Fragmented Chaos to One Unified System
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="sc-card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-500 flex items-center justify-center font-bold text-sm mb-4">01</div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Scattered Campus Data</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Maintenance logs, library seats, and event tickets isolated across separate paper logs and disconnected chats.
                            </p>
                        </div>

                        <div className="sc-card p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center font-bold text-sm mb-4">02</div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delayed Incident Response</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Broken pipes, security emergencies, and electrical faults taking days to reach appropriate maintenance staff.
                            </p>
                        </div>

                        <div className="sc-card p-6 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl shadow-xs">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm mb-4">03</div>
                            <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-300 mb-2">The SmartCampus Solution</h4>
                            <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                                Automated resource forecasting, digital QR gate check-ins, instant photo triage, and live emergency dispatch.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. REAL FEATURES BENTO GRID */}
            <section id="features" className="py-24 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                            <Sparkles size={14} /> Production-Verified Modules
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Engineered for Every Aspect of Campus Life
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto mt-2">
                            Every feature below is fully implemented and running inside our codebase.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {realFeatures.map((feat, index) => {
                            const IconComponent = feat.icon;
                            return (
                                <div
                                    key={index}
                                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-xs">
                                            <IconComponent size={22} />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2 inline-block">
                                            {feat.tag}
                                        </span>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">
                                            {feat.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {feat.desc}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 5. FOUR PORTALS, ONE PLATFORM (Interactive Tabs) */}
            <section id="portals" className="py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">Role-Based Experience</h2>
                        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Four Portals. One Cohesive Platform.
                        </h3>
                    </div>

                    {/* Portal Tabs Bar */}
                    <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-200/80 dark:bg-slate-900 rounded-2xl max-w-xl mx-auto mb-10 border border-slate-200 dark:border-slate-800">
                        {[
                            { id: 'student', label: '🎓 Student' },
                            { id: 'admin', label: '⚡ Admin' },
                            { id: 'employee', label: '🛠️ Staff' },
                            { id: 'security', label: '🛡️ Security' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActivePortalTab(tab.id)}
                                className={`flex-1 min-w-[100px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                    activePortalTab === tab.id
                                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Portal Tab Card Display */}
                    <div className="sc-card p-6 sm:p-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-7 space-y-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${portalDetails[activePortalTab].color}`}>
                                {portalDetails[activePortalTab].badge}
                            </span>
                            <h4 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                {portalDetails[activePortalTab].title}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                {portalDetails[activePortalTab].desc}
                            </p>
                            <ul className="space-y-2.5 pt-2">
                                {portalDetails[activePortalTab].features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{portalDetails[activePortalTab].previewTitle}</span>
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            </div>
                            {portalDetails[activePortalTab].previewContent}
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. HOW IT WORKS */}
            <section id="how-it-works" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Streamlined Flow</h2>
                        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            How SmartCampus Operates
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: "01", title: "Registration", desc: "Students & staff register with email, room, and department details." },
                            { step: "02", title: "Admin Approval", desc: "Admin reviews pending profiles in User Mgmt and activates role permissions." },
                            { step: "03", title: "Role Workspace", desc: "Dedicated portal unlocks with specialized tools, QR scanners, and telemetry." },
                            { step: "04", title: "Real-Time Sync", desc: "Instant WebSockets synchronize complaints, seat bookings, and broadcasts." }
                        ].map((s, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 relative">
                                <span className="text-4xl font-black text-slate-200 dark:text-slate-800 absolute top-4 right-4">{s.step}</span>
                                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 relative z-10">{s.title}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed relative z-10">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. PROJECT VIDEO SHOWCASE (Canva Embed) */}
            <section id="project-video-section" className="py-20 bg-gradient-to-b from-slate-50 via-slate-900 to-slate-950 text-white relative">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                            <Sparkles size={14} className="animate-pulse" />
                            <span>Interactive Video Walkthrough</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                            Watch SmartCampus in Action
                        </h2>
                        <p className="text-slate-400 text-sm max-w-xl mx-auto">
                            Comprehensive video presentation and system walkthrough by DEEPAK JAT.
                        </p>
                    </div>

                    <ProjectVideoPlayer
                        title="Smart Campus - Video Presentation"
                        subtitle="Full system architecture and features walkthrough"
                    />
                </div>
            </section>

            {/* 8. SECURITY & ARCHITECTURE */}
            <section id="security" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Enterprise Security</h2>
                        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Built with Modern Security Best Practices
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Lock, title: "bcrypt Password Hashing", desc: "Secure salt generation ensuring raw passwords never touch the database." },
                            { icon: Key, title: "Stateless JWT Auth", desc: "Cryptographically signed JSON Web Tokens for robust session integrity." },
                            { icon: ShieldCheck, title: "Role-Based Access Control", desc: "Strict RBAC middleware guards against unauthorized route traversal." },
                            { icon: Server, title: "Socket.io Channel Isolation", desc: "Authenticated socket channels for targeted role announcements." },
                            { icon: Database, title: "Multer File-Type Validation", desc: "Strict MIME-type checking on evidence photos and spreadsheet uploads." },
                            { icon: Activity, title: "XSS & Payload Sanitization", desc: "Clean input parsing safeguarding against cross-site scripting." }
                        ].map((sec, idx) => {
                            const SecIcon = sec.icon;
                            return (
                                <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                                        <SecIcon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{sec.title}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{sec.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 9. TECH STACK STRIP */}
            <div className="py-10 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Powered by Modern Web Technologies</p>
                    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-slate-600 dark:text-slate-400">
                        <span className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">⚛️ React 19</span>
                        <span className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">⚡ Vite 7</span>
                        <span className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">🟢 Node.js & Express</span>
                        <span className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">🍃 MongoDB & Mongoose</span>
                        <span className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">🔌 Socket.io WebSockets</span>
                        <span className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">🎨 Tailwind CSS v4</span>
                    </div>
                </div>
            </div>

            {/* 10. FAQ ACCORDION */}
            <section id="faq" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-14">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-2">Frequently Asked Questions</h2>
                        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Got Questions? We Have Answers.
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden transition-colors"
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full p-5 text-left flex justify-between items-center gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        size={18}
                                        className={`shrink-0 text-slate-400 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-emerald-500' : ''}`}
                                    />
                                </button>
                                {openFaq === idx && (
                                    <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/60 dark:border-slate-800/60 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 11. FINAL CTA BAND */}
            <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
                        Ready to Transform Your Campus?
                    </h2>
                    <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto mb-8 font-medium">
                        Log in with one of our quick demo role profiles or create a new student account to experience the next-generation campus dashboard.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-xl hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                        >
                            Open Demo Portals
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold text-sm border border-emerald-400/40 active:scale-95 transition-all cursor-pointer"
                        >
                            Register New Account
                        </button>
                    </div>
                </div>
            </section>

            {/* 12. FOOTER */}
            <footer className="py-12 bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
                        <span className="font-bold text-slate-200">SmartCampus</span>
                        <span className="text-slate-600">•</span>
                        <span>Final-year project, Parul University</span>
                    </div>

                    <div>
                        © {new Date().getFullYear()} SmartCampus. All rights reserved.
                    </div>

                    <div className="flex items-center gap-6 text-slate-400">
                        <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
                        <a href="#portals" className="hover:text-emerald-400 transition-colors">Portals</a>
                        <a href="#security" className="hover:text-emerald-400 transition-colors">Security</a>
                        <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
