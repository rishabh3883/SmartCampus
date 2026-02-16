import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { BookOpen, MapPin, Users, Plus, Trash2, Library, Search } from 'lucide-react';

const AdminLibrary = () => {
    const [libraries, setLibraries] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', totalSeats: '' });

    useEffect(() => {
        fetchLibraries();
    }, []);

    const fetchLibraries = async () => {
        try {
            const res = await API.get('/library');
            setLibraries(res.data);
        } catch (err) {
            console.error("Failed to fetch libraries", err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await API.post('/library', formData);
            alert("Library added successfully!");
            setShowForm(false);
            setFormData({ name: '', totalSeats: '' });
            fetchLibraries();
        } catch (err) {
            alert("Failed to add library");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this library? This will cancel all active bookings.")) return;
        try {
            await API.delete(`/library/${id}`);
            alert("Library deleted.");
            fetchLibraries();
        } catch (err) {
            alert("Failed to delete library");
        }
    };

    return (
        <div className="min-h-screen pb-10 bg-slate-50">
            <Navbar />

            <div className="page-container max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center">
                            <BookOpen className="mr-3 text-emerald-600" /> Library Management
                        </h1>
                        <p className="text-slate-500 mt-1">Manage departmental libraries and study slots.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                    >
                        {showForm ? <Library className="mr-2" size={18} /> : <Plus className="mr-2" size={18} />}
                        {showForm ? "View Libraries" : "Add New Library"}
                    </button>
                </div>

                {showForm ? (
                    <div className="card max-w-xl mx-auto bg-white border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Add New Department Library</h2>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="label text-slate-700">Library / Department Name</label>
                                <input
                                    type="text" required
                                    className="input-field bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500"
                                    placeholder="e.g. CSE Department Library"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="label text-slate-700">Total Study Seats</label>
                                <input
                                    type="number" required min="1"
                                    className="input-field bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500"
                                    value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-emerald-200">
                                Create Library
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {libraries.map(lib => (
                            <div key={lib._id} className="card group relative overflow-hidden hover:border-emerald-300 bg-white border-slate-200 transition-all p-0 shadow-sm hover:shadow-md">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity"><BookOpen size={100} className="text-slate-900" /></div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${lib.bookedSeats >= lib.totalSeats ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                            {lib.bookedSeats >= lib.totalSeats ? 'FULL' : 'AVAILABLE'}
                                        </div>
                                        <button onClick={() => handleDelete(lib._id)} className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded hover:bg-rose-50">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-6 truncate">{lib.name}</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-sm text-slate-500">Occupancy</span>
                                                <span className="text-sm font-mono text-slate-800">{lib.bookedSeats} / {lib.totalSeats}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${lib.bookedSeats >= lib.totalSeats ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${(lib.bookedSeats / lib.totalSeats) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                            <span className="text-xs text-slate-500">Available Seats</span>
                                            <span className="text-lg font-bold text-emerald-600">{Math.max(0, lib.totalSeats - lib.bookedSeats)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {libraries.length === 0 && (
                            <div className="col-span-full py-20 text-center text-slate-500 border-2 border-dashed border-slate-300 rounded-2xl">
                                <Library size={48} className="mx-auto mb-4 opacity-20 text-slate-400" />
                                <p>No libraries created yet. Click "Add New Library" to start.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLibrary;
