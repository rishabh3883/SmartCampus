import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { Calendar, MapPin, DollarSign, Users, Plus, List, X, Mail, Search } from 'lucide-react';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', venue: '', price: '', totalSeats: '', rules: '', organizer: 'Admin'
    });

    const [attendees, setAttendees] = useState([]);
    const [showAttendeesModal, setShowAttendeesModal] = useState(false);
    const [selectedEventName, setSelectedEventName] = useState('');
    const [loadingAttendees, setLoadingAttendees] = useState(false);

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

    const fetchAttendees = async (eventId, eventTitle) => {
        setLoadingAttendees(true);
        setSelectedEventName(eventTitle);
        setAttendees([]);
        setShowAttendeesModal(true);
        try {
            const res = await API.get(`/events/${eventId}/attendees`);
            setAttendees(res.data); // Returns array of bookings populated with user
        } catch (err) {
            console.error("Failed to fetch attendees", err);
            alert("Failed to load attendee list");
        } finally {
            setLoadingAttendees(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const rulesArray = formData.rules.split(',').map(r => r.trim()).filter(r => r);
            await API.post('/events', { ...formData, rules: rulesArray });
            alert("Event created successfully!");
            setShowForm(false);
            setFormData({ title: '', description: '', date: '', venue: '', price: '', totalSeats: '', rules: '', organizer: 'Admin' });
            fetchEvents();
        } catch (err) {
            alert("Failed to create event");
        }
    };

    return (
        <div className="min-h-screen pb-10 bg-slate-50">
            <Navbar />

            <div className="page-container max-w-6xl relative">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center">
                            Event Command Center
                        </h1>
                        <p className="text-slate-500 mt-1">Create and manage campus events and bookings.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn btn-primary bg-purple-600 hover:bg-purple-700 shadow-purple-200"
                    >
                        {showForm ? <List className="mr-2" size={18} /> : <Plus className="mr-2" size={18} />}
                        {showForm ? "View All Events" : "Create New Event"}
                    </button>
                </div>

                {showForm ? (
                    <div className="card max-w-2xl mx-auto bg-white border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Create New Event</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
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
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 text-slate-500" size={18} />
                                        <input
                                            type="number" required min="0"
                                            className="input-field pl-10 bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"
                                            value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
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
                                    className="input-field min-h-[100px] bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"
                                    placeholder="Event details..."
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label text-slate-700">Rules (comma separated)</label>
                                <textarea
                                    className="input-field min-h-[80px] bg-slate-50 border-slate-300 text-slate-900 focus:border-purple-500"
                                    placeholder="No entry without ID, Dress code formal..."
                                    value={formData.rules} onChange={e => setFormData({ ...formData, rules: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-full bg-purple-600 hover:bg-purple-700 py-3 mt-4 text-white font-bold shadow-purple-200">
                                Publish Event
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <div key={event._id} className="card group hover:border-purple-300 bg-white border-slate-200 transition-all p-0 overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded border border-purple-100 uppercase tracking-wide">
                                            UPCOMING
                                        </div>
                                        <button
                                            onClick={() => fetchAttendees(event._id, event.title)}
                                            className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center transition-all hover:text-slate-900"
                                        >
                                            <Users size={12} className="mr-1.5" /> Attendees
                                        </button>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2">{event.title}</h3>
                                    <div className="space-y-3 text-sm text-slate-500">
                                        <div className="flex items-center"><Calendar size={16} className="mr-3 text-purple-600" /> {new Date(event.date).toLocaleString()}</div>
                                        <div className="flex items-center"><MapPin size={16} className="mr-3 text-purple-600" /> {event.venue}</div>
                                        <div className="flex items-center"><Users size={16} className="mr-3 text-purple-600" /> {event.bookedSeats} / {event.totalSeats} Booked</div>
                                        <div className="flex items-center"><DollarSign size={16} className="mr-3 text-purple-600" /> ₹{event.price}</div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
                                    <span>ID: {event._id.slice(-6)}</span>
                                    {event.bookedSeats >= event.totalSeats && <span className="text-rose-600 font-bold">SOLD OUT</span>}
                                </div>
                            </div>
                        ))}
                        {events.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-500">
                                No events found. Create one to get started.
                            </div>
                        )}
                    </div>
                )}

                {/* Attendees Modal */}
                {showAttendeesModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-enter">
                            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Attendee List</h3>
                                    <p className="text-sm text-purple-600">{selectedEventName}</p>
                                </div>
                                <button onClick={() => setShowAttendeesModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                                {loadingAttendees ? (
                                    <div className="text-center py-10 text-slate-400">Loading attendees...</div>
                                ) : attendees.length === 0 ? (
                                    <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
                                        <Users size={48} className="mx-auto mb-3 opacity-20" />
                                        <p>No tickets booked yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {attendees.map((booking) => (
                                            <div key={booking._id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center hover:bg-white hover:shadow-sm transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold border border-purple-200">
                                                        {booking.userId?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-sm">{booking.userId?.name || 'Unknown User'}</h4>
                                                        <p className="text-xs text-slate-500 flex items-center">
                                                            <Mail size={10} className="mr-1" /> {booking.userId?.email}
                                                        </p>
                                                        <p className="text-xs text-slate-400 mt-0.5">Enrollment: {booking.userId?.enrollmentNumber || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-mono bg-white px-2 py-1 rounded text-slate-500 border border-slate-200 block mb-1">
                                                        {booking.qrCode ? new Date(parseInt(booking.qrCode.split('-')[3])).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                        Confirmed
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
                                <span className="text-sm text-slate-500">Total Attendees: <span className="text-slate-900 font-bold">{attendees.length}</span></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminEvents;
