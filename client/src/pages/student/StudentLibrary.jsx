import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { BookOpen, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const StudentLibrary = ({ isEmbedded = false }) => {
    const [libraries, setLibraries] = useState([]);
    const [activeBooking, setActiveBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState(2); // Default 2 hours

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // Poll for updates
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [libRes, bookRes] = await Promise.all([
                API.get('/library'),
                API.get('/library/my-booking')
            ]);
            setLibraries(libRes.data);
            setActiveBooking(bookRes.data);
        } catch (err) {
            console.error("Failed to fetch library data", err);
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

    // Calculate time remaining
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

    return (
        <div className={`font-sans text-slate-900 pb-10 custom-scrollbar ${!isEmbedded && 'min-h-screen bg-slate-50'}`}>
            {!isEmbedded && <Navbar />}

            <main className={`${!isEmbedded ? 'p-4 md:p-8 max-w-[1200px] mx-auto' : ''} space-y-8 animate-in fade-in duration-500`}>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Library Study Slots</h1>
                        <p className="text-slate-500 text-sm mt-1">Real-time availability for all departmental libraries.</p>
                    </div>

                    {!activeBooking && (
                        <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                            <span className="text-xs text-slate-500 font-bold uppercase px-2">Duration:</span>
                            {[1, 2, 3, 4].map(h => (
                                <button
                                    key={h}
                                    onClick={() => setSelectedDuration(h)}
                                    className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${selectedDuration === h ? 'bg-cyan-600 text-white shadow-md shadow-cyan-200' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {h}h
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Active Booking Status */}
                {activeBooking && (
                    <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl relative overflow-hidden shadow-sm">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Clock size={100} className="text-emerald-600" /></div>
                        <div className="relative z-10">
                            <h2 className="text-xl font-bold text-emerald-700 mb-2 flex items-center">
                                <CheckCircle className="mr-2" /> Active Session
                            </h2>
                            <p className="text-slate-600 mb-4">
                                You have a booked seat at <span className="font-bold text-slate-900">{activeBooking.library?.name}</span>
                            </p>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-emerald-700 mb-6">
                                <span>Started: {new Date(activeBooking.startTime).toLocaleTimeString()}</span>
                                <span className="bg-emerald-100 px-2 py-1 rounded text-emerald-800 font-bold border border-emerald-200">
                                    Ends: {new Date(activeBooking.endTime).toLocaleTimeString()}
                                </span>
                                <span className="font-mono text-emerald-600 font-medium bg-white/50 px-2 py-1 rounded">{getTimeRemaining()}</span>
                            </div>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2 rounded-lg font-bold transition-all text-sm flex items-center shadow-sm"
                            >
                                <XCircle className="mr-2" size={16} /> End Session & Release Seat
                            </button>
                        </div>
                    </div>
                )}

                {/* Libraries Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {libraries.map(lib => {
                        const isFull = lib.bookedSeats >= lib.totalSeats;
                        const percentage = (lib.bookedSeats / lib.totalSeats) * 100;
                        const canBook = !activeBooking && !isFull;

                        return (
                            <div key={lib._id} className={`bg-white p-6 rounded-2xl border ${isFull ? 'border-rose-200 bg-rose-50/30' : 'border-slate-200'} relative group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1`}>
                                <div className="absolute top-0 right-0 p-4 opacity-5"><BookOpen size={100} className="text-slate-900" /></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`text-xs font-bold px-2 py-1 rounded border ${isFull ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-emerald-100 text-emerald-600 border-emerald-200'}`}>
                                            {isFull ? 'FULL' : 'AVAILABLE'}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{lib.name}</h3>

                                    <div className="space-y-4 text-sm text-slate-500 mb-6">
                                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${percentage > 90 ? 'bg-rose-500' : percentage > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs font-mono font-medium">
                                            <span className={isFull ? 'text-rose-500' : 'text-slate-600'}>{lib.bookedSeats} / {lib.totalSeats} Seats Occupied</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleBook(lib._id)}
                                        disabled={!canBook || loading}
                                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center shadow-md
                                            ${activeBooking
                                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                                                : isFull
                                                    ? 'bg-rose-50 text-rose-400 border border-rose-200 cursor-not-allowed shadow-none'
                                                    : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-500/20'
                                            }`}
                                    >
                                        {activeBooking ? 'Active Session in Progress' : isFull ? 'Library Full' : `Book for ${selectedDuration} Hours`}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default StudentLibrary;
