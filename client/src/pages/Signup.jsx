import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { User, Mail, Lock, Building, ArrowRight, UserPlus, CheckCircle, GraduationCap, Home } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'Student',
        residenceType: 'Hosteler', // 'Hosteler' or 'DayScholar'
        hostelName: '', roomNumber: '', enrollmentNumber: ''
    });
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
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-[100px] opacity-60"></div>
                <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-emerald-100 rounded-full blur-[100px] opacity-60"></div>
            </div>

            <div className="card w-full max-w-2xl bg-white border-slate-200 shadow-xl relative z-10 animate-enter">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 text-purple-600 mb-4 shadow-sm shadow-purple-100">
                        <UserPlus size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
                    <p className="text-slate-500 text-sm mt-1">Join the SmartCampus community</p>
                </div>

                {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg mb-6 text-sm flex items-center gap-2">
                        <span>•</span> {error}
                    </div>
                )}

                {success ? (
                    <div className="text-center py-10 animate-enter">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Account Created!</h3>
                        <p className="text-slate-500 mt-2">Redirecting to login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input name="name" type="text" placeholder="John Doe" required
                                        className="input-field pl-12" onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <label className="label">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input name="email" type="email" placeholder="john@campus.edu" required
                                        className="input-field pl-12" onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <label className="label">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input name="password" type="password" placeholder="••••••••" required
                                        className="input-field pl-12" onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <label className="label">Role</label>
                                <select name="role" className="input-field appearance-none" onChange={handleChange} value={formData.role}>
                                    <option value="Student">Student</option>
                                    <option value="Employee">Employee (Staff)</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>

                        {/* Student Specific Fields */}
                        {formData.role === 'Student' && (
                            <div className="space-y-6 animate-enter">
                                {/* Academic Details */}
                                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                                    <h3 className="text-sm font-bold text-indigo-700 mb-3 flex items-center"><GraduationCap size={16} className="mr-2" /> Academic Details</h3>
                                    <div>
                                        <input name="enrollmentNumber" type="text" placeholder="Enrollment ID (e.g. CS2024001)" required
                                            className="input-field bg-white" onChange={handleChange} />
                                    </div>
                                </div>

                                {/* Residence Details */}
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center"><Home size={16} className="mr-2" /> Residential Status</h3>

                                    <div className="flex gap-4 mb-4">
                                        <label className={`flex-1 p-3 rounded-lg border cursor-pointer transition-all ${formData.residenceType === 'Hosteler' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                                            <input type="radio" name="residenceType" value="Hosteler" className="hidden"
                                                checked={formData.residenceType === 'Hosteler'} onChange={handleChange} />
                                            <div className="font-bold text-sm text-center">Hosteler</div>
                                        </label>
                                        <label className={`flex-1 p-3 rounded-lg border cursor-pointer transition-all ${formData.residenceType === 'DayScholar' ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                                            <input type="radio" name="residenceType" value="DayScholar" className="hidden"
                                                checked={formData.residenceType === 'DayScholar'} onChange={handleChange} />
                                            <div className="font-bold text-sm text-center">Day Scholar (External)</div>
                                        </label>
                                    </div>

                                    {formData.residenceType === 'Hosteler' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-enter">
                                            <div>
                                                <select name="hostelName" className="input-field" onChange={handleChange} required>
                                                    <option value="">Select Hostel</option>
                                                    <option value="H1">Hostel H1</option>
                                                    <option value="H2">Hostel H2</option>
                                                </select>
                                            </div>
                                            <div>
                                                <input name="roomNumber" type="text" placeholder="Room Number" required
                                                    className="input-field" onChange={handleChange} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
                            {loading ? 'Creating Account...' : 'Sign Up'} <ArrowRight size={18} />
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
                    Already have an account? <Link to="/login" className="text-purple-600 hover:text-purple-500 font-bold">Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
