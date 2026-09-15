import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { Calendar, MapPin, DollarSign, Users, Plus, List, X, Mail, Search, Scan, CheckCircle, AlertCircle, BarChart3, FileSpreadsheet, ShieldCheck, UserCheck } from 'lucide-react';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', venue: '', price: '', totalSeats: '', rules: '', organizer: 'Admin', category: 'Fest'
    });

    // Scanner Modal
    const [showScannerModal, setShowScannerModal] = useState(false);
    const [qrCodeInput, setQrCodeInput] = useState('');
    const [scanResult, setScanResult] = useState(null);
    const [scanLoading, setScanLoading] = useState(false);

    // Reports Modal
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [loadingReport, setLoadingReport] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await API.get('/events');
            setEvents(res.data);
        } catch (err) {
            console.error("Failed to fetch events", err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const rulesArray = formData.rules.split(',').map(r => r.trim()).filter(r => r);
            await API.post('/events', { ...formData, rules: rulesArray });
            alert("Event created successfully!");
            setShowForm(false);
            setFormData({ title: '', description: '', date: '', venue: '', price: '', totalSeats: '', rules: '', organizer: 'Admin', category: 'Fest' });
            fetchEvents();
        } catch (err) {
            alert("Failed to create event");
        }
    };

    // Gate Entry QR Scan Handler
    const handleVerifyEntry = async (qrCode) => {
        setScanLoading(true);
        setScanResult(null);
        try {
            const res = await API.post('/events/verify-entry', { qrCode });
            setScanResult({ success: true, message: res.data.message, booking: res.data.booking });
            fetchEvents();
            if (showReportModal && reportData) {
                fetchEventReport(reportData.event._id);
            }
        } catch (err) {
            setScanResult({
                success: false,
                message: err.response?.data?.message || "Verification Failed",
                booking: err.response?.data?.booking
            });
        } finally {
            setScanLoading(false);
        }
    };

    // Fetch Comprehensive Event Attendance Report
    const fetchEventReport = async (eventId) => {
        setLoadingReport(true);
        setShowReportModal(true);
        setReportData(null);
        try {
            const res = await API.get(`/events/${eventId}/reports`);
            setReportData(res.data);
        } catch (err) {
            alert("Failed to load attendance report");
            setShowReportModal(false);
        } finally {
            setLoadingReport(false);
        }
    };

    return (
        <div className="min-h-screen pb-12 bg-slate-50 font-sans">
            <Navbar />

            <div className="page-container max-w-7xl mx-auto p-4 md:p-8 space-y-8">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-900 text-white p-6 md:p-8 rounded-3xl shadow-xl">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                            <ShieldCheck size={14} /> Gate Entry & Attendance Intelligence
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white">
                            Event QR Command Center
                        </h1>
                        <p className="text-slate-300 text-sm mt-1">
                            Scan venue entry passes, track real-time attendance, and generate official reports.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => { setShowScannerModal(true); setScanResult(null); setQrCodeInput(''); }}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                        >
                            <Scan size={18} /> Venue QR Gate Scanner
                        </button>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-3 rounded-2xl transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2"
                        >
                            {showForm ? <List size={18} /> : <Plus size={18} />}
                            {showForm ? "View All Events" : "Create New Event"}
                        </button>
                    </div>
                </div>

                {/* Create Event Form */}
                {showForm ? (
                    <div className="card max-w-2xl mx-auto bg-white border-slate-200 shadow-md">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Create New Campus Event</h2>
                        <form onSubmit={handleCreate} className="space-y-5">
                            <div>
                                <label className="label text-slate-700">Event Title</label>
                                <input
                                    type="text" required
                                    className="input-field bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"
                                    value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="label text-slate-700">Date & Time</label>
                                    <input
                                        type="datetime-local" required
                                        className="input-field bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"
                                        value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label text-slate-700">Venue</label>
                                    <input
                                        type="text" required
                                        className="input-field bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"
                                        value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="label text-slate-700">Ticket Price (Rs)</label>
                                    <input
                                        type="number" required min="0"
                                        className="input-field bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"
                                        value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label text-slate-700">Total Seats</label>
                                    <input
                                        type="number" required min="1"
                                        className="input-field bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"
                                        value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label text-slate-700">Description</label>
                                <textarea
                                    required
                                    className="input-field min-h-[90px] bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-full bg-purple-600 hover:bg-purple-700 py-3 mt-4 text-white font-bold">
                                Publish Event
                            </button>
                        </form>
                    </div>
                ) : (
                    /* Events Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <div key={event._id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-black text-purple-700 bg-purple-100 px-2.5 py-1 rounded-md uppercase">
                                            {event.category || 'Event'}
                                        </span>
                                        <button
                                            onClick={() => fetchEventReport(event._id)}
                                            className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all"
                                        >
                                            <BarChart3 size={14} className="text-purple-600" /> Attendance Report
                                        </button>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 leading-tight">{event.title}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2">{event.description}</p>

                                    <div className="space-y-2 text-xs font-medium text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-2"><Calendar size={14} className="text-purple-600" /> {new Date(event.date).toLocaleString()}</div>
                                        <div className="flex items-center gap-2"><MapPin size={14} className="text-purple-600" /> {event.venue}</div>
                                        <div className="flex items-center gap-2"><Users size={14} className="text-purple-600" /> {event.bookedSeats} / {event.totalSeats} Registered</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => fetchEventReport(event._id)}
                                    className="w-full bg-slate-900 hover:bg-purple-900 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                                >
                                    <FileSpreadsheet size={15} /> View Attendance & Scanned QR Logs
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Gate Entry Scanner Modal */}
                {showScannerModal && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 relative border border-slate-200">
                            <button
                                onClick={() => setShowScannerModal(false)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center">
                                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Scan size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900">Event Gate QR Scanner</h3>
                                <p className="text-slate-500 text-xs mt-1">
                                    Scan or input student ticket QR code to grant venue entry.
                                </p>
                            </div>

                            {scanResult && (
                                <div className={`p-4 rounded-2xl text-xs font-bold space-y-2 border ${
                                    scanResult.success ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
                                }`}>
                                    <div className="flex items-center gap-2 text-sm font-black">
                                        {scanResult.success ? <CheckCircle size={18} className="text-emerald-600" /> : <AlertCircle size={18} className="text-rose-600" />}
                                        <span>{scanResult.message}</span>
                                    </div>
                                    {scanResult.booking && (
                                        <div className="bg-white/80 p-3 rounded-xl text-slate-700 space-y-1 font-mono text-[11px] border border-slate-200">
                                            <p><span className="font-sans font-bold">Attendee:</span> {scanResult.booking.attendeeName || scanResult.booking.userId?.name}</p>
                                            <p><span className="font-sans font-bold">Roll / ID:</span> {scanResult.booking.enrollmentNumber || scanResult.booking.userId?.enrollmentNumber || 'N/A'}</p>
                                            <p><span className="font-sans font-bold">Event:</span> {scanResult.booking.eventId?.title}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (qrCodeInput.trim()) handleVerifyEntry(qrCodeInput.trim());
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Scan or Enter Ticket QR Code</label>
                                    <input
                                        type="text" required
                                        placeholder="e.g. EVT-TICKET-..."
                                        value={qrCodeInput}
                                        onChange={(e) => setQrCodeInput(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={scanLoading || !qrCodeInput.trim()}
                                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    <Scan size={18} /> Verify Ticket & Grant Entry
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Attendance Report Modal */}
                {showReportModal && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl p-6 md:p-8 max-w-4xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative border border-slate-200">
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
                            >
                                <X size={20} />
                            </button>

                            {loadingReport ? (
                                <div className="text-center py-20 text-slate-400 font-bold">Generating Attendance Report...</div>
                            ) : reportData && (
                                <div className="space-y-6">
                                    <div className="border-b border-slate-200 pb-4">
                                        <div className="inline-block bg-purple-100 text-purple-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase mb-2">
                                            Official Venue Report
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900">{reportData.event.title}</h2>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Venue: {reportData.event.venue} • Date: {new Date(reportData.event.date).toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Stats KPI Cards */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                                            <p className="text-xs text-slate-500 font-bold">Total Capacity</p>
                                            <p className="text-2xl font-black text-slate-900 mt-1">{reportData.summary.capacity}</p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 text-center">
                                            <p className="text-xs text-purple-700 font-bold">Booked / Registered</p>
                                            <p className="text-2xl font-black text-purple-900 mt-1">{reportData.summary.totalRegistered}</p>
                                        </div>
                                        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
                                            <p className="text-xs text-emerald-700 font-bold">Present (Scanned QR)</p>
                                            <p className="text-2xl font-black text-emerald-700 mt-1">{reportData.summary.presentCount}</p>
                                        </div>
                                        <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-center">
                                            <p className="text-xs text-rose-700 font-bold">Turnout Rate</p>
                                            <p className="text-2xl font-black text-rose-700 mt-1">{reportData.summary.attendancePercentage}%</p>
                                        </div>
                                    </div>

                                    {/* Attendees Table */}
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            <UserCheck size={20} className="text-purple-600" /> Attendee Check-In Log ({reportData.attendees.length})
                                        </h3>
                                        <div className="border border-slate-200 rounded-2xl overflow-hidden">
                                            <table className="w-full text-left text-xs border-collapse">
                                                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                                                    <tr>
                                                        <th className="p-3">Student Name</th>
                                                        <th className="p-3">ID / Roll No</th>
                                                        <th className="p-3">Ticket QR Code</th>
                                                        <th className="p-3">Gate Status</th>
                                                        <th className="p-3">Check-In Time</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {reportData.attendees.map(item => (
                                                        <tr key={item._id} className="hover:bg-slate-50/80">
                                                            <td className="p-3 font-bold text-slate-900">{item.attendeeName || item.userId?.name || 'Student'}</td>
                                                            <td className="p-3 font-mono text-slate-600">{item.enrollmentNumber || item.userId?.enrollmentNumber || 'N/A'}</td>
                                                            <td className="p-3 font-mono text-[11px] text-purple-700 select-all">{item.qrCode}</td>
                                                            <td className="p-3">
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                                    item.attended ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                                }`}>
                                                                    {item.attended ? 'PRESENT ✅' : 'ABSENT ⏳'}
                                                                </span>
                                                            </td>
                                                            <td className="p-3 font-mono text-slate-500">
                                                                {item.attendedAt ? new Date(item.attendedAt).toLocaleTimeString() : 'Not Scanned Yet'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {reportData.attendees.length === 0 && (
                                                        <tr>
                                                            <td colSpan="5" className="p-6 text-center text-slate-400 font-medium">
                                                                No registrations for this event yet.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminEvents;
