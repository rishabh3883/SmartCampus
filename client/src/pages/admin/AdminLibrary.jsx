import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { BookOpen, MapPin, Users, Plus, Trash2, Library, Search, QrCode, Scan, RefreshCw, Sparkles, CheckCircle, XCircle } from 'lucide-react';

const AdminLibrary = () => {
    const [libraries, setLibraries] = useState([]);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'create', 'seats'
    const [selectedLibraryId, setSelectedLibraryId] = useState(null);
    const [seats, setSeats] = useState([]);
    const [formData, setFormData] = useState({ name: '', totalSeats: '12' });
    const [loading, setLoading] = useState(false);
    const [selectedQrSeat, setSelectedQrSeat] = useState(null);

    useEffect(() => {
        fetchLibraries();
    }, []);

    useEffect(() => {
        if (selectedLibraryId) {
            fetchSeats(selectedLibraryId);
        }
    }, [selectedLibraryId]);

    const fetchLibraries = async () => {
        try {
            const res = await API.get('/library');
            setLibraries(res.data);
            if (res.data.length > 0 && !selectedLibraryId) {
                setSelectedLibraryId(res.data[0]._id);
            }
        } catch (err) {
            console.error("Failed to fetch libraries", err);
        }
    };

    const fetchSeats = async (libraryId) => {
        try {
            const res = await API.get(`/library/seats/${libraryId}`);
            setSeats(res.data.seats || []);
        } catch (err) {
            console.error("Failed to fetch library seats", err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/library', formData);
            alert("Library added successfully with auto-generated seat QR codes!");
            setFormData({ name: '', totalSeats: '12' });
            setActiveTab('overview');
            fetchLibraries();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add library");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this library? This will cancel all active bookings and seats.")) return;
        try {
            await API.delete(`/library/${id}`);
            alert("Library deleted.");
            fetchLibraries();
        } catch (err) {
            alert("Failed to delete library");
        }
    };

    const handleToggleSeat = async (seatCode) => {
        try {
            const res = await API.post('/library/seats/scan', { seatCode });
            alert(res.data.message);
            fetchLibraries();
            if (selectedLibraryId) fetchSeats(selectedLibraryId);
        } catch (err) {
            alert("Failed to update seat status.");
        }
    };

    const selectedLib = libraries.find(l => l._id === selectedLibraryId);

    return (
        <div className="min-h-screen pb-12 bg-slate-50 font-sans text-slate-900">
            <Navbar />

            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-300">
                
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <BookOpen size={220} className="text-white" />
                    </div>
                    <div className="relative z-10 max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles size={14} /> Library Seat & QR Management
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Departmental Library Hub
                        </h1>
                        <p className="text-slate-300 text-sm mt-1">
                            Manage study slots, inspect seat occupancy, and generate scannable seat QR codes.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
                                activeTab === 'overview'
                                    ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20'
                                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                            }`}
                        >
                            <BookOpen size={16} /> All Libraries
                        </button>
                        <button
                            onClick={() => setActiveTab('seats')}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
                                activeTab === 'seats'
                                    ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20'
                                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                            }`}
                        >
                            <QrCode size={16} /> Seat QR Manager
                        </button>
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
                                activeTab === 'create'
                                    ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20'
                                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                            }`}
                        >
                            <Plus size={16} /> Add New Library
                        </button>
                    </div>
                </div>

                {/* TAB 1: CREATE LIBRARY FORM (Crystal Clear White Input Styling) */}
                {activeTab === 'create' && (
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-xl mx-auto space-y-6">
                        <div className="border-b border-slate-100 pb-4">
                            <h2 className="text-2xl font-black text-slate-900">Add New Department Library</h2>
                            <p className="text-slate-500 text-xs mt-1">Specify seat capacity to automatically create scannable QR seat tokens.</p>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Library / Department Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. CSE Department Library"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 font-semibold text-sm rounded-xl outline-none shadow-xs transition-all focus:ring-4 focus:ring-emerald-500/10"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Total Study Seats Capacity
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    placeholder="e.g. 12"
                                    value={formData.totalSeats}
                                    onChange={e => setFormData({ ...formData, totalSeats: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 font-semibold text-sm rounded-xl outline-none shadow-xs transition-all focus:ring-4 focus:ring-emerald-500/10"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                            >
                                {loading ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />}
                                Create Library & Generate Seat QRs
                            </button>
                        </form>
                    </div>
                )}

                {/* TAB 2: ALL LIBRARIES OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {libraries.map(lib => {
                            const isFull = lib.bookedSeats >= lib.totalSeats;
                            const percentage = Math.min(100, Math.round((lib.bookedSeats / lib.totalSeats) * 100));

                            return (
                                <div key={lib._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-5 flex flex-col justify-between group">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase ${
                                                isFull ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                                            }`}>
                                                {isFull ? 'FULL' : 'AVAILABLE'}
                                            </span>
                                            <button
                                                onClick={() => handleDelete(lib._id)}
                                                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                                                title="Delete Library"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{lib.name}</h3>
                                            <p className="text-xs text-slate-500 mt-0.5">Capacity: {lib.totalSeats} Total Seats</p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-semibold text-slate-600">
                                                <span>Occupancy</span>
                                                <span className="font-mono">{lib.bookedSeats} / {lib.totalSeats} ({percentage}%)</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${percentage >= 100 ? 'bg-rose-500' : percentage > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => { setSelectedLibraryId(lib._id); setActiveTab('seats'); }}
                                        className="w-full py-2.5 bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                                    >
                                        <QrCode size={15} /> Manage Seat QRs ({lib.totalSeats} Seats)
                                    </button>
                                </div>
                            );
                        })}

                        {libraries.length === 0 && (
                            <div className="col-span-full py-16 text-center text-slate-500 bg-white border-2 border-dashed border-slate-300 rounded-3xl space-y-3">
                                <Library size={48} className="mx-auto opacity-30 text-slate-400" />
                                <p className="font-bold text-slate-700">No libraries created yet.</p>
                                <button
                                    onClick={() => setActiveTab('create')}
                                    className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm"
                                >
                                    Create First Library
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: SEAT QR CODE MANAGER */}
                {activeTab === 'seats' && selectedLib && (
                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        {/* Selector Header */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                    <QrCode className="text-emerald-600" /> {selectedLib.name} Seat QRs
                                </h2>
                                <p className="text-slate-500 text-xs mt-1">
                                    Inspect live seat occupancy, view printable QR codes, or simulate gate check-ins.
                                </p>
                            </div>

                            {/* Dropdown Library Switcher */}
                            <select
                                value={selectedLibraryId || ''}
                                onChange={(e) => setSelectedLibraryId(e.target.value)}
                                className="bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500"
                            >
                                {libraries.map(lib => (
                                    <option key={lib._id} value={lib._id}>{lib.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Bulk Print Sheet / Action Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl">
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                                <Sparkles size={16} className="text-emerald-600" />
                                <span>Desk Sticker QR Generation: Scan with any mobile camera to instantly occupy or vacate.</span>
                            </div>
                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                            >
                                <Scan size={14} /> Print All {seats.length} Seat Stickers
                            </button>
                        </div>

                        {/* Seat Cards Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {seats.map(seat => {
                                const isOccupied = seat.status === 'Occupied';
                                const seatUrl = `${window.location.origin}/scan-seat?code=${encodeURIComponent(seat.seatCode)}`;

                                return (
                                    <div
                                        key={seat._id}
                                        className={`rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                                            isOccupied ? 'bg-rose-50/50 border-rose-200' : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-mono text-xs font-black text-slate-800">{seat.seatNumber}</span>
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                                isOccupied ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                                            }`}>
                                                {isOccupied ? 'Occupied' : 'Vacant'}
                                            </span>
                                        </div>

                                        <div className="my-2 text-center">
                                            <p className="text-xs font-bold text-slate-700 truncate">{seat.occupiedByName || 'Available'}</p>
                                        </div>

                                        <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
                                            <button
                                                onClick={() => setSelectedQrSeat(seat)}
                                                className="w-full text-[11px] font-bold py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center justify-center gap-1 shadow-2xs"
                                            >
                                                <QrCode size={12} className="text-emerald-600" /> Desk Sticker QR
                                            </button>
                                            <button
                                                onClick={() => handleToggleSeat(seat.seatCode)}
                                                className={`w-full text-[11px] font-black py-1.5 text-white rounded-lg transition-all shadow-2xs ${
                                                    isOccupied ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                                                }`}
                                            >
                                                {isOccupied ? 'Free Seat' : 'Occupy Seat'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Printable QR Code Modal */}
                {selectedQrSeat && (
                    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-5 relative border border-slate-200">
                            <button
                                onClick={() => setSelectedQrSeat(null)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
                            >
                                <XCircle size={20} />
                            </button>

                            {/* Desk Sticker Card Content */}
                            <div id="printable-seat-sticker" className="bg-gradient-to-b from-emerald-50 via-white to-slate-50 border-2 border-emerald-500/40 rounded-3xl p-5 shadow-inner space-y-4 text-center">
                                <div className="space-y-1">
                                    <div className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                                        <Sparkles size={11} /> Smart Campus Library
                                    </div>
                                    <h4 className="text-xl font-black text-slate-900 tracking-tight">
                                        {selectedQrSeat.seatNumber}
                                    </h4>
                                    <p className="text-[11px] font-semibold text-slate-500">
                                        {selectedLib?.name || 'Central Library'}
                                    </p>
                                </div>

                                <div className="bg-white p-4 rounded-2xl border border-slate-200 inline-block shadow-md">
                                    <QRCodeSVG
                                        id="seat-qr-svg"
                                        value={`${window.location.origin}/scan-seat?code=${encodeURIComponent(selectedQrSeat.seatCode)}`}
                                        size={180}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs font-extrabold text-emerald-800">
                                        📱 Scan with Mobile Camera
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-medium">
                                        Auto-books or vacates this seat immediately
                                    </p>
                                    <p className="font-mono text-[9px] text-slate-400 select-all pt-1">
                                        Code: {selectedQrSeat.seatCode}
                                    </p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="grid grid-cols-2 gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const svg = document.getElementById("seat-qr-svg");
                                        if (svg) {
                                            const svgData = new XMLSerializer().serializeToString(svg);
                                            const canvas = document.createElement("canvas");
                                            const ctx = canvas.getContext("2d");
                                            const img = new Image();
                                            img.onload = () => {
                                                canvas.width = img.width;
                                                canvas.height = img.height;
                                                ctx.drawImage(img, 0, 0);
                                                const pngFile = canvas.toDataURL("image/png");
                                                const downloadLink = document.createElement("a");
                                                downloadLink.download = `${selectedQrSeat.seatNumber}-QR.png`;
                                                downloadLink.href = pngFile;
                                                downloadLink.click();
                                            };
                                            img.src = "data:image/svg+xml;base64," + btoa(svgData);
                                        }
                                    }}
                                    className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
                                >
                                    Download PNG
                                </button>
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                                >
                                    Print Sticker
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminLibrary;
