import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, User, Key, ShieldAlert } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans bg-slate-950">
            {/* Dynamic Mesh & Glow Orbs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px]"></div>
            </div>

            <div className="w-full max-w-md glass-panel rounded-2xl p-8 relative z-10 animate-enter border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white mb-4 shadow-lg shadow-emerald-500/30">
                        <ShieldCheck size={28} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        Smart <span className="text-gradient">Campus</span>
                    </h2>
                    <p className="text-slate-400 text-sm mt-1.5 font-medium">
                        Welcome back! Sign in to access your dashboard.
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="p-3.5 rounded-xl mb-6 text-sm flex items-center gap-3 bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm animate-enter">
                        <ShieldAlert size={18} className="shrink-0 text-rose-400" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="label">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={19} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field pl-11"
                                placeholder="admin@college.edu"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="label">Password</label>
                            <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-semibold">Forgot password?</a>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={19} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-11"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full py-3 mt-2 text-base font-bold tracking-wide"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Authenticating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                Sign In <ArrowRight size={19} />
                            </span>
                        )}
                    </button>
                </form>

                {/* Footer link */}
                <div className="mt-7 pt-5 border-t border-slate-700/50 text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                        Create Account
                    </Link>
                </div>

                {/* Interactive Preset Chips */}
                <div className="mt-6 pt-5 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-3">
                        <Sparkles size={14} className="text-amber-400" />
                        <span>Quick Demo Portals (Click to autofill):</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => fillPreset('admin@college.edu', 'password123')}
                            className="px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-slate-700/60 text-slate-300 hover:text-emerald-300 text-xs font-medium transition-all text-left flex items-center gap-2 group"
                        >
                            <span className="w-2 h-2 rounded-full bg-purple-400 group-hover:scale-125 transition-transform"></span>
                            Admin Portal
                        </button>

                        <button
                            type="button"
                            onClick={() => fillPreset('rishabh@student.edu', 'password123')}
                            className="px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-slate-700/60 text-slate-300 hover:text-emerald-300 text-xs font-medium transition-all text-left flex items-center gap-2 group"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-400 group-hover:scale-125 transition-transform"></span>
                            Student Portal
                        </button>

                        <button
                            type="button"
                            onClick={() => fillPreset('staff@college.edu', 'password123')}
                            className="px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-slate-700/60 text-slate-300 hover:text-emerald-300 text-xs font-medium transition-all text-left flex items-center gap-2 group"
                        >
                            <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform"></span>
                            Staff Portal
                        </button>

                        <button
                            type="button"
                            onClick={() => fillPreset('security@campus.com', 'security123')}
                            className="px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-slate-700/60 text-slate-300 hover:text-emerald-300 text-xs font-medium transition-all text-left flex items-center gap-2 group"
                        >
                            <span className="w-2 h-2 rounded-full bg-rose-400 group-hover:scale-125 transition-transform"></span>
                            Security Guard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

