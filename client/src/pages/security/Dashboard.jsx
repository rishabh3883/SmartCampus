import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { AlertTriangle, Shield, CheckCircle, Clock, Siren } from 'lucide-react';

const SecurityDashboard = () => {
    const [alarms, setAlarms] = useState([]);
    const [triggering, setTriggering] = useState(false);

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
        <div className="min-h-screen pb-10 bg-slate-50">
            <Navbar />

            <div className="page-container max-w-4xl text-center">

                <div className="mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-rose-50 text-rose-600 mb-6 border border-rose-200 shadow-sm">
                        <Shield size={48} />
                    </div>
                    <h1 className="text-4xl font-black text-rose-600 mb-2 flex items-center justify-center gap-3 tracking-tight">
                        SECURITY COMMAND CENTER
                    </h1>
                    <p className="text-slate-500 text-lg">Emergency Response & Real-time Monitoring System</p>
                </div>

                {/* BIG RED BUTTON */}
                <div className="mb-16 flex justify-center">
                    <button
                        onClick={triggerAlarm}
                        disabled={triggering}
                        className={`
                            relative group w-72 h-72 rounded-full border-[10px] border-white
                            bg-gradient-to-br from-rose-500 to-red-700 
                            text-white font-black text-3xl tracking-widest shadow-2xl
                            transform transition-all duration-300 active:scale-95 hover:scale-105 hover:shadow-rose-300/50
                            flex flex-col items-center justify-center gap-4 z-10 overflow-hidden ring-4 ring-rose-100
                            ${triggering ? 'opacity-80 cursor-wait' : ''}
                        `}
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                        <div className={`p-4 rounded-full bg-rose-900/20 backdrop-blur-sm border border-white/20 ${triggering ? 'animate-spin' : 'group-hover:animate-pulse'}`}>
                            <Siren size={64} className="text-white drop-shadow-md" />
                        </div>
                        <span className="relative z-10 text-shadow-sm">
                            {triggering ? 'SENDING...' : 'TRIGGER\nALARM'}
                        </span>
                    </button>

                </div>
                <p className="mb-12 text-rose-500 font-bold text-sm tracking-[0.2em] uppercase opacity-70 border-b border-rose-200 inline-block pb-1">
                    ⚠️ Authorized Personnel Only • Press in Emergency
                </p>

                {/* Recent Alarms Status */}
                <div className="card text-left relative overflow-hidden bg-white border-slate-200 shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -z-10"></div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center text-slate-900">
                            <Clock className="mr-3 text-slate-400" /> Recent Alarms Status
                        </h2>
                        {alarms.length > 0 && <span className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-full animate-pulse">{alarms.length} Active</span>}
                    </div>

                    <div className="space-y-4">
                        {alarms.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                <Shield size={48} className="mx-auto mb-4 text-slate-300" />
                                <p className="text-slate-500 font-medium">No active alarms. System Nominal.</p>
                            </div>
                        ) : (
                            alarms.slice(0, 5).map(alarm => (
                                <div key={alarm._id} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors shadow-sm">
                                    <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-slate-900 text-lg">{alarm.title}</h3>
                                                <span className={`text-[10px] font-black px-3 py-0.5 rounded-full border ${getStatusColor(alarm.status)}`}>
                                                    {alarm.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center gap-2">
                                                <span>ID: {alarm._id.slice(-6)}</span>
                                                <span>•</span>
                                                <span>{new Date(alarm.createdAt).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Student & Location Details */}
                                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-wrap gap-4 items-center">
                                        <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-slate-700 font-bold text-xl border border-slate-200 shadow-sm">
                                            {alarm.studentId?.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-800">{alarm.studentId?.name || 'Unknown Student'}</div>
                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                                <span className="bg-white px-1.5 py-0.5 rounded text-slate-600 border border-slate-200 shadow-sm">{alarm.studentId?.hostelId?.name || 'Unknown Hostel'}</span>
                                                <span>Room {alarm.studentId?.roomNumber || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {alarm.status === 'Pending' && (
                                        <button
                                            onClick={async () => {
                                                if (!window.confirm("Confirm you are responding to this alarm?")) return;
                                                try {
                                                    await API.put(`/complaints/${alarm._id}/assign`);
                                                    alert("Response Confirmed. Go!");
                                                    fetchAlarms();
                                                } catch (err) { alert("Failed to accept: " + err.message); }
                                            }}
                                            className="w-full mt-4 btn btn-primary bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 py-3 border-none"
                                        >
                                            <CheckCircle size={20} className="mr-2" /> ACKNOWLEDGE & RESPOND
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SecurityDashboard;
