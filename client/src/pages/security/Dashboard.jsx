import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { 
    AlertTriangle, Shield, CheckCircle, Clock, Siren, 
    Scan, UserCheck, Search, AlertCircle, XCircle, Ticket, Calendar, MapPin, User, Camera
} from 'lucide-react';
import CameraQrScannerModal from '../../components/CameraQrScannerModal';

const SecurityDashboard = () => {
    const [activeTab, setActiveTab] = useState('emergency'); // 'emergency' | 'events'
    const [alarms, setAlarms] = useState([]);
    const [triggering, setTriggering] = useState(false);

    // Event Verification State
    const [ticketInput, setTicketInput] = useState('');
    const [scanLoading, setScanLoading] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [recentCheckIns, setRecentCheckIns] = useState([]);
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    useEffect(() => {
        fetchAlarms();
        const interval = setInterval(fetchAlarms, 5000); // Poll for updates
        return () => clearInterval(interval);
    }, []);

    const fetchAlarms = async () => {
        try {
            const { data } = await API.get('/complaints');
            const emergencies = data.filter(c => c.type === 'Emergency');
            setAlarms(emergencies);
        } catch (err) {
            console.error("Failed to fetch alarms", err);
        }
    };

    const triggerAlarm = async () => {
        if (!window.confirm("Are you sure you want to trigger a CAMPUS-WIDE EMERGENCY ALARM?")) return;

        setTriggering(true);
        try {
            await API.post('/complaints', {
                type: 'Emergency',
                title: 'SECURITY ALARM TRIGGERED',
                description: 'Security Personnel triggered a manual alarm. Immediate attention required.',
            });
            alert("ALARM TRIGGERED SUCCESSFULLY");
            fetchAlarms();
        } catch (err) {
            alert("FAILED TO TRIGGER ALARM: " + (err.response?.data?.message || err.message));
        } finally {
            setTriggering(false);
        }
    };

    const handleCameraScanSuccess = (decodedCode) => {
        setTicketInput(decodedCode);
        handleVerifyCode(decodedCode);
    };

    const handleVerifyCode = async (codeToVerify) => {
        const code = codeToVerify || ticketInput;
        if (!code || !code.trim()) return;

        setScanLoading(true);
        setScanResult(null);

        try {
            const res = await API.post('/events/verify-entry', { qrCode: code.trim() });
            const resultData = {
                success: true,
                isGenuine: true,
                isDuplicate: false,
                message: res.data.message || 'Pass verified successfully!',
                verification: res.data.verification,
                booking: res.data.booking,
                timestamp: new Date().toLocaleTimeString()
            };
            setScanResult(resultData);
            setRecentCheckIns(prev => [resultData, ...prev.slice(0, 9)]);
            setTicketInput('');
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Verification failed: Pass not found or counterfeit";
            const isDuplicate = err.response?.data?.isDuplicate || err.response?.data?.alreadyUsed || false;
            const isGenuine = err.response?.data?.isGenuine || false;
            setScanResult({
                success: false,
                isGenuine,
                isDuplicate,
                message: errorMsg,
                verification: err.response?.data?.verification,
                booking: err.response?.data?.booking,
                timestamp: new Date().toLocaleTimeString()
            });
        } finally {
            setScanLoading(false);
        }
    };

    const handleVerifyTicket = async (e) => {
        if (e) e.preventDefault();
        handleVerifyCode(ticketInput);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'text-rose-600 bg-rose-50 border-rose-200 animate-pulse';
            case 'Accepted': return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'On The Way': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Resolved': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            default: return 'text-slate-500 bg-slate-100 border-slate-200';
        }
    };

    return (
        <div className="min-h-screen pb-12 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
            <Navbar />

            <div className="page-container max-w-5xl mx-auto px-4 py-8">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl mb-8">
                    <div className="flex items-center gap-4 text-left">
                        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                            <Shield size={36} />
                        </div>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-800">
                                Campus Security Department
                            </span>
                            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">Security Command Center</h1>
                            <p className="text-slate-400 text-xs md:text-sm">Real-time Emergency SOS & Event Gate Pass Verification</p>
                        </div>
                    </div>

                    {/* View Switcher Tabs */}
                    <div className="flex p-1.5 bg-slate-800 rounded-2xl border border-slate-700 w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab('emergency')}
                            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                                activeTab === 'emergency' 
                                    ? 'bg-rose-600 text-white shadow-md' 
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <Siren size={16} />
                            <span>SOS & Alarms</span>
                            {alarms.length > 0 && (
                                <span className="w-2 h-2 rounded-full bg-rose-300 animate-ping"></span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('events')}
                            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                                activeTab === 'events' 
                                    ? 'bg-emerald-600 text-white shadow-md' 
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <UserCheck size={16} />
                            <span>Event Gate Pass</span>
                        </button>
                    </div>
                </div>

                {/* TAB 1: SOS & EMERGENCY RESPONSE */}
                {activeTab === 'emergency' && (
                    <div className="space-y-8 animate-enter">
                        {/* BIG RED BUTTON */}
                        <div className="text-center bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-lg">
                            <h2 className="text-xl font-black text-slate-900 mb-2">Emergency Broadcast Switch</h2>
                            <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto mb-8">
                                Triggers an instantaneous campus-wide emergency protocol alerting all security officers and administrators.
                            </p>

                            <div className="flex justify-center mb-6">
                                <button
                                    onClick={triggerAlarm}
                                    disabled={triggering}
                                    className={`
                                        relative group w-64 h-64 md:w-72 md:h-72 rounded-full border-[10px] border-slate-100
                                        bg-gradient-to-br from-rose-500 to-red-700 
                                        text-white font-black text-2xl md:text-3xl tracking-widest shadow-2xl shadow-rose-500/30
                                        transform transition-all duration-300 active:scale-95 hover:scale-105
                                        flex flex-col items-center justify-center gap-3 z-10 overflow-hidden ring-8 ring-rose-100/50
                                        ${triggering ? 'opacity-80 cursor-wait' : ''}
                                    `}
                                >
                                    <div className="p-4 rounded-full bg-rose-900/30 backdrop-blur-sm border border-white/20">
                                        <Siren size={56} className="text-white drop-shadow-md group-hover:animate-pulse" />
                                    </div>
                                    <span className="relative z-10">
                                        {triggering ? 'TRIGGERING...' : 'TRIGGER ALARM'}
                                    </span>
                                </button>
                            </div>
                            <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">
                                ⚠️ Strictly for verified on-campus emergencies
                            </span>
                        </div>

                        {/* Recent Alarms Feed */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                                <div className="flex items-center gap-2 font-bold text-slate-800">
                                    <Clock className="text-slate-400" size={18} />
                                    <span>Active Emergency Feed</span>
                                </div>
                                {alarms.length > 0 && (
                                    <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full animate-pulse">
                                        {alarms.length} Active
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">
                                {alarms.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                        <Shield size={40} className="mx-auto mb-3 text-slate-300" />
                                        <p className="text-slate-500 font-medium text-sm">No active emergency alarms. System nominal.</p>
                                    </div>
                                ) : (
                                    alarms.map(alarm => (
                                        <div key={alarm._id} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-bold text-slate-900">{alarm.title}</h3>
                                                        <span className={`text-[10px] font-black px-3 py-0.5 rounded-full border ${getStatusColor(alarm.status)}`}>
                                                            {alarm.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 text-xs mt-1">{alarm.description}</p>
                                                    <span className="text-[10px] text-slate-400 block mt-1">
                                                        ID: {alarm._id.slice(-6)} • {new Date(alarm.createdAt).toLocaleString()}
                                                    </span>
                                                </div>

                                                {alarm.status === 'Pending' && (
                                                    <button
                                                        onClick={async () => {
                                                            if (!window.confirm("Confirm you are responding to this emergency?")) return;
                                                            try {
                                                                await API.put(`/complaints/${alarm._id}/assign`);
                                                                alert("Response acknowledged.");
                                                                fetchAlarms();
                                                            } catch (err) { alert("Failed to accept: " + err.message); }
                                                        }}
                                                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                                                    >
                                                        Acknowledge & Respond
                                                    </button>
                                                )}
                                            </div>

                                            {alarm.studentId && (
                                                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                                                        {alarm.studentId?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-800">{alarm.studentId?.name}</span>
                                                        <span className="text-slate-400 ml-2">({alarm.studentId?.hostelId?.name || 'Campus'} - Room {alarm.studentId?.roomNumber || 'N/A'})</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: EVENT GATE PASS CHECK-IN & DUPLICATE PREVENTION */}
                {activeTab === 'events' && (
                    <div className="space-y-8 animate-enter">
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                                        <Scan size={22} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-slate-900">Event Gate Pass QR Verification</h2>
                                        <p className="text-slate-500 text-xs">Verify QR Authenticity, Participant Identity & Block Counterfeits</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsScannerOpen(true)}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                                >
                                    <Camera size={15} />
                                    <span>Open Live QR Scanner</span>
                                </button>
                            </div>

                            {/* Camera QR Scanner Modal */}
                            <CameraQrScannerModal
                                isOpen={isScannerOpen}
                                onClose={() => setIsScannerOpen(false)}
                                onScanSuccess={handleCameraScanSuccess}
                                title="Gate Pass QR Scanner"
                                description="Scan student or visitor event QR ticket for instant verification"
                            />

                            {/* Input Form */}
                            <form onSubmit={handleVerifyTicket} className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Ticket className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Scan or enter Pass QR Code (e.g. EVT-TICKET-xxxx)..."
                                        value={ticketInput}
                                        onChange={(e) => setTicketInput(e.target.value)}
                                        className="input-field pl-12 py-3 bg-slate-50 text-slate-900 border-slate-300 focus:bg-white text-sm"
                                        autoFocus
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={scanLoading || !ticketInput.trim()}
                                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                                >
                                    {scanLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <UserCheck size={18} />
                                            <span>Authenticate Pass</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Verification Result Feedback Card */}
                            {scanResult && (
                                <div className={`p-6 rounded-2xl border transition-all shadow-md ${
                                    scanResult.success 
                                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                                        : scanResult.isDuplicate
                                            ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                                            : 'bg-rose-50/90 border-rose-300 text-rose-950'
                                }`}>
                                    <div className="flex flex-col md:flex-row items-start gap-4">
                                        <div className={`p-3.5 rounded-2xl shrink-0 ${
                                            scanResult.success 
                                                ? 'bg-emerald-600 text-white' 
                                                : scanResult.isDuplicate 
                                                    ? 'bg-amber-600 text-white' 
                                                    : 'bg-rose-600 text-white'
                                        }`}>
                                            {scanResult.success ? <CheckCircle size={32} /> : scanResult.isDuplicate ? <AlertCircle size={32} /> : <XCircle size={32} />}
                                        </div>

                                        <div className="flex-1 w-full space-y-3">
                                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                                                <div>
                                                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                                        scanResult.success 
                                                            ? 'bg-emerald-200 text-emerald-900' 
                                                            : scanResult.isDuplicate 
                                                                ? 'bg-amber-200 text-amber-900' 
                                                                : 'bg-rose-200 text-rose-900'
                                                    }`}>
                                                        {scanResult.success 
                                                            ? '🟢 100% GENUINE & VALID PASS' 
                                                            : scanResult.isDuplicate 
                                                                ? '⚠️ DUPLICATE ENTRY (ALREADY USED)' 
                                                                : '🚨 COUNTERFEIT / UNREGISTERED QR'}
                                                    </span>
                                                    <h3 className="text-lg font-black mt-1">
                                                        {scanResult.success 
                                                            ? 'ENTRY GRANTED — OFFICIAL PASS' 
                                                            : scanResult.isDuplicate 
                                                                ? 'ENTRY BLOCKED — PASS ALREADY SCANNED' 
                                                                : 'ENTRY DENIED — INVALID PASS'}
                                                    </h3>
                                                </div>
                                                <span className="text-xs font-mono font-bold bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200">
                                                    {scanResult.timestamp}
                                                </span>
                                            </div>

                                            <p className="text-sm font-semibold">{scanResult.message}</p>

                                            {/* Detailed Attendee & Event Metadata */}
                                            {(scanResult.verification || scanResult.booking) && (
                                                <div className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3 text-xs text-slate-800 shadow-xs">
                                                    <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm">
                                                            {(scanResult.verification?.attendeeName || scanResult.booking?.attendeeName || 'U').charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-sm text-slate-900">
                                                                {scanResult.verification?.attendeeName || scanResult.booking?.attendeeName || 'Registered Student'}
                                                            </h4>
                                                            <p className="text-slate-500 text-[11px]">
                                                                Enrollment: <span className="font-mono font-bold text-slate-700">{scanResult.verification?.enrollmentNumber || scanResult.booking?.enrollmentNumber || 'PU2024CS001'}</span> • {scanResult.verification?.attendeeEmail || scanResult.booking?.attendeeEmail || ''}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                                                        <div>
                                                            <span className="text-slate-400 font-semibold block uppercase text-[9px]">Event Name</span>
                                                            <span className="font-bold text-slate-900">{scanResult.verification?.eventTitle || scanResult.booking?.eventId?.title || 'Campus Event'}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400 font-semibold block uppercase text-[9px]">Venue Location</span>
                                                            <span className="font-bold text-slate-900">{scanResult.verification?.venue || scanResult.booking?.eventId?.venue || 'Campus Auditorium'}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400 font-semibold block uppercase text-[9px]">Pass Token / QR Code</span>
                                                            <code className="font-mono text-emerald-700 font-bold break-all">{scanResult.verification?.qrCode || scanResult.booking?.qrCode || ticketInput}</code>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-400 font-semibold block uppercase text-[9px]">Issuing Authority</span>
                                                            <span className="font-semibold text-slate-700">{scanResult.verification?.issuer || 'Parul University Event Office'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Recent Validated Check-ins Log */}
                        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
                            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <UserCheck size={18} className="text-emerald-600" />
                                <span>Recent Gate Check-In History</span>
                            </h3>

                            {recentCheckIns.length === 0 ? (
                                <p className="text-slate-400 text-xs italic py-4">No check-ins recorded during this session yet.</p>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {recentCheckIns.map((item, idx) => (
                                        <div key={idx} className="py-3 flex justify-between items-center text-xs">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                                                    ✓
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-800">
                                                        {item.booking?.attendeeName || item.booking?.userId?.name || 'Participant'}
                                                    </span>
                                                    <span className="text-slate-400 block text-[11px]">
                                                        {item.booking?.eventId?.title || 'Event Check-in'}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-slate-400 font-mono text-[11px]">{item.timestamp}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecurityDashboard;
