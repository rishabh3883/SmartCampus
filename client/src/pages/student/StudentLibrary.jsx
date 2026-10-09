import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { BookOpen, Clock, CheckCircle, XCircle, QrCode, Scan, AlertCircle, RefreshCw, UserCheck, ShieldCheck, Sparkles } from 'lucide-react';

const StudentLibrary = ({ isEmbedded = false }) => {
    const [libraries, setLibraries] = useState([]);
    const [activeBooking, setActiveBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState(2);
    
    // Seat QR & Live Scanner states
    const [selectedLibraryId, setSelectedLibraryId] = useState(null);
    const [seats, setSeats] = useState([]);
    const [activeQrModal, setActiveQrModal] = useState(null); // Seat object for showing QR modal
    const [showScannerModal, setShowScannerModal] = useState(false);
    const [manualQrInput, setManualQrInput] = useState('');
    const [scanMessage, setScanMessage] = useState(null);
    const [scanLoading, setScanLoading] = useState(false);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 8000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedLibraryId) {
            fetchSeats(selectedLibraryId);
        }
    }, [selectedLibraryId]);

    const fetchData = async () => {
        try {
            const [libRes, bookRes] = await Promise.all([
                API.get('/library'),
                API.get('/library/my-booking')
            ]);
            setLibraries(libRes.data);
            setActiveBooking(bookRes.data);
            if (libRes.data.length > 0 && !selectedLibraryId) {
                setSelectedLibraryId(libRes.data[0]._id);
            }
        } catch (err) {
            console.error("Failed to fetch library data", err);
        }
    };

    const fetchSeats = async (libraryId) => {
        try {
            const res = await API.get(`/library/seats/${libraryId}`);
            setSeats(res.data.seats || []);
        } catch (err) {
            console.error("Failed to fetch seat map", err);
        }
    };

    const handleBook = async (libraryId) => {
        setLoading(true);
        try {
            await API.post('/library/book', { libraryId, duration: selectedDuration });
            alert(`Study slot booked for ${selectedDuration} hours successfully!`);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm("End your study session and release the seat?")) return;
        setLoading(true);
        try {
            await API.post('/library/cancel');
            alert("Session ended.");
            fetchData();
        } catch (err) {
            alert("Failed to cancel booking");
        } finally {
            setLoading(false);
        }
    };

    // Scan QR Code API trigger (either via direct seat scan or input)
    const handleScanQr = async (seatCode) => {
        setScanLoading(true);
        setScanMessage(null);
        try {
            const res = await API.post('/library/seats/scan', { seatCode });
            setScanMessage({ type: 'success', text: res.data.message, action: res.data.action });
            fetchData();
            if (selectedLibraryId) fetchSeats(selectedLibraryId);
            setTimeout(() => {
                setScanMessage(null);
                setShowScannerModal(false);
                setActiveQrModal(null);
            }, 2500);
        } catch (err) {
            setScanMessage({ type: 'error', text: err.response?.data?.message || "Failed to scan QR Code!" });
        } finally {
            setScanLoading(false);
        }
    };

    const getTimeRemaining = () => {
        if (!activeBooking || !activeBooking.endTime) return null;
        const end = new Date(activeBooking.endTime).getTime();
        const now = new Date().getTime();
        const diff = end - now;
        if (diff <= 0) return "Expiring...";
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m remaining`;
    };

    const currentLibrary = libraries.find(l => l._id === selectedLibraryId);

    return (
        <div className={`font-sans text-slate-900 pb-12 custom-scrollbar ${!isEmbedded && 'min-h-screen bg-slate-50'}`}>
            {!isEmbedded && <Navbar />}

            <main className={`${!isEmbedded ? 'p-4 md:p-8 max-w-[1280px] mx-auto' : ''} space-y-8 animate-in fade-in duration-500`}>
                
                {/* Header & Quick Action */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-emerald-900 via-teal-900 to-cyan-900 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <QrCode size={220} className="text-white" />
                    </div>
                    <div className="relative z-10 max-w-xl">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
                            <Sparkles size={14} /> Smart Library QR System
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                            Library Seat QR Occupancy
                        </h1>
                        <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                            Scan the seat QR code when sitting to set status to <span className="text-emerald-400 font-bold">OCCUPIED</span>. Scan again when leaving to mark as <span className="text-cyan-400 font-bold">VACANT</span>!
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-wrap gap-3">
                        <Link
                            to="/scan-seat"
                            className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold px-5 py-3 rounded-2xl transition-all shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95"
                        >
                            <Scan size={20} className="text-emerald-600" /> Mobile Camera Scan
                        </Link>
                        <button
                            onClick={() => { setShowScannerModal(true); setScanMessage(null); }}
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-2 hover:scale-105 active:scale-95"
                        >
                            <QrCode size={20} /> Quick Scan / Code
                        </button>
                    </div>
                </div>

                {/* Active Booking Alert Banner */}
                {activeBooking && (
                    <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Clock size={100} className="text-emerald-600" /></div>
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold text-emerald-800 mb-2 flex items-center">
                                <CheckCircle className="mr-2 text-emerald-600" /> Active Reserved Session
                            </h2>
                            <p className="text-slate-600 mb-4">
                                Reserved seat at <span className="font-bold text-slate-900">{activeBooking.library?.name}</span>
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-emerald-700 mb-4">
                                <span>Started: {new Date(activeBooking.startTime).toLocaleTimeString()}</span>
                                <span className="bg-emerald-100 px-2.5 py-1 rounded-md text-emerald-900 font-bold border border-emerald-200">
                                    Ends: {new Date(activeBooking.endTime).toLocaleTimeString()}
                                </span>
                                <span className="font-mono text-emerald-700 font-bold bg-white px-2 py-1 rounded shadow-xs">{getTimeRemaining()}</span>
                            </div>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2 rounded-xl font-bold transition-all text-sm flex items-center shadow-xs"
                            >
                                <XCircle className="mr-2" size={16} /> End Session & Release
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Content Grid: Seat QR Map & Library Cards */}
                <div className="space-y-6">
                    {/* Library Selector Tabs */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                            {libraries.map(lib => (
                                <button
                                    key={lib._id}
                                    onClick={() => setSelectedLibraryId(lib._id)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                                        selectedLibraryId === lib._id
                                            ? 'bg-slate-900 text-white shadow-md'
                                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                    }`}
                                >
                                    <BookOpen size={16} />
                                    {lib.name}
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${
                                        lib.bookedSeats >= lib.totalSeats ? 'bg-rose-500 text-white' : 'bg-emerald-500/20 text-emerald-700'
                                    }`}>
                                        {lib.bookedSeats}/{lib.totalSeats}
                                    </span>
                                </button>
                            ))}
                        </div>
                        
                        <button
                            onClick={() => { fetchData(); if (selectedLibraryId) fetchSeats(selectedLibraryId); }}
                            className="p-2 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-all"
                            title="Refresh Seat Status"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>

                    {/* Live Dynamic Seat Map */}
                    {currentLibrary && (
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                        <QrCode className="text-emerald-600" /> {currentLibrary.name} - Seat QR Map
                                    </h2>
                                    <p className="text-slate-500 text-xs mt-1">
                                        Click any seat to view QR code or tap <span className="font-bold text-emerald-600">"Scan / Sit Here"</span> to toggle Occupied/Vacant.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-semibold">
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Vacant ({seats.filter(s => s.status === 'Vacant').length})</span>
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span> Occupied ({seats.filter(s => s.status === 'Occupied').length})</span>
                                </div>
                            </div>

                            {/* Seats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {seats.map(seat => {
                                    const isOccupied = seat.status === 'Occupied';
                                    return (
                                        <div
                                            key={seat._id}
                                            className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 ${
                                                isOccupied
                                                    ? 'bg-rose-50/40 border-rose-200 shadow-xs'
                                                    : 'bg-emerald-50/30 border-emerald-200 hover:border-emerald-400 hover:shadow-md'
                                            }`}
                                        >
                                            {/* Seat Header */}
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="font-mono text-xs font-black text-slate-800">{seat.seatNumber}</span>
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                                    isOccupied ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                                                }`}>
                                                    {isOccupied ? 'Occupied' : 'Vacant'}
                                                </span>
                                            </div>

                                            {/* Seat Center Icon / Occupant */}
                                            <div className="my-3 text-center">
                                                <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center border transition-all ${
                                                    isOccupied
                                                        ? 'bg-rose-100 text-rose-600 border-rose-300'
                                                        : 'bg-emerald-100 text-emerald-600 border-emerald-300'
                                                }`}>
                                                    {isOccupied ? <UserCheck size={24} /> : <QrCode size={24} />}
                                                </div>
                                                <p className="text-[11px] font-bold text-slate-700 mt-2 truncate">
                                                    {isOccupied ? (seat.occupiedByName || 'Occupied') : 'Available'}
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="space-y-2 mt-2 pt-2 border-t border-slate-200/60">
                                                <button
                                                    onClick={() => setActiveQrModal(seat)}
                                                    className="w-full text-xs font-bold py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center justify-center gap-1 transition-all"
                                                >
                                                    <QrCode size={13} /> View QR
                                                </button>
                                                <button
                                                    onClick={() => handleScanQr(seat.seatCode)}
                                                    disabled={scanLoading}
                                                    className={`w-full text-xs font-black py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 text-white shadow-xs ${
                                                        isOccupied
                                                            ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                                                            : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                                                    }`}
                                                >
                                                    <Scan size={13} /> {isOccupied ? 'Scan to Vacate' : 'Scan to Occupy'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* All Department Libraries Overview Cards */}
                    <div className="space-y-3">
                        <h3 className="text-xl font-black text-slate-900">All Libraries Capacity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {libraries.map(lib => {
                                const isFull = lib.bookedSeats >= lib.totalSeats;
                                const percentage = Math.min(100, Math.round((lib.bookedSeats / lib.totalSeats) * 100));

                                return (
                                    <div key={lib._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-slate-900 text-lg">{lib.name}</h4>
                                            <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${isFull ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                {isFull ? 'FULL' : 'OPEN'}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-semibold text-slate-600">
                                                <span>Occupancy Rate</span>
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
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* QR Code Display Modal */}
                {activeQrModal && (
                    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-6 relative border border-slate-200">
                            <button
                                onClick={() => setActiveQrModal(null)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
                            >
                                <XCircle size={20} />
                            </button>

                            <div>
                                <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-black uppercase mb-2">
                                    {activeQrModal.seatNumber}
                                </div>
                                <h3 className="text-xl font-black text-slate-900">Seat QR Code</h3>
                                <p className="text-slate-500 text-xs mt-1">Print or scan this QR code on seat arrival.</p>
                            </div>

                            {/* QR Code Box */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 inline-block shadow-inner">
                                <QRCodeSVG
                                    value={`${window.location.origin}/scan-seat?code=${encodeURIComponent(activeQrModal.seatCode)}`}
                                    size={180}
                                    level="H"
                                    includeMargin={true}
                                />
                            </div>

                            <div className="bg-slate-100 p-3 rounded-xl text-left text-xs font-mono space-y-1">
                                <p className="text-slate-500 font-sans font-bold">Desk Sticker URL:</p>
                                <p className="text-emerald-700 font-bold select-all break-all text-[11px]">
                                    {`${window.location.origin}/scan-seat?code=${activeQrModal.seatCode}`}
                                </p>
                            </div>

                            <button
                                onClick={() => handleScanQr(activeQrModal.seatCode)}
                                disabled={scanLoading}
                                className={`w-full py-3 rounded-xl font-black text-white text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                                    activeQrModal.status === 'Occupied' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                                }`}
                            >
                                <Scan size={18} />
                                {activeQrModal.status === 'Occupied' ? 'Simulate Scan: Free Seat' : 'Simulate Scan: Sit Here'}
                            </button>
                        </div>
                    </div>
                )}

                {/* QR Scanner Modal (Simulated / Input) */}
                {showScannerModal && (
                    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 relative border border-slate-200">
                            <button
                                onClick={() => { setShowScannerModal(false); setScanMessage(null); }}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
                            >
                                <XCircle size={20} />
                            </button>

                            <div className="text-center">
                                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Scan size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900">Seat QR Code Scanner</h3>
                                <p className="text-slate-500 text-xs mt-1">
                                    Enter or scan any seat QR code payload to instantly mark seat as Occupied or Vacant.
                                </p>
                            </div>

                            {scanMessage && (
                                <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 border ${
                                    scanMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                                }`}>
                                    {scanMessage.type === 'success' ? <CheckCircle className="shrink-0" /> : <AlertCircle className="shrink-0" />}
                                    <span>{scanMessage.text}</span>
                                </div>
                            )}

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (manualQrInput.trim()) handleScanQr(manualQrInput.trim());
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Scan or Type Seat QR Code</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. CSE-SEAT-1-A01"
                                        value={manualQrInput}
                                        onChange={(e) => setManualQrInput(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm focus:outline-none focus:border-emerald-500"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={scanLoading || !manualQrInput.trim()}
                                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    {scanLoading ? <RefreshCw className="animate-spin" size={18} /> : <Scan size={18} />}
                                    Scan & Toggle Seat Status
                                </button>
                            </form>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default StudentLibrary;
