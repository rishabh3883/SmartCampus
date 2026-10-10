import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import {
    User, Mail, Lock, Building, ArrowRight, UserPlus, CheckCircle2,
    GraduationCap, Home, Sparkles, ShieldCheck, Eye, EyeOff, ShieldAlert
} from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'Student',
        residenceType: 'Hosteler', // 'Hosteler' or 'DayScholar'
        hostelName: '', roomNumber: '', enrollmentNumber: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }

        // Prepare payload (exclude hostel details if Day Scholar)
        const payload = { ...formData };
        if (formData.residenceType === 'DayScholar') {
            delete payload.hostelName;
            delete payload.roomNumber;
        }

        try {
            await API.post('/auth/signup', payload);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please check your information and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
            {/* LEFT BRAND PANEL */}
            <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-12 text-white flex-col justify-between relative overflow-hidden border-r border-slate-800">
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
                            <UserPlus size={14} />
                            <span>Quick Registration</span>
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
                            Join the Connected<br />
                            Smart Campus Network.
                        </h1>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-medium">
                            Create your account to unlock real-time library bookings, issue reporting, and campus broadcasts.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 space-y-2">
                    <p className="text-xs font-bold text-slate-200">Registration Process</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        After submitting, your profile enters the administrator approval queue for verified role assignment.
                    </p>
                </div>

                <div className="relative z-10 text-xs text-slate-500 font-medium">
                    © {new Date().getFullYear()} SmartCampus. Final-year project, Parul University.
                </div>
            </div>

            {/* RIGHT FORM PANEL */}
            <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-12 lg:p-16 relative">
                <div className="flex items-center justify-between">
                    <Link to="/" className="lg:hidden flex items-center gap-2 font-black text-lg text-slate-900 dark:text-white">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-xs">SC</div>
                        <span>Smart<span className="text-emerald-500">Campus</span></span>
                    </Link>
                    <div className="ml-auto flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            to="/login"
                            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 px-3 py-2 rounded-xl transition-colors"
                        >
                            Already registered? <span className="text-emerald-600 dark:text-emerald-400 underline underline-offset-4">Log In</span>
                        </Link>
                    </div>
                </div>

                <div className="max-w-xl w-full mx-auto my-8 space-y-6">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            Create Your Account
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                            Enter your official details to register with the campus administration.
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 shadow-xs animate-enter">
                            <ShieldAlert size={18} className="shrink-0 text-rose-500 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success ? (
                        <div className="p-8 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-3 animate-enter">
                            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                                <CheckCircle2 size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Registration Submitted!</h3>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                                Your account is pending admin verification. Redirecting to login portal...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <User size={18} />
                                        </div>
                                        <input
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            required
                                            className="input-field pl-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <Mail size={18} />
                                        </div>
                                        <input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@campus.edu"
                                            required
                                            className="input-field pl-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            required
                                            className="input-field pl-11 pr-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                                        Target Role
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="input-field bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-semibold"
                                    >
                                        <option value="Student">🎓 Student</option>
                                        <option value="Employee">🛠️ Employee (Staff)</option>
                                        <option value="Admin">⚡ Administrator</option>
                                    </select>
                                </div>
                            </div>

                            {/* Student Specific Fields */}
                            {formData.role === 'Student' && (
                                <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800 animate-enter">
                                    {/* Academic Details */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1.5 flex items-center gap-1.5">
                                            <GraduationCap size={15} /> Enrollment / Student ID
                                        </label>
                                        <input
                                            name="enrollmentNumber"
                                            type="text"
                                            placeholder="e.g. CS2024001"
                                            required
                                            value={formData.enrollmentNumber}
                                            onChange={handleChange}
                                            className="input-field bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                        />
                                    </div>

                                    {/* Residence Details */}
                                    <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                            <Home size={15} /> Residential Status
                                        </label>

                                        <div className="grid grid-cols-2 gap-3">
                                            <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-center gap-2 ${
                                                formData.residenceType === 'Hosteler'
                                                    ? 'bg-white dark:bg-slate-800 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                                                    : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="residenceType"
                                                    value="Hosteler"
                                                    className="hidden"
                                                    checked={formData.residenceType === 'Hosteler'}
                                                    onChange={handleChange}
                                                />
                                                <span className="text-xs">🏠 Hosteler</span>
                                            </label>

                                            <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-center gap-2 ${
                                                formData.residenceType === 'DayScholar'
                                                    ? 'bg-white dark:bg-slate-800 border-blue-500 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                                                    : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300'
                                            }`}>
                                                <input
                                                    type="radio"
                                                    name="residenceType"
                                                    value="DayScholar"
                                                    className="hidden"
                                                    checked={formData.residenceType === 'DayScholar'}
                                                    onChange={handleChange}
                                                />
                                                <span className="text-xs">🚗 Day Scholar</span>
                                            </label>
                                        </div>

                                        {formData.residenceType === 'Hosteler' && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 animate-enter">
                                                <select
                                                    name="hostelName"
                                                    value={formData.hostelName}
                                                    onChange={handleChange}
                                                    required
                                                    className="input-field bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs font-semibold"
                                                >
                                                    <option value="">Select Hostel Building</option>
                                                    <option value="H1">Hostel H1 (Boys)</option>
                                                    <option value="H2">Hostel H2 (Girls)</option>
                                                </select>
                                                <input
                                                    name="roomNumber"
                                                    type="text"
                                                    value={formData.roomNumber}
                                                    onChange={handleChange}
                                                    placeholder="Room Number (e.g. 204)"
                                                    required
                                                    className="input-field bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full py-3.5 mt-4 text-sm font-bold tracking-wide cursor-pointer shadow-lg shadow-emerald-500/20"
                            >
                                {loading ? 'Submitting Registration...' : 'Complete Registration'}
                            </button>
                        </form>
                    )}
                </div>

                <div className="text-center text-xs text-slate-400 dark:text-slate-500 pt-4">
                    All accounts undergo mandatory campus administrator verification before portal activation.
                </div>
            </div>
        </div>
    );
};

export default Signup;
