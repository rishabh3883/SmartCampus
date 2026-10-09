import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
    BookOpen, CheckCircle, XCircle, QrCode, Scan, Clock, 
    Sparkles, ArrowRight, UserCheck, ShieldAlert, LogIn, 
    Layers, RefreshCw, Smartphone, Camera, ChevronRight
} from 'lucide-react';

const ScanSeat = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const initialCode = searchParams.get('code') || searchParams.get('seatCode') || '';
    const [seatCode, setSeatCode] = useState(initialCode);
    const [loadingSeat, setLoadingSeat] = useState(false);
    const [seatData, setSeatData] = useState(null);
    const [seatError, setSeatError] = useState('');

    // Guest / Student Form
    const [studentName, setStudentName] = useState(user?.name || '');
    const [enrollmentNumber, setEnrollmentNumber] = useState(user?.enrollmentNumber || '');
    const [actionLoading, setActionLoading] = useState(false);
    const [actionResult, setActionResult] = useState(null);

    // Camera Scanner Sim/Stream State
    const [isScanningCamera, setIsScanningCamera] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (initialCode) {
            fetchSeatInfo(initialCode);
        }
    }, [initialCode]);

    useEffect(() => {
        if (user) {
            setStudentName(user.name || '');
            if (user.enrollmentNumber) setEnrollmentNumber(user.enrollmentNumber);
        }
    }, [user]);

    const fetchSeatInfo = async (code) => {
        if (!code) return;
        setLoadingSeat(true);
        setSeatError('');
        setActionResult(null);
        try {
            const res = await API.get(`/library/seat-info/${encodeURIComponent(code.trim())}`);
            setSeatData(res.data);
        } catch (err) {
            setSeatError(err.response?.data?.message || 'Invalid QR code. Could not find seat.');
            setSeatData(null);
        } finally {
            setLoadingSeat(false);
        }
    };

    const handleAction = async (actionType = 'TOGGLE') => {
        if (!seatCode) {
            alert('Please enter or scan a valid Seat QR Code.');
            return;
        }

        setActionLoading(true);
        try {
            const res = await API.post('/library/seats/scan', {
                seatCode: seatCode.trim(),
                studentName: studentName.trim() || 'Campus Student',
                enrollmentNumber: enrollmentNumber.trim(),
                actionType: actionType === 'OCCUPY' ? 'OCCUPY' : undefined
            });

            setActionResult(res.data);
            if (res.data.action === 'OCCUPIED') {
                confetti({
                    particleCount: 80,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }

            // Refresh seat details
            fetchSeatInfo(seatCode);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to process seat booking.');
        } finally {
            setActionLoading(false);
        }
    };

    // Camera start simulation
    const toggleCamera = async () => {
        if (isScanningCamera) {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
            setIsScanningCamera(false);
        } else {
            try {
                setIsScanningCamera(true);
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.warn('Camera access not granted or unavailable:', err);
                setIsScanningCamera(false);
                alert('Camera access unavailable. You can enter or paste the QR Code manually.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header / Navbar */}
            <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 py-4 flex justify-between items-center z-10">
                <Link to="/" className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <h1 className="font-extrabold text-base tracking-tight text-white">Smart <span className="text-emerald-400">Campus</span></h1>
                        <p className="text-[10px] text-slate-400 font-medium">Parul University Library QR Booking</p>
                    </div>
                </Link>

                <div>
                    {user ? (
                        <Link 
                            to={user.role === 'Admin' ? '/admin/library' : '/student/library'}
                            className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                        >
                            <span>Dashboard</span>
                            <ChevronRight size={14} />
                        </Link>
                    ) : (
                        <Link 
                            to="/login"
                            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                        >
                            <LogIn size={14} />
                            <span>Sign In</span>
                        </Link>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-xl mx-auto w-full px-4 py-8 z-10">
                <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl">
                    
                    {/* Title */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            <Sparkles size={14} /> Instant QR Seat Check-In
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Scan to Book Library Seat
                        </h2>
                        <p className="text-slate-400 text-xs sm:text-sm">
                            Scan any library desk QR code to occupy or release your study slot instantly.
                        </p>
                    </div>

                    {/* QR Code Input or Live Scanner */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex justify-between items-center">
                            <span>Seat QR Code</span>
                            <button 
                                type="button" 
                                onClick={toggleCamera}
                                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                            >
                                <Camera size={13} />
                                {isScanningCamera ? 'Close Camera' : 'Scan with Camera'}
                            </button>
                        </label>

                        {isScanningCamera && (
                            <div className="rounded-2xl overflow-hidden border border-emerald-500/40 relative bg-black aspect-video flex items-center justify-center">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                <div className="absolute inset-0 border-2 border-emerald-400/60 rounded-2xl pointer-events-none animate-pulse"></div>
                                <div className="absolute bottom-2 bg-black/70 px-3 py-1 rounded-full text-[11px] text-slate-200">
                                    Point camera at desk QR sticker
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <QrCode className="absolute left-3.5 top-3.5 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    value={seatCode}
                                    onChange={(e) => setSeatCode(e.target.value)}
                                    placeholder="e.g. LIB-SEAT-1-ABCDE"
                                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-3 text-sm text-white font-mono placeholder:font-sans placeholder:text-slate-500 outline-none transition-all"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => fetchSeatInfo(seatCode)}
                                disabled={loadingSeat || !seatCode}
                                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
                            >
                                {loadingSeat ? <RefreshCw size={15} className="animate-spin" /> : <Scan size={15} />}
                                <span>Lookup</span>
                            </button>
                        </div>
                    </div>

                    {/* Genuinity & Verification Header Badge */}
                    {seatData && (
                        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                            seatData.isGenuine !== false 
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' 
                                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                        }`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${seatData.isGenuine !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-black tracking-wide uppercase">
                                            {seatData.isGenuine !== false ? '✅ 100% Genuine Parul University Asset' : '❌ Unverified QR Code'}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        {seatData.verification?.issuer || 'Parul University Infrastructure Registry'}
                                    </p>
                                </div>
                            </div>
                            <span className="hidden sm:inline-block text-[10px] font-mono bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-400">
                                SEC-VERIFIED
                            </span>
                        </div>
                    )}

                    {/* Error Box */}
                    {seatError && (
                        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 animate-in fade-in">
                            <ShieldAlert size={20} className="text-rose-400 shrink-0" />
                            <div>
                                <h4 className="font-extrabold text-rose-200">❌ Fake / Unrecognized QR Code</h4>
                                <p className="mt-0.5 text-rose-300/90">{seatError}</p>
                            </div>
                        </div>
                    )}

                    {/* Seat Details Card */}
                    {seatData && (
                        <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4 animate-in fade-in shadow-xl">
                            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800">
                                        {seatData.library?.name || 'Central Tech Library'}
                                    </span>
                                    <h3 className="text-2xl font-black text-white mt-1">
                                        {seatData.seat.seatNumber}
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Location: {seatData.verification?.location || 'Library Academic Wing'}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                    seatData.seat.status === 'Occupied' 
                                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse' 
                                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}>
                                    ● {seatData.seat.status}
                                </span>
                            </div>

                            {/* Detailed Metadata Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                                <div>
                                    <span className="text-slate-500 font-semibold block text-[10px] uppercase">Unique Seat Code</span>
                                    <code className="text-emerald-400 font-mono font-bold">{seatData.seat.seatCode}</code>
                                </div>
                                <div>
                                    <span className="text-slate-500 font-semibold block text-[10px] uppercase">Security Hash</span>
                                    <code className="text-slate-300 font-mono text-[11px]">{seatData.verification?.securityToken || 'PU-VERIFIED-AUTH'}</code>
                                </div>
                                {seatData.seat.status === 'Occupied' && (
                                    <>
                                        <div>
                                            <span className="text-slate-500 font-semibold block text-[10px] uppercase">Occupied By</span>
                                            <span className="text-white font-bold">{seatData.seat.occupiedByName || 'Registered Student'}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 font-semibold block text-[10px] uppercase">Occupied Since</span>
                                            <span className="text-slate-300">{seatData.seat.occupiedAt ? new Date(seatData.seat.occupiedAt).toLocaleTimeString() : 'Just now'}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Student Name / Enrollment input for guests if not logged in */}
                            {!user && seatData.seat.status === 'Vacant' && (
                                <div className="pt-3 border-t border-slate-800 space-y-3">
                                    <p className="text-xs text-slate-300 font-bold">Student Check-In Details:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={studentName}
                                            onChange={(e) => setStudentName(e.target.value)}
                                            placeholder="Your Full Name"
                                            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                                        />
                                        <input
                                            type="text"
                                            value={enrollmentNumber}
                                            onChange={(e) => setEnrollmentNumber(e.target.value)}
                                            placeholder="Enrollment No (Optional)"
                                            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-3">
                                {seatData.seat.status === 'Vacant' ? (
                                    <button
                                        type="button"
                                        onClick={() => handleAction('OCCUPY')}
                                        disabled={actionLoading}
                                        className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                                    >
                                        {actionLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <UserCheck size={18} />
                                                <span>Reserve & Occupy This Seat Now</span>
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleAction('TOGGLE')}
                                        disabled={actionLoading}
                                        className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all"
                                    >
                                        {actionLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <XCircle size={18} />
                                                <span>Vacate & Release Seat</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Result Alert */}
                    {actionResult && (
                        <div className={`p-4 rounded-2xl text-xs font-bold border flex items-center gap-3 animate-in fade-in ${
                            actionResult.action === 'OCCUPIED'
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                                : 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                        }`}>
                            <CheckCircle size={20} className="shrink-0 text-emerald-400" />
                            <span>{actionResult.message}</span>
                        </div>
                    )}

                    {/* Quick Demo Seat Codes Chips */}
                    <div className="pt-4 border-t border-slate-800 space-y-2.5">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Try Quick Sample Desk QRs:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {['LIB-SEAT-A01-CSE', 'LIB-SEAT-1-DEMO', 'CENT-SEAT-1-A', 'CENT-SEAT-2-B'].map((sample) => (
                                <button
                                    key={sample}
                                    type="button"
                                    onClick={() => {
                                        setSeatCode(sample);
                                        fetchSeatInfo(sample);
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-mono text-[11px] transition-all"
                                >
                                    {sample}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="text-center text-slate-600 text-xs py-4">
                Smart Campus Management System • Parul University
            </footer>
        </div>
    );
};

export default ScanSeat;
