import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../services/api';
import { Calendar, Clock, BookOpen, User, MapPin, PlusCircle, LayoutGrid, CheckCircle, AlertTriangle, RefreshCw, Trash2, Sparkles } from 'lucide-react';

const AdminTimetable = () => {
    const [view, setView] = useState('generate'); // 'generate' or 'master'
    const [masterTab, setMasterTab] = useState('courses');

    // Master Data State
    const [courses, setCourses] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [rooms, setRooms] = useState([]);

    // Timetable State
    const [selectedClass, setSelectedClass] = useState('');
    const [timetable, setTimetable] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form inputs state
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchMasterData();
    }, []);

    const fetchMasterData = async () => {
        try {
            const [crs, cls, sub, tch, rm] = await Promise.all([
                API.get('/master-data/courses'),
                API.get('/master-data/classes'),
                API.get('/master-data/subjects'),
                API.get('/master-data/teachers'),
                API.get('/master-data/rooms')
            ]);
            setCourses(crs.data.data);
            setClasses(cls.data.data);
            setSubjects(sub.data.data);
            setTeachers(tch.data.data);
            setRooms(rm.data.data);
        } catch (err) {
            console.error('Failed to fetch master data', err);
        }
    };

    const handleGenerate = async () => {
        if (!selectedClass) return alert("Please select a class");
        setLoading(true);
        setError(null);
        setTimetable(null);
        try {
            const { data } = await API.post('/timetable/generate', { classId: selectedClass, semester: "1" });
            if (data.success) {
                await fetchTimetable(selectedClass);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchTimetable = async (classId) => {
        try {
            const { data } = await API.get(`/timetable/class/${classId}`);
            if (data.success) {
                setTimetable(data.data);
            }
        } catch (err) {
            setTimetable(null);
        }
    };

    useEffect(() => {
        if (selectedClass && view === 'generate') {
            fetchTimetable(selectedClass);
        }
    }, [selectedClass, view]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMultiSelectChange = (e) => {
        const values = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, [e.target.name]: values });
    };

    const submitMasterData = async (e, endpoint) => {
        e.preventDefault();
        try {
            await API.post(`/master-data/${endpoint}`, formData);
            setFormData({});
            fetchMasterData();
            alert(`Added to ${endpoint} successfully!`);
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleDeleteTimetable = async () => {
        if (!selectedClass) return;
        if (!window.confirm("Are you sure you want to delete this class timetable?")) return;
        setLoading(true);
        try {
            const { data } = await API.delete(`/timetable/class/${selectedClass}`);
            if (data.success) {
                setTimetable(null);
                alert("Timetable deleted successfully!");
            }
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMasterData = async (id, endpoint) => {
        if (!window.confirm(`Are you sure you want to delete this from ${endpoint}?`)) return;
        try {
            await API.delete(`/master-data/${endpoint}/${id}`);
            fetchMasterData();
            alert(`Deleted from ${endpoint} successfully!`);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete item.");
        }
    };

    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const DAYS_FULL = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const TIMES = [
        "09:30 - 10:25", "10:25 - 11:20", "11:20 - 12:20",
        "12:20 - 01:15", "01:15 - 02:10",
        "02:30 - 03:25", "03:25 - 04:20"
    ];

    const getUniqueSubjects = (timetableData) => {
        if (!timetableData || !timetableData.schedule) return [];
        const unique = [];
        const seen = new Set();
        timetableData.schedule.forEach(day => {
            day.slots.forEach(slot => {
                if (slot && slot.subject && slot.teacher) {
                    const key = `${slot.subject._id}_${slot.teacher._id}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        unique.push({ subject: slot.subject, teacher: slot.teacher });
                    }
                }
            });
        });
        return unique;
    };

    const renderSlotCell = (slot, timeIdx, dayShort) => {
        if (!slot || !slot.subject) {
            return (
                <td key={`${dayShort}-${timeIdx}`} className="border border-slate-300 p-2 uppercase bg-slate-50 text-slate-400 font-bold text-[10px]">
                    SELF-STUDY
                </td>
            );
        }

        const classNameDisplay = classes.find(c => c._id === timetable.classId)?.name || 'CLASS';
        const subjShort = slot.subject.name.substring(0, 5).toUpperCase();
        const teacherShort = slot.teacher.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const roomName = slot.room.name.toUpperCase();

        const isLab = slot.subject.type === 'Lab';
        const bgColor = isLab ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-indigo-50 text-indigo-950 border-indigo-200';

        return (
            <td key={`${dayShort}-${timeIdx}`} className={`border p-2 uppercase ${bgColor} font-bold text-[10px] tracking-wide leading-relaxed`}>
                {classNameDisplay}:{subjShort}:{teacherShort}:{roomName}
            </td>
        );
    };

    const masterTabListMap = {
        courses,
        classes,
        subjects,
        teachers,
        rooms
    };

    return (
        <div className="min-h-screen pb-12 bg-slate-50 font-sans text-slate-900">
            <Navbar />

            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-300">
                
                {/* Hero Banner Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Clock size={220} className="text-white" />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                            <Sparkles size={14} /> Smart AI Timetable Engine
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Timetable & Schedule Command Center
                        </h1>
                        <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                            Auto-generate class timetables, manage master courses & faculties, and eliminate room scheduling conflicts.
                        </p>
                    </div>

                    <div className="relative z-10 flex gap-3">
                        <button
                            onClick={() => setView('generate')}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
                                view === 'generate'
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                            }`}
                        >
                            <LayoutGrid size={16} /> Schedule Generator
                        </button>
                        <button
                            onClick={() => setView('master')}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
                                view === 'master'
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                            }`}
                        >
                            <BookOpen size={16} /> Master Data
                        </button>
                    </div>
                </div>

                {/* ===== GENERATE VIEW ===== */}
                {view === 'generate' && (
                    <div className="space-y-6">
                        {/* Selector Box */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <Calendar className="text-indigo-600" /> Class Timetable Generator
                            </h3>

                            <div className="flex flex-col sm:flex-row gap-4 items-end bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Target Class</label>
                                    <select
                                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-bold text-sm focus:border-indigo-500 outline-none shadow-xs transition-all"
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                    >
                                        <option value="">-- Select a Class --</option>
                                        {classes.map(c => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={handleGenerate}
                                        disabled={loading || !selectedClass}
                                        className="flex-1 sm:flex-initial py-3 px-6 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                                    >
                                        {loading ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                                        Auto-Generate Timetable
                                    </button>
                                    <button
                                        onClick={handleDeleteTimetable}
                                        disabled={loading || !selectedClass}
                                        className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl border border-rose-200 disabled:opacity-50 flex items-center justify-center transition-all"
                                        title="Delete Timetable"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 flex items-start gap-3 text-xs font-bold">
                                    <AlertTriangle size={18} className="shrink-0 text-rose-600" />
                                    <div>
                                        <p className="font-black">Generation Issue</p>
                                        <p className="font-normal text-rose-700">{error}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* TIMETABLE GRID */}
                        {timetable && timetable.schedule && (
                            <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200 p-6 space-y-4">
                                <div className="text-center font-black uppercase text-slate-900 text-sm border-b border-slate-200 pb-3">
                                    INSTITUTE ACADEMIC SCHEDULE: {classes.find(c => c._id === timetable.classId)?.name || 'CLASS TIMETABLE'}
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-xs text-center border border-slate-300">
                                        <thead>
                                            <tr className="bg-slate-900 text-white font-black text-[10px] uppercase">
                                                <th className="border border-slate-700 p-3 w-28">TIME SLOT</th>
                                                {DAYS_FULL.map(day => (
                                                    <th key={day} className="border border-slate-700 p-3">
                                                        {day}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {TIMES.map((time, timeIdx) => {
                                                if (timeIdx === 5) {
                                                    return (
                                                        <React.Fragment key={`recess-${timeIdx}`}>
                                                            <tr className="bg-slate-100">
                                                                <td className="border border-slate-300 p-2 font-black text-slate-700 text-[10px]">02:10 - 02:30</td>
                                                                <td colSpan={6} className="border border-slate-300 font-black tracking-widest text-slate-600 text-[10px] uppercase">RECREATION / BREAK</td>
                                                            </tr>
                                                            <tr key={time}>
                                                                <td className="border border-slate-300 p-2 font-black text-slate-800 text-[10px] bg-slate-50">{time}</td>
                                                                {DAYS.map(dayShort => {
                                                                    const daySch = timetable.schedule.find(d => d.day === dayShort);
                                                                    const slot = daySch?.slots[timeIdx];
                                                                    return renderSlotCell(slot, timeIdx, dayShort);
                                                                })}
                                                            </tr>
                                                        </React.Fragment>
                                                    );
                                                }

                                                return (
                                                    <tr key={time}>
                                                        <td className="border border-slate-300 p-2 font-black text-slate-800 text-[10px] bg-slate-50">{time}</td>
                                                        {DAYS.map(dayShort => {
                                                            const daySch = timetable.schedule.find(d => d.day === dayShort);
                                                            const slot = daySch?.slots[timeIdx];
                                                            return renderSlotCell(slot, timeIdx, dayShort);
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {!timetable && !loading && (
                            <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-xs space-y-3">
                                <Clock size={48} className="mx-auto text-slate-300 opacity-50" />
                                <h4 className="text-lg font-bold text-slate-700">No Timetable Selected</h4>
                                <p className="text-slate-500 text-xs">Select a class from the dropdown above to view or auto-generate its schedule.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ===== MASTER DATA VIEW ===== */}
                {view === 'master' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                        {/* Master Data Sidebar */}
                        <div className="bg-white p-4 space-y-2 border border-slate-200 rounded-3xl shadow-sm md:col-span-1 h-fit">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 mb-3">Entities</h3>
                            {[
                                { id: 'courses', label: 'Courses', icon: BookOpen, count: courses.length },
                                { id: 'classes', label: 'Classes', icon: LayoutGrid, count: classes.length },
                                { id: 'subjects', label: 'Subjects', icon: BookOpen, count: subjects.length },
                                { id: 'teachers', label: 'Teachers', icon: User, count: teachers.length },
                                { id: 'rooms', label: 'Rooms', icon: MapPin, count: rooms.length }
                            ].map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setMasterTab(t.id)}
                                    className={`w-full flex justify-between items-center px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                                        masterTab === t.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <t.icon size={16} /> {t.label}
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                                        masterTab === t.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {t.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Master Data Content */}
                        <div className="md:col-span-3 space-y-6">

                            {/* Form Panel */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                                    <PlusCircle className="text-indigo-600" size={20} /> Add New {masterTab.slice(0, -1).toUpperCase()}
                                </h3>

                                {/* Courses Form */}
                                {masterTab === 'courses' && (
                                    <form onSubmit={(e) => submitMasterData(e, 'courses')} className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs font-bold text-slate-700 block mb-1">Course Name</label><input required name="name" onChange={handleFormChange} className="input-field" placeholder="e.g. BCA" /></div>
                                        <div><label className="text-xs font-bold text-slate-700 block mb-1">Course Code</label><input required name="code" onChange={handleFormChange} className="input-field" placeholder="e.g. CS101" /></div>
                                        <button type="submit" className="btn btn-primary col-span-2 py-3">Save Course</button>
                                    </form>
                                )}

                                {/* Classes Form */}
                                {masterTab === 'classes' && (
                                    <form onSubmit={(e) => submitMasterData(e, 'classes')} className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs font-bold text-slate-700 block mb-1">Class Name</label><input required name="name" onChange={handleFormChange} className="input-field" placeholder="e.g. BCA 2nd Yr Sec A" /></div>
                                        <div><label className="text-xs font-bold text-slate-700 block mb-1">Course</label>
                                            <select required name="course" onChange={handleFormChange} className="input-field bg-white">
                                                <option value="">Select Course</option>
                                                {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div><label className="text-xs font-bold text-slate-700 block mb-1">Year</label><input required type="number" name="year" onChange={handleFormChange} className="input-field" placeholder="e.g. 2" /></div>
                                        <div><label className="text-xs font-bold text-slate-700 block mb-1">Section</label><input required name="section" onChange={handleFormChange} className="input-field" placeholder="e.g. A" /></div>
                                        <button type="submit" className="btn btn-primary col-span-2 py-3">Save Class</button>
                                    </form>
                                )}

                                {/* Subjects Form */}
                                {masterTab === 'subjects' && (
                                    <form onSubmit={(e) => submitMasterData(e, 'subjects')} className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs font-bold text-slate-700 block mb-1">Subject Name</label><input required name="name" onChange={handleFormChange} className="input-field" placeholder="e.g. Data Structures" /></div>
                                        <div><label className="text-xs font-bold text-slate-700 block mb-1">Subject Code</label><input required name="code" onChange={handleFormChange} className="input-field" placeholder="e.g. DS201" /></div>
                                        <div><label className="text-xs font-bold text-slate-700 block mb-1">Credits (Hrs/Wk)</label><input required type="number" name="credits" onChange={handleFormChange} className="input-field" placeholder="e.g. 4" /></div>
                                        <div><label className="text-xs font-bold text-slate-700 block mb-1">Type</label>
                                            <select required name="type" onChange={handleFormChange} className="input-field bg-white">
                                                <option value="">Select Type</option>
                                                <option value="Lecture">Lecture (Theory)</option>
                                                <option value="Lab">Lab (Practical)</option>
                                            </select>
                                        </div>
                                        <div className="col-span-2"><label className="text-xs font-bold text-slate-700 block mb-1">Course</label>
                                            <select required name="course" onChange={handleFormChange} className="input-field bg-white">
                                                <option value="">Select Course</option>
                                                {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-primary col-span-2 py-3">Save Subject</button>
                                    </form>
                                )}

                                {/* Teachers Form */}
                                {masterTab === 'teachers' && (
                                    <form onSubmit={(e) => submitMasterData(e, 'teachers')} className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs font-bold text-slate-700 block mb-1">Teacher Name</label><input required name="name" onChange={handleFormChange} className="input-field" placeholder="e.g. Prof. Sharma" /></div>
                                        <div><label className="text-xs font-bold text-slate-700 block mb-1">Employee ID</label><input required name="employeeId" onChange={handleFormChange} className="input-field" placeholder="e.g. EMP123" /></div>
                                        <div className="col-span-2">
                                            <label className="text-xs font-bold text-slate-700 block mb-1">Subjects</label>
                                            <select multiple name="subjects" onChange={handleMultiSelectChange} className="input-field bg-white h-24">
                                                {subjects.map(s => <option key={s._id} value={s._id}>{s.name} ({s.code})</option>)}
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-primary col-span-2 py-3">Save Teacher</button>
                                    </form>
                                )}

                                {/* Rooms Form */}
                                {masterTab === 'rooms' && (
                                    <form onSubmit={(e) => submitMasterData(e, 'rooms')} className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs font-bold text-slate-700 block mb-1">Room Name/Number</label><input required name="name" onChange={handleFormChange} className="input-field" placeholder="e.g. Room 101" /></div>
                                        <div><label className="text-xs font-bold text-slate-700 block mb-1">Capacity</label><input required type="number" name="capacity" onChange={handleFormChange} className="input-field" placeholder="e.g. 60" /></div>
                                        <div className="col-span-2"><label className="text-xs font-bold text-slate-700 block mb-1">Type</label>
                                            <select required name="type" onChange={handleFormChange} className="input-field bg-white">
                                                <option value="">Select Type</option>
                                                <option value="Classroom">Classroom</option>
                                                <option value="Lab">Lab</option>
                                            </select>
                                        </div>
                                        <button type="submit" className="btn btn-primary col-span-2 py-3">Save Room</button>
                                    </form>
                                )}
                            </div>

                            {/* List Panel */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Existing {masterTab.toUpperCase()}</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs border-collapse">
                                        {masterTab === 'courses' && (
                                            <>
                                                <thead className="bg-slate-100 text-slate-700 font-bold"><tr><th className="p-3">Name</th><th className="p-3">Code</th><th className="p-3 w-16">Actions</th></tr></thead>
                                                <tbody className="divide-y divide-slate-100">{courses.map(c => <tr key={c._id}><td className="p-3 font-bold">{c.name}</td><td className="p-3 font-mono">{c.code}</td>
                                                    <td className="p-3"><button onClick={() => handleDeleteMasterData(c._id, 'courses')} className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg"><Trash2 size={16} /></button></td>
                                                </tr>)}</tbody>
                                            </>
                                        )}
                                        {masterTab === 'classes' && (
                                            <>
                                                <thead className="bg-slate-100 text-slate-700 font-bold"><tr><th className="p-3">Name</th><th className="p-3">Course</th><th className="p-3">Year</th><th className="p-3 w-16">Actions</th></tr></thead>
                                                <tbody className="divide-y divide-slate-100">{classes.map(c => <tr key={c._id}><td className="p-3 font-bold">{c.name}</td><td className="p-3">{c.course?.name}</td><td className="p-3">{c.year}</td>
                                                    <td className="p-3"><button onClick={() => handleDeleteMasterData(c._id, 'classes')} className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg"><Trash2 size={16} /></button></td>
                                                </tr>)}</tbody>
                                            </>
                                        )}
                                        {masterTab === 'subjects' && (
                                            <>
                                                <thead className="bg-slate-100 text-slate-700 font-bold"><tr><th className="p-3">Name</th><th className="p-3">Credits</th><th className="p-3">Type</th><th className="p-3 w-16">Actions</th></tr></thead>
                                                <tbody className="divide-y divide-slate-100">{subjects.map(c => <tr key={c._id}><td className="p-3 font-bold">{c.name}</td><td className="p-3 font-mono">{c.credits}</td><td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700">{c.type}</span></td>
                                                    <td className="p-3"><button onClick={() => handleDeleteMasterData(c._id, 'subjects')} className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg"><Trash2 size={16} /></button></td>
                                                </tr>)}</tbody>
                                            </>
                                        )}
                                        {masterTab === 'teachers' && (
                                            <>
                                                <thead className="bg-slate-100 text-slate-700 font-bold"><tr><th className="p-3">Name</th><th className="p-3">Emp ID</th><th className="p-3 w-16">Actions</th></tr></thead>
                                                <tbody className="divide-y divide-slate-100">{teachers.map(c => <tr key={c._id}><td className="p-3 font-bold">{c.name}</td><td className="p-3 font-mono">{c.employeeId}</td>
                                                    <td className="p-3"><button onClick={() => handleDeleteMasterData(c._id, 'teachers')} className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg"><Trash2 size={16} /></button></td>
                                                </tr>)}</tbody>
                                            </>
                                        )}
                                        {masterTab === 'rooms' && (
                                            <>
                                                <thead className="bg-slate-100 text-slate-700 font-bold"><tr><th className="p-3">Name</th><th className="p-3">Capacity</th><th className="p-3">Type</th><th className="p-3 w-16">Actions</th></tr></thead>
                                                <tbody className="divide-y divide-slate-100">{rooms.map(c => <tr key={c._id}><td className="p-3 font-bold">{c.name}</td><td className="p-3 font-mono">{c.capacity}</td><td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">{c.type}</span></td>
                                                    <td className="p-3"><button onClick={() => handleDeleteMasterData(c._id, 'rooms')} className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg"><Trash2 size={16} /></button></td>
                                                </tr>)}</tbody>
                                            </>
                                        )}
                                    </table>
                                    {(masterTabListMap[masterTab] || []).length === 0 && <p className="text-center text-slate-400 py-6 text-xs font-medium">No records found.</p>}
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTimetable;
