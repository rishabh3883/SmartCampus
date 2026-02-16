import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

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
            // Redirect based on role
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

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-100 rounded-full blur-[100px] opacity-60"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-100 rounded-full blur-[100px] opacity-60"></div>
            </div>

            <div className="card w-full max-w-md bg-white border-slate-200 shadow-xl relative z-10 animate-enter">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 mb-4 shadow-sm shadow-emerald-100">
                        <ShieldCheck size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                    <p className="text-slate-500 text-sm mt-1">Sign in to your SmartCampus account</p>
                </div>

                {error && (
                    <div className={`p-3 rounded-lg mb-6 text-sm flex items-start gap-2 ${error.toLowerCase().includes('pending') ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                        <span>•</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="label">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field pl-12"
                                placeholder="name@campus.edu"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-sm font-medium text-slate-600">Password</label>
                            <a href="#" className="text-xs text-emerald-600 hover:text-emerald-500 font-medium">Forgot password?</a>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pl-12"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full py-2.5 mt-2"
                    >
                        {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={18} />
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
                    Don't have an account? <Link to="/signup" className="text-emerald-600 hover:text-emerald-500 font-bold">Create Account</Link>
                </div>

                {/* Developer Hint - Remove in production */}
                <div className="mt-8 bg-slate-50 p-4 rounded-lg text-xs text-slate-600 border border-slate-200">
                    <p className="font-semibold mb-2 text-slate-700">Quick Access (Dev Mode):</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="hover:text-emerald-600 cursor-pointer transition-colors" onClick={() => { setEmail('admin@college.edu'); setPassword('password123') }}>• Admin</div>
                        <div className="hover:text-emerald-600 cursor-pointer transition-colors" onClick={() => { setEmail('rishabh@student.edu'); setPassword('password123') }}>• Student</div>
                        <div className="hover:text-emerald-600 cursor-pointer transition-colors" onClick={() => { setEmail('staff@college.edu'); setPassword('password123') }}>• Staff</div>
                        <div className="hover:text-emerald-600 cursor-pointer transition-colors" onClick={() => { setEmail('security@campus.com'); setPassword('security123') }}>• Security</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
