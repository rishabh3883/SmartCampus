import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Lock, Mail, ArrowRight, ShieldCheck, Sparkles, User, Key,
    ShieldAlert, Eye, EyeOff, CheckCircle2, Shield, Activity
} from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { handleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await handleLogin(email, password);
            if (data.user.role === 'Admin') navigate('/admin');
            else if (data.user.role === 'Employee') navigate('/employee');
            else if (data.user.role === 'Security') navigate('/security');
            else navigate('/student');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please verify your email and password.');
        } finally {
            setLoading(false);
        }
    };

    const fillPreset = (emailVal, passVal) => {
        setEmail(emailVal);
        setPassword(passVal);
        setError('');
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            {/* LEFT BRAND PANEL (Desktop 5 cols) */}
            <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-12 text-white flex-col justify-between relative overflow-hidden border-r border-slate-800">
                {/* Background Mesh */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10">
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                            <Sparkles size={20} />
                        </div>
                        <span className="text-xl font-black text-white tracking-tight">
                            Smart<span className="text-emerald-400">Campus</span>
                        </span>
                    </Link>

                    <div className="mt-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck size={14} />
                            <span>Unified Role Architecture</span>
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
                            One Login.<br />
                            Four Role-Tailored Experiences.
                        </h1>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-medium">
                            Stateless JWT security, live WebSocket broadcasts, and smart campus automation at your fingertips.
                        </p>
                    </div>
                </div>

                {/* Highlights Card */}
                <div className="relative z-10 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-bold pb-2 border-b border-white/10">
                        <span>Role Capabilities</span>
                        <span className="text-emerald-400 font-mono">100% Synced</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400"></span> Executive Admin</div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Student Hub</div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Staff Facility</div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400"></span> Gate Security</div>
                    </div>
                </div>

                <div className="relative z-10 text-xs text-slate-500 font-medium">
                    © {new Date().getFullYear()} SmartCampus. Final-year project, Parul University.
                </div>
            </div>

            {/* RIGHT FORM PANEL (Desktop 7 cols / Full Mobile) */}
            <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-12 lg:p-16 relative">
                {/* Top Nav Action */}
                <div className="flex items-center justify-between">
                    <Link to="/" className="lg:hidden flex items-center gap-2 font-black text-lg text-slate-900 dark:text-white">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-xs">SC</div>
                        <span>Smart<span className="text-emerald-500">Campus</span></span>
                    </Link>
                    <div className="ml-auto flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            to="/signup"
                            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 px-3 py-2 rounded-xl transition-colors"
                        >
                            Need an account? <span className="text-emerald-600 dark:text-emerald-400 underline underline-offset-4">Sign Up</span>
                        </Link>
                    </div>
                </div>

                {/* Main Form Center */}
                <div className="max-w-md w-full mx-auto my-8 space-y-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Sign In to SmartCampus
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                            Select a demo profile or enter your verified credentials below.
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 shadow-xs animate-enter">
                            <ShieldAlert size={18} className="shrink-0 text-rose-500 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Quick Demo Autofill Role Chips */}
                    <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-1.5 text-amber-500">
                                <Sparkles size={14} /> Quick Demo Portals:
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">Click to fill</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => fillPreset('admin@college.edu', 'password123')}
                                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:border-purple-400 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-left flex items-center gap-2 group cursor-pointer shadow-2xs hover:shadow-xs"
                            >
                                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 group-hover:scale-125 transition-transform shrink-0"></span>
                                <span className="truncate">Admin Portal</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => fillPreset('rishabh@student.edu', 'password123')}
                                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:border-blue-400 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-left flex items-center gap-2 group cursor-pointer shadow-2xs hover:shadow-xs"
                            >
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 group-hover:scale-125 transition-transform shrink-0"></span>
                                <span className="truncate">Student Portal</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => fillPreset('staff@college.edu', 'password123')}
                                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:border-amber-400 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-left flex items-center gap-2 group cursor-pointer shadow-2xs hover:shadow-xs"
                            >
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform shrink-0"></span>
                                <span className="truncate">Staff / Facility</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => fillPreset('security@campus.com', 'security123')}
                                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:border-rose-400 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-left flex items-center gap-2 group cursor-pointer shadow-2xs hover:shadow-xs"
                            >
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 group-hover:scale-125 transition-transform shrink-0"></span>
                                <span className="truncate">Security Guard</span>
                            </button>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                    placeholder="admin@college.edu"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                    Password
                                </label>
                                <a href="#" onClick={(e) => { e.preventDefault(); alert("Please use one of the quick demo buttons or contact your campus administrator."); }} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pl-11 pr-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="btn btn-primary w-full py-3.5 mt-2 text-sm font-bold tracking-wide cursor-pointer shadow-lg shadow-emerald-500/20"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Signing In...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Access Portal <ArrowRight size={17} />
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Bottom Notice */}
                <div className="text-center text-xs text-slate-400 dark:text-slate-500 pt-4">
                    Protected by cryptographically signed JWT sessions and backend RBAC authorization.
                </div>
            </div>
        </div>
    );
};

export default Login;
