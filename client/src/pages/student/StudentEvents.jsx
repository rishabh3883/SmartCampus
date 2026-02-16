import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { Calendar, MapPin, DollarSign, Users, Ticket, Copy, Check, CreditCard, X } from 'lucide-react';
import EventPass from '../../components/EventPass';

const StudentEvents = ({ isEmbedded = false }) => {
    const [events, setEvents] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [view, setView] = useState('browse'); // browse, my_tickets
    const [selectedEvent, setSelectedEvent] = useState(null); // For Booking Modal
    const [showPass, setShowPass] = useState(null); // To show generated pass

    useEffect(() => {
        fetchEvents();
        fetchMyBookings();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await API.get('/events');
            setEvents(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchMyBookings = async () => {
        try {
            const res = await API.get('/events/my-bookings');
            setMyBookings(res.data);
        } catch (err) { console.error(err); }
    };

    const handleBook = async () => {
        try {
            const res = await API.post('/events/book', {
                eventId: selectedEvent._id,
                paymentId: 'PAY-' + Math.random().toString(36).substr(2, 9).toUpperCase() // Mock Payment
            });
            alert("Booking Confirmed! View your pass in 'My Tickets'.");
            setSelectedEvent(null);
            fetchEvents();
            fetchMyBookings();
            setView('my_tickets');
        } catch (err) {
            alert(err.response?.data?.message || "Booking Failed");
        }
    };

    return (
        <div className={`font-sans bg-slate-50 pb-10 custom-scrollbar ${!isEmbedded && 'min-h-screen'}`}>
            {!isEmbedded && <Navbar />}

            <main className={`${!isEmbedded ? 'p-4 md:p-8 max-w-[1200px] mx-auto' : ''} space-y-8 animate-in fade-in duration-500`}>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Campus Events</h1>
                        <p className="text-slate-500 text-sm mt-1">Discover, Book, and Experience.</p>
                    </div>
                    <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                        <button
                            onClick={() => setView('browse')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'browse' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                            Browse Events
                        </button>
                        <button
                            onClick={() => setView('my_tickets')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'my_tickets' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                            My Tickets
                        </button>
                    </div>
                </div>

                {view === 'browse' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <div key={event._id} className="bg-white p-6 rounded-2xl border border-slate-200 relative group hover:border-indigo-300 hover:shadow-lg transition-all">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Ticket size={120} className="text-indigo-600" /></div>
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{event.title}</h3>
                                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{event.description}</p>

                                    <div className="space-y-2 text-sm text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className="flex items-center"><Calendar size={14} className="mr-2 text-indigo-500" /> {new Date(event.date).toLocaleString()}</div>
                                        <div className="flex items-center"><MapPin size={14} className="mr-2 text-indigo-500" /> {event.venue}</div>
                                        <div className="flex items-center"><DollarSign size={14} className="mr-2 text-indigo-500" /> ₹{event.price}</div>
                                        <div className="flex items-center">
                                            <Users size={14} className="mr-2 text-indigo-500" />
                                            <span className={`font-bold ${event.bookedSeats >= event.totalSeats ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                {event.bookedSeats >= event.totalSeats ? 'SOLD OUT' : `${event.totalSeats - event.bookedSeats} seats left`}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        disabled={event.bookedSeats >= event.totalSeats}
                                        onClick={() => setSelectedEvent(event)}
                                        className={`w-full py-3 rounded-xl font-bold transition-all shadow-md ${event.bookedSeats >= event.totalSeats ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'}`}
                                    >
                                        {event.bookedSeats >= event.totalSeats ? 'Sold Out' : 'Book Now'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {view === 'my_tickets' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myBookings.map(booking => (
                            <div key={booking._id} className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm relative hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900">{booking.eventId.title}</h3>
                                        <p className="text-xs text-slate-500">{new Date(booking.eventId.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded border border-emerald-100">CONFIRMED</span>
                                </div>
                                <button
                                    onClick={() => setShowPass(booking)}
                                    className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold py-2 rounded-lg border border-slate-200 transition-all"
                                >
                                    View Digital Pass
                                </button>
                            </div>
                        ))}
                        {myBookings.length === 0 && <p className="text-slate-500 col-span-full text-center py-10">No tickets found.</p>}
                    </div>
                )}
            </main>

            {/* Booking Modal (Mock Payment) */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-enter relative">
                        <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>

                        <div className="p-6">
                            <h2 className="text-xl font-black text-slate-900 mb-1">Confirm Booking</h2>
                            <p className="text-sm text-slate-500 mb-6">You are about to book a ticket for <span className="text-indigo-600 font-bold">{selectedEvent.title}</span></p>

                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Ticket Price</span>
                                    <span className="font-bold text-slate-800">₹{selectedEvent.price}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Convenience Fee</span>
                                    <span className="font-bold text-slate-800">₹0</span>
                                </div>
                                <div className="border-t border-slate-200 pt-2 flex justify-between text-base">
                                    <span className="font-bold text-slate-800">Total</span>
                                    <span className="font-black text-indigo-600">₹{selectedEvent.price}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleBook}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center"
                            >
                                <CreditCard size={18} className="mr-2" /> Pay & Confirm
                            </button>
                            <p className="text-[10px] text-center text-slate-400 mt-3 flex items-center justify-center">
                                <Check size={10} className="mr-1 text-emerald-500" /> Secure Payment Gateway (Simulated)
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Digital Pass Modal */}
            {showPass && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setShowPass(null)}>
                    <div onClick={e => e.stopPropagation()}>
                        <EventPass booking={showPass} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentEvents;
